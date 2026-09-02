import React, { useEffect } from 'react';
import HeroSection from '../../components/marketing/HeroSection';
import TrustTicker from '../../components/marketing/TrustTicker';
import DisciplineSimulatorSection from '../../components/marketing/DisciplineSimulatorSection';
import TraderJourneySection from '../../components/marketing/TraderJourneySection';
import EdgeLeakCheckerSection from '../../components/marketing/EdgeLeakCheckerSection';
import InteractiveDashboard from '../../components/marketing/InteractiveDashboard';
import BentoGridSection from '../../components/marketing/BentoGridSection';
import MarketNewsSection from '../../components/marketing/MarketNewsSection';
import AICoachSection from '../../components/marketing/AICoachSection';
import SocialProofSection from '../../components/marketing/SocialProofSection';
import PricingSection from '../../components/marketing/PricingSection';
import FAQSection from '../../components/marketing/FAQSection';
import FinalCTASection from '../../components/marketing/FinalCTASection';

export default function Home() {
  // Ensure view starts at top on direct navigation
  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div className="w-full relative overflow-hidden bg-canvas text-primary">
      
      {/* 01. Hero Positioning & Value Conversion Section */}
      <HeroSection />

      {/* 02. Institutional Broker Ecosystem Marquee */}
      <TrustTicker />

      {/* 03. Interactive Discipline-to-Profit Simulator (How discipline changes the equity curve) */}
      <div id="discipline-simulator" className="pt-8 scroll-mt-20">
        <DisciplineSimulatorSection />
      </div>

      {/* 04. The 4-Step Blueprint to Trader Consistency */}
      <TraderJourneySection />

      {/* 05. Interactive Diagnostic: Where are you leaking capital right now? */}
      <EdgeLeakCheckerSection />

      {/* 06. Interactive Command Center Showcase (Live 4-Tab Simulation) */}
      <div className="pt-12">
        <InteractiveDashboard />
      </div>

      {/* 07. Concrete Trader Benefits & Engineering Pillars Bento Grid */}
      <BentoGridSection />

      {/* 08. Macroeconomic News Protection & Event Lockouts */}
      <MarketNewsSection />

      {/* 09. AI Behavioral Coach Deep-Dive Engine */}
      <AICoachSection />

      {/* 10. Verified Social Proof & Audited Prop Performance */}
      <SocialProofSection />

      {/* 11. Transparent Investment Plans & ROI Calculator */}
      <PricingSection />

      {/* 12. Objection Resolution FAQ Accordion Vault */}
      <FAQSection />

      {/* 13. High-Conversion Closing Trigger */}
      <FinalCTASection />

    </div>
  );
}
