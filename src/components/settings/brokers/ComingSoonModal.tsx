import React from 'react';
import { BrokerProviderDefinition } from '../../../lib/brokers/brokerTypes';
import { BrokerLogo } from './BrokerLogo';
import { cn } from '../../../lib/cn';
import { Button } from '../../ui/Button';
import { X, Bell, Mail, Clock, Construction, ExternalLink, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { notify } from '../../../lib/notify';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  broker: BrokerProviderDefinition;
}

export const ComingSoonModal: React.FC<ComingSoonModalProps> = ({
  isOpen,
  onClose,
  broker,
}) => {
  if (!isOpen) return null;

  const handleNotifyMe = () => {
    notify.success(`You'll be notified when ${broker.name} is ready!`);
    onClose();
  };

  const handleRequestAccess = () => {
    notify.info(`Early access request submitted for ${broker.name}.`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 font-sans">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="relative w-full max-w-md bg-surface-0 border border-border rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Decorative background glow */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-[120px] opacity-15 pointer-events-none"
              style={{ backgroundColor: broker.themeColor }}
            />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 text-tertiary hover:text-primary bg-surface-1 hover:bg-surface-2 rounded-xl transition-colors border border-border"
            >
              <X size={16} />
            </button>

            {/* Content */}
            <div className="relative z-10 px-8 pt-10 pb-8 flex flex-col items-center text-center">
              {/* Logo */}
              <div className="relative mb-6">
                <div
                  className="absolute inset-0 rounded-2xl blur-2xl opacity-20 animate-pulse"
                  style={{ backgroundColor: broker.themeColor }}
                />
                <BrokerLogo
                  providerId={broker.providerId}
                  fallbackText={broker.logoText}
                  themeColor={broker.themeColor}
                  size="xl"
                  muted
                  className="relative z-10"
                />
              </div>

              {/* Coming Soon Badge */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-warning/10 border border-warning/25 mb-5">
                <Construction size={15} className="text-warning" />
                <span className="text-sm font-bold text-warning tracking-wide">Coming Soon</span>
              </div>

              {/* Broker Name */}
              <h2 className="font-display font-bold text-2xl text-primary mb-2">
                {broker.name}
              </h2>

              {/* Description */}
              <p className="text-sm text-secondary leading-relaxed max-w-sm mb-2">
                {broker.comingSoonDescription || `We're actively building the ${broker.name} integration. Stay tuned for updates.`}
              </p>

              {/* ETA */}
              {broker.comingSoonEta && (
                <div className="flex items-center gap-2 text-xs text-tertiary mt-1 mb-6">
                  <Clock size={13} />
                  <span>
                    Expected availability: <strong className="text-secondary">{broker.comingSoonEta}</strong>
                  </span>
                </div>
              )}

              {/* Market segments preview */}
              {broker.marketSegments && broker.marketSegments.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap justify-center mb-8">
                  {broker.marketSegments.map(seg => (
                    <span
                      key={seg}
                      className="px-2.5 py-1 bg-surface-1 border border-border rounded-lg text-[11px] font-semibold text-tertiary"
                    >
                      {seg}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="w-full space-y-3">
                <Button
                  onClick={handleNotifyMe}
                  className="w-full h-12 font-bold text-sm gap-2 shadow-iris"
                >
                  <Bell size={16} />
                  Notify Me When Ready
                </Button>

                <Button
                  variant="secondary"
                  onClick={handleRequestAccess}
                  className="w-full h-11 font-bold text-sm gap-2"
                >
                  <Sparkles size={16} />
                  Request Early Access
                </Button>
              </div>

              {/* Trust footer */}
              <p className="text-[11px] text-muted mt-6 leading-relaxed max-w-xs">
                Our engineering team is actively building this integration with full security compliance and institutional-grade reliability.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
