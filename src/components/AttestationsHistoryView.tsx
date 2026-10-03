/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BuilderNode, VerificationRecord } from '../types/quorum';
import { downloadAuditTrailCsv, truncateHash } from '../utils/crypto';

interface AttestationsHistoryViewProps {
  records: VerificationRecord[];
  builders: BuilderNode[];
  onSelectRecord: (record: VerificationRecord) => void;
  showToast: (msg: string) => void;
}

export const AttestationsHistoryView: React.FC<AttestationsHistoryViewProps> = ({
  records,
  builders,
  onSelectRecord,
  showToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filter records
  const filteredRecords = records.filter((rec) => {
    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'verified' && rec.decision === 'VERIFIED') ||
      (filterStatus === 'conflict' && rec.decision === 'CONFLICT') ||
      (filterStatus === 'rejected' && rec.decision === 'REJECTED') ||
      (filterStatus === 'inflight' && (rec.decision === 'IN_QUEUE' || rec.decision === 'RUNNING'));

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      rec.packageName.toLowerCase().includes(query) ||
      rec.repositoryUrl.toLowerCase().includes(query) ||
      rec.pinnedCommit.toLowerCase().includes(query) ||
      rec.id.toLowerCase().includes(query) ||
      rec.attestations.some((a) => a.builderName.toLowerCase().includes(query));

    return matchesFilter && matchesSearch;
  });

  const handleExport = () => {
    downloadAuditTrailCsv(records);
    showToast(`Exported ${records.length} verification records to CSV.`);
  };

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex flex-col w-full px-gutter space-y-space-lg pb-space-2xl">
      {/* Subtle Ambient Glow Canvas Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#181c24] via-[#1c2028] to-[#181c24] p-space-lg shadow-sm border border-[#262a33]">
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-[#4cd7f6]/10 blur-2xl pointer-events-none"></div>
        <div className="flex flex-col space-y-space-xs relative z-10">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[18px] text-[#4cd7f6]">history_edu</span>
            <span className="font-label-caps text-label-caps uppercase text-[#4cd7f6] tracking-widest text-[10px]">
              Decentralized Telemetry
            </span>
          </div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-[#dfe2ee] font-semibold tracking-tight">
            Signed Attestations & History
          </h1>
          <p className="font-body-sm text-body-sm text-[#bcc9cd] leading-relaxed text-[13px]">
            Immutable log of cryptographic builder evidence and historical release decisions.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-space-sm mt-space-md pt-space-md border-t-0 bg-[#0a0e16]/60 rounded-lg p-space-sm border border-[#262a33]">
          <div className="flex flex-col">
            <span className="font-label-caps text-label-caps uppercase text-[#869397] text-[9px]">
              Attested Total
            </span>
            <span className="font-headline-sm text-headline-sm text-[#dfe2ee] font-semibold">
              {(1489 + records.length - 5).toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-caps text-label-caps uppercase text-[#869397] text-[9px]">
              Pass Rate
            </span>
            <span className="font-headline-sm text-headline-sm text-[#4cd7f6] font-semibold">
              97.4%
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-caps text-label-caps uppercase text-[#869397] text-[9px]">
              Active Enclaves
            </span>
            <span className="font-headline-sm text-headline-sm text-[#d0bcff] font-semibold">
              12 TEE
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col space-y-space-sm">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#869397]">
            <span className="material-symbols-outlined text-[18px]">search</span>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-9 rounded-lg bg-[#0a0e16] text-[#dfe2ee] placeholder:text-[#869397] font-mono-sm text-mono-sm focus:outline-none focus:border-[#4cd7f6] border border-[#262a33] text-[12px]"
            placeholder="Filter by repository, commit SHA, or Builder ID..."
          />
          {searchQuery && (
            <button
              aria-label="Clear filter"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#869397] hover:text-[#dfe2ee]"
              onClick={() => setSearchQuery('')}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Filter Chips Horizontal Rail */}
        <div className="flex items-center gap-space-xs overflow-x-auto no-scrollbar py-0.5">
          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            className={`whitespace-nowrap px-2.5 py-1 rounded-full font-label-caps text-label-caps uppercase transition-all flex items-center gap-1 text-[10px] active:scale-95 ${
              filterStatus === 'all'
                ? 'bg-[#06b6d4] text-[#003640] font-semibold shadow-sm'
                : 'bg-[#262a33] text-[#bcc9cd] hover:text-[#dfe2ee]'
            }`}
          >
            <span>All</span>
            <span className="px-1 py-0.2 rounded-full bg-black/20 text-[9px] font-mono-sm">
              {records.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus('verified')}
            className={`whitespace-nowrap px-2.5 py-1 rounded-full font-label-caps text-label-caps uppercase transition-all flex items-center gap-1 text-[10px] active:scale-95 ${
              filterStatus === 'verified'
                ? 'bg-[#06b6d4] text-[#003640] font-semibold shadow-sm'
                : 'bg-[#262a33] text-[#bcc9cd] hover:text-[#dfe2ee]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6]"></span>
            <span>Verified</span>
            <span className="text-[9px] font-mono-sm">
              {records.filter((r) => r.decision === 'VERIFIED').length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus('conflict')}
            className={`whitespace-nowrap px-2.5 py-1 rounded-full font-label-caps text-label-caps uppercase transition-all flex items-center gap-1 text-[10px] active:scale-95 ${
              filterStatus === 'conflict'
                ? 'bg-[#571bc1] text-[#e9ddff] font-semibold shadow-sm'
                : 'bg-[#262a33] text-[#bcc9cd] hover:text-[#dfe2ee]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#d0bcff]"></span>
            <span>Conflict</span>
            <span className="text-[9px] font-mono-sm">
              {records.filter((r) => r.decision === 'CONFLICT').length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus('rejected')}
            className={`whitespace-nowrap px-2.5 py-1 rounded-full font-label-caps text-label-caps uppercase transition-all flex items-center gap-1 text-[10px] active:scale-95 ${
              filterStatus === 'rejected'
                ? 'bg-[#93000a] text-[#ffdad6] font-semibold shadow-sm'
                : 'bg-[#262a33] text-[#bcc9cd] hover:text-[#dfe2ee]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab]"></span>
            <span>Rejected</span>
            <span className="text-[9px] font-mono-sm">
              {records.filter((r) => r.decision === 'REJECTED').length}
            </span>
          </button>
        </div>
      </div>

      {/* Consensus Registry Feed */}
      <div className="flex flex-col space-y-space-md">
        <div className="flex items-center justify-between">
          <span className="font-label-caps text-label-caps uppercase text-[#bcc9cd] tracking-wider text-[10px]">
            Consensus Registry Feed ({filteredRecords.length})
          </span>
          <span className="font-mono-sm text-mono-sm text-[#4cd7f6] flex items-center gap-1 text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] animate-ping"></span>
            Live Sync
          </span>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="p-8 text-center bg-[#181c24] rounded-xl border border-[#262a33] text-[#bcc9cd]">
            <span className="material-symbols-outlined text-[32px] text-[#869397] block mb-2">
              search_off
            </span>
            <p className="font-body-md text-[13px]">No records matched the filter criteria.</p>
          </div>
        ) : (
          filteredRecords.map((rec) => {
            const isExpanded = expandedId === rec.id;
            const quorumPct = ((rec.matchingCount / rec.consensusPolicy.totalNodes) * 100).toFixed(0);

            return (
              <article
                key={rec.id}
                onClick={() => onSelectRecord(rec)}
                className="flex flex-col bg-[#181c24] rounded-xl p-space-md shadow-sm transition-all hover:bg-[#1c2028] border border-[#262a33] hover:border-[#31353e] cursor-pointer"
              >
                <div className="flex items-start justify-between gap-space-xs">
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-headline-sm text-headline-sm font-semibold text-[#dfe2ee] truncate text-[14px]">
                        {rec.packageName}
                      </span>
                      <span
                        className={`font-mono-sm text-mono-sm px-1.5 py-0.5 rounded text-[10px] ${
                          rec.decision === 'VERIFIED'
                            ? 'bg-[#262a33] text-[#4cd7f6]'
                            : rec.decision === 'CONFLICT'
                            ? 'bg-[#571bc1]/30 text-[#d0bcff]'
                            : 'bg-[#93000a]/30 text-[#ffb4ab]'
                        }`}
                      >
                        {rec.version}
                      </span>
                    </div>

                    <div className="flex items-center gap-space-xs mt-1 text-[#bcc9cd] font-mono-sm text-mono-sm text-[11px]">
                      <span className="flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[13px]">commit</span>
                        {rec.pinnedCommit.slice(0, 8)}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[13px]">schedule</span>
                        {rec.relativeTime}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded-full font-label-caps text-label-caps uppercase tracking-wider flex items-center gap-1 text-[10px] border ${
                        rec.decision === 'VERIFIED'
                          ? 'bg-[#4cd7f6]/10 text-[#4cd7f6] border-[#4cd7f6]/20'
                          : rec.decision === 'CONFLICT'
                          ? 'bg-[#571bc1]/30 text-[#d0bcff] border-[#d0bcff]/30'
                          : 'bg-[#93000a]/20 text-[#ffb4ab] border-[#ffb4ab]/30'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[12px]">
                        {rec.decision === 'VERIFIED'
                          ? 'check_circle'
                          : rec.decision === 'CONFLICT'
                          ? 'gpp_maybe'
                          : 'cancel'}
                      </span>
                      {rec.decision === 'VERIFIED'
                        ? rec.divergenceCount > 0
                          ? 'VERIFIED W/ EXCEPTION'
                          : 'VERIFIED'
                        : rec.decision === 'CONFLICT'
                        ? 'CONFLICT DETECTED'
                        : 'REJECTED'}
                    </span>
                    <span className="font-mono-sm text-mono-sm text-[#869397] mt-1 text-[10px]">
                      ID: {rec.id}
                    </span>
                  </div>
                </div>

                {/* Segmented Quorum Progress Visualizer */}
                <div className="mt-space-sm bg-[#0a0e16] rounded-lg p-2.5 border border-[#181c24]">
                  <div className="flex items-center justify-between mb-1.5 text-[11px]">
                    <span
                      className={`font-body-sm text-body-sm ${
                        rec.decision === 'REJECTED' ? 'text-[#ffb4ab]' : 'text-[#dfe2ee]'
                      }`}
                    >
                      {rec.matchingCount} of {rec.consensusPolicy.totalNodes} builders{' '}
                      {rec.decision === 'REJECTED' ? 'agreed (Quorum Failed)' : 'verified'}
                    </span>
                    <span
                      className={`font-mono-sm text-mono-sm font-medium ${
                        rec.decision === 'VERIFIED'
                          ? 'text-[#4cd7f6]'
                          : rec.decision === 'CONFLICT'
                          ? 'text-[#d0bcff]'
                          : 'text-[#ffb4ab]'
                      }`}
                    >
                      {rec.decision === 'VERIFIED'
                        ? `${quorumPct}% consensus`
                        : rec.decision === 'CONFLICT'
                        ? 'Met (Minority Drift)'
                        : 'Quorum Failed'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 h-1.5 w-full rounded overflow-hidden">
                    {rec.attestations.map((att, i) => (
                      <div
                        key={i}
                        className={`rounded-sm h-full ${
                          att.matchExpected
                            ? 'bg-[#4cd7f6]'
                            : rec.decision === 'CONFLICT'
                            ? 'bg-[#d0bcff]'
                            : 'bg-[#ffb4ab]'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Expandable Cryptographic Details Drawer */}
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={(e) => toggleExpand(rec.id, e)}
                    className="w-full flex items-center justify-between text-[#869397] hover:text-[#dfe2ee] py-1 font-mono-sm text-[11px] transition-colors"
                  >
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">terminal</span>
                      <span>
                        {rec.decision === 'REJECTED'
                          ? 'Cryptographic Binary Mismatch'
                          : rec.decision === 'CONFLICT'
                          ? 'Build Environment Drift Details'
                          : 'Enclave Attestation Root'}
                      </span>
                    </span>
                    <span
                      className={`material-symbols-outlined text-[16px] transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    >
                      expand_more
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="mt-2 p-2.5 rounded bg-[#0a0e16] text-[#bcc9cd] font-mono-sm text-[11px] space-y-1.5 border border-[#262a33] animate-fadeIn">
                      <div className="flex justify-between">
                        <span className="text-[#869397]">Expected SHA256:</span>
                        <span className="text-[#dfe2ee] truncate max-w-[200px]">
                          {truncateHash(rec.expectedHash || rec.attestations[0]?.artifactHash, 12, 6)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#869397]">Primary Signer:</span>
                        <span className="text-[#4cd7f6]">
                          {rec.attestations[0]?.builderName} ({rec.attestations[0]?.enclaveType})
                        </span>
                      </div>
                      <div className="text-[10px] text-[#869397] pt-1 border-t border-[#1c2028]">
                        Click item to inspect in Full Release Inspector →
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Signed Builder Registry Section */}
      <div className="flex flex-col space-y-space-md pt-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[#d0bcff] text-[20px]">hub</span>
            <h2 className="font-headline-sm text-headline-sm font-semibold text-[#dfe2ee]">
              Independent Builder Registry
            </h2>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono-sm text-[9px] text-[#869397] px-2 py-0.5 rounded bg-[#262a33] border border-[#31353e]">
              SIMULATED NODES
            </span>
            <span className="font-label-caps text-label-caps uppercase text-[#bcc9cd] text-[10px]">
              Attested Nodes
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-space-sm">
          {builders.map((builder) => (
            <div
              key={builder.id}
              className="flex flex-col bg-[#181c24] rounded-xl p-space-md shadow-sm border border-[#262a33]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <div className="w-8 h-8 rounded-lg bg-[#262a33] flex items-center justify-center text-[#4cd7f6]">
                    <span className="material-symbols-outlined text-[18px]">memory</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="font-headline-sm text-headline-sm font-semibold text-[#dfe2ee] text-[14px]">
                        {builder.name}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6]"></span>
                      <span className="px-1.5 py-0.2 rounded bg-[#0a0e16] text-[#869397] text-[9px] font-mono-sm border border-[#262a33]">
                        DEMO TEE
                      </span>
                    </div>
                    <span className="font-body-sm text-body-sm text-[#bcc9cd] text-[11px]">
                      {builder.type}
                    </span>
                  </div>
                </div>
                <span className="font-mono-sm text-mono-sm px-2 py-0.5 rounded bg-[#1c2028] text-[#4cd7f6] font-medium text-[10px] border border-[#262a33]">
                  {builder.uptime} Uptime
                </span>
              </div>

              <div className="flex items-center justify-between mt-space-sm pt-space-xs border-t border-[#1c2028] font-mono-sm text-mono-sm text-[#bcc9cd] text-[11px]">
                <span className="flex items-center gap-1">
                  <span className="text-[#869397]">Key:</span>
                  <span className="text-[#dfe2ee]">{builder.publicKeyId}</span>
                </span>
                <span className="text-[#dfe2ee] font-medium">
                  {builder.totalBuilds.toLocaleString()} Builds
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Action Bar */}
      <div className="pb-space-lg pt-space-xs">
        <button
          onClick={handleExport}
          className="w-full h-11 rounded-xl bg-[#262a33] hover:bg-[#31353e] active:scale-[0.98] transition-all text-[#dfe2ee] flex items-center justify-center gap-space-sm shadow-sm font-body-md text-body-md font-semibold border border-[#31353e]"
          type="button"
        >
          <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">download</span>
          <span>Export Full Verification Audit Trail (.csv / .json)</span>
        </button>
      </div>
    </div>
  );
};
