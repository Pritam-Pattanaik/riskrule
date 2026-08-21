import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff, Lock, CheckCircle2, ShieldAlert, Clock, Check, X, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { api } from '../../lib/api';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import AuthLayout from '../../components/layout/AuthLayout';

type PageState = 'verifying' | 'form' | 'expired' | 'invalid' | 'submitting' | 'success';

const getFriendlyError = (msg: string): string => {
  const lower = msg.toLowerCase();
  if (lower.includes('expired')) return 'This reset link has expired. Please request a new one.';
  if (lower.includes('invalid') || lower.includes('already')) return 'This link is invalid or has already been used.';
  if (lower.includes('rate limit') || lower.includes('too many')) return 'Too many attempts. Please wait a moment and try again.';
  if (lower.includes('network') || lower.includes('failed to fetch')) return 'Connection error. Please check your internet and try again.';
  if (lower.includes('password must')) return msg; // Pass through Zod validation messages
  return 'Something went wrong. Please try again or request a new reset link.';
};

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [pageState, setPageState] = useState<PageState>(token ? 'verifying' : 'invalid');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(0);
  const [redirectCountdown, setRedirectCountdown] = useState(3);
  
  const shouldReduceMotion = useReducedMotion();

  // Password strength rules (identical to Signup page)
  const lengthValid = password.length >= 8;
  const upperValid = /[A-Z]/.test(password);
  const lowerValid = /[a-z]/.test(password);
  const numberValid = /[0-9]/.test(password);
  const specialValid = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordValid = lengthValid && upperValid && lowerValid && numberValid && specialValid;
  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;

  // ── Verify Token on Mount ──────────────────────────────────────────────
  useEffect(() => {
    if (!token) {
      setPageState('invalid');
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const res = await api.get<{ valid: boolean }>(`/auth/verify-reset-token?token=${encodeURIComponent(token)}`);
        if (cancelled) return;
        if (res.valid) {
          setPageState('form');
        } else {
          setPageState('invalid');
        }
      } catch (err: any) {
        if (cancelled) return;
        const msg = (err?.message || '').toLowerCase();
        if (msg.includes('expired')) {
          setPageState('expired');
        } else {
          setPageState('invalid');
        }
      }
    })();

    return () => { cancelled = true; };
  }, [token]);

  // ── Success Redirect Countdown ─────────────────────────────────────────
  useEffect(() => {
    if (pageState !== 'success') return;
    const timer = setInterval(() => {
      setRedirectCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/login');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [pageState, navigate]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordValid || !passwordsMatch || !token) {
      setShake(s => s + 1);
      return;
    }
    
    setPageState('submitting');
    setError(null);
    
    try {
      await api.post('/auth/reset-password', { token, password });
      setPageState('success');
    } catch (err: any) {
      const message = err.message || 'Failed to reset password.';
      const lower = message.toLowerCase();
      
      if (lower.includes('expired')) {
        setPageState('expired');
      } else if (lower.includes('invalid') || lower.includes('already')) {
        setPageState('invalid');
      } else {
        setPageState('form');
        setError(getFriendlyError(message));
        setShake(s => s + 1);
      }
    }
  }, [password, passwordValid, passwordsMatch, token]);

  // ────────────────────────────────────────────────────────────────────────
  // STATE: Verifying token
  // ────────────────────────────────────────────────────────────────────────
  if (pageState === 'verifying') {
    return (
      <AuthLayout title="Verifying link" subtitle="Checking your password reset token...">
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-7 h-7 animate-spin text-iris mb-4" />
          <p className="text-secondary text-[14px]">This will only take a moment.</p>
        </div>
      </AuthLayout>
    );
  }

  // ────────────────────────────────────────────────────────────────────────
  // STATE: Success — password changed
  // ────────────────────────────────────────────────────────────────────────
  if (pageState === 'success') {
    return (
      <AuthLayout title="Password updated" subtitle="Your password has been changed successfully.">
        <motion.div 
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center py-8 text-center"
        >
          <div className="w-14 h-14 bg-success/10 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-7 h-7 text-success" />
          </div>
          <p className="text-primary text-[16px] font-semibold mb-1.5">
            Password updated successfully
          </p>
          <p className="text-secondary text-[14px] mb-2 leading-relaxed">
            All existing sessions have been logged out.
          </p>
          <p className="text-secondary text-[14px] mb-8">
            Please login again with your new password.
          </p>
          <Link to="/login" className="w-full">
            <Button className="w-full justify-center min-h-[48px] rounded-xl shadow-md text-[15px] font-bold">
              Continue to Login
              <span className="ml-2 text-white/60 text-[13px] font-normal">({redirectCountdown}s)</span>
            </Button>
          </Link>
        </motion.div>
      </AuthLayout>
    );
  }

  // ────────────────────────────────────────────────────────────────────────
  // STATE: Expired token
  // ────────────────────────────────────────────────────────────────────────
  if (pageState === 'expired') {
    return (
      <AuthLayout title="Link expired" subtitle="This password reset link is no longer valid.">
        <motion.div 
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center py-8 text-center"
        >
          <div className="w-14 h-14 bg-warning/10 rounded-full flex items-center justify-center mb-6">
            <Clock className="w-7 h-7 text-warning" />
          </div>
          <p className="text-primary text-[15px] font-semibold mb-1.5">
            This link has expired
          </p>
          <p className="text-secondary text-[14px] mb-8 leading-relaxed max-w-xs">
            For your security, reset links expire after 5 minutes. Request a new one to continue.
          </p>
          <div className="w-full space-y-3">
            <Link to="/forgot-password" className="block w-full">
              <Button className="w-full justify-center min-h-[48px] rounded-xl shadow-md text-[15px] font-bold">
                Request new link <ArrowRight className="w-4 h-4 ml-1 opacity-70" />
              </Button>
            </Link>
            <Link to="/login" className="block w-full">
              <Button variant="ghost" className="w-full justify-center min-h-[44px] rounded-xl text-secondary">
                <ArrowLeft size={15} />
                <span>Back to Login</span>
              </Button>
            </Link>
          </div>
        </motion.div>
      </AuthLayout>
    );
  }

  // ────────────────────────────────────────────────────────────────────────
  // STATE: Invalid / already used token
  // ────────────────────────────────────────────────────────────────────────
  if (pageState === 'invalid') {
    return (
      <AuthLayout title="Invalid link" subtitle="This password reset link can't be used.">
        <motion.div 
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center py-8 text-center"
        >
          <div className="w-14 h-14 bg-danger/10 rounded-full flex items-center justify-center mb-6">
            <ShieldAlert className="w-7 h-7 text-danger" />
          </div>
          <p className="text-primary text-[15px] font-semibold mb-1.5">
            This link is invalid or has already been used
          </p>
          <p className="text-secondary text-[14px] mb-8 leading-relaxed max-w-xs">
            Each reset link can only be used once. If you still need to reset your password, request a new link.
          </p>
          <div className="w-full space-y-3">
            <Link to="/forgot-password" className="block w-full">
              <Button className="w-full justify-center min-h-[48px] rounded-xl shadow-md text-[15px] font-bold">
                Request new link <ArrowRight className="w-4 h-4 ml-1 opacity-70" />
              </Button>
            </Link>
            <Link to="/login" className="block w-full">
              <Button variant="ghost" className="w-full justify-center min-h-[44px] rounded-xl text-secondary">
                <ArrowLeft size={15} />
                <span>Back to Login</span>
              </Button>
            </Link>
          </div>
        </motion.div>
      </AuthLayout>
    );
  }

  // ────────────────────────────────────────────────────────────────────────
  // STATE: Password form (valid token)
  // ────────────────────────────────────────────────────────────────────────
  const isSubmitting = pageState === 'submitting';

  const Rule = ({ valid, text }: { valid: boolean; text: string }) => (
    <div className={`flex items-center gap-1.5 text-[11.5px] font-semibold transition-colors duration-200 ${valid ? 'text-success font-bold' : 'text-tertiary'}`}>
      {valid ? <Check size={13} strokeWidth={3} className="text-success" /> : <X size={13} strokeWidth={3} className="opacity-40" />}
      <span>{text}</span>
    </div>
  );

  return (
    <AuthLayout title="Create new password" subtitle="Choose a strong password for your account.">
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
          <div>
            <Input
              id="reset-password"
              type={showPassword ? 'text' : 'password'}
              label="New Password"
              required
              autoComplete="new-password"
              autoFocus
              value={password}
              onChange={e => setPassword(e.target.value)}
              leftIcon={Lock}
              aria-label="New Password"
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="text-tertiary hover:text-primary transition-colors p-1.5 focus-ring rounded-md"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              }
            />
            
            {/* ── Password Security Checklist (matches Signup) ── */}
            <div className="mt-2.5 p-3.5 rounded-xl bg-surface-0 border border-border shadow-xs">
              <div className="flex items-center justify-between text-[11px] font-mono-stat font-bold text-secondary uppercase mb-2 pb-1.5 border-b border-border/50">
                <span>ENCRYPTION RULES CHECKLIST</span>
                <span className={passwordValid ? "text-success" : "text-tertiary"}>
                  {passwordValid ? "COMPACT VERIFIED" : "PENDING"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                <Rule valid={lengthValid} text="8+ characters" />
                <Rule valid={upperValid} text="1 uppercase letter" />
                <Rule valid={lowerValid} text="1 lowercase letter" />
                <Rule valid={numberValid} text="1 digit (0-9)" />
                <Rule valid={specialValid} text="1 symbol (!@#$...)" />
              </div>
            </div>
          </div>

          <Input
            id="reset-confirm-password"
            type={showPassword ? 'text' : 'password'}
            label="Confirm New Password"
            required
            autoComplete="new-password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            leftIcon={Lock}
            aria-label="Confirm New Password"
            error={confirmPassword.length > 0 && !passwordsMatch ? 'Passwords do not match.' : undefined}
          />

          <div className="pt-4">
            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={isSubmitting || !passwordValid || !passwordsMatch || !token}
              className="w-full min-h-[48px] text-[15px] font-bold shadow-md rounded-xl justify-center"
            >
              {!isSubmitting && (
                <>
                  Reset Password <ArrowRight className="w-4 h-4 ml-1 opacity-70" />
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
