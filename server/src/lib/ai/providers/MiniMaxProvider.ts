/**
 * MiniMaxProvider — STUB (Future Deep-Reasoning Provider)
 *
 * STATUS: NOT ACTIVE — This file is a clean extension point.
 *         MiniMax API is not called anywhere right now.
 *         MINIMAX_API_KEY is not required for the application to run.
 *
 * WHEN TO ACTIVATE:
 *   1. Obtain a MiniMax API key
 *   2. Add MINIMAX_API_KEY to .env
 *   3. Set DEEP_PROVIDER=minimax in .env
 *   4. Implement the methods below against the MiniMax API
 *   5. No other files need to change — the router picks it up automatically
 *
 * MIGRATION PATH:
 *   Current:  DEEP_PROVIDER=nemotron → NemotronProvider handles all deep tasks
 *   Future:   DEEP_PROVIDER=minimax  → MiniMaxProvider handles all deep tasks
 *   Business logic, routes, prompts, and frontend remain UNCHANGED.
 */

import { AIProvider, AIMessage } from '../AIProvider';
import { logger } from '../../logger';

export class MiniMaxProvider implements AIProvider {
  private readonly defaultModel = 'MiniMax-M1'; // Update when activating
  private readonly baseUrl = 'https://api.minimax.chat/v1';
  private readonly apiKey: string;

  constructor() {
    const apiKey = process.env.MINIMAX_API_KEY;
    if (!apiKey) {
      // Non-fatal on startup — throws lazily when actually invoked
      logger.warn('[MiniMaxProvider] MINIMAX_API_KEY is not set. Provider will fail if invoked.');
    }
    this.apiKey = apiKey || '';
  }

  async streamChat(
    messages: AIMessage[],
    onChunk: (chunk: string) => void,
    signal?: AbortSignal
  ): Promise<void> {
    this.assertApiKey();

    // TODO: Implement MiniMax streaming chat
    // Reference: https://platform.minimaxi.com/document/ChatCompletion%20v2
    //
    // Expected implementation pattern (OpenAI-compatible):
    //
    // const response = await fetch(`${this.baseUrl}/chat/completions`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${this.apiKey}`,
    //   },
    //   body: JSON.stringify({
    //     model: this.defaultModel,
    //     messages,
    //     temperature: 0.1,
    //     top_p: 0.95,
    //     max_tokens: 4096,
    //     stream: true,
    //   }),
    //   signal,
    // });
    //
    // Parse SSE stream and call onChunk() for each delta.content token.

    throw new Error('[MiniMaxProvider] Not yet implemented. Set DEEP_PROVIDER=nemotron to use the active deep provider.');
  }

  async generateText(messages: AIMessage[]): Promise<string> {
    this.assertApiKey();
    // TODO: Implement MiniMax non-streaming text generation
    throw new Error('[MiniMaxProvider] Not yet implemented.');
  }

  async generateJSON(messages: AIMessage[]): Promise<any> {
    this.assertApiKey();
    // TODO: Implement MiniMax JSON-mode generation
    throw new Error('[MiniMaxProvider] Not yet implemented.');
  }

  private assertApiKey(): void {
    if (!this.apiKey) {
      throw new Error('[MiniMaxProvider] MINIMAX_API_KEY is not configured. Cannot call MiniMax API.');
    }
  }
}
