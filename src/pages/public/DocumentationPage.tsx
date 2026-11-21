import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { AppLink } from '../../components/AppLink';

interface DocSection {
  id: string;
  title: string;
  category: string;
  summary: string;
  paragraphs: string[];
  keyPoints: string[];
}

const DOC_SECTIONS: readonly DocSection[] = [
  {
    id: 'architecture',
    title: 'Platform Architecture & Stack',
    category: 'Architecture',
    summary:
      'Overview of the CAREX frontend-backend separation and planned Firebase infrastructure.',
    paragraphs: [
      'The CAREX Web Platform is engineered with React, TypeScript, and Tailwind CSS using modular, reusable UI primitives and decoupled pure logic modules for routing, role validation, and input verification.',
      'Backend services are architected around Node.js server-side functionality, Firebase Authentication, and Cloud Firestore. All sensitive credentials and verification calls remain strictly server-side.',
    ],
    keyPoints: [
      'Three distinct application surfaces: Public Website (8 pages), Client Portal (6 pages), Admin Portal (6 pages).',
      'Zero duplication of navigation chrome or data presentation primitives across portals.',
      'No private API keys or service credentials stored in browser-accessible bundles.',
    ],
  },
  {
    id: 'wallet-security',
    title: 'Wallet Ownership & Non-Custodial Policy',
    category: 'Security',
    summary: 'How CAREX verifies Web3 wallet ownership without ever handling private key material.',
    paragraphs: [
      'When live wallet connectivity is enabled in a subsequent development stage, CAREX verifies wallet ownership strictly through cryptographic message signatures initiated by the user’s own wallet software.',
      'Under no circumstances will CAREX request, transmit, or store private wallet keys, mnemonic seed phrases, keystore files, or wallet passwords.',
    ],
    keyPoints: [
      'Signature challenge-response proves public address control without custody.',
      'Public addresses are rendered in monospace tabular format with explicit verification status.',
      'No simulated or fabricated blockchain transactions appear prior to protocol integration.',
    ],
  },
  {
    id: 'kyc-identity',
    title: 'KYC Verification, DigiLocker & Human Verification',
    category: 'Compliance',
    summary: 'Modular separation between bot defense, authorized KYC providers, and DigiLocker.',
    paragraphs: [
      'CAREX treats human verification (bot protection) and regulatory identity verification (KYC) as separate security requirements so each operates with clear boundaries and auditability.',
      'KYC verification will integrate with an authorized verification provider. DigiLocker integration is scoped as a separate development milestone pending formal API access and approval.',
    ],
    keyPoints: [
      'No simulated KYC approvals claiming real identity verification.',
      'Client portal displays transparent readiness checklists and status placeholders.',
      'Admin KYC queue separates provider channels cleanly for compliance reviewers.',
    ],
  },
  {
    id: 'rbac',
    title: 'Role-Based Access Control (RBAC)',
    category: 'Governance',
    summary: 'How administrative functionality is isolated from ordinary client accounts.',
    paragraphs: [
      'Administrative dashboards, user management, KYC review queues, wallet registries, account restrictions, and audit logs are protected by strict role-based access control.',
      'Ordinary client accounts and unauthenticated public visitors are never permitted to access administrative routes or actions. In Stage 1, you can verify this behavior directly via the Role Preview control inside the Admin Console.',
    ],
    keyPoints: [
      'Role policy enforced in pure, unit-tested access control logic.',
      'Explicit Access Restricted screen rendered whenever a non-admin role requests an admin route.',
      'Live server-side Firebase Custom Claims and Firestore Security Rules scheduled for Stage 2.',
    ],
  },
  {
    id: 'stage-1-scope',
    title: 'Stage 1 Development Boundaries',
    category: 'Governance',
    summary: 'Explicit accounting of what is active in Stage 1 and what is intentionally deferred.',
    paragraphs: [
      'Stage 1 delivers the complete CAREX public website, geometric design system, navigation routing across all 20 required pages, validated authentication page layouts, and responsive Client and Admin dashboard layouts.',
      'Live blockchain transactions, wallet authentication, DigiLocker verification, live KYC provider connections, human identity verification, and financial operations are intentionally excluded from Stage 1.',
    ],
    keyPoints: [
      'All Stage 1 dashboard metrics and sample rows are clearly labelled as placeholder data.',
      'Client wallet and transaction views display honest empty states rather than fake balances.',
      'CRX blockchain and tokenomics fields explicitly reference the dedicated protocol team.',
    ],
  },
];

