import React, { useEffect } from 'react';
import HeroSection from '../../components/marketing/HeroSection';
import TrustTicker from '../../components/marketing/TrustTicker';
import BehavioursFloorSection from '../../components/marketing/BehavioursFloorSection';
import RealityStatSection from '../../components/marketing/RealityStatSection';
import LeakCalculatorSection from '../../components/marketing/LeakCalculatorSection';
import WhoItsForSection from '../../components/marketing/WhoItsForSection';
import TraderJourneySection from '../../components/marketing/TraderJourneySection';
import InteractiveDashboard from '../../components/marketing/InteractiveDashboard';
import BentoGridSection from '../../components/marketing/BentoGridSection';
import AICoachSection from '../../components/marketing/AICoachSection';
import PricingSection from '../../components/marketing/PricingSection';
import FAQSection from '../../components/marketing/FAQSection';
import FinalCTASection from '../../components/marketing/FinalCTASection';

// SocialProofSection is left out on purpose: its testimonials and headline figures
// are unverified. Add it back once they are real and sourced.

export default function Home() {
  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-canvas text-primary">
      <HeroSection />
      <TrustTicker />
      <RealityStatSection />
      <BehavioursFloorSection />
      <LeakCalculatorSection />
      <TraderJourneySection />
      <InteractiveDashboard />
      <BentoGridSection />
      <WhoItsForSection />
      <AICoachSection />
      <PricingSection />
      <FAQSection />
      <FinalCTASection />
    </div>
  );
}
