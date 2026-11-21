import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { EmptyStatePanel, SegmentedTabs } from '../../components/UiPrimitives';

export function ClientTransactionsPage() {
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Transaction History
        </h1>
        <p className="text-sm text-slate-400">
          Verified account and on-chain transaction records associated with your linked wallet.
        </p>
      </div>

      {/* Filter Bar Ready for Populated Data */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-800/90 bg-[#081124] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <label htmlFor="client-tx-search" className="sr-only">
            Search transaction hash or reference
          </label>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            id="client-tx-search"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reference or hash..."
            className="w-full rounded-lg border border-slate-700/90 bg-[#050b19] py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <SegmentedTabs
          ariaLabel="Filter transaction category"
          value={typeFilter}
          onChange={setTypeFilter}
          options={[
            { value: 'all', label: 'All Activity' },
            { value: 'incoming', label: 'Incoming' },
            { value: 'outgoing', label: 'Outgoing' },
            { value: 'verification', label: 'Verification' },
          ]}
        />
      </div>

      {/* Honest Empty State — Zero Fabricated Balances or Crypto Transactions */}
      <EmptyStatePanel
        title="No Transaction History Available"
        description={
          searchQuery.trim()
            ? `No transactions match "${searchQuery.trim()}". Live blockchain indexing and financial operations are not active in Stage 1.`
            : 'No financial balances or cryptocurrency transactions are displayed at this stage. Live transaction history will populate only after wallet connectivity and finalized protocol integration.'
        }
        metaNote={`Active Filter: ${typeFilter} · Stage 1 Empty State (Zero Fabricated Financial Data)`}
        actionLabel="Review Wallet Management"
        actionTo="/client/wallet"
      />
    </div>
  );
}
