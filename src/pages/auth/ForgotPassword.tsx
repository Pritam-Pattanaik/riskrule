import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowRight, ArrowLeft, Mail, CheckCircle2, RefreshCw, Clock, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import AuthLayout from '../../components/layout/AuthLayout';

const RESEND_COOLDOWN_SECONDS = 60;

const getFriendlyError = (msg: string): string => {
  const lower = msg.toLowerCase();
  if (lower.includes('rate limit') || lower.includes('too many')) return 'Too many requests. Please wait a moment and try again.';
  if (lower.includes('network') || lower.includes('failed to fetch')) return 'Connection error. Please check your internet and try again.';
  if (lower.includes('invalid email') || lower.includes('email')) return 'Please enter a valid email address.';
  return 'Something went wrong. Please try again.';
};

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(0);
  const [emailValid, setEmailValid] = useState(true);
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailValid(false);
    } else {
      setEmailValid(true);
    }
  }, [email]);

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    cooldownRef.current = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) {
          if (cooldownRef.current) clearInterval(cooldownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, [cooldown > 0]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!emailValid || !email) {
      setShake(s => s + 1);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await api.post('/auth/forgot-password', { email });
      setSuccess(true);
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err: any) {
      setError(getFriendlyError(err.message || ''));
      setShake(s => s + 1);
    } finally {
      setLoading(false);
    }
  }, [email, emailValid]);

  const handleResend = useCallback(async () => {
    if (cooldown > 0 || loading) return;
    setLoading(true);
    setError(null);
    try {
      await api.post('/auth/forgot-password', { email });
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err: any) {
      setError(getFriendlyError(err.message || ''));
    } finally {
      setLoading(false);
    }
  }, [email, cooldown, loading]);

  // ────────────────────────────────────────────────────────────────────────
  // SUCCESS STATE — email sent
  // ────────────────────────────────────────────────────────────────────────
  if (success) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle="We sent a password reset link to your inbox."
      >
        <motion.div 
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center py-8 text-center"
        >
          <div className="w-14 h-14 bg-success/10 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-7 h-7 text-success" />
          </div>
          
          <p className="text-secondary text-[14px] mb-1.5 leading-relaxed max-w-sm">
            If an account exists for
          </p>
          <p className="text-primary text-[15px] font-semibold mb-4">
            {email}
          </p>
          <p className="text-secondary text-[14px] mb-5 leading-relaxed max-w-sm">
            you'll receive an email with a link to reset your password.
          </p>

          {/* Expiry Notice */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-warning/10 border border-warning/20 text-warning text-[12px] font-bold mb-8">
            <Clock size={13} />
            <span>Link expires in 5 minutes</span>
          </div>

          {/* Actions */}
          <div className="w-full space-y-3">
            <Button
              type="button"
              variant="secondary"
              disabled={cooldown > 0 || loading}
              isLoading={loading}
              onClick={handleResend}
              className="w-full justify-center min-h-[48px] rounded-xl shadow-xs"
            >
              {!loading && (
                <>
                  <RefreshCw size={15} className={cooldown > 0 ? 'opacity-40' : ''} />
                  <span>
                    {cooldown > 0
                      ? `Resend in ${cooldown}s`
                      : 'Resend email'}
                  </span>
                </>
              )}
            </Button>

            <Link to="/login" className="block w-full">
              <Button variant="ghost" className="w-full justify-center min-h-[44px] rounded-xl text-secondary">
                <ArrowLeft size={15} />
                <span>Back to Login</span>
              </Button>
            </Link>
          </div>

          {/* Error on resend */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                role="alert"
                className="flex items-start gap-3 p-3.5 rounded-xl bg-danger/10 border border-danger/25 text-danger text-[13px] font-medium mt-4 shadow-xs overflow-hidden w-full"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-danger" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AuthLayout>
    );
  }

  // ────────────────────────────────────────────────────────────────────────
  // FORM STATE — enter email
  // ────────────────────────────────────────────────────────────────────────
  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email and we'll send you a reset link."
    >
      <motion.div animate={shouldReduceMotion ? { x: 0 } : { x: shake > 0 ? [-8, 8, -6, 6, -4, 4, 0] : 0 }} transition={{ duration: 0.35 }}>
        
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0, y: -10 }}
              role="alert"
              className="flex items-start gap-3 p-3.5 rounded-xl bg-danger/10 border border-danger/25 text-danger text-[13px] font-medium mb-6 shadow-xs overflow-hidden"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-danger" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            id="forgot-email"
            type="email"
            label="Email Address"
            required
            autoComplete="email"
            autoFocus
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            leftIcon={Mail}
            error={!emailValid && email.length > 0 ? 'Please enter a valid email address.' : undefined}
            aria-label="Email address"
          />

          <div className="pt-4">
            <Button
              type="submit"
              isLoading={loading}
              disabled={loading || !emailValid || !email}
              className="w-full min-h-[48px] text-[15px] font-bold shadow-md rounded-xl justify-center"
            >
              {!loading && (
                <>
                  Send reset link <ArrowRight className="w-4 h-4 ml-1 opacity-70" />
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>

      <div className="mt-8 flex justify-center">
        <Link to="/login" className="inline-flex items-center gap-1.5 text-sm font-medium text-secondary hover:text-primary transition-colors focus-ring rounded">
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
      </div>
    </AuthLayout>
  );
}
