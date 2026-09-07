import React from 'react';
import { Download, Image, Layout, FileText, Palette, FolderDown, Eye, ArrowUpRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { toast } from 'sonner';

export interface ResourceItem {
  id: string;
  title: string;
  subtitle: string;
  count: string;
  icon: React.ElementType;
  format: string;
  color: string;
  bg: string;
  description: string;
}

interface MarketingResourcesSectionProps {
  onSelectResource: (resource: ResourceItem) => void;
}

export default function MarketingResourcesSection({
  onSelectResource,
}: MarketingResourcesSectionProps) {
  const resources: ResourceItem[] = [
    {
      id: 'banners',
      title: 'Display & Web Banners',
      subtitle: 'Headers, sidebar & newsletter sizes',
      count: '12 Assets',
      icon: Image,
      format: 'PNG • SVG • WebP',
      color: 'text-violet-400',
      bg: 'bg-violet-500/10 border-violet-500/20',
      description:
        'Standard display banners for websites, YouTube headers, Discord announcements, and community newsletters in 1200x630, 728x90, and 300x250 dimensions.',
    },
    {
      id: 'social',
      title: 'Social Media Growth Kit',
      subtitle: 'Viral X threads & Instagram cards',
      count: '18 Templates',
      icon: Layout,
      format: 'Figma • Copy Snippets',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      description:
        'Pre-formatted viral Twitter/X threads, LinkedIn trade case-studies, Instagram story cards, and caption templates highlighting disciplined risk management.',
    },
    {
      id: 'screenshots',
      title: 'Product Screenshots & Mockups',
      subtitle: 'Crisp 4K dark-mode dashboard views',
      count: '16 Mockups',
      icon: FileText,
      format: '4K Clean PNGs',
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
      description:
        'Crisp dark-mode product screenshots showing the Trade Log, Equity Curve Analytics, Strategy Edge Matrix, and Lunar AI Post-Trade Review.',
    },
    {
      id: 'brand',
      title: 'Official Brand & Logo Pack',
      subtitle: 'Vector logos, palettes & badges',
      count: 'Official Pack',
      icon: Palette,
      format: 'Vector SVG • PDF Guide',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
      description:
        'Official RiskRules primary vector logos, inverted dark mode emblems, typography guidelines, and approved promotional partner badges.',
    },
  ];

  const handleDownloadFullPack = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success('Downloading Complete RiskRules Partner Kit (.ZIP)', {
      description: 'Contains all 4 asset packs, logos, mockups, and copy templates (48.4 MB).',
    });
  };

  return (
    <Card elevation="card" className="p-6 h-full flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-tertiary">
            <FolderDown className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-primary">Marketing Resources</h3>
            <p className="text-[11.5px] text-tertiary">Verified assets to promote RiskRules</p>
          </div>
        </div>

        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-surface-2 text-secondary border border-border">
          4 Asset Packs
        </span>
      </div>

      {/* 4 Full-Width Sleek Resource Rows (No Truncation) */}
      <div className="space-y-2 flex-1 flex flex-col justify-between">
        {resources.map((res) => {
          const Icon = res.icon;
          return (
            <div
              key={res.id}
              onClick={() => onSelectResource(res)}
              className="p-3 rounded-xl bg-surface-0/70 hover:bg-surface-2/60 border border-border/80 hover:border-violet-500/40 transition-all duration-150 cursor-pointer group flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${res.bg} ${res.color} group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary group-hover:text-violet-300 transition-colors truncate">
                      {res.title}
                    </span>
                    <span className="text-[9.5px] font-mono text-tertiary px-1.5 py-0.5 rounded bg-surface-1 border border-border/60 shrink-0">
                      {res.count}
                    </span>
                  </div>
                  <p className="text-[11px] text-secondary truncate mt-0.5">
                    {res.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 text-tertiary group-hover:text-primary transition-colors">
                <span className="text-[10px] font-semibold hidden sm:inline text-secondary group-hover:text-violet-300">
                  Preview
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-violet-400" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer / Download Complete Kit */}
      <div className="pt-2 border-t border-border/50 flex items-center justify-between">
        <span className="text-[11px] text-tertiary">Royalty-free for partners</span>
        <button
          onClick={handleDownloadFullPack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-primary hover:text-white bg-surface-2 hover:bg-violet-600 border border-border hover:border-violet-500/50 transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Full Media Kit (.ZIP)</span>
        </button>
      </div>
    </Card>
  );
}
