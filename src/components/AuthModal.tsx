import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  User,
  ShieldCheck,
  Lock,
  Mail,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Zap,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import { UserProfile } from '../types';
import { useAuth } from '../context/AuthContext';
import { RevoraLogo } from './RevoraLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup' | 'forgot' | 'verification';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
}) => {
  if (!isOpen) return null;

  const { signIn, signUp, resetPassword, resendVerification, signInWithGoogle, unverifiedEmail, setUnverifiedEmail } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot' | 'verification'>(
    unverifiedEmail ? 'verification' : initialMode
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserProfile['role']>('fintech_admin');
  const [showPassword, setShowPassword] = useState(false);

  const [activeUnverifiedEmail, setActiveUnverifiedEmail] = useState<string>(unverifiedEmail || '');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendNotice, setResendNotice] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDomainError, setIsDomainError] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (unverifiedEmail) {
      setActiveUnverifiedEmail(unverifiedEmail);
      setMode('verification');
    }
  }, [unverifiedEmail]);

  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : '';

  const handleCopyHostname = () => {
    if (navigator.clipboard && currentHostname) {
      navigator.clipboard.writeText(currentHostname);
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 2000);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMessage(null);
    setIsDomainError(false);
    setSuccessMessage(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      setSuccessMessage('Authenticated with Google successfully! Redirecting...');
      setTimeout(() => onClose(), 500);
    } catch (err: any) {
      console.warn('Google Auth notice:', err?.code || err?.message || err);
      let msg = err.message || 'Google authentication failed.';
      if (err.code === 'auth/operation-not-supported-in-this-app' || err.code === 'auth/admin-restricted-operation') {
        msg = 'Google Sign-In is not enabled in your Firebase Console. Enable it in Firebase Console -> Authentication -> Sign-in method -> Google.';
      } else if (err.code === 'auth/unauthorized-domain') {
        setIsDomainError(true);
        msg = `This domain (${currentHostname}) is not authorized in your Firebase Project. Add it in Firebase Console -> Authentication -> Settings -> Authorized domains.`;
      } else if (err.code === 'auth/popup-closed-by-user') {
        msg = 'Google sign-in popup was closed before completion.';
      } else if (err.code === 'auth/popup-blocked') {
        msg = 'Popup was blocked by your browser. Please allow popups for this app.';
      } else if (err.code === 'auth/cancelled-popup-request') {
        msg = 'Google login cancelled.';
      }
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!activeUnverifiedEmail) return;
    setResending(true);
    setResendNotice(null);
    setResendError(null);
    try {
      if (password) {
        await resendVerification(activeUnverifiedEmail, password);
        setResendNotice('Verification email resent successfully! Please check your inbox.');
      } else {
        setResendNotice('Please click Login below and sign in once your email link is verified.');
      }
    } catch (err: any) {
      setResendError(err.message || 'Unable to resend email right now. Please try again in a few moments.');
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        if (!email || !password) {
          throw new Error('Please enter both work email and password.');
        }
        await signIn(email, password);
        setSuccessMessage('Signed in successfully! Entering Revora workspace...');
        setTimeout(() => onClose(), 500);
      } else if (mode === 'signup') {
        if (!email || !password) {
          throw new Error('Please provide email and password.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }
        if (confirmPassword && password !== confirmPassword) {
          throw new Error('Passwords do not match.');
        }
        const registeredEmail = await signUp(email, password, fullName || email.split('@')[0], selectedRole);
        setActiveUnverifiedEmail(registeredEmail);
        setMode('verification');
      } else if (mode === 'forgot') {
        if (!email) {
          throw new Error('Please enter your registered work email.');
        }
        await resetPassword(email);
        setSuccessMessage('Password reset instructions sent to your email.');
      }
    } catch (err: any) {
      console.warn('Firebase Auth notice:', err?.code || err?.message || err);
      
      // If user's email is not verified in Firebase Authentication:
      if (err.code === 'auth/unverified-email' || err.unverifiedEmail) {
        const targetEmail = err.unverifiedEmail || email;
        setActiveUnverifiedEmail(targetEmail);
        setMode('verification');
        return;
      }

      let msg = err.message || 'Authentication failed. Please verify your credentials.';
      if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/invalid-credential'
      ) {
        msg = 'Invalid email or password. If you do not have an account yet, switch to "Get Started" to sign up, or continue with Google.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists. Please switch to Sign In.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      }
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-xl animate-in fade-in duration-200 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[440px] rounded-3xl bg-[#080d19]/95 border border-white/15 shadow-2xl shadow-black/90 p-5 sm:p-6 text-slate-100 overflow-hidden"
      >
        {/* Glow accent */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Branding */}
        <div className="flex items-center gap-3 mb-4 pr-6">
          <RevoraLogo size="sm" interactive />
          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight">
              {mode === 'verification'
                ? 'Verify Your Email'
                : mode === 'signup'
                ? 'Get Started with Revora'
                : mode === 'signin'
                ? 'Sign In to Revora AI'
                : 'Reset Password'}
            </h2>
            <p className="text-[11px] text-slate-400">
              {mode === 'verification'
                ? 'Firebase Authentication verification link sent'
                : mode === 'signup'
                ? 'Autonomous revenue recovery with live Razorpay rails'
                : mode === 'signin'
                ? 'Autonomous Interception & Interventions Workspace'
                : 'Enter your email to receive recovery instructions'}
            </p>
          </div>
        </div>

        {/* VERIFICATION SCREEN (Firebase Authentication Only) */}
        {mode === 'verification' ? (
          <div className="py-2 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            {/* Pulsing Mail Icon */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/10">
              <Mail className="w-8 h-8 text-cyan-400 animate-pulse" />
            </div>

            {/* Exact Required Message */}
            <div className="text-center space-y-2 px-1">
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">Check Your Inbox</h3>
              <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed">
                We have sent you a verification email to{' '}
                <span className="font-semibold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30 break-all inline-block my-0.5">
                  {activeUnverifiedEmail || email || 'your email'}
                </span>
                . Please verify it and log in.
              </p>
            </div>

            {/* Resend Notice or Error */}
            {resendNotice && (
              <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-center gap-2 text-center">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{resendNotice}</span>
              </div>
            )}

            {resendError && (
              <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-center gap-2 text-center">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{resendError}</span>
              </div>
            )}

            {/* Actions: Required Login Button */}
            <div className="pt-2 space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                  setUnverifiedEmail(null);
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:brightness-110 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {password && (
                <button
                  type="button"
                  disabled={resending}
                  onClick={handleResendVerification}
                  className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/10"
                >
                  {resending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                  <span>Resend verification email</span>
                </button>
              )}
            </div>

            {/* Security Notice */}
            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-center gap-2 text-[10.5px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Firebase Authentication Email Verification</span>
            </div>
          </div>
        ) : (
          <>
            {/* Tab Switcher (Sign In vs Get Started) */}
            {mode !== 'forgot' && (
              <div className="flex p-1 rounded-xl bg-black/50 border border-white/10 mb-3.5">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    mode === 'signin'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    mode === 'signup'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Get Started
                </button>
              </div>
            )}

            {/* Google One-Click OAuth Button */}
            {mode !== 'forgot' && (
              <div className="mb-3">
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={loading}
                  className="w-full py-2 px-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs sm:text-[13px] transition-all flex items-center justify-center gap-2.5 shadow-sm hover:shadow-md cursor-pointer border border-slate-200 disabled:opacity-60"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>{mode === 'signup' ? 'Sign up with Google' : 'Continue with Google'}</span>
                </button>

                <div className="relative my-2.5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-[10.5px]">
                    <span className="px-2 bg-[#080d19] text-slate-400 font-medium">or continue with work email</span>
                  </div>
                </div>
              </div>
            )}

            {/* Error / Success Notifications */}
            {errorMessage && (
              <div className="p-3 mb-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs space-y-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  <span className="leading-snug">{errorMessage}</span>
                </div>

                {errorMessage.includes('Invalid email or password') && (
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signup');
                        setErrorMessage(null);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-[11px] font-semibold text-blue-200 cursor-pointer transition-colors"
                    >
                      Switch to Get Started →
                    </button>
                  </div>
                )}

                {isDomainError && (
                  <div className="p-2.5 rounded-lg bg-black/40 border border-rose-500/30 text-[11px] space-y-1.5 font-sans">
                    <p className="font-semibold text-rose-300">How to authorize in 30 seconds:</p>
                    <ol className="list-decimal list-inside space-y-0.5 text-slate-300 text-[10.5px]">
                      <li>Open <a href="https://console.firebase.google.com/project/revora-ai-a8410/authentication/settings" target="_blank" rel="noreferrer" className="text-cyan-400 underline inline-flex items-center gap-0.5 font-medium">Firebase Console Settings <ExternalLink className="w-2.5 h-2.5" /></a></li>
                      <li>Click <strong>Authorized domains</strong> &gt; <strong>Add domain</strong></li>
                      <li>Paste your current domain:</li>
                    </ol>
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <code className="flex-1 px-2 py-1 rounded bg-black/60 border border-white/10 text-cyan-300 font-mono text-[10.5px] truncate">
                        {currentHostname}
                      </code>
                      <button
                        type="button"
                        onClick={handleCopyHostname}
                        className="px-2 py-1 rounded bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 border border-cyan-500/30 font-semibold text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        {copiedDomain ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedDomain ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {successMessage && (
              <div className="p-2.5 mb-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-start gap-2 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-400" />
                <span className="leading-snug">{successMessage}</span>
              </div>
            )}

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-2.5">
              {mode === 'signup' && (
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium text-[11px]">Full Name</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rajeyo Haldar"
                      className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/15 rounded-xl text-white text-xs sm:text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-slate-300 font-medium text-[11px]">Work Email Address</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/15 rounded-xl text-white text-xs sm:text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                    required
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-300 font-medium text-[11px]">Password</label>
                    {mode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode('forgot');
                          setErrorMessage(null);
                        }}
                        className="text-[11px] text-cyan-400 hover:underline cursor-pointer font-medium"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-9 py-2 bg-black/40 border border-white/15 rounded-xl text-white text-xs sm:text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}

              {mode === 'signup' && (
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium text-[11px]">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/15 rounded-xl text-white text-xs sm:text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                      required
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:brightness-110 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : mode === 'signin' ? (
                  <>
                    <span>Sign In to Revora</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                ) : mode === 'signup' ? (
                  <>
                    <span>Get Started with Revora</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <Mail className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              {mode === 'forgot' && (
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMessage(null);
                  }}
                  className="w-full text-center text-xs text-slate-400 hover:text-white mt-1 cursor-pointer"
                >
                  ← Back to Sign In
                </button>
              )}
            </form>

            {/* Security Declaration */}
            <div className="mt-3.5 pt-2.5 border-t border-white/[0.08] flex items-center justify-center gap-2 text-[10px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Secured via Firebase Auth & Razorpay API</span>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default AuthModal;

