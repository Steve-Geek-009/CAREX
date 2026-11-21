import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { AppLink } from '../../components/AppLink';
import { CarexLogo } from '../../components/CarexLogo';
import { StageNotice } from '../../components/UiPrimitives';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from '../../context/RouterContext';
import { validateLoginForm, type LoginFormValues, type ValidationErrors } from '../../utils/validation';

export function LoginPage() {
  const { signInWithGoogle, authBusy, authError, account } = useAuth();
  const { navigate } = useRouter();
  const [values, setValues] = useState<LoginFormValues>({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberSession, setRememberSession] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors<LoginFormValues>>({});
  const [submittedPreview, setSubmittedPreview] = useState(false);

  const handleGoogleSignIn = async () => {
    const ok = await signInWithGoogle();
    if (ok) {
      navigate('/client');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateLoginForm(values);
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      setSubmittedPreview(false);
      return;
    }
    setSubmittedPreview(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="grid gap-12 lg:grid-cols-12">
        {/* Left Architectural Context */}
        <div className="flex flex-col justify-between space-y-8 lg:col-span-5">
          <div className="space-y-4">
            <CarexLogo size="md" />
            <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Sign In to CAREX
            </h1>
            <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
              Access your CAREX Client Portal to manage your account profile, review KYC
              verification status, and oversee non-custodial wallet bindings.
            </p>
          </div>

          <div className="space-y-4 border-t border-slate-800/80 pt-6">
            <p className="text-xs font-medium text-sky-400">Portal Access</p>
            <p className="text-sm leading-relaxed text-slate-400">
              Sign in with Google to persist your account profile and preferences, or inspect the
              Client Portal and Admin Console layouts directly.
            </p>
            <div className="flex flex-wrap gap-4 pt-1 text-sm">
              <AppLink to="/client" className="font-medium text-sky-300 hover:text-white">
                Open Client Portal
              </AppLink>
              <span aria-hidden="true" className="text-slate-700">/</span>
              <AppLink to="/admin" className="font-medium text-slate-300 hover:text-white">
                Open Admin Console
              </AppLink>
            </div>
          </div>
        </div>

        {/* Right Login Form */}
        <div className="lg:col-span-7">
          <div className="rounded-xl border border-slate-800/90 bg-[#081124] p-7 sm:p-9">
            {account && (
              <div className="mb-6">
                <StageNotice
                  title={`Signed in as ${account.displayName}`}
                  description={`Authenticated session active for ${account.email}.`}
                  actionLabel="Continue to Client Portal"
                  actionTo="/client"
                />
              </div>
            )}

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={authBusy}
                className="flex w-full items-center justify-center gap-3 rounded-lg border border-cyan-400/40 bg-blue-600/20 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-cyan-300/60 hover:bg-blue-600/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#EA4335"
                    d="M12 10.2v3.9h5.4c-.2 1.2-1.4 3.6-5.4 3.6-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.1 14.6 2.2 12 2.2 6.6 2.2 2.2 6.6 2.2 12s4.4 9.8 9.8 9.8c5.7 0 9.4-4 9.4-9.6 0-.6-.1-1.1-.2-1.6H12z"
                  />
                </svg>
                <span>{authBusy ? 'Signing in...' : 'Continue with Google'}</span>
              </button>
              {authError && (
                <p role="alert" className="text-xs text-rose-400">
                  {authError}
                </p>
              )}
            </div>

            <div className="my-6 flex items-center gap-3 text-xs text-slate-500">
              <span className="h-px flex-1 bg-slate-800" />
              <span>or review email login layout</span>
              <span className="h-px flex-1 bg-slate-800" />
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-slate-200">
                  Email address
                </label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={(e) => {
                    setValues((prev) => ({ ...prev, email: e.target.value }));
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'login-email-error' : undefined}
                  placeholder="name@organization.com"
                  className="mt-2 w-full rounded-lg border border-slate-700/90 bg-[#050b19] px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
                />
                {errors.email && (
                  <p id="login-email-error" role="alert" className="mt-1.5 text-xs text-rose-400">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="login-password"
                    className="block text-sm font-medium text-slate-200"
                  >
                    Password
                  </label>
                  <span className="text-xs text-slate-500">
                    Google Sign-In is active above
                  </span>
                </div>
                <div className="relative mt-2">
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={values.password}
                    onChange={(e) => {
                      setValues((prev) => ({ ...prev, password: e.target.value }));
                      if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? 'login-password-error' : undefined}
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-slate-700/90 bg-[#050b19] py-2.5 pl-4 pr-11 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p
                    id="login-password-error"
                    role="alert"
                    className="mt-1.5 text-xs text-rose-400"
                  >
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberSession}
                    onChange={(e) => setRememberSession(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 bg-[#050b19] text-blue-600 focus:ring-blue-500"
                  />
                  <span>Keep session active on this device</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
              >
                Sign In
              </button>
            </form>

            {submittedPreview && (
              <div className="mt-6">
                <StageNotice
                  title="Stage 1 Validation Passed — Use Google Sign-In for Live Session"
                  description={`Input validation succeeded for ${values.email.trim()}. Live authentication currently uses Google Sign-In above; email/password sign-in requires enabling the Email/Password provider in Firebase Console.`}
                  actionLabel="Open Client Portal Preview"
                  actionTo="/client"
                />
              </div>
            )}

            <p className="mt-6 border-t border-slate-800/80 pt-5 text-sm text-slate-400">
              Need a CAREX account?{' '}
              <AppLink to="/register" className="font-medium text-sky-300 hover:text-white">
                Create an account
              </AppLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
