import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Share2, Mail, Send, ExternalLink, Edit3 } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '../ui/Card';

interface ReferralShareCardProps {
  referralLink: string;
  referralCode: string;
  onUpdateCode?: (newCode: string) => void;
}

export default function ReferralShareCard({
  referralLink,
  referralCode,
  onUpdateCode,
}: ReferralShareCardProps) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [customCode, setCustomCode] = useState(referralCode);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Referral link copied to clipboard!', {
      description: referralLink,
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveCode = () => {
    const clean = customCode.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    if (clean.length < 3) {
      toast.error('Code must be at least 3 characters');
      return;
    }
    if (onUpdateCode) {
      onUpdateCode(clean);
    }
    setIsEditing(false);
    toast.success(`Referral code updated to ${clean}`);
  };

  // Social Share configurations with pre-filled promotional text focused on Trading Journal & Discipline
  const shareMessage = encodeURIComponent(
    `I've been journaling my trades, analyzing win rate, and building disciplined trading habits with RiskRules. Track your performance and master your risk rules here: ${referralLink}`
  );
  const shareTitle = encodeURIComponent('Level up your trading with RiskRules AI Trading Journal');
  const encodedUrl = encodeURIComponent(referralLink);

  const shareChannels = [
    {
      id: 'x',
      name: 'Twitter',
      label: 'X (Twitter)',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      url: `https://twitter.com/intent/tweet?text=${shareMessage}`,
      btnStyle: 'hover:bg-zinc-800 text-zinc-300 hover:text-white border-border hover:border-zinc-600',
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      label: 'LinkedIn',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      ),
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      btnStyle: 'hover:bg-[#0A66C2]/20 text-sky-400 hover:text-sky-300 border-[#0A66C2]/30',
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      label: 'WhatsApp',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.17-.48-.29z" />
        </svg>
      ),
      url: `https://api.whatsapp.com/send?text=${shareMessage}`,
      btnStyle: 'hover:bg-[#25D366]/20 text-emerald-400 hover:text-emerald-300 border-[#25D366]/30',
    },
    {
      id: 'telegram',
      name: 'Telegram',
      label: 'Telegram',
      icon: <Send className="w-4 h-4" />,
      url: `https://t.me/share/url?url=${encodedUrl}&text=${shareMessage}`,
      btnStyle: 'hover:bg-[#229ED9]/20 text-sky-400 hover:text-sky-300 border-[#229ED9]/30',
    },
    {
      id: 'email',
      name: 'Email',
      label: 'Email',
      icon: <Mail className="w-4 h-4" />,
      url: `mailto:?subject=${shareTitle}&body=${shareMessage}`,
      btnStyle: 'hover:bg-surface-3 text-secondary hover:text-primary border-border',
    },
  ];

  return (
    <Card elevation="card" className="p-6 space-y-5">
      {/* Title & Description */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Share2 className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-base font-bold text-primary">Your Referral Link</h3>
          </div>
          <p className="text-xs text-secondary mt-1">
            Share this link with your network to earn lifetime 20% recurring commissions.
          </p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-xs text-tertiary hover:text-secondary flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Edit3 className="w-3 h-3" />
          <span>{isEditing ? 'Cancel' : 'Customize Code'}</span>
        </button>
      </div>

      {/* Code Editor (if toggled) */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-3 rounded-xl bg-surface-2/60 border border-border space-y-2"
        >
          <label className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
            Custom Referral Slug
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-tertiary font-mono">riskrules.com/r/</span>
            <input
              type="text"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
              placeholder="YOURCODE"
              className="flex-1 bg-surface-1 border border-border px-3 py-1.5 rounded-lg text-xs font-mono text-primary uppercase focus:outline-none focus:border-violet-500"
            />
            <button
              onClick={handleSaveCode}
              className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              Save
            </button>
          </div>
        </motion.div>
      )}

      {/* Referral Link Display & Copy Button */}
      <div className="flex flex-col sm:flex-row items-stretch gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            readOnly
            value={referralLink}
            className="w-full bg-surface-0/90 border border-border rounded-xl px-4 py-3 text-xs sm:text-sm font-mono text-primary/90 focus:outline-none focus:ring-1 focus:ring-violet-500/50 select-all"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCopy}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-iris transition-all duration-200 cursor-pointer shrink-0"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Link</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Social Share Buttons */}
      <div className="space-y-2 pt-1">
        <span className="text-xs font-semibold text-tertiary">Share on</span>
        <div className="flex flex-wrap items-center gap-2">
          {shareChannels.map((channel) => (
            <a
              key={channel.id}
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium bg-surface-1 border transition-all duration-150 ${channel.btnStyle}`}
            >
              {channel.icon}
              <span>{channel.name}</span>
            </a>
          ))}
        </div>
      </div>
    </Card>
  );
}
