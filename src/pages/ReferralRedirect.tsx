import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, Sparkles } from 'lucide-react';
import { api } from '../lib/api';

export default function ReferralRedirect() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const cleanCode = (code || '').trim().toUpperCase();
    if (cleanCode) {
      localStorage.setItem('riskrule_ref', cleanCode);
      // Asynchronously track click without blocking redirect
      api.post(`/affiliate/click/${cleanCode}`, {}).catch(() => {});
    }

    // Redirect to signup with ref query
    const timeout = setTimeout(() => {
      navigate(`/signup?ref=${encodeURIComponent(cleanCode)}`, { replace: true });
    }, 400);

    return () => clearTimeout(timeout);
  }, [code, navigate]);

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-canvas text-primary p-6">
      <div className="flex flex-col items-center space-y-4 max-w-sm text-center">
        <div className="w-14 h-14 rounded-2xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
          <Sparkles className="w-7 h-7 animate-spin" style={{ animationDuration: '6s' }} />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold">Connecting to RiskRules Partner...</h2>
          <p className="text-xs text-secondary">
            Setting up your referral attribution with code <span className="font-mono text-violet-400 font-bold">{code}</span>
          </p>
        </div>
        <Loader2 className="w-5 h-5 animate-spin text-tertiary" />
      </div>
    </div>
  );
}
