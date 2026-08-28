import dotenv from 'dotenv';
dotenv.config();
import { synthesizeSpeech } from '../src/lib/ai/SarvamVoiceService';

const voices = ['kabir', 'ashutosh', 'aditya', 'shubh', 'advait', 'rahul', 'rohan', 'amit', 'dev', 'varun', 'ratan', 'anand', 'tarun', 'gokul', 'priya', 'neha', 'ritu', 'pooja', 'simran', 'kavya', 'ishita', 'shreya', 'roopa', 'anushka', 'tanya', 'shruti', 'suhani'];

async function testAll() {
  console.log('Testing all voices...');
  for (const voice of voices) {
    try {
      const res = await synthesizeSpeech({
        text: "Hello",
        speaker: voice,
        languageCode: 'en-IN',
      });
      if (res.audioChunks && res.audioChunks.length > 0) {
        console.log(`✅ [${voice}] Success - Base64 len: ${res.audioChunks[0].length}`);
      } else {
        console.log(`❌ [${voice}] Failed - No chunks returned`);
      }
    } catch (e: any) {
      console.log(`❌ [${voice}] Error: ${e.message}`);
    }
  }
}

testAll();
