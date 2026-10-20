import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Compass, Lock, Mail, User as UserIcon, ArrowRight, Eye, EyeOff } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    openAuthModal,
    login,
    signup,
    forgotPassword,
    resetPassword,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resetSentInfo, setResetSentInfo] = useState<string | null>(null);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setResetToken('');
    setErrorMessage(null);
    setResetSentInfo(null);
  };

  const handleClose = () => {
    resetForm();
    closeAuthModal();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (authModalMode === 'login') {
        if (!email.trim() || !password) {
          setErrorMessage('Please fill in both email and password.');
          setIsSubmitting(false);
          return;
        }
        await login(email.trim(), password);
        handleClose();
      } else if (authModalMode === 'signup') {
        if (!email.trim() || !password || !fullName.trim()) {
          setErrorMessage('All fields are required.');
          setIsSubmitting(false);
          return;
        }
        if (password.length < 8) {
          setErrorMessage('Password must be at least 8 characters.');
          setIsSubmitting(false);
          return;
        }
        await signup(email.trim(), password, fullName.trim());
        handleClose();
      } else if (authModalMode === 'forgot') {
        if (!email.trim()) {
          setErrorMessage('Please provide your email address.');
          setIsSubmitting(false);
          return;
        }
        const devToken = await forgotPassword(email.trim());
        if (devToken) {
          setResetToken(devToken);
          setResetSentInfo(
            `Development Token generated: ${devToken}. Enter your new password below.`
          );
        } else {
          setResetSentInfo('Reset instructions have been dispatched.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.detail || 'An error occurred during authentication.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExecuteReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetToken.trim() || password.length < 8) {
      setErrorMessage('Token and new password (min 8 characters) required.');
      return;
    }
    setIsSubmitting(true);
    try {
      await resetPassword(resetToken.trim(), password);
      resetForm();
      openAuthModal('login');
    } catch (err: any) {
      setErrorMessage(err.detail || 'Password reset failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const titles = {
    login: 'Sign In to CodeMap',
    signup: 'Create Your CodeMap Account',
    forgot: 'Reset Your Password',
  };

  const descriptions = {
    login: 'Access your analyzed workspaces, private repositories, and saved queries.',
    signup: 'Join developers exploring AST symbol graphs and pre-commit blast radii.',
    forgot: 'Enter your email to receive a secure recovery token.',
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={handleClose}
      title={titles[authModalMode]}
      description={descriptions[authModalMode]}
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Brand header badge */}
        <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm">
            <Compass className="w-4 h-4" />
          </div>
          <div className="text-xs text-slate-600">
            <span className="font-semibold text-slate-900 block">CodeMap Enterprise Security</span>
            Stateless JWT authentication & Argon2/Bcrypt hash verification.
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setErrorMessage(null);
              openAuthModal('login');
            }}
            className={`pb-2.5 px-3 border-b-2 transition-colors ${
              authModalMode === 'login'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setErrorMessage(null);
              openAuthModal('signup');
            }}
            className={`pb-2.5 px-3 border-b-2 transition-colors ${
              authModalMode === 'signup'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => {
              setErrorMessage(null);
              openAuthModal('forgot');
            }}
            className={`pb-2.5 px-3 border-b-2 transition-colors ${
              authModalMode === 'forgot'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Reset Password
          </button>
        </div>

        {/* Error notification banner */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 leading-normal">
            {errorMessage}
          </div>
        )}

        {/* Info banner */}
        {resetSentInfo && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 leading-normal">
            {resetSentInfo}
          </div>
        )}

        {/* Normal Login / Signup / Forgot Form */}
        {authModalMode !== 'forgot' || !resetToken ? (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {authModalMode === 'signup' && (
              <Input
                label="Full Name"
                placeholder="e.g. Alice Architect"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                leftIcon={<UserIcon className="w-4 h-4 text-slate-400" />}
                required
              />
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
              required
            />

            {authModalMode !== 'forgot' && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-medium text-slate-700">Password</label>
                  {authModalMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => openAuthModal('forgot')}
                      className="text-blue-600 hover:underline text-[11px]"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full justify-center"
                isLoading={isSubmitting}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {authModalMode === 'login' && 'Sign In to Workspace'}
                {authModalMode === 'signup' && 'Register New Account'}
                {authModalMode === 'forgot' && 'Send Reset Instructions'}
              </Button>
            </div>
          </form>
        ) : (
          /* Step 2 of password reset: enter token and new password */
          <form onSubmit={handleExecuteReset} className="space-y-3.5">
            <Input
              label="Reset Token"
              placeholder="Paste the reset token"
              value={resetToken}
              onChange={(e) => setResetToken(e.target.value)}
              required
            />
            <Input
              label="New Password"
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
              required
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full justify-center"
              isLoading={isSubmitting}
            >
              Update Password
            </Button>
          </form>
        )}
      </div>
    </Modal>
  );
};
