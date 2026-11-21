import React from 'react';
import { ArrowRight } from 'lucide-react';
import { AppLink } from '../../components/AppLink';
import { MediaFrame } from '../../components/MediaFrame';
import { KeyValueRow, StageNotice } from '../../components/UiPrimitives';

const TOKEN_IMAGE = '/assets/aistudio/WhatsApp_Image_2026-11-21_at_8.17.00_PM_bd6cae11.jpeg';

export function TokenPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-16 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="grid items-center gap-10 lg:grid-cols-12">
        <div className="flex flex-col justify-center space-y-5 lg:col-span-7">
          <p className="text-sm font-medium text-sky-400">CRX Token Overview</p>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            CRX — Official Token Symbol of the CAREX Project
          </h1>
          <p className="text-base leading-relaxed text-slate-300 sm:text-lg">
            This page presents the verified identity placeholders and visual direction for the CRX
            token. Underlying blockchain infrastructure, tokenomics, distribution schedules, and
            protocol utility are determined exclusively by the dedicated CAREX protocol and
            business teams.
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:col-span-5">
          <MediaFrame
            src={TOKEN_IMAGE}
            alt="CAREX CRX brand logo and coin concept reference featuring interlocking silver C and electric-blue cyan X with orbital swoosh"
            aspectClass="aspect-[16/10]"
            objectPosition="object-[50%_46%]"
            className="rounded-xl border border-cyan-500/25 shadow-[0_0_40px_-18px_rgba(34,211,238,0.35)]"
            fallbackTitle="CRX Brand & Coin Concept"
          />
          <p className="text-xs text-slate-400">
            CAREX (CRX) brand &amp; coin concept reference — interlocking silver C, electric-blue
            cyan X, and orbital trajectory.
          </p>
        </div>
      </div>

      <StageNotice
        title="No Fabricated Financial or Tokenomics Information"
        description="CAREX does not display speculative market metrics, unverified supply numbers, or invented token utility claims. All fields below marked as pending will be populated strictly from official protocol documentation once finalized."
      />

      <section className="rounded-xl border border-slate-800/90 bg-[#081124] p-7 sm:p-9">
        <h2 className="font-display text-2xl font-semibold text-white">
          CRX Specification Registry
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Verified brand identity alongside explicit placeholders for protocol-owned specifications.
        </p>

        <div className="mt-6">
          <KeyValueRow label="Project Name" value="CAREX" />
          <KeyValueRow label="Official Token Symbol" value="CRX" mono />
          <KeyValueRow label="Official Tagline" value="POWERING THE NEXT GENERATION" />
          <KeyValueRow
            label="Underlying Blockchain Network"
            value="Pending Specification — Managed by Core Protocol Team"
            tone="info"
          />
          <KeyValueRow
            label="Token Standard & Contract Address"
            value="Not Published in Stage 1"
            mono
          />
          <KeyValueRow
            label="Total Supply & Tokenomics"
            value="Pending Official Publication"
          />
          <KeyValueRow
            label="Token Utility & Governance Scope"
            value="Pending Official Publication"
          />
          <KeyValueRow
            label="On-Chain Transactions & Balances"
            value="Inactive in Stage 1 (No Live Financial Operations)"
          />
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-5 border-t border-slate-800/80 pt-6">
          <AppLink
            to="/roadmap"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 whitespace-nowrap"
          >
            <span>View Development Roadmap</span>
            <ArrowRight className="h-4 w-4" />
          </AppLink>
          <AppLink
            to="/documentation"
            className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
          >
            Read Technical Documentation
          </AppLink>
        </div>
      </section>
    </div>
  );
}
