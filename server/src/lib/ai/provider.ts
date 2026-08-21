import Groq from 'groq-sdk';

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

  const completion = await groq.chat.completions.create({
    // Using openai/gpt-oss-120b for high quality coaching
    model: 'openai/gpt-oss-120b',
    messages,
    temperature: 0.1, // Very low temperature for highly deterministic analysis
    top_p: 0.95,
    max_tokens: 4096,
    stream: true,
  }, { signal });

  for await (const chunk of completion) {
    const content = chunk.choices[0]?.delta?.content || '';
    if (content) {
      onChunk(content);
    }
  }
}

export async function generateGroqJSON(messages: any[]): Promise<any> {
  const groq = getGroqClient();
  
  // Inject instructions to ensure JSON output
  const systemMessage = {
    role: 'system',
    content: 'You are an AI assistant that only responds in valid JSON format. Do not include markdown formatting like ```json. Do not include any explanations outside of the JSON object.'
  };

  const completion = await groq.chat.completions.create({
    model: 'openai/gpt-oss-120b',
    messages: [systemMessage, ...messages],
    temperature: 0.1,
    top_p: 0.95,
    max_tokens: 4096,
    response_format: { type: 'json_object' }
  });

  const content = completion.choices[0]?.message?.content || '{}';
  
  try {
    return JSON.parse(content);
  } catch (error) {
    console.error('Failed to parse Groq JSON response:', content);
    throw new Error('AI returned invalid JSON');
  }
}

export async function generateGroqText(messages: any[]): Promise<string> {
  const groq = getGroqClient();
  
  const completion = await groq.chat.completions.create({
    model: 'openai/gpt-oss-120b',
    messages,
    temperature: 0.7, // slightly more creative for titles
    top_p: 0.95,
    max_tokens: 30,
  });

  return completion.choices[0]?.message?.content || 'New Conversation';
}
