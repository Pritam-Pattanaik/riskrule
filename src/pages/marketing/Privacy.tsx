import React from 'react';
import { motion } from 'framer-motion';
import { PageHero } from '../../components/marketing/MarketingBits';

export default function Privacy() {
  return (
    <div className="w-full bg-canvas text-primary">
      <PageHero title="Privacy Policy" lead="How RiskRule collects, uses and protects your data." />
      <div className="mx-auto w-full max-w-[820px] px-5 py-14 sm:px-8 sm:py-20">

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="prose prose-slate dark:prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-primary prose-p:text-secondary prose-a:text-accent prose-a:no-underline hover:prose-a:underline"
        >
          <p className="text-tertiary text-sm">Last Updated: October 1, 2026</p>

          <h2>1. Information We Collect</h2>
          <p>
            When you use RiskRule, we collect the necessary information to provide our algorithmic journaling and coaching services:
          </p>
          <ul>
            <li><strong>Account Data:</strong> Email address, name, and basic profile information.</li>
            <li><strong>Trading Data:</strong> Execution history, broker sync logs, P&amp;L metrics, and journal entries.</li>
            <li><strong>Usage Metrics:</strong> Interaction patterns with the AI Coach to improve personalized behavioral feedback.</li>
          </ul>

          <h2>2. How We Use Your Data</h2>
          <p>
            Your trading data is strictly utilized to provide you with insights. We do not sell your data to hedge funds, HFT firms, or third-party marketers. Your data powers:
          </p>
          <ul>
            <li>Your personal analytics dashboard and behavioral profile.</li>
            <li>The AI Coach's ability to detect tilt and discipline breaches.</li>
            <li>Automated synchronization with your connected brokerages via secure OAuth/API keys.</li>
          </ul>

          <h2>3. Data Security &amp; Encryption</h2>
          <p>
            RiskRule employs bank-grade security protocols:
          </p>
          <ul>
            <li><strong>At Rest:</strong> All databases are encrypted using AES-256 encryption.</li>
            <li><strong>In Transit:</strong> TLS 1.3 encryption is enforced across all API and client communications.</li>
            <li><strong>API Keys:</strong> Broker API keys are encrypted at the field level and never exposed to the frontend.</li>
          </ul>

          <h2>4. Third-Party Integrations</h2>
          <p>
            RiskRule integrates with external brokerages and data providers (e.g., Yahoo Finance). We only request read-only access where possible. We are not responsible for the privacy practices of these third-party services.
          </p>

          <h2>5. Your Rights &amp; Controls</h2>
          <p>
            You retain full ownership of your trading data. You can at any time:
          </p>
          <ul>
            <li>Export your complete trade history as CSV/JSON.</li>
            <li>Disconnect any linked brokerages, immediately purging the associated connection tokens.</li>
            <li>Delete your account permanently, which initiates a hard delete of all your records within 30 days.</li>
          </ul>

          <h2>6. Contact Our Security Team</h2>
          <p>
            If you have questions regarding our privacy practices or wish to report a security vulnerability, please contact our compliance team at <strong>security@RiskRule.in</strong>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
