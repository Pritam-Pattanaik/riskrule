import { AIProvider, AIMessage } from '../AIProvider';

export class NemotronProvider implements AIProvider {
  private defaultModel = 'nvidia/nemotron-4-340b-instruct'; // Placeholder model name
  
  constructor() {
    const apiKey = process.env.NEMOTRON_API_KEY;
    if (!apiKey) {
      console.warn('NEMOTRON_API_KEY is missing. NemotronProvider will fail if invoked.');
    }
    // Setup OpenAI compatible client here if needed
  }

  async streamChat(messages: AIMessage[], onChunk: (chunk: string) => void, signal?: AbortSignal): Promise<void> {
    throw new Error('NemotronProvider is not yet active in production. Please configure AI_PROVIDER=groq in environment variables.');
  }

  async generateText(messages: AIMessage[]): Promise<string> {
    throw new Error('NemotronProvider is not yet active in production.');
  }

  async generateJSON(messages: AIMessage[]): Promise<any> {
    throw new Error('NemotronProvider is not yet active in production.');
  }
}
