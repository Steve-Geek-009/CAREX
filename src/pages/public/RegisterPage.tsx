import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { AppLink } from '../../components/AppLink';
import { CarexLogo } from '../../components/CarexLogo';
import { StageNotice } from '../../components/UiPrimitives';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from '../../context/RouterContext';
import {
  evaluatePasswordStrength,
  validateRegisterForm,
  type RegisterFormValues,
  type ValidationErrors,
} from '../../utils/validation';

export function RegisterPage() {
  const { signInWithGoogle, authBusy, authError } = useAuth();
  const { navigate } = useRouter();
  const [values, setValues] = useState<RegisterFormValues>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptedTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors<RegisterFormValues>>({});
  const [submittedPreview, setSubmittedPreview] = useState(false);

  const strength = evaluatePasswordStrength(values.password);

  const handleGoogleSignUp = async () => {
    const ok = await signInWithGoogle();
    if (ok) {
      navigate('/client');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateRegisterForm(values);
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
        {/* Left Onboarding Sequence Explanation */}
        <div className="space-y-8 lg:col-span-5">
          <div className="space-y-4">
            <CarexLogo size="md" />
            <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Create Your CAREX Account
            </h1>
            <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
              CAREX separates registration into clear, auditable security layers. Sign in with
              Google to activate your account immediately or review the upcoming onboarding steps.
            </p>
          </div>

          <ol className="divide-y divide-slate-800/80 border-y border-slate-800/80 text-sm">
            <li className="py-4">
              <p className="font-medium text-white">01. Account Credentials &amp; Google Sign-In</p>
              <p className="mt-1 text-xs text-slate-400">
                Verified Google Sign-In account provisioning and persistent profile storage.
              </p>
            </li>
            <li className="py-4">
              <p className="font-medium text-white">02. Independent Human Verification</p>
              <p className="mt-1 text-xs text-slate-400">
                Bot protection and human verification enforced as a separate security requirement.
              </p>
            </li>
            <li className="py-4">
              <p className="font-medium text-white">03. Authorized KYC Provider Verification</p>
              <p className="mt-1 text-xs text-slate-400">
                Identity verification via an authorized KYC provider; DigiLocker integration is
                scheduled separately after API approval.
              </p>
            </li>
            <li className="py-4">
              <p className="font-medium text-white">04. Non-Custodial Wallet Signature</p>
              <p className="mt-1 text-xs text-slate-400">
                Cryptographic signature ownership check only. Never asks for private keys or seed
                phrases.
              </p>
            </li>
          </ol>
        </div>

        {/* Right Registration Form */}
        <div className="lg:col-span-7">
          <div className="rounded-xl border border-slate-800/90 bg-[#081124] p-7 sm:p-9">
            <div className="mb-6 space-y-3">
              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={authBusy}
                className="flex w-full items-center justify-center gap-3 rounded-lg border border-cyan-400/40 bg-blue-600/20 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-cyan-300/60 hover:bg-blue-600/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#EA4335"
                    d="M12 10.2v3.9h5.4c-.2 1.2-1.4 3.6-5.4 3.6-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.1 14.6 2.2 12 2.2 6.6 2.2 2.2 6.6 2.2 12s4.4 9.8 9.8 9.8c5.7 0 9.4-4 9.4-9.6 0-.6-.1-1.1-.2-1.6H12z"
                  />
                </svg>
                <span>{authBusy ? 'Creating account...' : 'Continue with Google'}</span>
              </button>
              {authError && (
                <p role="alert" className="text-xs text-rose-400">
                  {authError}
                </p>
              )}
              <div className="flex items-center gap-3 pt-2 text-xs text-slate-500">
                <span className="h-px flex-1 bg-slate-800" />
                <span>or validate email registration layout</span>
                <span className="h-px flex-1 bg-slate-800" />
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div>
                <label htmlFor="reg-name" className="block text-sm font-medium text-slate-200">
                  Full name
                </label>
                <input
                  id="reg-name"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  value={values.fullName}
                  onChange={(e) => {
                    setValues((prev) => ({ ...prev, fullName: e.target.value }));
                    if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                  }}
                  aria-invalid={Boolean(errors.fullName)}
                  aria-describedby={errors.fullName ? 'reg-name-error' : undefined}
                  placeholder="Enter your full name"
                  className="mt-2 w-full rounded-lg border border-slate-700/90 bg-[#050b19] px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
                />
                {errors.fullName && (
                  <p id="reg-name-error" role="alert" className="mt-1.5 text-xs text-rose-400">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="reg-email" className="block text-sm font-medium text-slate-200">
                  Email address
                </label>
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={(e) => {
                    setValues((prev) => ({ ...prev, email: e.target.value }));
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'reg-email-error' : undefined}
                  placeholder="name@organization.com"
                  className="mt-2 w-full rounded-lg border border-slate-700/90 bg-[#050b19] px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
                />
                {errors.email && (
                  <p id="reg-email-error" role="alert" className="mt-1.5 text-xs text-rose-400">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="reg-password"
                    className="block text-sm font-medium text-slate-200"
                  >
                    Password
                  </label>
                  <div className="relative mt-2">
                    <input
                      id="reg-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={values.password}
                      onChange={(e) => {
                        setValues((prev) => ({ ...prev, password: e.target.value }));
                        if (errors.password)
                          setErrors((prev) => ({ ...prev, password: undefined }));
                      }}
                      aria-invalid={Boolean(errors.password)}
                      aria-describedby={errors.password ? 'reg-password-error' : undefined}
                      placeholder="Minimum 10 characters"
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
                      id="reg-password-error"
                      role="alert"
                      className="mt-1.5 text-xs text-rose-400"
                    >
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="reg-confirm"
                    className="block text-sm font-medium text-slate-200"
                  >
                    Confirm password
                  </label>
                  <input
                    id="reg-confirm"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={values.confirmPassword}
                    onChange={(e) => {
                      setValues((prev) => ({ ...prev, confirmPassword: e.target.value }));
                      if (errors.confirmPassword)
                        setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                    }}
                    aria-invalid={Boolean(errors.confirmPassword)}
                    aria-describedby={errors.confirmPassword ? 'reg-confirm-error' : undefined}
                    placeholder="Re-enter password"
                    className="mt-2 w-full rounded-lg border border-slate-700/90 bg-[#050b19] px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                  {errors.confirmPassword && (
                    <p
                      id="reg-confirm-error"
                      role="alert"
                      className="mt-1.5 text-xs text-rose-400"
                    >
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* Password Strength Criteria */}
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
                <span className={strength.hasMinLength ? 'text-emerald-400' : 'text-slate-500'}>
                  10+ characters
                </span>
                <span aria-hidden="true" className="text-slate-700">·</span>
                <span className={strength.hasUppercase ? 'text-emerald-400' : 'text-slate-500'}>
                  Uppercase letter
                </span>
                <span aria-hidden="true" className="text-slate-700">·</span>
                <span className={strength.hasLowercase ? 'text-emerald-400' : 'text-slate-500'}>
                  Lowercase letter
                </span>
                <span aria-hidden="true" className="text-slate-700">·</span>
                <span className={strength.hasNumber ? 'text-emerald-400' : 'text-slate-500'}>
                  Numeric digit
                </span>
              </div>

              {/* Human Verification Placeholder Box */}
              <div className="rounded-lg border border-slate-800 bg-[#050b19] px-4 py-3.5 text-xs text-slate-400">
                <p className="font-medium text-slate-200">
                  Human Verification & Bot Protection Module (Scheduled)
                </p>
                <p className="mt-1">
                  Independent human verification will be enforced here prior to live account
                  creation in a subsequent development stage.
                </p>
              </div>

              <div>
                <label className="flex cursor-pointer items-start gap-2.5 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={values.acceptedTerms}
                    onChange={(e) => {
                      setValues((prev) => ({ ...prev, acceptedTerms: e.target.checked }));
                      if (errors.acceptedTerms)
                        setErrors((prev) => ({ ...prev, acceptedTerms: undefined }));
                    }}
                    className="mt-1 h-4 w-4 rounded border-slate-700 bg-[#050b19] text-blue-600 focus:ring-blue-500"
                  />
                  <span>
                    I acknowledge that CAREX never requests private wallet keys or seed phrases,
                    and that live registration activates once backend services are connected.
                  </span>
                </label>
                {errors.acceptedTerms && (
                  <p role="alert" className="mt-1.5 text-xs text-rose-400">
                    {errors.acceptedTerms}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
              >
                Create Account
              </button>
            </form>

            {submittedPreview && (
              <div className="mt-6">
                <StageNotice
                  title="Stage 1 Registration Layout Validated"
                  description={`Registration fields validated for ${values.fullName.trim()} (${values.email.trim()}). Live Firebase account creation and email verification are scheduled for Stage 2.`}
                  actionLabel="Inspect Client Portal"
                  actionTo="/client"
                />
              </div>
            )}

            <p className="mt-6 border-t border-slate-800/80 pt-5 text-sm text-slate-400">
              Already registered?{' '}
              <AppLink to="/login" className="font-medium text-sky-300 hover:text-white">
                Sign in to your account
              </AppLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
