import dotenv from 'dotenv';
dotenv.config();
import { prisma } from '../src/db';
import { ContextService } from '../src/lib/ai/ContextService';
import { ChatPromptRegistry } from '../src/lib/ai/ChatPromptRegistry';
import { getAIProvider } from '../src/lib/ai/providerFactory';

async function auditRealAIResponses() {
  const user = await prisma.user.findFirst();
  if (!user) throw new Error('No user found');

  const testQueries = [
    {
      mode: 'general',
      prompt: 'How is my trading looking today?',
      scenario: "Daily Check-in during active trading session"
    },
    {
      mode: 'psychology',
      prompt: 'What is my biggest psychological trap right now and what is the exact rule to fix it?',
      scenario: "Psychology deep-dive after emotional friction"
    },
    {
      mode: 'risk',
      prompt: 'Evaluate my risk to reward ratio and tell me where I am bleeding money.',
      scenario: "Risk management audit"
    }
  ];

  console.log('===============================================================');
  console.log('🔍 AUDITING REAL AI COACH RESPONSES & USER COGNITIVE LOAD');
  console.log('===============================================================\n');

  for (const q of testQueries) {
    console.log(`\n---------------------------------------------------------------`);
    console.log(`🎯 SCENARIO: ${q.scenario}`);
    console.log(`💬 USER PROMPT: "${q.prompt}" (Mode: ${q.mode})`);
    console.log(`---------------------------------------------------------------`);

    const ctx = await ContextService.assembleMasterContext(user.id, q.mode);
    const systemPrompt = ChatPromptRegistry.buildSystemPrompt(ctx);
    const provider = getAIProvider();

    let fullResponse = '';
    const startTime = Date.now();

    await provider.streamChat(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: q.prompt }
      ],
      (chunk) => {
        fullResponse += chunk;
      }
    );

    const latency = Date.now() - startTime;
    const wordCount = fullResponse.split(/\s+/).filter(Boolean).length;
    const charCount = fullResponse.length;
    const paragraphs = fullResponse.split('\n\n').filter(p => p.trim().length > 0);
    const hasBulletedLists = fullResponse.includes('- ') || fullResponse.includes('* ') || fullResponse.includes('1. ');
    const hasDisciplineTag = fullResponse.includes('<!--DISCIPLINE_JSON-->');

    console.log(`⏱️ Latency: ${latency}ms | 📊 Words: ${wordCount} | 📝 Chars: ${charCount} | 📑 Paragraphs: ${paragraphs.length}`);
    console.log(`📋 Has Bullet Lists: ${hasBulletedLists} | 🏷️ Has Discipline Tag: ${hasDisciplineTag}`);
    console.log(`\n--- RAW OUTPUT ---`);
    console.log(fullResponse);
    console.log(`--- END RAW OUTPUT ---\n`);

    // Scannability analysis
    console.log(`🧐 COGNITIVE LOAD ASSESSMENT:`);
    if (wordCount > 300) {
      console.log(`⚠️ CRITIQUE: Response is TOO LONG (${wordCount} words). A trader scanning in 5s will experience fatigue.`);
    } else if (wordCount > 180) {
      console.log(`⚡ CRITIQUE: Moderate length (${wordCount} words). Usable, but could be tighter.`);
    } else {
      console.log(`✅ EXCELLENT: Crisp and punchy (${wordCount} words). High scannability.`);
    }

    if (paragraphs[0] && paragraphs[0].length > 250) {
      console.log(`⚠️ CRITIQUE: First paragraph is a dense block (${paragraphs[0].length} chars). First sentence should be a punchy headline takeaway.`);
    } else {
      console.log(`✅ LEAD CLARITY: First paragraph is concise.`);
    }
  }
}

auditRealAIResponses().catch(console.error);
