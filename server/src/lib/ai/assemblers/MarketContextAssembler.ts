import { cache } from '../../redis';
import { logger } from '../../logger';

export interface AssembledMarketContext {
  regime: string;
  sessionPhase: string;
  serializedMarket: string;
}

export class MarketContextAssembler {
  static async assemble(): Promise<AssembledMarketContext> {
    // Determine Indian Market Session Phase
    const now = new Date();
    // Convert to IST (UTC + 5:30)
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(now.getTime() + istOffset);
    const hours = istTime.getUTCHours();
    const minutes = istTime.getUTCMinutes();
    const totalMins = hours * 60 + minutes;

    let sessionPhase = 'Closed / Weekend';
    const day = istTime.getUTCDay();
    const isWeekday = day >= 1 && day <= 5;

    if (isWeekday) {
      if (totalMins >= 540 && totalMins < 555) {
        sessionPhase = 'Pre-Market Discovery (09:00 - 09:15 IST)';
      } else if (totalMins >= 555 && totalMins < 585) {
        sessionPhase = 'Opening Volatility Rush (09:15 - 09:45 IST)';
      } else if (totalMins >= 585 && totalMins < 690) {
        sessionPhase = 'Morning Trend Exploration (09:45 - 11:30 IST)';
      } else if (totalMins >= 690 && totalMins < 810) {
        sessionPhase = 'Midday Consolidation / Chop Window (11:30 - 13:30 IST)';
      } else if (totalMins >= 810 && totalMins < 930) {
        sessionPhase = 'European Open & Afternoon Expiry Acceleration (13:30 - 15:30 IST)';
      } else if (totalMins >= 930 && totalMins < 960) {
        sessionPhase = 'Post-Market Settlement (15:30 - 16:00 IST)';
      } else {
        sessionPhase = 'Off-Market Hours (Evening / Global Prep)';
      }
    }

    // Try reading cached market summary / news
    let marketSummary = 'Market Data: Standard Indian equity indices (NIFTY 50, BANK NIFTY).';
    try {
      const cachedNews = await cache.get('market:news:yahoo:v2');
      if (cachedNews) {
        const articles = JSON.parse(cachedNews);
        if (Array.isArray(articles) && articles.length > 0) {
          const topHeadlines = articles.slice(0, 3).map((a: any) => `• ${a.title}`).join('\n');
          marketSummary += `\nTop Recent Headlines:\n${topHeadlines}`;
        }
      }
    } catch (err: any) {
      logger.warn(`[MarketContextAssembler] News cache read failed: ${err.message}`);
    }

    return {
      regime: 'Standard Volatility',
      sessionPhase,
      serializedMarket: `• Session Phase: ${sessionPhase}\n${marketSummary}`,
    };
  }
}