export function DocumentationPage() {
  const [selectedId, setSelectedId] = useState<string>(DOC_SECTIONS[0].id);
  const [query, setQuery] = useState<string>('');

  const filteredSections = DOC_SECTIONS.filter((sec) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      sec.title.toLowerCase().includes(q) ||
      sec.summary.toLowerCase().includes(q) ||
      sec.category.toLowerCase().includes(q) ||
      sec.paragraphs.some((p) => p.toLowerCase().includes(q))
    );
  });

  const activeSection =
    filteredSections.find((s) => s.id === selectedId) ?? filteredSections[0] ?? null;

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="flex flex-col gap-6 border-b border-slate-800/80 pb-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm font-medium text-sky-400">Documentation</p>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-white">
            CAREX Technical & Architectural Reference
          </h1>
          <p className="text-base leading-relaxed text-slate-300">
            Reference specifications for Stage 1 architecture, security standards, and planned
            integration boundaries.
          </p>
        </div>

        <div className="relative w-full max-w-sm">
          <label htmlFor="doc-search" className="sr-only">
            Search documentation topics
          </label>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            id="doc-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter documentation topics..."
            className="w-full rounded-lg border border-slate-800 bg-[#081124] py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Sidebar Topic Index */}
        <aside className="lg:col-span-4">
          <nav aria-label="Documentation topics" className="space-y-1.5">
            {filteredSections.map((sec) => {
              const isSelected = activeSection?.id === sec.id;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setSelectedId(sec.id)}
                  className={`flex w-full flex-col items-start rounded-lg border px-4 py-3.5 text-left transition-colors ${
                    isSelected
                      ? 'border-blue-500/60 bg-[#0b1630] text-white'
                      : 'border-transparent bg-transparent text-slate-400 hover:border-slate-800 hover:bg-[#081124] hover:text-slate-100'
                  }`}
                >
                  <span className="text-xs text-sky-400">{sec.category}</span>
                  <span className="mt-0.5 text-sm font-semibold">{sec.title}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Documentation Article Reader */}
        <div className="lg:col-span-8">
          {activeSection ? (
            <article className="rounded-xl border border-slate-800/90 bg-[#081124] p-7 sm:p-9">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="text-sky-400">{activeSection.category}</span>
                <span aria-hidden="true">·</span>
                <span>Stage 1 Architecture Reference</span>
              </div>
              <h2 className="mt-3 font-display text-2xl font-semibold text-white sm:text-3xl">
                {activeSection.title}
              </h2>
              <p className="mt-3 text-base text-slate-300">{activeSection.summary}</p>

              <div className="mt-6 space-y-4 border-t border-slate-800/80 pt-6 text-sm leading-relaxed text-slate-300 sm:text-base">
                {activeSection.paragraphs.map((para) => (
                  <p key={para}>{para}</p>
                ))}
              </div>

              <div className="mt-8 border-t border-slate-800/80 pt-6">
                <h3 className="font-display text-base font-semibold text-white">
                  Key Requirements
                </h3>
                <ul className="mt-4 space-y-2.5 text-sm text-slate-300">
                  {activeSection.keyPoints.map((point) => (
                    <li key={point} className="rounded-lg bg-[#060d1d] px-4 py-3">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 flex flex-wrap gap-5 border-t border-slate-800/80 pt-6 text-sm">
                <AppLink to="/client" className="font-medium text-sky-300 hover:text-white">
                  Inspect Client Portal Layout
                </AppLink>
                <span aria-hidden="true" className="text-slate-700">/</span>
                <AppLink to="/admin" className="font-medium text-slate-300 hover:text-white">
                  Inspect Admin Console Layout
                </AppLink>
              </div>
            </article>
          ) : (
            <div className="rounded-xl border border-slate-800/90 bg-[#081124] p-8 text-sm text-slate-400">
              No documentation topics match &ldquo;{query}&rdquo;. Clear the filter to view all
              architecture references.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
