/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { VerificationRecord } from '../types/quorum';
import { truncateHash } from '../utils/crypto';

interface DashboardViewProps {
  records: VerificationRecord[];
  onStartVerify: () => void;
  onOpenDocs: () => void;
  onSelectTamperDemo: () => void;
  onSelectRecord: (record: VerificationRecord) => void;
  onOpenTestSuite?: () => void;
  onLaunchRealPackageDemo?: (path: 'consensus' | 'divergent') => void;
  showToast: (msg: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  records,
  onStartVerify,
  onOpenDocs,
  onSelectTamperDemo,
  onSelectRecord,
  onOpenTestSuite,
  onLaunchRealPackageDemo,
  showToast,
}) => {
  const [showHexDiff, setShowHexDiff] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  // Active run record is the second initial record or the latest in-flight/verified
  const activeRecord = records.find(r => r.id === 'QRM-2025-09012-ACTIVE') || records[0];

  const verifiedCount = 1842 + records.filter(r => r.decision === 'VERIFIED').length - 2;
  const inQueueCount = records.filter(r => r.decision === 'IN_QUEUE' || r.decision === 'RUNNING').length + 4;
  const disagreedCount = 19 + records.filter(r => r.decision === 'CONFLICT').length - 1;
  const blockedCount = 7 + records.filter(r => r.decision === 'REJECTED').length - 1;

  const handleCopyCommit = (commit: string) => {
    navigator.clipboard?.writeText(commit);
    setCopiedHash(true);
    showToast(`Copied commit SHA: ${commit.slice(0, 10)}...`);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="flex flex-col w-full px-gutter pb-space-xl space-y-space-md">
      {/* Security Ethos Pill Banner */}
      <div className="w-full mt-space-sm bg-[#181c24] rounded-xl px-space-md py-space-xs flex items-center justify-between shadow-sm border border-[#262a33]">
        <div className="flex items-center space-x-space-xs min-w-0">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4cd7f6] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4cd7f6]"></span>
          </span>
          <p className="font-label-caps text-label-caps uppercase text-[#4cd7f6] tracking-wider truncate text-[10px]">
            Don't Trust the Binary. Trust the Builders.
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="font-mono-sm text-[9px] text-[#869397] bg-[#262a33] px-1.5 py-0.5 rounded">
            SIMULATED TEE
          </span>
          <span className="font-mono-sm text-mono-sm text-[#bcc9cd] flex items-center text-[11px]">
            <span className="material-symbols-outlined text-[14px] text-[#4cd7f6] mr-1">security</span>
            BFT-Consensus
          </span>
        </div>
      </div>

      {/* Hero Block */}
      <div className="bg-[#1c2028] rounded-xl p-space-md shadow-md relative overflow-hidden border border-[#262a33]">
        <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-[#4cd7f6]/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex flex-col space-y-space-xs relative z-10">
          <div className="flex items-center space-x-space-xs">
            <span className="px-1.5 py-0.5 rounded bg-[#262a33] text-[#4cd7f6] font-label-caps text-label-caps uppercase text-[10px]">
              Zero-Trust Registry
            </span>
            <span className="text-[#bcc9cd] font-mono-sm text-mono-sm flex items-center text-[11px]">
              <span className="material-symbols-outlined text-[13px] text-[#adc6ff] mr-0.5">verified</span> SLSA L4
            </span>
          </div>

          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-[#dfe2ee] font-semibold tracking-tight">
            Software Release Verification
          </h1>

          <p className="font-body-md text-body-md text-[#bcc9cd] text-[13px] leading-relaxed">
            Verify software artifacts match claimed pinned source commits via multi-builder cryptographic consensus.
          </p>

          <div className="flex flex-col xs:flex-row gap-space-xs pt-space-xs">
            <button
              onClick={onStartVerify}
              className="w-full xs:w-auto h-10 px-space-md bg-[#06b6d4] hover:brightness-110 text-[#003640] font-body-md text-body-md font-medium rounded-lg flex items-center justify-center space-x-space-xs shadow-md active:scale-98 transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">add_moderator</span>
              <span>+ Verify New Release</span>
            </button>
            <button
              onClick={onOpenDocs}
              className="w-full xs:w-auto h-10 px-space-md bg-[#262a33] hover:bg-[#31353e] text-[#dfe2ee] font-body-md text-body-md rounded-lg flex items-center justify-center space-x-space-xs shadow-sm active:scale-98 transition-all border border-[#31353e]"
            >
              <span className="material-symbols-outlined text-[18px] text-[#bcc9cd]">menu_book</span>
              <span>View Spec / Docs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Telemetry Metrics 2x2 Grid */}
      <div className="grid grid-cols-2 gap-space-xs">
        {/* Metric 1: Verified */}
        <div className="bg-[#181c24] rounded-xl p-space-md flex flex-col justify-between shadow-sm border border-[#262a33]">
          <div className="flex items-center justify-between">
            <span className="font-mono-sm text-mono-sm text-[#bcc9cd] uppercase tracking-wider text-[11px]">
              Verified
            </span>
            <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">check_circle</span>
          </div>
          <div className="my-space-xs">
            <span className="font-headline-md text-headline-md font-semibold text-[#dfe2ee]">
              {verifiedCount.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono-sm text-mono-sm text-[#4cd7f6] text-[11px]">+14% this mo</span>
            <svg className="w-12 h-4 text-[#4cd7f6]" fill="none" viewBox="0 0 48 16">
              <path
                d="M1 13L10 10L19 12L28 6L37 7L47 2"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.75"
              />
            </svg>
          </div>
        </div>

        {/* Metric 2: Consensus Queue */}
        <div className="bg-[#181c24] rounded-xl p-space-md flex flex-col justify-between shadow-sm border border-[#262a33]">
          <div className="flex items-center justify-between">
            <span className="font-mono-sm text-mono-sm text-[#bcc9cd] uppercase tracking-wider text-[11px]">
              In Queue
            </span>
            <span className="material-symbols-outlined text-[16px] text-[#adc6ff]">hourglass_top</span>
          </div>
          <div className="my-space-xs">
            <span className="font-headline-md text-headline-md font-semibold text-[#dfe2ee]">
              {inQueueCount}
            </span>
          </div>
          <div className="flex items-center text-[#bcc9cd] font-mono-sm text-mono-sm text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#adc6ff] mr-1.5"></span>
            <span>Awaiting quorum</span>
          </div>
        </div>

        {/* Metric 3: Disagreements */}
        <div className="bg-[#181c24] rounded-xl p-space-md flex flex-col justify-between shadow-sm border border-[#262a33]">
          <div className="flex items-center justify-between">
            <span className="font-mono-sm text-mono-sm text-[#bcc9cd] uppercase tracking-wider text-[11px]">
              Disagreed
            </span>
            <span className="material-symbols-outlined text-[16px] text-[#d0bcff]">alt_route</span>
          </div>
          <div className="my-space-xs">
            <span className="font-headline-md text-headline-md font-semibold text-[#d0bcff]">
              {disagreedCount}
            </span>
          </div>
          <div className="font-mono-sm text-mono-sm text-[#bcc9cd] truncate text-[11px]">
            Mismatched hashes
          </div>
        </div>

        {/* Metric 4: Rejected / Tampered */}
        <div className="bg-[#181c24] rounded-xl p-space-md flex flex-col justify-between shadow-sm border border-[#262a33]">
          <div className="flex items-center justify-between">
            <span className="font-mono-sm text-mono-sm text-[#bcc9cd] uppercase tracking-wider text-[11px]">
              Blocked
            </span>
            <span className="material-symbols-outlined text-[16px] text-[#ffb4ab]">gpp_bad</span>
          </div>
          <div className="my-space-xs">
            <span className="font-headline-md text-headline-md font-semibold text-[#ffb4ab]">
              {blockedCount}
            </span>
          </div>
          <div className="font-mono-sm text-mono-sm text-[#ffb4ab] truncate text-[11px]">
            Tampered packages
          </div>
        </div>
      </div>

      {/* Featured Real Open-Source Package Benchmark Card */}
      <div className="bg-[#1c2028] rounded-xl p-space-md shadow-lg space-y-space-md border border-[#4cd7f6]/40 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-44 h-44 bg-[#4cd7f6]/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header badge & title */}
        <div className="flex items-start justify-between relative z-10">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-[#4cd7f6]/20 text-[#4cd7f6] font-label-caps uppercase text-[10px] font-bold border border-[#4cd7f6]/30">
                REAL OPEN-SOURCE BENCHMARK
              </span>
              <span className="px-2 py-0.5 rounded bg-[#181c24] text-[#869397] font-mono-sm text-[10px] border border-[#262a33]">
                SLSA LEVEL 4
              </span>
            </div>
            <h2 className="font-headline-md text-headline-md font-bold text-[#dfe2ee] flex items-center gap-2">
              <span>sigstore/cosign</span>
              <span className="text-[#4cd7f6] font-mono-lg text-mono-lg">v2.4.1</span>
            </h2>
            <p className="font-body-sm text-body-sm text-[#bcc9cd] text-[12px] leading-relaxed">
              Real public open-source standard for container signing and supply-chain integrity, tested across 3 independent simulated builder runners with WebCrypto attestations.
            </p>
          </div>
        </div>

        {/* Real Metadata Grid */}
        <div className="bg-[#0a0e16] rounded-lg p-space-sm space-y-1.5 font-mono-sm text-mono-sm text-[11px] border border-[#262a33]">
          <div className="flex items-center justify-between text-[#bcc9cd]">
            <span className="text-[#869397]">Repository</span>
            <a
              href="https://github.com/sigstore/cosign"
              target="_blank"
              rel="noreferrer"
              className="text-[#4cd7f6] hover:underline flex items-center"
            >
              github.com/sigstore/cosign
              <span className="material-symbols-outlined text-[12px] ml-0.5">open_in_new</span>
            </a>
          </div>
          <div className="flex items-center justify-between text-[#bcc9cd]">
            <span className="text-[#869397]">Pinned Commit</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[#dfe2ee]">b6ad9d08e9d3ae8eecb52a1ba2cf9ef3f10ef9ef</span>
              <button
                type="button"
                onClick={() => handleCopyCommit('b6ad9d08e9d3ae8eecb52a1ba2cf9ef3f10ef9ef')}
                className="text-[#4cd7f6] hover:text-[#dfe2ee]"
                title="Copy Commit"
              >
                <span className="material-symbols-outlined text-[13px]">content_copy</span>
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between text-[#bcc9cd]">
            <span className="text-[#869397]">Artifact Target</span>
            <span className="text-[#dfe2ee]">cosign-linux-amd64 (ELF 64-bit)</span>
          </div>
          <div className="flex items-center justify-between text-[#bcc9cd]">
            <span className="text-[#869397]">Expected SHA-256</span>
            <span className="text-[#4cd7f6] font-semibold">{truncateHash('584d4ae839cfbe42dfc28bf5c468e82aa8e6308a73562fe939bbd4745c11029e', 10, 6)}</span>
          </div>
          <div className="flex items-center justify-between text-[#bcc9cd]">
            <span className="text-[#869397]">Build Command</span>
            <span className="text-[#869397] truncate max-w-[260px]">CGO_ENABLED=0 go build -trimpath -ldflags="-s -w -buildid="</span>
          </div>
          <div className="flex items-center justify-between text-[#bcc9cd] pt-1 border-t border-[#181c24]">
            <span className="text-[#869397]">Builders (Simulated)</span>
            <span className="text-[#bcc9cd] text-[10px]">AWS Nitro Enclave · GCP Confidential VM · Baremetal Intel SGX</span>
          </div>
        </div>

        {/* Two Demonstration Paths Action Triggers */}
        <div className="space-y-2 pt-1">
          <span className="font-label-caps uppercase text-[#bcc9cd] tracking-wider text-[10px] block">
            Execute Real Package Demonstration Paths:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onLaunchRealPackageDemo?.('consensus')}
              className="p-3 rounded-xl bg-[#06b6d4] hover:brightness-110 text-[#003640] font-headline-sm text-headline-sm font-semibold flex flex-col items-start gap-1 shadow-md active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-1.5 w-full">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span className="text-[13px] font-bold">Path 1: Clean Consensus</span>
              </div>
              <span className="text-[11px] font-normal opacity-90 text-left">
                3/3 Builders reproduce bit-for-bit identical binary → VERIFIED
              </span>
            </button>

            <button
              type="button"
              onClick={() => onLaunchRealPackageDemo?.('divergent')}
              className="p-3 rounded-xl bg-[#262a33] hover:bg-[#31353e] text-[#dfe2ee] hover:text-[#4cd7f6] font-headline-sm text-headline-sm font-semibold flex flex-col items-start gap-1 border border-[#31353e] hover:border-[#4cd7f6]/40 active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-1.5 w-full text-[#d0bcff]">
                <span className="material-symbols-outlined text-[18px]">alt_route</span>
                <span className="text-[13px] font-bold">Path 2: Divergent Artifact</span>
              </div>
              <span className="text-[11px] font-normal text-[#bcc9cd] text-left">
                1 builder output diverges (+28B) → Quorum resolves conflict
              </span>
            </button>
          </div>

          {/* Direct link to pre-computed verified audit record */}
          <button
            type="button"
            onClick={() => {
              const cosignRecord = records.find(r => r.id === 'QRM-COSIGN-2.4.1-REPRO');
              if (cosignRecord) {
                onSelectRecord(cosignRecord);
              }
            }}
            className="w-full py-2 rounded-lg bg-[#181c24] hover:bg-[#262a33] text-[#4cd7f6] font-mono-sm text-[11px] flex items-center justify-center gap-1.5 border border-[#4cd7f6]/20 transition-colors"
          >
            <span className="material-symbols-outlined text-[15px]">fact_check</span>
            <span>Inspect Existing sigstore/cosign Attestation Record & Export SBOM →</span>
          </button>
        </div>
      </div>

      {/* Active Verification Card */}
      {activeRecord && (
        <div className="bg-[#1c2028] rounded-xl p-space-md shadow-md space-y-space-md border border-[#262a33]">
          {/* Header of Verification */}
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center space-x-space-xs">
                <span className="w-2 h-2 rounded-full bg-[#4cd7f6] animate-pulse"></span>
                <span className="font-label-caps text-label-caps uppercase text-[#4cd7f6] font-semibold text-[10px]">
                  Active Run
                </span>
                <span className="font-mono-sm text-mono-sm text-[#bcc9cd] text-[11px]">
                  {activeRecord.relativeTime}
                </span>
              </div>
              <h2 className="font-headline-sm text-headline-sm font-semibold text-[#dfe2ee]">
                {activeRecord.packageName}{' '}
                <span className="text-[#4cd7f6] font-mono-lg">{activeRecord.version}</span>
              </h2>
            </div>
            <div className="px-2 py-1 rounded bg-[#4cd7f6]/10 text-[#4cd7f6] font-label-caps text-label-caps uppercase flex items-center space-x-1 shrink-0 text-[10px] border border-[#4cd7f6]/20">
              <span className="material-symbols-outlined text-[13px]">how_to_reg</span>
              <span>Quorum Met (2/3)</span>
            </div>
          </div>

          {/* Metadata Attributes */}
          <div className="bg-[#0a0e16] rounded-lg p-space-sm space-y-space-xs font-mono-sm text-mono-sm border border-[#181c24]">
            <div className="flex items-center justify-between text-[#bcc9cd]">
              <span className="text-[#869397]">Repository</span>
              <a
                className="text-[#4cd7f6] truncate max-w-[200px] flex items-center hover:underline"
                href={activeRecord.repositoryUrl}
                target="_blank"
                rel="noreferrer"
              >
                {activeRecord.repositoryUrl.replace('https://', '')}
                <span className="material-symbols-outlined text-[12px] ml-0.5">open_in_new</span>
              </a>
            </div>
            <div className="flex items-center justify-between text-[#bcc9cd]">
              <span className="text-[#869397]">Pinned Commit</span>
              <button
                className="flex items-center space-x-1 px-1.5 py-0.5 rounded bg-[#262a33] text-[#dfe2ee] hover:text-[#4cd7f6] active:scale-95 transition-transform"
                onClick={() => handleCopyCommit(activeRecord.pinnedCommit)}
                title="Copy Commit Hash"
              >
                <span>{truncateHash(activeRecord.pinnedCommit, 8, 4)}</span>
                <span className="material-symbols-outlined text-[12px] text-[#4cd7f6]">
                  {copiedHash ? 'check' : 'content_copy'}
                </span>
              </button>
            </div>
            <div className="flex items-center justify-between text-[#bcc9cd]">
              <span className="text-[#869397]">Consensus Policy</span>
              <span className="text-[#dfe2ee] font-medium">{activeRecord.consensusPolicy.description}</span>
            </div>
          </div>

          {/* Pipeline Step Visualization */}
          <div className="space-y-space-xs">
            <div className="flex items-center justify-between">
              <span className="font-label-caps text-label-caps uppercase text-[#bcc9cd] tracking-wider text-[10px]">
                Multi-Party Pipeline Flow
              </span>
              <span className="font-mono-sm text-mono-sm text-[#4cd7f6] text-[11px]">
                SLSA Step 4 of 4
              </span>
            </div>

            {/* Linear visual step bar */}
            <div className="grid grid-cols-4 gap-1.5 py-1">
              <div className="flex flex-col space-y-1">
                <div className="h-1.5 rounded-full bg-[#4cd7f6]"></div>
                <span className="font-label-caps text-label-caps text-[#bcc9cd] truncate text-[9px]">
                  1. Commit
                </span>
              </div>
              <div className="flex flex-col space-y-1">
                <div className="h-1.5 rounded-full bg-[#4cd7f6]"></div>
                <span className="font-label-caps text-label-caps text-[#bcc9cd] truncate text-[9px]">
                  2. 3x Builds
                </span>
              </div>
              <div className="flex flex-col space-y-1">
                <div className="h-1.5 rounded-full bg-[#4cd7f6]"></div>
                <span className="font-label-caps text-label-caps text-[#bcc9cd] truncate text-[9px]">
                  3. Hashes
                </span>
              </div>
              <div className="flex flex-col space-y-1">
                <div className="h-1.5 rounded-full bg-[#d0bcff]"></div>
                <span className="font-label-caps text-label-caps text-[#d0bcff] truncate text-[9px]">
                  4. Quorum (2/3)
                </span>
              </div>
            </div>

            {/* Segmented Verification Status Alert */}
            <div className="bg-[#262a33] rounded-lg p-space-sm flex items-center justify-between border border-[#31353e]">
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">verified_user</span>
                <span className="font-mono-sm text-mono-sm font-medium text-[#dfe2ee]">
                  Consensus: QUORUM REACHED
                </span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-[#571bc1]/40 text-[#d0bcff] font-label-caps text-label-caps uppercase text-[9px] border border-[#d0bcff]/30">
                1 Divergence
              </span>
            </div>
          </div>

          {/* Multi-Builder Attestation Snapshot Cards */}
          <div className="space-y-space-xs">
            <span className="font-label-caps text-label-caps uppercase text-[#bcc9cd] tracking-wider block text-[10px]">
              Isolated Node Attestations
            </span>

            {/* Builder A */}
            <div className="bg-[#181c24] rounded-lg p-space-sm flex flex-col space-y-1 border border-[#262a33]">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6]"></span>
                  <span className="font-mono-md text-mono-md font-medium text-[#dfe2ee]">
                    Builder A (AWS Nitro #01)
                  </span>
                </div>
                <span className="px-1.5 py-0.2 rounded bg-[#4cd7f6]/10 text-[#4cd7f6] font-label-caps text-label-caps uppercase flex items-center text-[10px]">
                  <span className="material-symbols-outlined text-[11px] mr-0.5">check</span> MATCH
                </span>
              </div>
              <div className="flex items-center justify-between font-mono-sm text-mono-sm text-[#bcc9cd] pl-3 text-[11px]">
                <span className="truncate text-[#869397]">
                  SHA256: {truncateHash(activeRecord.attestations[0]?.artifactHash || '8f2a41d99b0c031ef82a720114ae4f91ce', 10, 4)}
                </span>
                <span className="text-[#4cd7f6] flex items-center shrink-0">ed25519 ✓</span>
              </div>
            </div>

            {/* Builder B */}
            <div className="bg-[#181c24] rounded-lg p-space-sm flex flex-col space-y-1 border border-[#262a33]">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6]"></span>
                  <span className="font-mono-md text-mono-md font-medium text-[#dfe2ee]">
                    Builder B (GCP Shielded #04)
                  </span>
                </div>
                <span className="px-1.5 py-0.2 rounded bg-[#4cd7f6]/10 text-[#4cd7f6] font-label-caps text-label-caps uppercase flex items-center text-[10px]">
                  <span className="material-symbols-outlined text-[11px] mr-0.5">check</span> MATCH
                </span>
              </div>
              <div className="flex items-center justify-between font-mono-sm text-mono-sm text-[#bcc9cd] pl-3 text-[11px]">
                <span className="truncate text-[#869397]">
                  SHA256: {truncateHash(activeRecord.attestations[1]?.artifactHash || '8f2a41d99b0c031ef82a720114ae4f91ce', 10, 4)}
                </span>
                <span className="text-[#4cd7f6] flex items-center shrink-0">ed25519 ✓</span>
              </div>
            </div>

            {/* Builder C (Divergence / Variance) */}
            <div className="bg-[#181c24] rounded-lg p-space-sm flex flex-col space-y-1 bg-gradient-to-r from-[#181c24] to-[#571bc1]/15 border border-[#d0bcff]/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d0bcff]"></span>
                  <span className="font-mono-md text-mono-md font-medium text-[#dfe2ee]">
                    Builder C (Hetzner Baremetal)
                  </span>
                </div>
                <span className="px-1.5 py-0.2 rounded bg-[#571bc1]/30 text-[#d0bcff] font-label-caps text-label-caps uppercase flex items-center text-[10px] border border-[#d0bcff]/30">
                  <span className="material-symbols-outlined text-[11px] mr-0.5">alt_route</span> DIVERGENT
                </span>
              </div>
              <div className="flex items-center justify-between font-mono-sm text-mono-sm text-[#bcc9cd] pl-3 text-[11px]">
                <span className="truncate text-[#d0bcff]">
                  SHA256: {truncateHash(activeRecord.attestations[2]?.artifactHash || '71bd9a43a0e159fa0021cbb8981244ea90', 10, 4)}
                </span>
                <span className="text-[#d0bcff] font-medium flex items-center shrink-0">
                  Signed ⚠ VARIANCE
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="pt-space-xs space-y-2">
            <button
              onClick={() => setShowHexDiff(!showHexDiff)}
              className="w-full py-2 bg-[#262a33] hover:bg-[#353942] rounded-lg text-[#dfe2ee] font-body-sm text-body-sm font-medium flex items-center justify-center space-x-1.5 transition-colors border border-[#31353e]"
            >
              <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">difference</span>
              <span>
                {showHexDiff
                  ? 'Hide Hex Diff'
                  : 'Inspect Hex Diff (Builder A vs C: +14 bytes)'}
              </span>
            </button>

            {/* Open Full Inspector */}
            <button
              onClick={() => onSelectRecord(activeRecord)}
              className="w-full py-2 bg-[#181c24] hover:bg-[#262a33] text-[#4cd7f6] rounded-lg font-body-sm text-body-sm font-medium flex items-center justify-center space-x-1.5 transition-colors border border-[#4cd7f6]/30"
            >
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              <span>Open in Full Release Inspector</span>
            </button>
          </div>

          {/* Interactive Diff Drawer (Toggled) */}
          {showHexDiff && (
            <div className="bg-[#0a0e16] rounded-xl p-space-md font-mono-sm text-mono-sm space-y-space-xs border border-[#262a33] animate-fadeIn">
              <div className="flex items-center justify-between pb-space-xs border-b border-[#1c2028]">
                <span className="text-[#dfe2ee] font-medium flex items-center text-[12px]">
                  <span className="material-symbols-outlined text-[15px] text-[#ffb4ab] mr-1">terminal</span>
                  Binary Attestation Diff
                </span>
                <span className="font-label-caps text-label-caps text-[#869397] uppercase text-[10px]">
                  Target: /bin/core-crypto
                </span>
              </div>
              <div className="bg-[#262a33] rounded p-2 text-[#dfe2ee] space-y-1 overflow-x-auto text-[11px]">
                <p className="text-[#869397] font-mono-sm">@@ -118,4 +118,4 @@ Pinned reproducible artifact payload</p>
                <p className="text-[#4cd7f6] font-mono-sm">+ Builder A: 8f2a41d99b0c031ef82a720114ae4f91ce [Deterministic]</p>
                <p className="text-[#4cd7f6] font-mono-sm">+ Builder B: 8f2a41d99b0c031ef82a720114ae4f91ce [Deterministic]</p>
                <p className="text-[#ffb4ab] font-mono-sm">- Builder C: 71bd9a43a0e159fa0021cbb8981244ea [HOST_TIMESTAMP_LEAK]</p>
              </div>
              <p className="font-body-sm text-body-sm text-[#bcc9cd] pt-1 text-[12px] leading-relaxed">
                Builder C incurred non-deterministic output due to unstripped build epoch timestamp in Hetzner runner. Quorum threshold (2/3) prevents supply chain compromise.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Interactive Demo Quick Link Banner */}
      <button
        type="button"
        onClick={onSelectTamperDemo}
        className="w-full text-left group bg-[#181c24] hover:bg-[#1c2028] rounded-xl p-space-md shadow-md flex items-center justify-between transition-all border border-[#262a33] hover:border-[#ffb4ab]/40"
      >
        <div className="flex items-center space-x-space-sm min-w-0">
          <div className="w-10 h-10 rounded-lg bg-[#93000a]/30 text-[#ffb4ab] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform border border-[#ffb4ab]/20">
            <span className="material-symbols-outlined text-[22px]">bug_report</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center space-x-1">
              <span className="font-headline-sm text-headline-sm font-semibold text-[#dfe2ee] group-hover:text-[#4cd7f6] transition-colors truncate">
                Live Simulation
              </span>
            </div>
            <span className="font-body-sm text-body-sm text-[#bcc9cd] truncate text-[12px]">
              Simulate a compromised SolarWinds-style compiler injection →
            </span>
          </div>
        </div>
        <span className="material-symbols-outlined text-[20px] text-[#4cd7f6] group-hover:translate-x-1 transition-transform shrink-0 ml-2">
          arrow_forward
        </span>
      </button>

      {/* Verification Test Suite Banner */}
      {onOpenTestSuite && (
        <button
          type="button"
          onClick={onOpenTestSuite}
          className="w-full text-left group bg-[#181c24] hover:bg-[#1c2028] rounded-xl p-space-md shadow-md flex items-center justify-between transition-all border border-[#4cd7f6]/30 hover:border-[#4cd7f6]"
        >
          <div className="flex items-center space-x-space-sm min-w-0">
            <div className="w-10 h-10 rounded-lg bg-[#4cd7f6]/10 text-[#4cd7f6] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform border border-[#4cd7f6]/20">
              <span className="material-symbols-outlined text-[22px]">fact_check</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center space-x-1.5">
                <span className="font-headline-sm text-headline-sm font-semibold text-[#dfe2ee] group-hover:text-[#4cd7f6] transition-colors truncate">
                  Verification Test Suite (14 Tests)
                </span>
                <span className="px-1.5 py-0.2 rounded bg-[#4cd7f6]/20 text-[#4cd7f6] font-mono-sm text-[9px] uppercase font-bold border border-[#4cd7f6]/30">
                  READY
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-[#bcc9cd] truncate text-[12px]">
                Deterministic audit harness: BFT quorum, invalid sigs, commit mismatch →
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[20px] text-[#4cd7f6] group-hover:translate-x-1 transition-transform shrink-0 ml-2">
            arrow_forward
          </span>
        </button>
      )}

      {/* Recent Consensus Logs Summary */}
      <div className="bg-[#1c2028] rounded-xl p-space-md shadow-sm space-y-space-xs border border-[#262a33]">
        <div className="flex items-center justify-between">
          <span className="font-headline-sm text-headline-sm font-semibold text-[#dfe2ee]">
            Recent Consensus Logs
          </span>
          <span className="font-mono-sm text-mono-sm text-[#4cd7f6] text-[11px] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] animate-pulse"></span>
            Live Feed
          </span>
        </div>

        <div className="space-y-1.5 pt-1">
          {records.slice(0, 4).map((rec) => (
            <div
              key={rec.id}
              onClick={() => onSelectRecord(rec)}
              className="flex items-center justify-between py-2 bg-[#0a0e16]/60 hover:bg-[#262a33] transition-colors rounded px-2.5 cursor-pointer border border-transparent hover:border-[#31353e]"
            >
              <div className="flex items-center space-x-2.5 min-w-0">
                <span
                  className={`material-symbols-outlined text-[18px] shrink-0 ${
                    rec.decision === 'VERIFIED'
                      ? 'text-[#4cd7f6]'
                      : rec.decision === 'REJECTED'
                      ? 'text-[#ffb4ab]'
                      : 'text-[#d0bcff]'
                  }`}
                >
                  {rec.decision === 'VERIFIED'
                    ? 'check_circle'
                    : rec.decision === 'REJECTED'
                    ? 'cancel'
                    : 'alt_route'}
                </span>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono-md text-mono-md font-medium text-[#dfe2ee] truncate">
                      {rec.packageName}
                    </span>
                    <span className="font-mono-sm text-[10px] text-[#869397]">{rec.version}</span>
                  </div>
                  <span className="font-mono-sm text-[11px] text-[#bcc9cd] truncate">
                    {rec.matchingCount}/{rec.consensusPolicy.totalNodes} Consensus · {rec.decision}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="font-mono-sm text-mono-sm text-[#869397] block text-[11px]">
                  {rec.relativeTime}
                </span>
                <span className="text-[10px] text-[#4cd7f6] font-mono-sm hover:underline">
                  Inspect →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
