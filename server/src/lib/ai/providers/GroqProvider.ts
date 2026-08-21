import Groq from 'groq-sdk';
import { AIProvider, AIMessage } from '../AIProvider';
import { logger } from '../../logger';

export class GroqProvider implements AIProvider {
  private groq: Groq;
  private primaryModel = 'openai/gpt-oss-120b';
  private fallbackModel = 'openai/gpt-oss-20b';

  constructor() {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('GROQ_API_KEY is missing from environment variables.');
    }
    this.groq = new Groq({ apiKey });
  }

  async streamChat(messages: AIMessage[], onChunk: (chunk: string) => void, signal?: AbortSignal): Promise<void> {
    const modelsToTry = [this.primaryModel, this.fallbackModel];

    for (let mIndex = 0; mIndex < modelsToTry.length; mIndex++) {
      const model = modelsToTry[mIndex];
      try {
        const completion = await this.groq.chat.completions.create({
          model,
          messages,
          temperature: 0.1,
          top_p: 0.95,
          max_tokens: 800, // Reduced from 4096 to prevent artificial rate limit reservation
          stream: true,
        }, { signal });

        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            onChunk(content);
          }
        }
        return; // Success
      } catch (err: any) {
        // If 429 Rate Limit (TPD) on primary model, fallback immediately to 8b-instant
        if (err?.status === 429 && mIndex < modelsToTry.length - 1 && !signal?.aborted) {
          logger.warn(`[GroqProvider] Primary model ${model} rate-limited. Falling back to ${modelsToTry[mIndex + 1]}`);
          continue;
        }
        throw err;
      }
    }
  }

  async generateText(messages: AIMessage[]): Promise<string> {
    try {
      const completion = await this.groq.chat.completions.create({
        model: this.fallbackModel, // Use instant model for fast metadata/title generation
        messages,
        temperature: 0.7,
        top_p: 0.95,
        max_tokens: 50,
      });

      return completion.choices[0]?.message?.content || 'New Conversation';
    } catch {
      return 'New Conversation';
    }
  }

  async generateJSON(messages: AIMessage[]): Promise<any> {
    const systemMessage: AIMessage = {
      role: 'system',
      content: 'You are an AI assistant that only responds in valid JSON format. Do not include markdown formatting like ```json. Do not include any explanations outside of the JSON object.'
    };

    const completion = await this.groq.chat.completions.create({
      model: this.primaryModel,
      messages: [systemMessage, ...messages],
      temperature: 0.1,
      top_p: 0.95,
      max_tokens: 1024,
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0]?.message?.content || '{}';
    
    try {
      return JSON.parse(content);
    } catch {
      logger.error('Failed to parse Groq JSON response:', content);
      throw new Error('AI returned invalid JSON');
    }
  }
}
