import Groq from 'groq-sdk';
import { logger } from '../logger';

// Circuit breaker to prevent 429 rate-limit flood loops on Groq free tier
let cbUntil = 0;
const CB_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

// Create a singleton instance of the Groq client
let groqInstance: Groq | null = null;

export function getGroqClient(): Groq {
  if (groqInstance) return groqInstance;
  
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is missing from environment variables.');
  }

  groqInstance = new Groq({
    apiKey,
  });

  return groqInstance;
}

export async function streamGroqChat(messages: any[], onChunk: (chunk: string) => void, signal?: AbortSignal) {
  const groq = getGroqClient();

  // Check circuit breaker
  if (Date.now() < cbUntil) {
    onChunk('[AI temporarily unavailable due to rate limits. Please try again in a few minutes.]');
    return;
  }

  try {
    const completion = await groq.chat.completions.create({
      // Using openai/gpt-oss-20b to conserve daily token budget (200K TPD)
      model: 'openai/gpt-oss-20b',
      messages,
      temperature: 0.1,
      top_p: 0.95,
      max_tokens: 800,
      stream: true,
    }, { signal });

    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        onChunk(content);
      }
    }
  } catch (err: any) {
    if (err?.status === 429 || err?.message?.includes('429') || err?.message?.includes('Rate limit')) {
      cbUntil = Date.now() + CB_COOLDOWN_MS;
      logger.warn('[provider] Groq 429 rate limit hit — circuit breaker active for 5m');
      onChunk('[AI temporarily unavailable due to rate limits. Please try again in a few minutes.]');
      return;
    }
    throw err;
  }
}

export async function generateGroqJSON(messages: any[]): Promise<any> {
  const groq = getGroqClient();

  // Check circuit breaker
  if (Date.now() < cbUntil) {
    throw new Error('Groq rate limit circuit breaker active — try again later');
  }
  
  const systemMessage = {
    role: 'system',
    content: 'You are an AI assistant that only responds in valid JSON format. Do not include markdown formatting like ```json. Do not include any explanations outside of the JSON object.'
  };

  try {
    const completion = await groq.chat.completions.create({
      model: 'openai/gpt-oss-20b',
      messages: [systemMessage, ...messages],
      temperature: 0.1,
      top_p: 0.95,
      max_tokens: 800,
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0]?.message?.content || '{}';
    
    try {
      return JSON.parse(content);
    } catch (error) {
      console.error('Failed to parse Groq JSON response:', content);
      throw new Error('AI returned invalid JSON');
    }
  } catch (err: any) {
    if (err?.status === 429 || err?.message?.includes('429') || err?.message?.includes('Rate limit')) {
      cbUntil = Date.now() + CB_COOLDOWN_MS;
      logger.warn('[provider] Groq 429 rate limit hit in generateGroqJSON — circuit breaker active for 5m');
    }
    throw err;
  }
}

export async function generateGroqText(messages: any[]): Promise<string> {
  const groq = getGroqClient();

  if (Date.now() < cbUntil) {
    return 'New Conversation';
  }

  try {
    const completion = await groq.chat.completions.create({
      model: 'openai/gpt-oss-20b',
      messages,
      temperature: 0.7,
      top_p: 0.95,
      max_tokens: 30,
    });

    return completion.choices[0]?.message?.content || 'New Conversation';
  } catch (err: any) {
    if (err?.status === 429 || err?.message?.includes('429')) {
      cbUntil = Date.now() + CB_COOLDOWN_MS;
      logger.warn('[provider] Groq 429 in generateGroqText — circuit breaker active for 5m');
    }
    return 'New Conversation';
  }
}
