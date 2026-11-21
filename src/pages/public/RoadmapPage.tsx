import React, { useState } from 'react';
import { SegmentedTabs, StatusText } from '../../components/UiPrimitives';

interface RoadmapStage {
  id: string;
  stageLabel: string;
  phase: 'current' | 'upcoming';
  statusLabel: string;
  title: string;
  summary: string;
  deliverables: string[];
}

const ROADMAP_STAGES: readonly RoadmapStage[] = [
  {
    id: 'stage-1',
    stageLabel: 'Stage 01',
    phase: 'current',
    statusLabel: 'Current Active Stage',
    title: 'Web Platform Foundation, Design System & Portal Layouts',
    summary:
      'Establishes the public CAREX corporate website, geometric visual identity, full client and administrative page structures, navigation routing, and responsive experience.',
    deliverables: [
      'Complete public corporate website (Home, About, Ecosystem, CRX Token, Roadmap, Documentation)',
      'Validated Login and Registration page layouts prepared for authentication integration',
      'Client Dashboard and 6-page Client Portal layout with honest empty states',
      'Separate Administrator Dashboard and 6-page Admin Console layout with RBAC guard design',
    ],
  },
  {
    id: 'stage-2',
    stageLabel: 'Stage 02',
    phase: 'upcoming',
    statusLabel: 'Planned Stage',
    title: 'Firebase Authentication, Cloud Firestore & Session Management',
    summary:
      'Activates persistent user accounts, email verification, secure session handling, and server-side role-based access enforcement backed by Firebase.',
    deliverables: [
      'Live user registration, email verification, login, and logout flows',
      'Persistent user profile records and audit logging in Cloud Firestore',
      'Server-side enforcement of administrative roles and account restriction controls',
    ],
  },
  {
    id: 'stage-3',
    stageLabel: 'Stage 03',
    phase: 'upcoming',
    statusLabel: 'Planned Stage',
    title: 'Cryptographic Wallet Connectivity & Human Verification',
    summary:
      'Introduces non-custodial Web3 wallet ownership verification via cryptographic signatures alongside independent human verification and bot protection.',
    deliverables: [
      'Cryptographic signature challenge-response for proving wallet ownership without keys',
      'Independent human verification and automated bot protection for account security',
      'Wallet binding visibility across Client and Administrative portals',
    ],
  },
  {
    id: 'stage-4',
    stageLabel: 'Stage 04',
    phase: 'upcoming',
    statusLabel: 'Planned Stage',
    title: 'Authorized KYC Provider & Separate DigiLocker Integration',
    summary:
      'Connects identity verification workflows to an authorized KYC provider, followed by dedicated DigiLocker integration upon formal API approval.',
    deliverables: [
      'Authorized KYC provider webhook and verification status synchronization',
      'Compliance review queue workflows within the restricted Admin Portal',
      'Dedicated DigiLocker verification integration developed separately after API approval',
    ],
  },
  {
    id: 'stage-5',
    stageLabel: 'Stage 05',
    phase: 'upcoming',
    statusLabel: 'Protocol-Dependent Stage',
    title: 'Blockchain Protocol & CRX Activity Integration',
    summary:
      'Integrates finalized blockchain specifications, network indexing, and CRX transaction history once ratified by the core protocol and business teams.',
    deliverables: [
      'Integration of finalized blockchain network and CRX specifications',
      'Live account activity and verified transaction history views in the Client Portal',
    ],
  },
];

export function RoadmapPage() {
  const [filter, setFilter] = useState<string>('all');

  const visibleStages = ROADMAP_STAGES.filter((stage) => {
    if (filter === 'all') return true;
    return stage.phase === filter;
  });

  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-4">
          <p className="text-sm font-medium text-sky-400">Development Roadmap</p>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Phased Delivery Architecture
          </h1>
          <p className="text-base leading-relaxed text-slate-300">
            CAREX is engineered in strictly scoped stages so visual architecture, security
            boundaries, identity verification, and protocol integration are never conflated or
            rushed.
          </p>
        </div>

        <SegmentedTabs
          ariaLabel="Filter roadmap stages"
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: 'All Stages' },
            { value: 'current', label: 'Current Stage' },
            { value: 'upcoming', label: 'Upcoming Stages' },
          ]}
        />
      </div>

      <div className="space-y-6">
        {visibleStages.map((stage) => (
          <article
            key={stage.id}
            className="rounded-xl border border-slate-800/90 bg-[#081124] p-7 sm:p-9"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="font-mono font-medium text-sky-400">{stage.stageLabel}</span>
                <span aria-hidden="true">·</span>
                <StatusText
                  label={stage.statusLabel}
                  tone={stage.phase === 'current' ? 'positive' : 'neutral'}
                  className="text-xs"
                />
              </div>
            </div>

            <h2 className="mt-3 font-display text-2xl font-semibold text-white">{stage.title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
              {stage.summary}
            </p>

            <ul className="mt-6 grid gap-3 border-t border-slate-800/80 pt-6 sm:grid-cols-2">
              {stage.deliverables.map((item) => (
                <li
                  key={item}
                  className="rounded-lg border border-slate-800/70 bg-[#060d1d] px-4 py-3 text-sm text-slate-300"
                >
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
