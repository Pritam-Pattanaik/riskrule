import React, { useState } from 'react';
import { X, Download, Copy, Check, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { ResourceItem } from './MarketingResourcesSection';

interface ResourcePreviewModalProps {
  resource: ResourceItem | null;
  onClose: () => void;
  referralLink: string;
}

export default function ResourcePreviewModal({
  resource,
  onClose,
  referralLink,
}: ResourcePreviewModalProps) {
  const [copiedCaption, setCopiedCaption] = useState(false);

  if (!resource) return null;

  const sampleCaptions: Record<string, string> = {
    social: `The difference between losing traders and profitable traders isn't the indicator—it's execution discipline. 📊\n\nI've been logging my trades and uncovering emotional leaks with @RiskRules AI Trading Journal. Track your edges, measure setups, and build systematic discipline:\n👉 ${referralLink}\n\n#TradingJournal #TraderDiscipline #RiskManagement`,
    banners: `Master your risk. Journal every trade. Level up with RiskRules.\nJoin our trading community: ${referralLink}`,
    screenshots: `Explore institutional-grade analytics, strategy benchmarking, and automated multi-broker journal sync on RiskRules: ${referralLink}`,
    brand: `Official RiskRules Partner Asset Kit. Built for creators and educators helping traders build disciplined habits. Link: ${referralLink}`,
  };

  const caption = sampleCaptions[resource.id] || sampleCaptions.social;

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(caption);
    setCopiedCaption(true);
    toast.success('Promotional caption copied to clipboard!');
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const handleDownloadAsset = (filename: string) => {
    toast.success(`Downloading ${filename}`, {
      description: 'Asset saved to your downloads folder.',
    });
  };

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
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${resource.bg} ${resource.color}`}>
                <resource.icon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-primary">{resource.title}</h3>
                <p className="text-xs text-secondary">{resource.subtitle}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-tertiary hover:text-primary hover:bg-surface-2 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-5">
            <p className="text-xs text-secondary leading-relaxed">{resource.description}</p>

            {/* Visual Preview Banner Box */}
            <div className="relative rounded-xl bg-gradient-to-br from-surface-0 to-surface-2 border border-border p-6 flex flex-col items-center justify-center text-center space-y-3 overflow-hidden min-h-[160px]">
              <div className="w-12 h-12 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-primary">{resource.title} Asset Pack</span>
                <p className="text-[11px] text-tertiary mt-0.5">High-definition dark-mode verified creative assets</p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <span className="px-2 py-0.5 rounded bg-surface-1 text-[10px] font-mono text-secondary border border-border">
                  {resource.format}
                </span>
                <span className="px-2 py-0.5 rounded bg-surface-1 text-[10px] font-mono text-secondary border border-border">
                  Instant Access
                </span>
              </div>
            </div>

            {/* Copyable Caption Snippet */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-primary">Suggested Social Post & Caption</span>
                <button
                  onClick={handleCopyCaption}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-400 hover:text-violet-300 transition-colors cursor-pointer"
                >
                  {copiedCaption ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCaption ? 'Copied' : 'Copy Caption'}</span>
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-0 border border-border text-xs font-mono text-secondary whitespace-pre-wrap leading-relaxed select-all">
                {caption}
              </div>
            </div>

            {/* Available Assets in Pack */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-primary">Downloadable Asset Files</span>
              <div className="space-y-2">
                {[
                  { name: `${resource.title.toLowerCase().replace(/\s+/g, '-')}-dark-1200x630.png`, size: '1.4 MB' },
                  { name: `${resource.title.toLowerCase().replace(/\s+/g, '-')}-square-1080x1080.png`, size: '920 KB' },
                  { name: `${resource.title.toLowerCase().replace(/\s+/g, '-')}-vector-pack.zip`, size: '4.2 MB' },
                ].map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-surface-0 border border-border/80 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Download className="w-3.5 h-3.5 text-tertiary" />
                      <span className="font-mono text-primary">{file.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-tertiary">{file.size}</span>
                      <button
                        onClick={() => handleDownloadAsset(file.name)}
                        className="px-2.5 py-1 rounded bg-surface-2 hover:bg-surface-3 text-[11px] font-semibold text-secondary hover:text-primary transition-colors cursor-pointer"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border bg-surface-0/60 flex items-center justify-between">
            <span className="text-[11px] text-tertiary">All assets royalty-free for RiskRules affiliates</span>
            <button
              onClick={() => handleDownloadAsset(`${resource.title.toLowerCase()}-full-pack.zip`)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download All Assets (.zip)</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
