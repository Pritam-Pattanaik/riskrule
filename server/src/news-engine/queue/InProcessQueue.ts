/**
 * In-Process Event Queue
 *
 * V1 implementation: lightweight Node.js EventEmitter-based queue.
 * Items are processed sequentially within the same process.
 * V2 will replace this with Redis pub/sub (ioredis is already installed).
 *
 * This abstraction ensures V1→V2 migration requires only swapping this module.
 *
 * H2 fix: Added MAX_DEPTH backpressure — drops items when queue is full
 * to prevent unbounded memory growth under burst news ingestion.
 */

import { EventEmitter } from 'events';
import { logger } from '../../lib/logger';

// Maximum items per named queue before new items are dropped (H2 fix)
const MAX_DEPTH = 1000;

export interface QueueItem {
  id: string;
  data: Record<string, unknown>;
  enqueuedAt: number;
  attempts: number;
}

class InProcessQueue extends EventEmitter {
  private queues: Map<string, QueueItem[]> = new Map();
  private processing: Map<string, boolean> = new Map();
  private dropped: Map<string, number> = new Map(); // Track dropped items per queue

  /**
   * Push an item to the named queue.
   * Returns false if the queue is at MAX_DEPTH (item dropped).
   */
  push(queueName: string, id: string, data: Record<string, unknown>): boolean {
    if (!this.queues.has(queueName)) {
      this.queues.set(queueName, []);
    }

    const queueArr = this.queues.get(queueName)!;

    // H2 fix: Backpressure — drop items when queue is at capacity
    if (queueArr.length >= MAX_DEPTH) {
      const dropped = (this.dropped.get(queueName) ?? 0) + 1;
      this.dropped.set(queueName, dropped);
      logger.warn(`[Queue:${queueName}] BACKPRESSURE: queue depth ${queueArr.length} >= MAX_DEPTH ${MAX_DEPTH}. Dropping item ${id} (total dropped: ${dropped})`);
      return false;
    }

    const item: QueueItem = {
      id,
      data,
      enqueuedAt: Date.now(),
      attempts: 0,
    };

    queueArr.push(item);
    logger.debug(`[Queue:${queueName}] Enqueued item ${id}. Depth: ${queueArr.length}`);

    // Trigger processing if not already running
    if (!this.processing.get(queueName)) {
      setImmediate(() => this.processNext(queueName));
    }

    return true;
  }

  /**
   * Register a handler for a queue. The handler is called with each item.
   * Errors are caught; the item is marked as failed after maxRetries.
   */
  subscribe(
    queueName: string,
    handler: (item: QueueItem) => Promise<void>,
    options: { maxRetries?: number; retryDelayMs?: number } = {}
  ): void {
    const { maxRetries = 3, retryDelayMs = 2_000 } = options;

    this.on(`process:${queueName}`, async (item: QueueItem) => {
      item.attempts += 1;
      try {
        await handler(item);
        logger.debug(`[Queue:${queueName}] Item ${item.id} processed successfully.`);
      } catch (err: any) {
        logger.warn(`[Queue:${queueName}] Item ${item.id} failed (attempt ${item.attempts}/${maxRetries}): ${err.message}`);

        if (item.attempts < maxRetries) {
          // Re-enqueue with delay
          const delay = retryDelayMs * Math.pow(2, item.attempts - 1) + Math.random() * 500;
          setTimeout(() => {
            this.queues.get(queueName)?.push(item);
            setImmediate(() => this.processNext(queueName));
          }, delay);
        } else {
          logger.error(`[Queue:${queueName}] Item ${item.id} exhausted retries. Moving to DLQ.`);
          this.emit(`dlq:${queueName}`, item, err);
        }
      }

      // Continue processing
      this.processing.set(queueName, false);
      setImmediate(() => this.processNext(queueName));
    });
  }

  /**
   * Get current queue depth for monitoring.
   */
  depth(queueName: string): number {
    return this.queues.get(queueName)?.length ?? 0;
  }

  /**
   * Get queue stats for health reporting (depth + dropped count).
   */
  stats(queueName: string): { depth: number; dropped: number } {
    return {
      depth: this.queues.get(queueName)?.length ?? 0,
      dropped: this.dropped.get(queueName) ?? 0,
    };
  }

  private processNext(queueName: string): void {
    const queue = this.queues.get(queueName);
    if (!queue || queue.length === 0) {
      this.processing.set(queueName, false);
      return;
    }

    const item = queue.shift()!;
    this.processing.set(queueName, true);
    this.emit(`process:${queueName}`, item);
  }
}

// Singleton queue instance shared across the pipeline
export const queue = new InProcessQueue();

// Named queue constants
export const QUEUES = {
  RAW: 'raw',
  TRIAGE: 'triage',
  SCORING: 'scoring',
  DELIVERY: 'delivery',
} as const;
