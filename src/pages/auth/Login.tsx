import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, ArrowRight, Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { Input } from '../../components/ui/Input';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import AuthLayout from '../../components/layout/AuthLayout';
import { btnPrimary } from '../../components/marketing/MarketingBits';
import { cn } from '../../lib/cn';

const getFriendlyErrorMessage = (err: string) => {
  const e = err.toLowerCase();
  if (e.includes('invalid login credentials') || e.includes('invalid email or password')) return 'The email or password is incorrect. Check both and try again.';
  if (e.includes('user not found')) return 'No account uses this email. Check the address or create an account.';
  if (e.includes('rate limit')) return 'Too many sign-in attempts. Wait a minute, then try again.';
  if (e.includes('network') || e.includes('failed to fetch')) return 'Could not reach RiskRule. Check your connection and try again.';
  return `Could not sign you in. Try again in a moment. (${err})`;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(0);

  const navigate = useNavigate();
  const { signIn } = useAuthStore();
  const shouldReduceMotion = useReducedMotion();

  const emailValid = !email || EMAIL_PATTERN.test(email);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailValid) {
      setShake(s => s + 1);
      return;
    }

    setLoading(true);
    setError(null);

    const { error: err } = await signIn(email, password);
    if (err) {
      setError(getFriendlyErrorMessage(err));
      setShake(s => s + 1);
      setLoading(false);
    } else {
      const userRole = useAuthStore.getState().profile?.role;
      navigate(userRole === 'SUPER_ADMIN' ? '/app/admin' : '/app');
    }
  };

  const disabled = loading || !emailValid || !email || !password;

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to review your last session and plan the next one.">
      <motion.div animate={shouldReduceMotion ? { x: 0 } : { x: shake > 0 ? [-8, 8, -6, 6, -4, 4, 0] : 0 }} transition={{ duration: 0.35 }}>
        <AnimatePresence initial={false}>
          {error && (
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
              role="alert"
              className="mb-5 overflow-hidden"
            >
              <div className="flex items-start gap-3 rounded-xl border border-danger/25 bg-danger/10 p-3.5 text-[13.5px] font-medium leading-5 text-danger">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleLogin} className="space-y-5" noValidate>
          <Input
            id="login-email"
            type="email"
            label="Email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            leftIcon={Mail}
            error={!emailValid ? 'Enter a valid email address, for example you@example.com.' : undefined}
          />

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="login-password" className="text-[13px] font-semibold leading-none text-primary">Password</label>
              <Link to="/forgot-password" className="rounded text-[13px] font-medium text-accent ">
                Forgot password?
              </Link>
            </div>
            <Input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              leftIcon={Lock}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-tertiary transition-colors hover:bg-surface-1 "
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              }
            />
          </div>

          <button
            type="submit"
            disabled={disabled}
            className={cn(btnPrimary, 'h-12 w-full text-base disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none')}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Signing in
              </>
            ) : (
              <>
                Sign in
                <ArrowRight size={17} strokeWidth={2} aria-hidden="true" />
              </>
            )}
          </button>
        </form>
      </motion.div>

      <p className="mt-8 text-center text-[15px] text-secondary">
        New to RiskRule?{' '}
        <Link to="/signup" className="font-semibold text-accent ">
          Create a free account
        </Link>
      </p>
    </AuthLayout>
  );
}
