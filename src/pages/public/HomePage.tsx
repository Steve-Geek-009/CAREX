import React from 'react';
import { ArrowRight } from 'lucide-react';
import { AppLink } from '../../components/AppLink';
import { MediaFrame } from '../../components/MediaFrame';
import { SectionHeader } from '../../components/UiPrimitives';

const HERO_IMAGE = '/src/assets/images/hero_carex_orbital_1795268971519.jpg';
const ECOSYSTEM_IMAGE = '/src/assets/images/ecosystem_network_nodes_1795268971994.jpg';
const TOKEN_IMAGE = '/src/assets/images/crx_token_emblem_1795268982099.jpg';

export function HomePage() {
  return (
    <div className="bg-[#040814]">
      {/* 1. Hero Section — Single Dominant Focal Carrier */}
      <section className="relative overflow-hidden border-b border-slate-800/80">
        <div className="absolute inset-0">
          <MediaFrame
            src={HERO_IMAGE}
            alt="CAREX orbital titanium and sapphire glass interconnected network rings"
            aspectClass="h-full w-full"
            objectPosition="object-right md:object-center"
            scrimClassName="bg-gradient-to-b from-[#040814]/90 via-[#040814]/84 to-[#040814]/95 md:bg-gradient-to-r md:from-[#040814] md:via-[#040814]/88 md:to-[#040814]/28"
          />
        </div>
        <div className="carex-hairline-grid pointer-events-none absolute inset-0 opacity-60" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <div className="max-w-2xl space-y-6">
            <p className="text-xs font-semibold tracking-[0.2em] text-sky-400">
              POWERING THE NEXT GENERATION
            </p>
            <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.75rem)] font-semibold leading-[1.08] tracking-tight text-white">
              Institutional Web3 Infrastructure Built for Clarity and Trust
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              CAREX (CRX) unites a public corporate platform, modular client onboarding,
              non-custodial cryptographic wallet verification, and role-based administrative
              governance into one cohesive Web3 architecture.
            </p>

            <div className="flex flex-wrap items-center gap-5 pt-2">
              <AppLink
                to="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500 whitespace-nowrap"
              >
                <span>Create Account</span>
                <ArrowRight className="h-4 w-4" />
              </AppLink>
              <AppLink
                to="/ecosystem"
                className="inline-flex items-center gap-2 py-2 text-sm font-medium text-slate-200 transition-colors hover:text-sky-300 whitespace-nowrap"
              >
                <span>Explore Ecosystem</span>
                <ArrowRight className="h-4 w-4" />
              </AppLink>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-slate-800/80 pt-6 text-xs text-slate-400">
              <span>Symbol: CRX</span>
              <span aria-hidden="true">·</span>
              <span>Modular Architecture</span>
              <span aria-hidden="true" className="hidden sm:inline">·</span>
              <span className="w-full sm:w-auto">Stage 1 Web Platform Active</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Platform Architecture — Asymmetric Bento Grid */}
      <section className="border-b border-slate-800/80 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Platform Architecture"
            title="Three Separated Layers, One Consistent Experience"
            description="CAREX separates public corporate communication, client account operations, and restricted administrative controls so each layer scales independently and securely."
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {/* Primary Asymmetric Span */}
            <div className="flex flex-col justify-between rounded-xl border border-slate-800/90 bg-[#081124] p-7 lg:col-span-2 lg:p-9">
              <div className="space-y-4">
                <p className="text-xs font-medium text-sky-400">01. Modular Web Platform</p>
                <h3 className="font-display text-2xl font-semibold tracking-tight text-white">
                  Built for Security Separation from Day One
                </h3>
                <p className="max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
                  Frontend presentation and backend verification responsibilities remain strictly
                  separated. Sensitive identity checks, session controls, and administrative
                  actions are architected for server-side execution without ever exposing private
                  keys or service credentials to client code.
                </p>
              </div>

              <div className="mt-8 grid gap-6 border-t border-slate-800/80 pt-6 sm:grid-cols-3">
                <div>
                  <p className="font-display text-base font-semibold text-white">Public Website</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">
                    Corporate identity, ecosystem structure, CRX overview, roadmap, and technical
                    documentation.
                  </p>
                </div>
                <div>
                  <p className="font-display text-base font-semibold text-white">Client Portal</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">
                    Account profile, KYC verification status, non-custodial wallet management, and
                    activity views.
                  </p>
                </div>
                <div>
                  <p className="font-display text-base font-semibold text-white">Admin Console</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">
                    Role-restricted operations for user oversight, KYC queues, wallet records, and
                    audit logs.
                  </p>
                </div>
              </div>
            </div>

            {/* Secondary Single-Column Architectural Card */}
            <div className="flex flex-col justify-between rounded-xl border border-slate-800/90 bg-[#081124] p-7 lg:p-9">
              <div className="space-y-4">
                <p className="text-xs font-medium text-sky-400">02. Verification Standards</p>
                <h3 className="font-display text-2xl font-semibold tracking-tight text-white">
                  Non-Custodial & Provider-Verified
                </h3>
                <p className="text-sm leading-relaxed text-slate-300">
                  Wallet ownership uses cryptographic signatures only. CAREX never requests or
                  stores seed phrases, private keys, or wallet passwords. Identity verification is
                  handled through authorized KYC providers, with DigiLocker planned separately
                  after API approval.
                </p>
              </div>

              <div className="mt-8 border-t border-slate-800/80 pt-5">
                <AppLink
                  to="/documentation"
                  className="inline-flex items-center gap-2 text-sm font-medium text-sky-300 transition-colors hover:text-white"
                >
                  <span>Read Architecture Documentation</span>
                  <ArrowRight className="h-4 w-4" />
                </AppLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Ecosystem Visual Split — Balanced 2-Column items-stretch */}
      <section className="border-b border-slate-800/80 bg-[#060c1b] py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-stretch gap-10 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <MediaFrame
                src={ECOSYSTEM_IMAGE}
                alt="Interconnected modular architectural nodes representing the CAREX Web3 ecosystem"
                aspectClass="aspect-[4/3] lg:h-full lg:aspect-auto"
                className="rounded-xl border border-slate-800/90"
                fallbackTitle="CAREX Modular Ecosystem"
              />
            </div>

            <div className="flex flex-col justify-between space-y-8 lg:col-span-6 lg:py-2">
              <div className="space-y-4">
                <p className="text-sm font-medium text-sky-400">Interconnected Ecosystem</p>
                <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Structured Onboarding Without Compromising Sovereignty
                </h2>
                <p className="text-base leading-relaxed text-slate-300">
                  Every module in the CAREX platform is intentionally decoupled so authentication,
                  human verification, identity checks, and wallet connectivity operate as clear,
                  auditable stages rather than opaque black boxes.
                </p>
              </div>

              <div className="divide-y divide-slate-800/80 border-y border-slate-800/80">
                <div className="py-4">
                  <p className="font-display text-base font-semibold text-white">
                    01. Identity & Human Verification Separation
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Bot protection and human verification operate independently from regulated KYC
                    provider checks.
                  </p>
                </div>
                <div className="py-4">
                  <p className="font-display text-base font-semibold text-white">
                    02. Planned Firebase Authentication & Cloud Firestore
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Backend account sessions, user profiles, and role policies are architected for
                    Firebase integration in subsequent stages.
                  </p>
                </div>
                <div className="py-4">
                  <p className="font-display text-base font-semibold text-white">
                    03. Strict Administrative Role-Based Access Control
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Ordinary client users are strictly prevented from accessing administrative
                    routes or governance tools.
                  </p>
                </div>
              </div>

              <div>
                <AppLink
                  to="/ecosystem"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-sky-300 transition-colors hover:text-white"
                >
                  <span>Inspect Full Ecosystem Architecture</span>
                  <ArrowRight className="h-4 w-4" />
                </AppLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CRX Token Identity Section — Zero Invented Tokenomics */}
      <section className="border-b border-slate-800/80 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-stretch gap-10 lg:grid-cols-12">
            <div className="flex flex-col justify-between space-y-6 lg:col-span-7 lg:py-2">
              <div className="space-y-4">
                <p className="text-sm font-medium text-sky-400">CRX Token</p>
                <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  The Digital Asset Identity of the CAREX Platform
                </h2>
                <p className="text-base leading-relaxed text-slate-300">
                  CRX is the official token symbol of the CAREX Web3 project. In line with CAREX
                  governance discipline, underlying blockchain network selection, tokenomics,
                  supply schedules, and token utility are managed by a dedicated core protocol
                  team and will be published exclusively upon official ratification.
                </p>
              </div>

              <div className="grid gap-4 border-t border-slate-800/80 pt-6 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-800/90 bg-[#081124] p-5">
                  <p className="text-xs text-slate-400">Token Symbol</p>
                  <p className="mt-1 font-mono text-2xl font-medium tabular-nums text-white">CRX</p>
                </div>
                <div className="rounded-lg border border-slate-800/90 bg-[#081124] p-5">
                  <p className="text-xs text-slate-400">Protocol Specification</p>
                  <p className="mt-1 text-base font-semibold text-sky-300">
                    Managed by Core Team
                  </p>
                </div>
              </div>

              <div>
                <AppLink
                  to="/token"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-sky-300 transition-colors hover:text-white"
                >
                  <span>View CRX Token Overview</span>
                  <ArrowRight className="h-4 w-4" />
                </AppLink>
              </div>
            </div>

            <div className="lg:col-span-5">
              <MediaFrame
                src={TOKEN_IMAGE}
                alt="Precision machined dark titanium and sapphire glass CRX architectural emblem"
                aspectClass="aspect-square lg:h-full lg:aspect-auto"
                className="rounded-xl border border-slate-800/90"
                fallbackTitle="CRX Token Identity"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Stage 1 Interactive Portal Previews & Conversion */}
      <section className="carex-orbital-grid py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Stage 1 Platform Preview"
            title="Inspect Every Interface Across the CAREX Platform"
            description="Stage 1 establishes the public website, authentication flows, client workspace layout, and role-protected administrative console using transparent placeholder states."
          />

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="flex flex-col justify-between rounded-xl border border-slate-800/90 bg-[#081124] p-7">
              <div className="space-y-3">
                <p className="text-xs font-medium text-sky-400">Onboarding Layouts</p>
                <h3 className="font-display text-xl font-semibold text-white">
                  Account Registration & Sign In
                </h3>
                <p className="text-sm leading-relaxed text-slate-400">
                  Validated login and registration layouts prepared for Firebase Authentication,
                  email verification, and human verification modules.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-4 border-t border-slate-800/80 pt-5 text-sm">
                <AppLink
                  to="/register"
                  className="font-medium text-sky-300 transition-colors hover:text-white"
                >
                  Open Registration
                </AppLink>
                <span aria-hidden="true" className="text-slate-700">/</span>
                <AppLink
                  to="/login"
                  className="font-medium text-slate-300 transition-colors hover:text-white"
                >
                  Sign In
                </AppLink>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-xl border border-slate-800/90 bg-[#081124] p-7">
              <div className="space-y-3">
                <p className="text-xs font-medium text-sky-400">Client Workspace</p>
                <h3 className="font-display text-xl font-semibold text-white">
                  Client Portal Dashboard
                </h3>
                <p className="text-sm leading-relaxed text-slate-400">
                  Review profile management, KYC readiness, non-custodial wallet management,
                  account settings, and honest empty states for transactions.
                </p>
              </div>
              <div className="mt-6 border-t border-slate-800/80 pt-5">
                <AppLink
                  to="/client"
                  className="inline-flex items-center gap-2 text-sm font-medium text-sky-300 transition-colors hover:text-white"
                >
                  <span>Open Client Portal</span>
                  <ArrowRight className="h-4 w-4" />
                </AppLink>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-xl border border-slate-800/90 bg-[#081124] p-7">
              <div className="space-y-3">
                <p className="text-xs font-medium text-sky-400">Restricted Governance</p>
                <h3 className="font-display text-xl font-semibold text-white">
                  Administrator Console
                </h3>
                <p className="text-sm leading-relaxed text-slate-400">
                  Inspect user management, KYC queues, wallet records, account restrictions,
                  activity logs, and live RBAC access denial controls.
                </p>
              </div>
              <div className="mt-6 border-t border-slate-800/80 pt-5">
                <AppLink
                  to="/admin"
                  className="inline-flex items-center gap-2 text-sm font-medium text-sky-300 transition-colors hover:text-white"
                >
                  <span>Open Admin Console</span>
                  <ArrowRight className="h-4 w-4" />
                </AppLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
