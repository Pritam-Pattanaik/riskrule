import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Download, QrCode, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '../ui/Card';
import riskRuleLogo from '../../assets/images/RiskRule.png';

interface ReferralQRCodeCardProps {
  referralLink: string;
}

export default function ReferralQRCodeCard({ referralLink }: ReferralQRCodeCardProps) {
  const [downloaded, setDownloaded] = React.useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const handleDownload = () => {
    if (!svgRef.current) return;
    const svgElement = svgRef.current;
    const svgString = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'RiskRules-Referral-QR.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloaded(true);
    toast.success('QR Code downloaded successfully!', {
      description: 'You can print or embed it in presentations, videos, and flyers.',
    });
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <Card elevation="card" className="p-6 flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
            <QrCode className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-base font-bold text-primary">Your Referral QR Code</h3>
        </div>
        <p className="text-xs text-secondary mt-1">Let others scan and join easily</p>
      </div>

      {/* QR Code Container */}
      <div className="flex justify-center py-2">
        <div className="p-3.5 rounded-2xl bg-white shadow-card flex items-center justify-center border border-zinc-200">
          <QRCodeSVG
            value={referralLink}
            size={128}
            bgColor={"#ffffff"}
            fgColor={"#09090B"}
            level={"Q"}
            includeMargin={false}
            imageSettings={{
              src: riskRuleLogo,
              x: undefined,
              y: undefined,
              height: 28,
              width: 28,
              excavate: true,
            }}
            ref={svgRef}
            className="w-32 h-32"
          />
        </div>
      </div>

      {/* Download Action */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleDownload}
        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-secondary hover:text-primary bg-surface-2 hover:bg-surface-3 border border-border hover:border-border-hover transition-all duration-150 cursor-pointer"
      >
        {downloaded ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Downloaded!</span>
          </>
        ) : (
          <>
            <Download className="w-3.5 h-3.5" />
            <span>Download QR Code</span>
          </>
        )}
      </motion.button>
    </Card>
  );
}
