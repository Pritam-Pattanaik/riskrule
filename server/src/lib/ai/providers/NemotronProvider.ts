import { AIProvider, AIMessage } from '../AIProvider';
import { logger } from '../../logger';

export class NemotronProvider implements AIProvider {
  private defaultModel = 'nvidia/llama-3.1-nemotron-ultra-253b-v1'; // NEMOTRONultra
  private apiKey: string;
  private baseUrl = 'https://integrate.api.nvidia.com/v1';

  constructor() {
    const apiKey = process.env.NEMOTRON_API_KEY;
    if (!apiKey) {
      console.warn('NEMOTRON_API_KEY is missing. NemotronProvider will fail if invoked.');
    }
    this.apiKey = apiKey || '';
  }

  private async fetchNvidiaAPI(endpoint: string, body: any, signal?: AbortSignal) {
    if (!this.apiKey) {
      throw new Error('NEMOTRON_API_KEY is missing. Cannot call Nemotron API.');
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(body),
      signal
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error('NVIDIA API Error:', response.status, errorText);
      throw new Error(`NVIDIA API Error: ${response.status} ${response.statusText}`);
    }

    return response;
  }

  async streamChat(messages: AIMessage[], onChunk: (chunk: string) => void, signal?: AbortSignal): Promise<void> {
    const response = await this.fetchNvidiaAPI('/chat/completions', {
      model: this.defaultModel,
      messages,
      temperature: 0.1,
      top_p: 0.95,
      max_tokens: 800,
      stream: true,
    }, signal);

    if (!response.body) throw new Error('No response body from NVIDIA API');

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        if (line === 'data: [DONE]') return;
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.choices && data.choices[0] && data.choices[0].delta && data.choices[0].delta.content) {
              onChunk(data.choices[0].delta.content);
            }
          } catch (e) {
            // Ignore parse errors on incomplete chunks
          }
        }
      }
    }
  }

  async generateText(messages: AIMessage[]): Promise<string> {
    try {
      const response = await this.fetchNvidiaAPI('/chat/completions', {
        model: this.defaultModel,
        messages,
        temperature: 0.7,
        top_p: 0.95,
        max_tokens: 50,
      });
      const data = await response.json();
      return data.choices?.[0]?.message?.content || 'New Conversation';
    } catch (error) {
      logger.error('Failed to generate text with Nemotron:', error);
      return 'New Conversation';
    }
  }

  async generateJSON(messages: AIMessage[]): Promise<any> {
    const systemMessage: AIMessage = {
      role: 'system',
      content: 'You are an AI assistant that only responds in valid JSON format. Do not include markdown formatting like ```json. Do not include any explanations outside of the JSON object.'
    };

    try {
      const response = await this.fetchNvidiaAPI('/chat/completions', {
        model: this.defaultModel,
        messages: [systemMessage, ...messages],
        temperature: 0.1,
        top_p: 0.95,
        max_tokens: 1024,
      });
      
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '{}';
      
      let parsed;
      try {
        parsed = JSON.parse(content);
      } catch {
        // Fallback: try to extract json from markdown
        const match = content.match(/```json\n([\s\S]*?)\n```/);
        if (match) {
          parsed = JSON.parse(match[1]);
        } else {
          throw new Error('Could not parse JSON from Nemotron output');
        }
      }
      return parsed;
    } catch (error) {
      logger.error('Failed to generate JSON with Nemotron:', error);
      throw new Error('AI returned invalid JSON');
    }
  }
}
