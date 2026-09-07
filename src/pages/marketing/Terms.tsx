import React from 'react';
import { Scale, ShieldAlert, Zap, BookOpen, Crown, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Terms() {
  return (
    <div className="min-h-screen bg-canvas pt-32 pb-24 selection:bg-primary/20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/20">
            <Scale className="w-4 h-4" />
            <span>Comprehensive Legal Agreement</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight mb-6 font-display">
            Terms & Conditions
          </h1>
          <p className="text-xl text-secondary max-w-2xl leading-relaxed">
            By accessing or using RiskRule, you agree to be bound by these comprehensive terms. 
            Designed for professional market participants, traders, and affiliates.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-primary prose-p:text-secondary prose-li:text-secondary prose-strong:text-primary prose-a:text-iris prose-a:no-underline hover:prose-a:underline"
        >
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-8">
            <p className="text-amber-400 text-sm font-bold m-0 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              IMPORTANT RISK DISCLOSURE
            </p>
            <p className="text-amber-400/80 text-sm mt-2 mb-0">
              RiskRule is an analytics, journaling, and AI-coaching platform. We are NOT a broker-dealer or registered investment advisor. Trading involves significant risk of loss and is not suitable for everyone. Any insights, including AI Coach recommendations, are for educational purposes only.
            </p>
          </div>

          <p className="text-tertiary text-sm">Last Updated: October 1, 2026</p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            These Terms of Service ("Terms") govern your use of the RiskRule platform, software, APIs, and associated services (collectively, the "Service"). By creating an account, subscribing to Pro, or joining the Affiliate program, you signify your absolute acceptance of these Terms.
          </p>

          <h2>2. Description of the Service Platform</h2>
          <p>
            RiskRule provides a comprehensive suite of tools designed for active traders:
          </p>
          <ul>
            <li><strong>Trade Journaling & Analytics:</strong> Logging trades, analyzing performance metrics, and goal tracking.</li>
            <li><strong>Knowledge Vault & Strategies:</strong> A secure environment to store personal trading strategies, playbooks, and market notes.</li>
            <li><strong>AI Coach:</strong> Behavioral and performance insights driven by artificial intelligence based on your trade logs.</li>
            <li><strong>Market Quotes & Flow:</strong> Visualization of market data, quotes, and order flow context.</li>
          </ul>

          <h2 className="flex items-center gap-2"><Bot className="w-6 h-6 text-violet-400" /> 3. AI Coach & Artificial Intelligence Disclaimer</h2>
          <p>
            The RiskRule AI Coach analyzes your trading journal to provide behavioral insights and discipline feedback. You acknowledge that:
          </p>
          <ul>
            <li>AI-generated insights are <strong>not trading signals</strong> and must never be interpreted as financial advice.</li>
            <li>Artificial Intelligence can occasionally hallucinate or provide inaccurate behavioral interpretations. Always verify your own data.</li>
            <li>RiskRule assumes no liability for trading decisions made after consulting the AI Coach.</li>
          </ul>

          <h2 className="flex items-center gap-2"><Zap className="w-6 h-6 text-emerald-400" /> 4. Affiliate & Partner Program</h2>
          <p>
            RiskRule offers an Affiliate Program allowing users to earn recurring commissions (e.g., 20% per active Pro referral). By participating, you agree:
          </p>
          <ul>
            <li><strong>Payouts:</strong> Commissions are paid out on a recurring basis as long as the referred user maintains an active Pro subscription. Minimum payout thresholds may apply.</li>
            <li><strong>Prohibited Marketing:</strong> You may not bid on "RiskRule" trademark terms in PPC ads, engage in spam, or misrepresent RiskRule as a guaranteed path to trading profitability.</li>
            <li><strong>Revocation:</strong> RiskRule reserves the right to withhold payouts and terminate affiliate accounts engaging in fraudulent self-referrals or deceptive marketing.</li>
          </ul>

          <h2 className="flex items-center gap-2"><Crown className="w-6 h-6 text-amber-400" /> 5. Subscriptions, Pro Tier, & Billing</h2>
          <p>
            Certain advanced features (like real-time flow, unlimited AI Coach queries, and advanced analytics) require a RiskRule Pro subscription.
          </p>
          <ul>
            <li>Subscriptions are billed in advance on a recurring monthly or annual basis.</li>
            <li>You may cancel at any time, but we do not provide prorated refunds for mid-cycle cancellations unless legally required.</li>
          </ul>

          <h2>6. Broker API Sync & Third-Party Integrations</h2>
          <p>
            If you connect your broker or prop firm account via our read-only API sync:
          </p>
          <ul>
            <li>You authorize RiskRule to fetch trade history and balances strictly on a read-only basis.</li>
            <li>We do not execute trades on your behalf.</li>
            <li>RiskRule is not liable for data discrepancies caused by third-party broker API outages or rate limits.</li>
          </ul>

          <h2 className="flex items-center gap-2"><BookOpen className="w-6 h-6 text-iris" /> 7. User-Generated Content & Intellectual Property</h2>
          <p>
            Your trading strategies, journal entries, and Knowledge Vault contents belong to you. RiskRule claims no ownership over your proprietary trading strategies. However, by using the Service, you grant RiskRule the right to securely store and process this data to provide you with the Service and AI insights.
          </p>

          <h2>8. Acceptable Use Policy</h2>
          <p>
            You agree not to misuse the Service. Misuse includes, but is not limited to:
          </p>
          <ul>
            <li>Attempting to reverse-engineer, decompile, or bypass security constraints.</li>
            <li>Using automated scripts or bots to scrape market data from the platform.</li>
            <li>Sharing a single Pro subscription across multiple unassociated users.</li>
          </ul>

          <h2>9. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, RiskRule and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, trading capital, data, or goodwill, arising out of your access to or use of the Service.
          </p>

          <h2>10. Modifications to Terms & Service</h2>
          <p>
            RiskRule reserves the right to modify the platform or these Terms at any time. Significant changes will be communicated via email or an in-app notice. Continued use of the platform constitutes acceptance of the new terms.
          </p>

          <h2>11. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which RiskRule Inc. is registered, without regard to its conflict of law provisions.
          </p>

          <hr className="border-border/50 my-12" />

          <h2>Contact Information</h2>
          <p>
            For legal inquiries, affiliate support, or privacy questions, please contact our support team at:
            <br />
            <strong>legal@riskrule.in</strong>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
