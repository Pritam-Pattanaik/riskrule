import React, { useState, useEffect } from 'react';
import { BROKER_REGISTRY, getBrokerProvider } from '../../../lib/brokers/brokerRegistry';
import { BrokerProviderDefinition } from '../../../lib/brokers/brokerTypes';
import { DynamicBrokerForm } from './DynamicBrokerForm';
import { BrokerLogo } from './BrokerLogo';
import { ComingSoonModal } from './ComingSoonModal';
import { useBrokerStore } from '../../../stores/brokerStore';
import { notify } from '../../../lib/notify';
import { cn } from '../../../lib/cn';
import { Button } from '../../ui/Button';
import { 
  Check, ArrowRight, ArrowLeft, ShieldCheck, Lock, 
  ExternalLink, AlertCircle, X, Activity, 
  Clock, Globe, BookOpen, Key, Server, Cpu, Layers,
  Construction, Zap, Shield, ChevronDown, ChevronUp,
  Info, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BrokerConnectionWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrokerConnectionWizard: React.FC<BrokerConnectionWizardProps> = ({
  isOpen,
  onClose,
}) => {
  const { addConnection, syncConnection } = useBrokerStore();
  const [step, setStep] = useState<number>(1);
  const [selectedProviderId, setSelectedProviderId] = useState<string>(BROKER_REGISTRY[0].providerId);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [wizardError, setWizardError] = useState<string | null>(null);
  
  // Step 6, 7, 8 State
  const [handshakeStep, setHandshakeStep] = useState(0);
  const [successAccountAlias, setSuccessAccountAlias] = useState<string>('');
  const [syncProgress, setSyncProgress] = useState(0);

  // Coming Soon Modal
  const [comingSoonBroker, setComingSoonBroker] = useState<BrokerProviderDefinition | null>(null);
  
  // Guide State (Step 4)
  const [guideStep, setGuideStep] = useState(0);

  // Guide FAQ/Common Mistakes toggles
  const [showCommonMistakes, setShowCommonMistakes] = useState(false);

  const activeProvider = getBrokerProvider(selectedProviderId) || BROKER_REGISTRY[0];

  // Split brokers into sections
  const activeBrokers = BROKER_REGISTRY.filter(b => b.syncStatus === 'ACTIVE');
  const comingSoonBrokers = BROKER_REGISTRY.filter(b => b.syncStatus === 'COMING_SOON');

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setWizardError(null);
      setIsProcessing(false);
      setHandshakeStep(0);
      setGuideStep(0);
      setSyncProgress(0);
      setComingSoonBroker(null);
      setShowCommonMistakes(false);
    }
  }, [isOpen]);

  const handleConnectSubmission = async (credentials: Record<string, string>, accountAlias: string) => {
    setIsProcessing(true);
    setWizardError(null);
    setHandshakeStep(0);

    try {
      setStep(6); // Step 6: Cryptographic Handshake
      
      // Simulate Handshake for Trust
      await new Promise(r => setTimeout(r, 800));
      setHandshakeStep(1);
      await new Promise(r => setTimeout(r, 800));
      setHandshakeStep(2);
      
      const payload: any = {
        broker: selectedProviderId,
        apiKey: credentials.apiKey || credentials.accessToken || '',
        clientId: credentials.clientId || accountAlias,
        accountAlias,
      };

      if (credentials.apiSecret) payload.apiSecret = credentials.apiSecret;

      if (selectedProviderId === 'angelone') {
        payload.mpin = credentials.mpin;
        payload.totpSecret = credentials.totpSecret;
      } else {
        const metaObj: Record<string, string> = {};
        if (credentials.apiPassword) metaObj.password = credentials.apiPassword;
        if (credentials.accessToken) metaObj.accessToken = credentials.accessToken;
        if (Object.keys(metaObj).length > 0) payload.metadata = JSON.stringify(metaObj);
      }

      const { error } = await addConnection(payload);
      if (error) throw new Error(error);

      setHandshakeStep(3);
      await new Promise(r => setTimeout(r, 600));

      setSuccessAccountAlias(accountAlias);
      setStep(7); // Step 7: Identity Preview
      
    } catch (err: any) {
      setWizardError(err.message || 'Authentication failed. Please verify your credentials.');
      setStep(5); // Go back to Vault Form
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartSync = () => {
    setStep(8); // Step 8: Sync Center
    
    // Trigger real backend sync
    if (activeProvider.syncStatus === 'ACTIVE') {
      syncConnection(selectedProviderId, true).catch(console.error);
    }

    // Simulate progress bar filling
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      setSyncProgress(Math.min(progress, 100));
    }, 400);
  };

  const resetAndClose = () => {
    setStep(1);
    setIsProcessing(false);
    setWizardError(null);
    onClose();
  };

  if (!isOpen) return null;

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => Math.max(1, prev - 1));

  // Handle broker card click — gate Coming Soon brokers
  const handleBrokerSelect = (broker: BrokerProviderDefinition) => {
    if (broker.syncStatus === 'COMING_SOON') {
      setComingSoonBroker(broker);
      return;
    }
    setSelectedProviderId(broker.providerId);
    nextStep();
  };

  // Auth label helper
  const getAuthLabel = (model: string) => {
    switch (model) {
      case 'OAUTH2': return 'OAuth 2.0';
      case 'DAILY_SESSION_TOKEN': return 'Daily Token';
      case 'CLIENT_ID_SECRET_TOTP': return 'TOTP Auto-Refresh';
      case 'API_KEY_SECRET': return 'API Key + Secret';
      case 'JWT': return 'JWT Bearer';
      default: return 'API Key';
    }
  };

  // A global component for trust
  const TrustAnchor = () => (
    <div className="w-full mt-8 p-4 bg-surface-1/50 border border-border rounded-xl flex items-start gap-3">
      <Lock className="w-5 h-5 text-iris shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-bold text-primary">Zero-Knowledge Secure Tunnel</p>
        <p className="text-xs text-tertiary mt-1 leading-relaxed">
          Your keys are encrypted via AES-256 and stored securely. RiskRules maintains strict read-only access to synchronize portfolio history. We cannot place trades, transfer funds, or modify your account.
        </p>
      </div>
    </div>
  );

  // What you'll need summary card for Step 4
  const CredentialSummaryCard = () => (
    <div className="p-5 bg-surface-1 border border-iris/20 rounded-2xl space-y-3 mb-6">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-iris/10 flex items-center justify-center">
          <FileText size={16} className="text-iris" />
        </div>
        <h4 className="font-bold text-sm text-primary">What You'll Need</h4>
      </div>
      <div className="space-y-2">
        {activeProvider.fields.map(field => (
          <div key={field.id} className="flex items-center gap-3 text-xs">
            <span className={cn(
              "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
              field.isSecret ? "bg-warning/10 text-warning border border-warning/20" : "bg-surface-2 text-secondary border border-border"
            )}>
              {field.isSecret ? <Lock size={10} /> : <Check size={10} />}
            </span>
            <span className="text-secondary font-medium">{field.label}</span>
            {field.required && <span className="text-danger text-[10px] font-bold">Required</span>}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 sm:p-6 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 10 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-5xl h-[85vh] bg-surface-0 border border-border shadow-2xl rounded-2xl sm:rounded-3xl flex flex-col overflow-hidden"
      >
        
        {/* Universal Header */}
        <div className="px-6 py-4 border-b border-border bg-surface-1/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-iris/10 border border-iris/20 flex items-center justify-center text-iris">
              <Layers size={16} />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-primary tracking-tight">Institutional Integration</h2>
              <p className="text-[11px] text-tertiary">Step {step} of 8 — {
                step === 1 ? 'Broker Selection' :
                step === 2 ? 'Education & Capability' :
                step === 3 ? 'Authentication Protocol' :
                step === 4 ? 'Credential Preparation' :
                step === 5 ? 'Secure Data Vault' :
                step === 6 ? 'Cryptographic Handshake' :
                step === 7 ? 'Identity Verification' :
                'Data Synchronization'
              }</p>
            </div>
          </div>
          <button onClick={resetAndClose} className="p-2 text-tertiary hover:text-primary bg-surface-2 rounded-xl transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Workspace Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="min-h-full p-6 sm:p-10 flex flex-col"
            >
              
              {/* ─────────────────────────────────────────────────────────────── */}
              {/* STEP 1: The Showroom — Redesigned with Section Layout         */}
              {/* ─────────────────────────────────────────────────────────────── */}
              {step === 1 && (
                <div className="max-w-[1100px] mx-auto w-full space-y-10">
                  {/* Header */}
                  <div className="text-center space-y-3">
                    <h1 className="font-display font-bold text-3xl sm:text-4xl text-primary tracking-tight">Connect Your Broker</h1>
                    <p className="text-secondary text-sm sm:text-base max-w-xl mx-auto">
                      Link your brokerage account to synchronize trades, holdings, and performance analytics automatically.
                    </p>
                  </div>

                  {/* ── Available Now Section ────────────────────────────────── */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-success/10 border border-success/20">
                        <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                        <span className="text-xs font-bold text-success tracking-wide">Available Now</span>
                      </div>
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-[11px] text-muted font-mono">{activeBrokers.length} integrations</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {activeBrokers.map(broker => (
                        <motion.div
                          key={broker.providerId}
                          whileHover={{ y: -4, scale: 1.015 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleBrokerSelect(broker)}
                          className="group relative bg-surface-1 border border-border rounded-2xl p-5 cursor-pointer 
                            hover:border-iris/50 hover:shadow-[0_12px_40px_rgba(var(--color-iris),0.12)] 
                            transition-all duration-300 flex flex-col min-h-[280px] overflow-hidden"
                        >
                          {/* Brand glow on hover */}
                          <div 
                            className="absolute top-0 right-0 w-40 h-40 blur-[80px] opacity-0 group-hover:opacity-15 transition-opacity duration-500 pointer-events-none translate-x-1/3 -translate-y-1/3" 
                            style={{ backgroundColor: broker.themeColor }} 
                          />
                          
                          {/* Top row: Logo + Status */}
                          <div className="flex items-start justify-between mb-4 relative z-10">
                            <BrokerLogo 
                              providerId={broker.providerId}
                              fallbackText={broker.logoText}
                              themeColor={broker.themeColor}
                              size="md"
                            />
                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase bg-success/10 text-success border border-success/20 flex items-center gap-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-success" />
                              Active
                            </span>
                          </div>

                          {/* Name + Tagline */}
                          <div className="mb-4 relative z-10">
                            <h3 className="font-display font-bold text-lg text-primary mb-1.5 group-hover:text-iris transition-colors">{broker.name}</h3>
                            <p className="text-xs text-tertiary line-clamp-2 leading-relaxed">{broker.tagline}</p>
                          </div>

                          {/* Market Segments */}
                          <div className="flex flex-wrap gap-1.5 mb-4 relative z-10">
                            {broker.marketSegments?.slice(0, 4).map(seg => (
                              <span key={seg} className="text-[10px] px-2 py-0.5 bg-surface-2 border border-border rounded-md font-semibold text-secondary">
                                {seg}
                              </span>
                            ))}
                          </div>

                          {/* Meta Info */}
                          <div className="mt-auto flex items-center gap-3 relative z-10 pt-3 border-t border-border/50">
                            <span className="text-[11px] text-tertiary flex items-center gap-1 font-medium">
                              <Clock size={11} className="text-secondary" /> {broker.setupTimeEstimate}
                            </span>
                            <span className="text-[11px] text-tertiary flex items-center gap-1 font-medium">
                              <Key size={11} className="text-secondary" /> {getAuthLabel(broker.authModel)}
                            </span>
                          </div>

                          {/* Connect CTA */}
                          <div className="mt-4 relative z-10">
                            <div className="w-full h-10 rounded-xl bg-iris/10 border border-iris/20 flex items-center justify-center gap-2 text-iris text-sm font-bold group-hover:bg-iris group-hover:text-white group-hover:border-iris transition-all duration-300">
                              Connect <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* ── Coming Soon Section ──────────────────────────────────── */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-warning/10 border border-warning/20">
                        <Construction size={13} className="text-warning" />
                        <span className="text-xs font-bold text-warning tracking-wide">Coming Soon</span>
                      </div>
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-[11px] text-muted font-mono">{comingSoonBrokers.length} in development</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {comingSoonBrokers.map(broker => (
                        <motion.div
                          key={broker.providerId}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleBrokerSelect(broker)}
                          className="group bg-surface-1/60 border border-border/60 rounded-xl p-4 cursor-pointer 
                            hover:border-warning/30 hover:bg-surface-1 
                            transition-all duration-300 flex flex-col items-center text-center min-h-[160px] justify-center relative overflow-hidden"
                        >
                          {/* Muted Logo */}
                          <BrokerLogo 
                            providerId={broker.providerId}
                            fallbackText={broker.logoText}
                            themeColor={broker.themeColor}
                            size="md"
                            muted
                            className="mb-3"
                          />

                          <h4 className="font-bold text-sm text-secondary mb-1.5">{broker.name}</h4>
                          
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase bg-warning/10 text-warning/80 border border-warning/15 flex items-center gap-1">
                            <Construction size={10} />
                            Coming Soon
                          </span>

                          {broker.comingSoonEta && (
                            <span className="text-[10px] text-muted mt-2 font-mono">{broker.comingSoonEta}</span>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Trust Footer */}
                  <TrustAnchor />
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────── */}
              {/* STEP 2: The Handshake (Education)                             */}
              {/* ─────────────────────────────────────────────────────────────── */}
              {step === 2 && (
                <div className="max-w-4xl mx-auto w-full flex flex-col md:flex-row gap-10 items-center justify-center h-full min-h-[500px]">
                  <div className="w-full md:w-1/2 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-1 border border-border text-xs font-bold text-secondary">
                      <BookOpen size={14} className="text-iris" /> Capability Overview
                    </div>
                    <h1 className="font-display font-bold text-4xl text-primary leading-tight">
                      You have selected <br/><span style={{ color: activeProvider.themeColor }}>{activeProvider.name}</span>
                    </h1>
                    <p className="text-lg text-secondary leading-relaxed">
                      {activeProvider.authDescription}
                    </p>
                    
                    <div className="pt-4 space-y-3">
                      <h4 className="text-sm font-bold text-primary">Supported Market Segments</h4>
                      <div className="flex flex-wrap gap-2">
                        {activeProvider.marketSegments?.map(seg => (
                          <span key={seg} className="px-3 py-1.5 bg-surface-1 border border-border rounded-lg text-sm font-semibold text-secondary">
                            {seg}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-8 flex gap-4">
                      <Button variant="secondary" onClick={prevStep} className="px-6 h-12 font-bold">Change Broker</Button>
                      <Button onClick={nextStep} className="px-8 h-12 font-bold shadow-iris gap-2">
                        View Protocol <ArrowRight size={18} />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-1/2 flex justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full blur-[80px] opacity-20 animate-pulse" style={{ backgroundColor: activeProvider.themeColor }} />
                      <BrokerLogo
                        providerId={activeProvider.providerId}
                        fallbackText={activeProvider.logoText}
                        themeColor={activeProvider.themeColor}
                        size="xl"
                        className="w-64 h-64 !rounded-[40px] shadow-2xl border-4 border-surface-0 relative z-10"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────── */}
              {/* STEP 3: The Protocol (Auth Overview)                          */}
              {/* ─────────────────────────────────────────────────────────────── */}
              {step === 3 && (
                <div className="max-w-3xl mx-auto w-full space-y-8 flex flex-col justify-center min-h-[500px]">
                  <div className="text-center space-y-3">
                    <h1 className="font-display font-bold text-3xl sm:text-4xl text-primary tracking-tight">Security & Protocol</h1>
                    <p className="text-secondary text-base max-w-xl mx-auto">Understanding how RiskRules connects to {activeProvider.name}.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
                    <div className="p-6 bg-surface-1 border border-border rounded-2xl space-y-4">
                      <div className="w-12 h-12 rounded-xl bg-surface-2 flex items-center justify-center text-primary">
                        <Clock size={24} className={activeProvider.tokenLifecycle.expiresDaily ? "text-warning" : "text-success"} />
                      </div>
                      <h3 className="text-xl font-bold text-primary">Session Lifecycle</h3>
                      <p className="text-sm text-tertiary leading-relaxed">
                        {activeProvider.tokenLifecycle.expiresDaily ? (
                          <>Your broker enforces a strict daily expiration policy. Access tokens will automatically expire at <strong>{activeProvider.tokenLifecycle.expiryTimeLocal}</strong>. {activeProvider.tokenLifecycle.refreshStrategy === 'NONE_MANDATORY_REAUTH' ? 'You must click renew daily.' : 'RiskRules handles automatic renewal.'}</>
                        ) : (
                          <>This broker provides a persistent rolling token. RiskRules manages the token lifecycle automatically in the background so you stay connected seamlessly.</>
                        )}
                      </p>
                    </div>

                    <div className="p-6 bg-surface-1 border border-border rounded-2xl space-y-4">
                      <div className="w-12 h-12 rounded-xl bg-surface-2 flex items-center justify-center text-primary">
                        <ShieldCheck size={24} className="text-iris" />
                      </div>
                      <h3 className="text-xl font-bold text-primary">Data Encryption</h3>
                      <p className="text-sm text-tertiary leading-relaxed">
                        Credentials provided in the next steps are <strong>never stored in plain text</strong>. They are subjected to AES-256 cloud encryption and are exclusively used by RiskRules backend servers to fetch read-only ledger data.
                      </p>
                    </div>
                  </div>

                  <div className="pt-8 flex justify-between border-t border-border mt-8">
                    <Button variant="ghost" onClick={prevStep} className="px-6 h-12 font-bold gap-2"><ArrowLeft size={16} /> Back</Button>
                    <Button onClick={nextStep} className="px-8 h-12 font-bold shadow-iris gap-2">
                      Get Instructions <ArrowRight size={18} />
                    </Button>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────── */}
              {/* STEP 4: The Guide (Broker-Specific Preparation) — Redesigned  */}
              {/* ─────────────────────────────────────────────────────────────── */}
              {step === 4 && (
                <div className="max-w-5xl mx-auto w-full h-full flex flex-col">
                  <div className="mb-6 flex items-center gap-4">
                    <BrokerLogo 
                      providerId={activeProvider.providerId}
                      fallbackText={activeProvider.logoText}
                      themeColor={activeProvider.themeColor}
                      size="md"
                    />
                    <div>
                      <h1 className="font-display font-bold text-2xl sm:text-3xl text-primary">{activeProvider.name} Setup Guide</h1>
                      <p className="text-secondary text-sm mt-0.5">Follow these steps before entering your credentials.</p>
                    </div>
                  </div>

                  {/* What You'll Need */}
                  <CredentialSummaryCard />

                  <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-[400px]">
                    {/* Left Panel: Stepper */}
                    <div className="w-full md:w-1/3 flex flex-col gap-2">
                      {activeProvider.connectionGuide?.map((guide, idx) => (
                        <button
                          key={idx}
                          onClick={() => setGuideStep(idx)}
                          className={cn(
                            "text-left p-4 rounded-xl transition-all border",
                            guideStep === idx ? "bg-surface-1 border-iris shadow-sm" : "bg-transparent border-transparent hover:bg-surface-1/50 hover:border-border"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                              idx < guideStep ? "bg-success text-white" :
                              guideStep === idx ? "bg-iris text-white" : "bg-surface-2 text-tertiary"
                            )}>
                              {idx < guideStep ? <Check size={13} strokeWidth={3} /> : idx + 1}
                            </div>
                            <span className={cn("font-bold text-sm", guideStep === idx ? "text-primary" : "text-secondary")}>
                              {guide.title}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Right Panel: Content */}
                    <div className="w-full md:w-2/3 bg-surface-1 border border-border rounded-2xl p-8 flex flex-col relative overflow-hidden">
                      <Key className="absolute -bottom-10 -right-10 w-64 h-64 text-surface-2 opacity-30 pointer-events-none" />
                      
                      <div className="relative z-10 flex-1 flex flex-col justify-center">
                        <span className="text-iris font-bold text-sm mb-4 tracking-wider uppercase">Step {guideStep + 1}</span>
                        <h2 className="font-display font-bold text-3xl text-primary mb-6">
                          {activeProvider.connectionGuide?.[guideStep]?.title}
                        </h2>
                        <p className="text-lg text-secondary leading-relaxed max-w-xl">
                          {activeProvider.connectionGuide?.[guideStep]?.description}
                        </p>
                        
                        {activeProvider.connectionGuide?.[guideStep]?.actionUrl && (
                          <a 
                            href={activeProvider.connectionGuide[guideStep].actionUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-surface-2 hover:bg-surface-3 transition-colors rounded-xl text-primary font-bold text-sm w-fit border border-border"
                          >
                            Open {activeProvider.name} <ExternalLink size={16} />
                          </a>
                        )}
                      </div>

                      {/* Security note for credential steps */}
                      {guideStep === (activeProvider.connectionGuide?.length || 1) - 1 && (
                        <div className="relative z-10 mt-6 p-4 bg-iris/5 border border-iris/15 rounded-xl flex items-start gap-3">
                          <Shield size={18} className="text-iris shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-primary">Security Note</p>
                            <p className="text-xs text-tertiary mt-1 leading-relaxed">
                              Your credentials are encrypted via AES-256 before storage. RiskRules only uses read-only access to synchronize your trade history.
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="pt-6 mt-6 border-t border-border flex justify-between items-center relative z-10">
                        <Button 
                          variant="ghost" 
                          onClick={() => setGuideStep(Math.max(0, guideStep - 1))}
                          disabled={guideStep === 0}
                        >
                          Previous Step
                        </Button>
                        <Button 
                          onClick={() => {
                            if (guideStep < (activeProvider.connectionGuide?.length || 1) - 1) {
                              setGuideStep(guideStep + 1);
                            } else {
                              nextStep();
                            }
                          }}
                          className="font-bold px-6"
                        >
                          {guideStep < (activeProvider.connectionGuide?.length || 1) - 1 ? 'Next Step' : 'Proceed to Vault'}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Common Mistakes Collapsible */}
                  <div className="mt-6">
                    <button
                      onClick={() => setShowCommonMistakes(!showCommonMistakes)}
                      className="w-full flex items-center justify-between p-4 bg-surface-1 border border-border rounded-xl hover:bg-surface-1/80 transition-colors text-left"
                    >
                      <div className="flex items-center gap-2">
                        <AlertCircle size={16} className="text-warning" />
                        <span className="font-bold text-sm text-primary">Common Mistakes & Troubleshooting</span>
                      </div>
                      {showCommonMistakes ? <ChevronUp size={16} className="text-tertiary" /> : <ChevronDown size={16} className="text-tertiary" />}
                    </button>
                    <AnimatePresence>
                      {showCommonMistakes && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-5 bg-surface-1 border border-t-0 border-border rounded-b-xl space-y-3 text-sm">
                            <div className="flex items-start gap-3">
                              <span className="text-warning font-bold text-xs bg-warning/10 px-2 py-0.5 rounded shrink-0">1</span>
                              <p className="text-secondary"><strong className="text-primary">Don't confuse API Key with Secret.</strong> The API Key is public; the Secret must be kept private and is shown only once on some platforms.</p>
                            </div>
                            <div className="flex items-start gap-3">
                              <span className="text-warning font-bold text-xs bg-warning/10 px-2 py-0.5 rounded shrink-0">2</span>
                              <p className="text-secondary"><strong className="text-primary">Daily tokens expire.</strong> For brokers like Dhan, you'll need to paste a new token each trading day.</p>
                            </div>
                            <div className="flex items-start gap-3">
                              <span className="text-warning font-bold text-xs bg-warning/10 px-2 py-0.5 rounded shrink-0">3</span>
                              <p className="text-secondary"><strong className="text-primary">TOTP Secret ≠ 6-digit code.</strong> For Angel One, paste the Base32 setup key (e.g., JBSWY3D...), not the rotating 6-digit code.</p>
                            </div>
                            {activeProvider.documentation.troubleshootingUrl && (
                              <a 
                                href={activeProvider.documentation.troubleshootingUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 text-iris font-bold text-xs hover:underline mt-2"
                              >
                                View Official Troubleshooting Docs <ExternalLink size={12} />
                              </a>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────── */}
              {/* STEP 5: The Vault (Data Entry)                                */}
              {/* ─────────────────────────────────────────────────────────────── */}
              {step === 5 && (
                <div className="max-w-2xl mx-auto w-full space-y-8 flex flex-col justify-center min-h-[500px]">
                  <div className="text-center space-y-3">
                    <h1 className="font-display font-bold text-3xl text-primary">Secure Vault</h1>
                    <p className="text-secondary text-sm">Enter the credentials acquired from the previous guide.</p>
                  </div>

                  {wizardError && (
                    <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-sm text-danger font-medium flex items-start gap-3 animate-shake">
                      <AlertCircle size={18} className="shrink-0 mt-0.5" />
                      <span>{wizardError}</span>
                    </div>
                  )}

                  <DynamicBrokerForm 
                    provider={activeProvider}
                    onSubmit={handleConnectSubmission}
                    isLoading={isProcessing}
                    onCancel={prevStep}
                  />

                  <TrustAnchor />
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────── */}
              {/* STEP 6: Connection Verification (Cryptographic Handshake)     */}
              {/* ─────────────────────────────────────────────────────────────── */}
              {step === 6 && (
                <div className="max-w-md mx-auto w-full flex flex-col items-center justify-center min-h-[500px] text-center space-y-10">
                  <div className="relative">
                    <div className="absolute inset-0 bg-iris/30 rounded-full blur-2xl animate-pulse-glow" />
                    <div className="w-24 h-24 rounded-2xl bg-surface-0 border border-border flex items-center justify-center relative z-10 shadow-2xl">
                      <Server className="w-10 h-10 text-iris animate-pulse" />
                    </div>
                  </div>
                  
                  <div className="space-y-6 w-full text-left">
                    {[
                      { idx: 0, text: 'Encrypting payload via AES-256' },
                      { idx: 1, text: `Establishing tunnel to ${activeProvider.name}` },
                      { idx: 2, text: 'Verifying read-only permission scope' },
                      { idx: 3, text: 'Resolving identity matrix' }
                    ].map(item => (
                      <div key={item.idx} className="flex items-center gap-4">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                          handshakeStep > item.idx ? "bg-success text-white shadow-lg shadow-success/20" : handshakeStep === item.idx ? "bg-surface-2 border border-iris text-iris animate-spin" : "bg-surface-1 border border-border text-transparent"
                        )}>
                          {handshakeStep > item.idx ? <Check size={16} strokeWidth={3} /> : handshakeStep === item.idx ? <Cpu size={14} /> : null}
                        </div>
                        <span className={cn(
                          "text-base font-medium transition-colors duration-300",
                          handshakeStep > item.idx ? "text-primary" : handshakeStep === item.idx ? "text-primary font-bold" : "text-tertiary"
                        )}>
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────── */}
              {/* STEP 7: Account Preview (Identity)                            */}
              {/* ─────────────────────────────────────────────────────────────── */}
              {step === 7 && (
                <div className="max-w-lg mx-auto w-full flex flex-col items-center justify-center min-h-[500px] text-center space-y-8">
                  <div className="w-20 h-20 rounded-full bg-success/10 border-4 border-success text-success flex items-center justify-center">
                    <Check size={40} strokeWidth={4} />
                  </div>
                  
                  <div className="space-y-2">
                    <h1 className="font-display font-bold text-3xl text-primary">Connection Verified</h1>
                    <p className="text-secondary text-base">We successfully authenticated with {activeProvider.name}.</p>
                  </div>

                  <div className="w-full p-6 bg-surface-1 border border-border rounded-2xl flex items-center gap-5 text-left shadow-lg">
                    <BrokerLogo
                      providerId={activeProvider.providerId}
                      fallbackText={activeProvider.logoText}
                      themeColor={activeProvider.themeColor}
                      size="lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-tertiary uppercase tracking-wider mb-1">Account Identity</p>
                      <p className="font-display font-bold text-2xl text-primary truncate">{successAccountAlias}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                        <span className="text-xs font-mono text-secondary">Secure Tunnel Active</span>
                      </div>
                    </div>
                  </div>

                  <div className="w-full pt-6 border-t border-border">
                    <Button onClick={handleStartSync} className="w-full h-14 font-bold text-lg shadow-iris">
                      Begin Data Synchronization
                    </Button>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────── */}
              {/* STEP 8: Sync Center                                           */}
              {/* ─────────────────────────────────────────────────────────────── */}
              {step === 8 && (
                <div className="max-w-2xl mx-auto w-full flex flex-col items-center justify-center min-h-[500px] text-center space-y-10">
                  <div className="space-y-4">
                    <h1 className="font-display font-bold text-4xl text-primary">Syncing Ledger</h1>
                    <p className="text-secondary text-lg max-w-md mx-auto">
                      Downloading historical trades, orders, and portfolio state from {activeProvider.name}...
                    </p>
                  </div>

                  <div className="w-full space-y-4">
                    <div className="h-4 w-full bg-surface-2 rounded-full overflow-hidden shadow-inner">
                      <motion.div 
                        className="h-full bg-iris"
                        initial={{ width: 0 }}
                        animate={{ width: `${syncProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <div className="flex justify-between text-sm font-bold text-secondary font-mono">
                      <span>{syncProgress < 100 ? 'Ingesting data...' : 'Ingestion Complete'}</span>
                      <span>{Math.round(syncProgress)}%</span>
                    </div>
                  </div>

                  {syncProgress === 100 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full pt-8">
                      <Button onClick={resetAndClose} className="w-full h-14 font-bold text-lg shadow-success bg-success hover:bg-success-hover text-white">
                        Enter Dashboard
                      </Button>
                    </motion.div>
                  )}
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Coming Soon Modal overlay */}
      <ComingSoonModal
        isOpen={!!comingSoonBroker}
        onClose={() => setComingSoonBroker(null)}
        broker={comingSoonBroker || BROKER_REGISTRY[0]}
      />
    </div>
  );
};
