import { Response } from 'express';
import { logger } from '../logger';

export interface StreamDonePayload {
  messageId?: string;
  conversationId?: string;
  promptVersion: string;
  tokensIn?: number;
  tokensOut?: number;
  latencyMs: number;
}

export class StreamController {
  private res: Response;
  private buffer: string = '';
  private fullText: string = '';
  private disciplineBuffer: string = '';
  private isCapturingDiscipline: boolean = false;
  private disciplineParsed: any = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private startTime: number;

  constructor(res: Response) {
    this.res = res;
    this.startTime = Date.now();

    // Set SSE headers
    this.res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    this.res.setHeader('Cache-Control', 'no-cache, no-transform');
    this.res.setHeader('Connection', 'keep-alive');
    this.res.setHeader('X-Accel-Buffering', 'no');
    this.res.flushHeaders?.();

    // Start 15-second heartbeat
    this.heartbeatInterval = setInterval(() => {
      try {
        this.res.write(': heartbeat\n\n');
        this.res.flushHeaders?.();
      } catch {
        this.cleanup();
      }
    }, 15000);
  }

  /**
   * Processes an incoming LLM token chunk and filters out DISCIPLINE_JSON tags with regex resilience
   */
  handleChunk(chunk: string): void {
    if (!this.isCapturingDiscipline) {
      this.buffer += chunk;
      
      // Match start tag with flexible spacing
      const startMatch = this.buffer.match(/<!--\s*DISCIPLINE_JSON\s*-->/i);
      if (startMatch && startMatch.index !== undefined) {
        const preText = this.buffer.substring(0, startMatch.index);
        if (preText) {
          this.emitChunk(preText);
          this.fullText += preText;
        }
        this.isCapturingDiscipline = true;
        this.disciplineBuffer = this.buffer.substring(startMatch.index + startMatch[0].length);
        this.buffer = '';
      } else {
        // Safe emission: preserve partial start tag boundary
        const safetyMargin = 25;
        if (this.buffer.length > safetyMargin) {
          const safeLength = this.buffer.length - safetyMargin;
          const safeText = this.buffer.substring(0, safeLength);
          this.emitChunk(safeText);
          this.fullText += safeText;
          this.buffer = this.buffer.substring(safeLength);
        }
      }
    } else {
      this.disciplineBuffer += chunk;
      const endMatch = this.disciplineBuffer.match(/<!--\s*\/DISCIPLINE_JSON\s*-->/i);
      if (endMatch && endMatch.index !== undefined) {
        const rawJson = this.disciplineBuffer.substring(0, endMatch.index).trim();
        this.parseAndEmitDiscipline(rawJson);
        this.isCapturingDiscipline = false;

        const postText = this.disciplineBuffer.substring(endMatch.index + endMatch[0].length);
        if (postText) {
          this.emitChunk(postText);
          this.fullText += postText;
        }
        this.disciplineBuffer = '';
      }
    }
  }

  private parseAndEmitDiscipline(rawJson: string): void {
    if (!rawJson) return;
    try {
      // Sanitize non-standard JSON literals like N/A or NaN
      const sanitized = rawJson
        .replace(/:\s*N\/A\b/gi, ': null')
        .replace(/:\s*NaN\b/gi, ': null')
        .replace(/,\s*([}\]])/g, '$1');

      this.disciplineParsed = JSON.parse(sanitized);
      this.emitDiscipline(this.disciplineParsed);
    } catch (err: any) {
      logger.warn(`[StreamController] Failed to parse discipline JSON: ${err?.message}`);
    }
  }

  private emitChunk(text: string): void {
    if (!text) return;
    this.res.write(`event: chunk\ndata: ${JSON.stringify({ text })}\n\n`);
    this.res.flushHeaders?.();
  }

  private emitDiscipline(data: any): void {
    this.res.write(`event: discipline\ndata: ${JSON.stringify(data)}\n\n`);
    this.res.flushHeaders?.();
  }

  /**
   * Finalizes the stream and returns completed data for persistence
   */
  finish(payload: { promptVersion: string; messageId?: string; conversationId?: string; detectedMode?: string }): {
    fullText: string;
    disciplineData: any;
    latencyMs: number;
  } {
    // Flush remaining buffer if not in discipline mode
    if (!this.isCapturingDiscipline && this.buffer) {
      // Strip any lingering comment fragment before emission
      const cleaned = this.buffer.replace(/<!--\s*DISCIPLINE_JSON[\s\S]*$/i, '');
      if (cleaned) {
        this.emitChunk(cleaned);
        this.fullText += cleaned;
      }
      this.buffer = '';
    } else if (this.isCapturingDiscipline && this.disciplineBuffer) {
      // If stream ended while capturing, parse what we have without leaking raw tags
      const cleanedJson = this.disciplineBuffer.replace(/<!--\s*\/DISCIPLINE_JSON[\s\S]*$/i, '').trim();
      this.parseAndEmitDiscipline(cleanedJson);
      this.disciplineBuffer = '';
    }

    const latencyMs = Date.now() - this.startTime;

    const doneData: StreamDonePayload = {
      messageId: payload.messageId,
      conversationId: payload.conversationId,
      promptVersion: payload.promptVersion,
      latencyMs,
    };

    this.res.write(`event: done\ndata: ${JSON.stringify(doneData)}\n\n`);
    this.cleanup();
    this.res.end();

    return {
      fullText: this.fullText.trim(),
      disciplineData: this.disciplineParsed,
      latencyMs,
    };
  }

  sendError(errorMsg: string, code: number = 500): void {
    this.res.write(`event: error\ndata: ${JSON.stringify({ error: errorMsg, code })}\n\n`);
    this.cleanup();
    this.res.end();
  }

  private cleanup(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }
}
