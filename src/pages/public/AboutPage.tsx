import React from 'react';
import { ArrowRight } from 'lucide-react';
import { AppLink } from '../../components/AppLink';
import { KeyValueRow, SectionHeader, StageNotice } from '../../components/UiPrimitives';

export function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-16 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="max-w-3xl space-y-5">
        <p className="text-sm font-medium text-sky-400">About CAREX</p>
        <h1 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Powering the Next Generation of Structured Web3 Infrastructure
        </h1>
        <p className="text-base leading-relaxed text-slate-300 sm:text-lg">
          CAREX (CRX) is a Web3 technology platform designed around clear architectural
          boundaries: a corporate public presence, a structured client portal, cryptographic
          non-custodial wallet verification, authorized identity verification, and strictly
          separated administrative governance.
        </p>
      </div>

      <StageNotice
        title="Governance Separation Notice"
        description="This web platform delivers the CAREX software architecture and interface foundation. Underlying blockchain selection, CRX tokenomics, token utility, and commercial decisions are owned by a separate core team and are not fabricated within this application."
      />

      <section className="grid gap-10 border-t border-slate-800/80 pt-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeader
            eyebrow="Engineering Principles"
            title="Clarity, Restraint, and Security by Architecture"
            description="Every system decision in the CAREX Web Platform follows strict separation of concerns and non-custodial security standards."
          />
        </div>

        <div className="divide-y divide-slate-800/80 border-t border-slate-800/80 lg:col-span-7 lg:border-t-0">
          <div className="py-5 first:pt-0">
            <h3 className="font-display text-lg font-semibold text-white">
              01. Separation of Frontend and Sensitive Operations
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              All sensitive verification, role enforcement, and credentialed integrations are
              designed for server-side execution. Private API keys and service credentials are
              never exposed to browser code.
            </p>
          </div>
          <div className="py-5">
            <h3 className="font-display text-lg font-semibold text-white">
              02. Cryptographic Wallet Verification Only
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Wallet ownership will be proven exclusively through cryptographic message signatures.
              CAREX never requests, collects, or stores private keys, recovery seed phrases, or
              wallet passwords.
            </p>
          </div>
          <div className="py-5">
            <h3 className="font-display text-lg font-semibold text-white">
              03. Authorized KYC & Independent Human Verification
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Identity verification is architected for an authorized KYC provider, with DigiLocker
              planned separately following formal API approval. Bot protection and human
              verification remain distinct security layers.
            </p>
          </div>
          <div className="py-5">
            <h3 className="font-display text-lg font-semibold text-white">
              04. Role-Based Administrative Protection
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Administrative interfaces are logically isolated from client accounts and enforced
              through strict role-based access control so ordinary users can never reach
              administrative capabilities.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-800/90 bg-[#081124] p-7 sm:p-9">
        <h2 className="font-display text-2xl font-semibold text-white">Project Identity Profile</h2>
        <div className="mt-6">
          <KeyValueRow label="Brand Name" value="CAREX" />
          <KeyValueRow label="Token Symbol" value="CRX" mono />
          <KeyValueRow label="Official Tagline" value="POWERING THE NEXT GENERATION" />
          <KeyValueRow label="Planned Backend Stack" value="Node.js · Firebase Authentication · Cloud Firestore" />
          <KeyValueRow label="Current Release Scope" value="Stage 1 — Public Website, Design System & Portal Layouts" tone="info" />
          <KeyValueRow label="Corporate Legal & Jurisdiction Details" value="Pending Official Publication" tone="neutral" />
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-5 border-t border-slate-800/80 pt-6">
          <AppLink
            to="/ecosystem"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 whitespace-nowrap"
          >
            <span>Explore Ecosystem</span>
            <ArrowRight className="h-4 w-4" />
          </AppLink>
          <AppLink
            to="/roadmap"
            className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
          >
            Review Development Roadmap
          </AppLink>
        </div>
      </section>
    </div>
  );
}
