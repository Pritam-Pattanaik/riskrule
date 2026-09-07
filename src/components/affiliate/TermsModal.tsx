import React from 'react';
import { X, Shield, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl max-h-[85vh] bg-surface-1 border border-border rounded-2xl shadow-floating overflow-hidden flex flex-col z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-border bg-surface-0/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-primary">Affiliate Program Terms & Conditions</h3>
                <p className="text-xs text-secondary">RiskRules Partner Program Agreement</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-tertiary hover:text-primary hover:bg-surface-2 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="p-6 overflow-y-auto space-y-5 text-xs text-secondary leading-relaxed">
            <div className="p-3.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-200">
              <p className="font-semibold text-xs text-primary mb-1">
                Platform Identity Notice:
              </p>
              <p className="text-[11px] text-secondary">
                RiskRules is strictly a <strong>Trading Journal and Performance Analytics Platform</strong>.
                Affiliates must never advertise RiskRules as a broker, exchange, or trade execution service, nor
                promise guaranteed financial returns or trading profitability.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold text-primary">1. Commission Structure & Attribution</h4>
              <p>
                Affiliates earn up to a 20% recurring monthly commission for every qualifying paid subscriber
                who registers through their referral link. The attribution cookie is valid for 60 days from the
                initial link click.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold text-primary">2. Lifetime Recurring Model</h4>
              <p>
                Commissions continue on each recurring billing cycle for as long as the referred trader maintains
                an active, paid subscription to RiskRules with no chargebacks or refund disputes.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold text-primary">3. Disbursement & Payout Terms</h4>
              <ul className="list-disc pl-5 space-y-1 text-secondary">
                <li>Payouts are computed on the 1st of each calendar month and disbursed on the 15th.</li>
                <li>The minimum disbursement threshold is ₹2,000 (or equivalent in USD).</li>
                <li>Payouts are issued directly via verified Bank Transfer (NEFT/IMPS), UPI, or PayPal.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold text-primary">4. Prohibited Marketing Activities</h4>
              <p>
                Affiliates agree not to engage in spam messaging, search engine bidding on trademarked terms
                ("RiskRules", "RiskRules AI"), deceptive marketing, or fabricating trade performance statements.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold text-primary">5. Termination & Modifications</h4>
              <p>
                RiskRules reserves the right to modify commission rates, tier thresholds, or terminate accounts
                found violating program policies with 30 days written electronic notification.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border bg-surface-0/60 flex items-center justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 transition-colors cursor-pointer"
            >
              I Understand
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
