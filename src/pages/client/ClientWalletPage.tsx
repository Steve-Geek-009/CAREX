import React, { useState } from 'react';
import { EmptyStatePanel, KeyValueRow, StageNotice } from '../../components/UiPrimitives';

export function ClientWalletPage() {
  const [showFlowDetails, setShowFlowDetails] = useState(false);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Wallet Management
        </h1>
        <p className="text-sm text-slate-400">
          Manage your linked Web3 wallet address and review CAREX non-custodial signature
          standards.
        </p>
      </div>

      <StageNotice
        title="Cryptographic Signature Connectivity Scheduled for Future Stage"
        description="Live Web3 wallet connection is not enabled in Stage 1. When activated, wallet ownership will be proven exclusively through cryptographic message signatures."
      />

      <EmptyStatePanel
        title="No Wallet Connected"
        description="You do not currently have a linked wallet address. Once live wallet connectivity is released, you will be able to sign a one-time cryptographic ownership challenge from your wallet."
        metaNote="Wallet Address: Not Connected · Non-Custodial Policy Enforced"
        actionLabel={showFlowDetails ? 'Hide Planned Signature Flow' : 'Review Planned Signature Flow'}
        onAction={() => setShowFlowDetails((prev) => !prev)}
      />

      {showFlowDetails && (
        <section className="rounded-xl border border-slate-800/90 bg-[#081124] p-6 sm:p-7">
          <h2 className="font-display text-lg font-semibold text-white">
            Planned Cryptographic Ownership Flow (Informational Preview)
          </h2>
          <ol className="mt-4 grid gap-4 md:grid-cols-3">
            <li className="rounded-lg border border-slate-800/80 bg-[#050b19] p-4 text-sm text-slate-300">
              <span className="font-mono text-xs text-sky-400">01. Server Nonce</span>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                The backend generates a short-lived, single-use cryptographic challenge message
                tied to your authenticated session.
              </p>
            </li>
            <li className="rounded-lg border border-slate-800/80 bg-[#050b19] p-4 text-sm text-slate-300">
              <span className="font-mono text-xs text-sky-400">02. Client Signature</span>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                You sign the challenge locally in your wallet application without initiating a
                blockchain transaction or exposing private keys.
              </p>
            </li>
            <li className="rounded-lg border border-slate-800/80 bg-[#050b19] p-4 text-sm text-slate-300">
              <span className="font-mono text-xs text-sky-400">03. Server Verification</span>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                Server-side verification recovers the public address from the signature and binds
                only the public address to your account record.
              </p>
            </li>
          </ol>
        </section>
      )}

      <section className="rounded-xl border border-slate-800/90 bg-[#081124] p-6 sm:p-7">
        <h2 className="font-display text-lg font-semibold text-white">
          Non-Custodial Security Commitments
        </h2>
        <div className="mt-4">
          <KeyValueRow label="Private Wallet Keys" value="Never Requested or Stored" tone="positive" />
          <KeyValueRow label="Recovery Seed Phrases" value="Never Requested or Stored" tone="positive" />
          <KeyValueRow label="Wallet Passwords" value="Never Requested or Stored" tone="positive" />
          <KeyValueRow label="Ownership Proof Method" value="Cryptographic Signature Verification" />
          <KeyValueRow label="Supported Blockchain Network" value="Pending Core Protocol Specification" />
        </div>
      </section>
    </div>
  );
}
