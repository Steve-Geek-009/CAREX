import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { AppLink } from '../../components/AppLink';
import { MediaFrame } from '../../components/MediaFrame';
import { SegmentedTabs, StatusText } from '../../components/UiPrimitives';

const ECOSYSTEM_IMAGE = '/src/assets/images/ecosystem_network_nodes_1795268971994.jpg';

interface EcosystemLayer {
  id: string;
  title: string;
  status: string;
  tone: 'info' | 'neutral';
  summary: string;
  responsibilities: string[];
  routeTo: string;
  routeLabel: string;
}

const LAYERS: readonly EcosystemLayer[] = [
  {
    id: 'public',
    title: 'Public Corporate Layer',
    status: 'Stage 1 Active',
    tone: 'info',
    summary:
      'Provides transparent brand identity, architectural documentation, development milestones, and structured account entry points for prospective participants.',
    responsibilities: [
      'Consistent CAREX design system and geometric visual language across all screens',
      'Clear separation between established platform architecture and pending protocol decisions',
      'Accessible entry points into Login and Registration workflows',
    ],
    routeTo: '/documentation',
    routeLabel: 'Open Platform Documentation',
  },
  {
    id: 'client',
    title: 'Client Portal Layer',
    status: 'Stage 1 Layout · Stage 2 Backend',
    tone: 'info',
    summary:
      'Dedicated authenticated workspace enabling users to review account profiles, verification status, non-custodial wallet bindings, settings, and activity records.',
    responsibilities: [
      'Honest empty states when account activity or transaction history is not yet available',
      'Modular KYC readiness and status tracking without fabricated verification claims',
      'Account security controls prepared for Firebase Authentication sessions',
    ],
    routeTo: '/client',
    routeLabel: 'Inspect Client Portal Layout',
  },
  {
    id: 'identity',
    title: 'Identity & Wallet Security Layer',
    status: 'Scheduled (Subsequent Stages)',
    tone: 'neutral',
    summary:
      'Separates cryptographic wallet ownership, authorized KYC identity verification, DigiLocker integration, and human bot-protection checks into independent modules.',
    responsibilities: [
      'Cryptographic signature verification for wallet linkage (zero private key collection)',
      'Authorized external KYC provider integration for compliant identity verification',
      'Separate DigiLocker integration following formal API approval and onboarding',
    ],
    routeTo: '/client/wallet',
    routeLabel: 'Review Wallet Security Layout',
  },
  {
    id: 'admin',
    title: 'Administrative Governance Layer',
    status: 'Stage 1 Layout · RBAC Enforced',
    tone: 'info',
    summary:
      'Isolated administrative console built for authorized compliance reviewers and platform administrators to oversee accounts, KYC queues, wallets, and audit trails.',
    responsibilities: [
      'Strict role-based access control blocking ordinary users from administrative tools',
      'Dedicated management views for users, KYC applications, linked wallets, and restrictions',
      'Structured activity monitoring and audit logs with tabular UTC timestamps',
    ],
    routeTo: '/admin',
    routeLabel: 'Inspect Admin Console Layout',
  },
];

export function EcosystemPage() {
  const [selectedLayerId, setSelectedLayerId] = useState<string>('public');
  const activeLayer = LAYERS.find((layer) => layer.id === selectedLayerId) ?? LAYERS[0];

  return (
    <div className="mx-auto max-w-7xl space-y-16 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="grid items-stretch gap-10 lg:grid-cols-12">
        <div className="flex flex-col justify-center space-y-5 lg:col-span-6">
          <p className="text-sm font-medium text-sky-400">CAREX Ecosystem</p>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Modular Platform Layers Built to Evolve in Disciplined Stages
          </h1>
          <p className="text-base leading-relaxed text-slate-300">
            Rather than coupling presentation, identity checks, wallet verification, and
            administration into a monolith, CAREX organizes its web ecosystem into independent,
            auditable layers.
          </p>
        </div>

        <div className="lg:col-span-6">
          <MediaFrame
            src={ECOSYSTEM_IMAGE}
            alt="CAREX ecosystem modular architectural nodes"
            aspectClass="aspect-[4/3] lg:h-full lg:aspect-auto"
            className="rounded-xl border border-slate-800/90"
            fallbackTitle="CAREX Modular Ecosystem"
          />
        </div>
      </div>

      {/* Interactive Layer Explorer */}
      <section className="space-y-6 border-t border-slate-800/80 pt-14">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-2xl font-semibold text-white">
            Explore Platform Layers
          </h2>
          <SegmentedTabs
            ariaLabel="Ecosystem architectural layers"
            value={selectedLayerId}
            onChange={setSelectedLayerId}
            options={LAYERS.map((l) => ({ value: l.id, label: l.title.replace(' Layer', '') }))}
          />
        </div>

        <div className="rounded-xl border border-slate-800/90 bg-[#081124] p-7 sm:p-9">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="font-display text-2xl font-semibold text-white">{activeLayer.title}</h3>
            <StatusText label={activeLayer.status} tone={activeLayer.tone} />
          </div>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-300">
            {activeLayer.summary}
          </p>

          <div className="mt-8 border-t border-slate-800/80 pt-6">
            <p className="text-xs font-medium text-slate-400">Core Architectural Responsibilities</p>
            <ul className="mt-4 grid gap-4 md:grid-cols-3">
              {activeLayer.responsibilities.map((item, idx) => (
                <li
                  key={item}
                  className="rounded-lg border border-slate-800/70 bg-[#060d1d] p-4 text-sm leading-relaxed text-slate-300"
                >
                  <span className="block font-mono text-xs text-sky-400">0{idx + 1}.</span>
                  <span className="mt-1.5 block">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-7">
            <AppLink
              to={activeLayer.routeTo}
              className="inline-flex items-center gap-2 text-sm font-semibold text-sky-300 transition-colors hover:text-white"
            >
              <span>{activeLayer.routeLabel}</span>
              <ArrowRight className="h-4 w-4" />
            </AppLink>
          </div>
        </div>
      </section>
    </div>
  );
}
