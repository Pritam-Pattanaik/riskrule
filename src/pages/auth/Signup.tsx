import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { AlertCircle, ArrowRight, Eye, EyeOff, Mail, Lock, User, Phone, Check, ShieldCheck, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { Input } from '../../components/ui/Input';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import AuthLayout from '../../components/layout/AuthLayout';
import { btnPrimary } from '../../components/marketing/MarketingBits';
import { cn } from '../../lib/cn';
import { isValidEmailFormat, isDisposableEmail } from '../../lib/disposableEmail';
import { isValidPhoneNumber } from '../../lib/phoneValidation';

const getFriendlyErrorMessage = (err: string) => {
  const e = err.toLowerCase();
  if (e.includes('already exists') || e.includes('already registered')) return 'An account with this email already exists. Sign in instead.';
  if (e.includes('disposable') || e.includes('temporary')) return err;
  if (e.includes('phone')) return err;
  if (e.includes('weak password')) return 'That password is too weak. Meet every requirement listed under the field.';
  if (e.includes('network') || e.includes('failed to fetch')) return 'Could not reach RiskRule. Check your connection and try again.';
  return err || 'Could not create your account. Try again in a moment.';
};

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Email validation and disposable-address check
  const emailTrimmed = email.trim();
  const isEmailFormatValid = emailTrimmed.length > 0 && isValidEmailFormat(emailTrimmed);
  const isEmailDisposable = emailTrimmed.length > 0 && isDisposableEmail(emailTrimmed);
  const emailValid = isEmailFormatValid && !isEmailDisposable;

  let emailErrorMessage: string | undefined = undefined;
  if (emailTrimmed.length > 0) {
    if (!isEmailFormatValid) {
      emailErrorMessage = 'Enter a valid email address, for example you@example.com.';
    } else if (isEmailDisposable) {
      emailErrorMessage = 'Temporary email addresses are not accepted. Use a permanent address.';
    }
  }

  // Phone validation
  const phoneTrimmed = phoneNumber.trim();
  const phoneValid = phoneTrimmed.length > 0 && isValidPhoneNumber(phoneTrimmed);
  const phoneErrorMessage = phoneTrimmed.length > 0 && !isValidPhoneNumber(phoneTrimmed)
    ? 'Enter a mobile number with 10 to 15 digits, for example +91 98765 43210.'
    : undefined;

  // Password rules
  const lengthValid = password.length >= 8;
  const upperValid = /[A-Z]/.test(password);
  const lowerValid = /[a-z]/.test(password);
  const numberValid = /[0-9]/.test(password);
  const specialValid = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordValid = lengthValid && upperValid && lowerValid && numberValid && specialValid;
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlRef = searchParams.get('ref') || searchParams.get('r');
  const [referralCode, setReferralCode] = useState<string>(() => {
    return urlRef || localStorage.getItem('riskrule_ref') || '';
  });

  useEffect(() => {
    if (urlRef) {
      localStorage.setItem('riskrule_ref', urlRef.toUpperCase());
      setReferralCode(urlRef.toUpperCase());
    }
  }, [urlRef]);

  const role = searchParams.get('role');
  const isApplicant = role?.toLowerCase() === 'applicant';

  const { signUp } = useAuthStore();
  const shouldReduceMotion = useReducedMotion();

  const ready = emailValid && phoneValid && passwordValid && !!passwordsMatch && !!fullName.trim() && termsAccepted;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready) {
      setShake(s => s + 1);
      return;
    }

    setLoading(true);
    setError(null);
    const { error: err } = await signUp(emailTrimmed, password, fullName.trim(), phoneTrimmed, referralCode || undefined);
    if (err) {
      setError(getFriendlyErrorMessage(err));
      setShake(s => s + 1);
      setLoading(false);
    } else {
      localStorage.removeItem('riskrule_ref');
      navigate('/app');
    }
  };

  const Rule = ({ valid, text }: { valid: boolean; text: string }) => (
    <li className={cn('flex items-center gap-2 text-[12.5px] transition-colors duration-150', valid ? 'font-medium text-success' : 'text-tertiary')}>
      <span
        className={cn(
          'flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-colors duration-150',
          valid ? 'bg-[var(--brand-green)] text-[#0F172A]' : 'border border-primary/20'
        )}
        aria-hidden="true"
      >
        {valid && <Check size={11} strokeWidth={3.5} />}
      </span>
      <span>{text}</span>
      <span className="sr-only">{valid ? 'met' : 'not met yet'}</span>
    </li>
  );

  return (
    <AuthLayout
      title={isApplicant ? 'Applicant registration' : 'Create your account'}
      subtitle={isApplicant ? 'Complete your profile to open your workspace.' : 'Start your journal to track trades, review risk and record your setups.'}
    >
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

        <form onSubmit={handleSignup} className="space-y-5" noValidate>
          {referralCode && (
            <div className="flex items-center gap-2.5 rounded-xl border border-[var(--brand-green)]/30 bg-[var(--brand-green)]/10 p-3 text-[13px] font-medium text-primary">
              <ShieldCheck className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              <span>
                Referral code applied: <strong className="font-mono-stat tracking-wider text-accent">{referralCode}</strong>
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input
              id="signup-name"
              type="text"
              label="Full name"
              required
              autoComplete="name"
              placeholder="Your name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              leftIcon={User}
            />
            <Input
              id="signup-phone"
              type="tel"
              label="Mobile number"
              required
              autoComplete="tel"
              placeholder="+91 98765 43210"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              leftIcon={Phone}
              error={phoneErrorMessage}
            />
          </div>

          <Input
            id="signup-email"
            type="email"
            label="Email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            leftIcon={Mail}
            error={emailErrorMessage}
          />

          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                required
                autoComplete="new-password"
                placeholder="Create a password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                leftIcon={Lock}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide passwords' : 'Show passwords'}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-tertiary transition-colors hover:bg-surface-1 "
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                }
              />
              <Input
                id="signup-confirm"
                type={showPassword ? 'text' : 'password'}
                label="Confirm password"
                required
                autoComplete="new-password"
                placeholder="Repeat the password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                leftIcon={Lock}
                error={confirmPassword.length > 0 && !passwordsMatch ? 'The passwords do not match.' : undefined}
              />
            </div>

            <ul className="grid grid-cols-2 gap-x-3 gap-y-2 rounded-xl border border-primary/10 bg-surface-1 p-3.5" aria-label="Password requirements">
              <Rule valid={lengthValid} text="8 or more characters" />
              <Rule valid={upperValid} text="An uppercase letter" />
              <Rule valid={lowerValid} text="A lowercase letter" />
              <Rule valid={numberValid} text="A number" />
              <Rule valid={specialValid} text="A symbol such as !@#$" />
            </ul>
          </div>

          <label htmlFor="terms" className="flex cursor-pointer select-none items-start gap-3 text-[13.5px] leading-5 text-secondary">
            <span className="relative mt-0.5 h-[18px] w-[18px] shrink-0">
              <input
                id="terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={e => setTermsAccepted(e.target.checked)}
                className="peer h-full w-full cursor-pointer appearance-none rounded-[5px] border border-primary/30 bg-surface transition-colors duration-150 checked:border-[var(--brand-green)] checked:bg-[var(--brand-green)] hover:border-primary/50"
              />
              <Check size={12} strokeWidth={3.5} className="pointer-events-none absolute inset-0 m-auto text-[#0F172A] opacity-0 transition-opacity duration-150 peer-checked:opacity-100" aria-hidden="true" />
            </span>
            <span>
              I agree to the{' '}
              <Link to="/terms" target="_blank" rel="noopener noreferrer" className="font-medium text-accent ">Terms and Conditions</Link>
              {' '}and confirm I am a professional market participant.
            </span>
          </label>

          <button
            type="submit"
            disabled={loading || !ready}
            className={cn(btnPrimary, 'h-12 w-full text-base disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none')}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Creating account
              </>
            ) : (
              <>
                Create account
                <ArrowRight size={17} strokeWidth={2} aria-hidden="true" />
              </>
            )}
          </button>
        </form>
      </motion.div>

      <p className="mt-8 text-center text-[15px] text-secondary">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-accent ">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
