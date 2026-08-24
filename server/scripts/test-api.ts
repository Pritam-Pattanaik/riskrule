import * as dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(__dirname, '../../.env') });

import { GroqProvider } from '../src/lib/ai/providers/GroqProvider';
import { NemotronProvider } from '../src/lib/ai/providers/NemotronProvider';
import { AIMessage } from '../src/lib/ai/AIProvider';

async function testProvider(providerName: string, provider: any) {
  console.log(`\n=== Testing ${providerName} ===`);
  try {
    const messages: AIMessage[] = [{ role: 'user', content: 'Say hello in 5 words or less.' }];
    
    console.log('1. Testing generateText...');
    const textResponse = await provider.generateText(messages);
    console.log(`Response: ${textResponse}`);
    
    console.log('\n2. Testing streamChat...');
    process.stdout.write('Stream: ');
    await provider.streamChat(messages, (chunk: string) => {
      process.stdout.write(chunk);
    });
    console.log();
    
    console.log('\n3. Testing generateJSON...');
    const jsonMessages: AIMessage[] = [{ role: 'user', content: 'Give me a JSON object with a key "message" and value "hello world"' }];
    const jsonResponse = await provider.generateJSON(jsonMessages);
    console.log(`JSON Response: ${JSON.stringify(jsonResponse)}`);
    
    console.log(`\n✅ ${providerName} tests passed!`);
  } catch (error) {
    console.error(`\n❌ ${providerName} tests failed:`, error);
  }
}

async function run() {
  const groq = new GroqProvider();
  await testProvider('GroqProvider', groq);
  
  const nemotron = new NemotronProvider();
  await testProvider('NemotronProvider', nemotron);
}

run();
