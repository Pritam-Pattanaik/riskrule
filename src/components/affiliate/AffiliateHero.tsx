import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Link2,
  PlayCircle,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Zap,
  Calendar,
  Copy,
  Crown,
} from 'lucide-react';
import { toast } from 'sonner';

interface AffiliateHeroProps {
  referralLink: string;
  referralCode?: string;
  commissionPercent?: number;
  monthlyRewardPerPro?: number;
  onScrollToHowItWorks?: () => void;
  onScrollToReferralLink?: () => void;
}

export default function AffiliateHero({
  referralLink,
  referralCode = 'RISKRULE',
  commissionPercent = 20,
  monthlyRewardPerPro = 400,
  onScrollToHowItWorks,
  onScrollToReferralLink,
}: AffiliateHeroProps) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(referralLink); setCopied(true); }
    catch { toast.error('Could not copy the link. Select the link to copy it manually.'); }
  };
  React.useEffect(() => { setCopied(false); }, [referralLink]);
  return <section className="desk-panel flex flex-wrap items-end justify-between gap-4">
    <div className="min-w-0"><h2 className="font-semibold">Your referral link</h2>
      <p className="mt-1 break-all text-sm text-secondary">{referralLink || 'Referral link unavailable'}</p>
      <p className="mt-2 text-xs text-secondary">{commissionPercent}% commission · {referralCode}</p></div>
    <div className="flex flex-wrap gap-2"><button className="desk-button" onClick={onScrollToHowItWorks}>How it works</button>
      <button className="desk-button" onClick={onScrollToReferralLink}>Manage link</button>
      <button className="desk-button desk-primary" disabled={!referralLink} onClick={copy}>{copied ? 'Copied' : 'Copy link'}</button></div>
  </section>;
}
