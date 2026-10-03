/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';

interface TamperDemoViewProps {
  showToast: (msg: string) => void;
}

export const TamperDemoView: React.FC<TamperDemoViewProps> = ({ showToast }) => {
  const [scenario, setScenario] = useState<'clean' | 'rogue' | 'split'>('rogue');
  const [isQuarantined, setIsQuarantined] = useState(false);
  const [isWarningPublished, setIsWarningPublished] = useState(false);
  const diffRef = useRef<HTMLDivElement>(null);

  const handleQuarantine = () => {
    setIsQuarantined(true);
    showToast('QUORUM ACTION DISPATCHED: Builder C signing authority revoked. Node quarantined.');
  };

  const handlePublishWarning = () => {
    setIsWarningPublished(true);
    showToast('SECURITY DISCLOSURE BROADCAST: CVE alert dispatched to package distributors.');
  };

  const handleResetScenario = () => {
    setScenario('rogue');
    setIsQuarantined(false);
    setIsWarningPublished(false);
    showToast('Attack simulation scenario reset to default 1/3 Rogue vector.');
  };

  const scrollToDiff = () => {
    diffRef.current?.scrollIntoView({ behavior: 'smooth' });
    showToast('Inspecting binary assertion diff at offset 0x4B20');
  };

  return (
    <div className="flex flex-col w-full px-gutter pb-space-2xl gap-space-lg">
      {/* Top Banner & Scenario Selector */}
      <div className="relative overflow-hidden rounded-xl bg-[#0a0e16] p-space-lg shadow-xl border border-[#262a33]">
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-[#ffb4ab]/10 blur-2xl pointer-events-none"></div>
        <div className="absolute -left-8 -bottom-8 w-44 h-44 rounded-full bg-[#4cd7f6]/10 blur-2xl pointer-events-none"></div>

        <div className="flex flex-col gap-space-xs relative z-10">
          <div className="flex items-center gap-space-xs flex-wrap">
            <span className="px-2 py-0.5 rounded bg-[#93000a] text-[#ffdad6] font-label-caps text-label-caps uppercase text-[10px] font-bold tracking-wider border border-[#ffb4ab]/40">
              DEMO / SIMULATION
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-label-caps text-label-caps tracking-widest uppercase text-[10px] ${
                scenario === 'clean'
                  ? 'bg-[#4cd7f6]/15 text-[#4cd7f6]'
                  : 'bg-[#93000a]/30 text-[#ffb4ab]'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                  scenario === 'clean' ? 'bg-[#4cd7f6]' : 'bg-[#ffb4ab]'
                }`}
              ></span>
              {scenario === 'clean'
                ? 'SCENARIO A: 3/3 CONSENSUS CLEAN'
                : scenario === 'rogue'
                ? 'SCENARIO B: 1/3 ROGUE / DIVERGENT ARTIFACT'
                : 'SCENARIO C: TOTAL DISCORD (0/3 CONSENSUS)'}
            </span>
            <span className="px-2 py-0.5 rounded bg-[#262a33] text-[#4cd7f6] font-mono-sm text-mono-sm text-[11px] border border-[#31353e]">
              TEST-VECTOR #0942
            </span>
          </div>

          <div className="flex items-center justify-between mt-1">
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-[#dfe2ee] tracking-tight font-medium">
              Tamper Detection & Attack Simulation
            </h1>
            <button
              onClick={handleResetScenario}
              className="px-2.5 py-1 rounded bg-[#262a33] hover:bg-[#31353e] text-[#bcc9cd] hover:text-[#dfe2ee] font-mono-sm text-[11px] flex items-center gap-1 border border-[#31353e] transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">restart_alt</span>
              <span>Reset</span>
            </button>
          </div>

          <p className="font-body-sm text-body-sm text-[#bcc9cd] text-[13px] leading-relaxed">
            Live simulation testing decentralized builder consensus: isolating unauthorized binary
            modification at the cryptographic threshold boundary.
          </p>
        </div>

        {/* Interactive Judge Sandbox */}
        <div className="mt-space-md p-space-md rounded-xl bg-[#181c24] flex flex-col gap-space-xs border border-[#262a33]">
          <div className="flex items-center justify-between">
            <span className="font-mono-sm text-mono-sm text-[#bcc9cd] uppercase text-[10px]">
              Interactive Judge Sandbox (Simulated)
            </span>
            <span className="font-label-caps text-label-caps text-[#4cd7f6] uppercase text-[10px]">
              Scenario Selector
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-xs mt-1">
            <button
              type="button"
              onClick={() => {
                setScenario('clean');
                showToast('Activated Scenario A: 3/3 Consensus Clean');
              }}
              className={`flex items-center justify-center gap-1.5 py-2 px-space-xs rounded transition-colors text-left border ${
                scenario === 'clean'
                  ? 'bg-[#06b6d4] text-[#003640] font-semibold border-[#4cd7f6] shadow-sm'
                  : 'bg-[#1c2028] text-[#dfe2ee] hover:bg-[#262a33] border-[#262a33]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">task_alt</span>
              <span className="font-mono-sm text-mono-sm truncate text-[11px]">A: 3/3 Consensus Clean</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setScenario('rogue');
                showToast('Activated Scenario B: 1/3 Rogue Divergent Artifact');
              }}
              className={`flex items-center justify-center gap-1.5 py-2 px-space-xs rounded transition-colors text-left border ${
                scenario === 'rogue'
                  ? 'bg-[#93000a] text-[#ffdad6] font-semibold border-[#ffb4ab] shadow-sm'
                  : 'bg-[#1c2028] text-[#dfe2ee] hover:bg-[#262a33] border-[#262a33]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">gpp_bad</span>
              <span className="font-mono-sm text-mono-sm truncate text-[11px]">B: 1/3 Rogue (Active)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setScenario('split');
                showToast('Activated Scenario C: Total Discord (0/3 Consensus)');
              }}
              className={`flex items-center justify-center gap-1.5 py-2 px-space-xs rounded transition-colors text-left border ${
                scenario === 'split'
                  ? 'bg-[#571bc1] text-[#e9ddff] font-semibold border-[#d0bcff] shadow-sm'
                  : 'bg-[#1c2028] text-[#dfe2ee] hover:bg-[#262a33] border-[#262a33]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">alt_route</span>
              <span className="font-mono-sm text-mono-sm truncate text-[11px]">C: Total Discord (0/3)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Disagreement / Verdict Banner */}
      <div
        className={`relative overflow-hidden rounded-xl p-space-md shadow-md border ${
          scenario === 'clean'
            ? 'bg-[#06b6d4]/15 text-[#dfe2ee] border-[#4cd7f6]/40'
            : scenario === 'split'
            ? 'bg-[#93000a]/25 text-[#ffdad6] border-[#ffb4ab]/40'
            : 'bg-[#93000a]/30 text-[#ffdad6] border-[#ffb4ab]/50'
        }`}
      >
        <div className="flex items-start gap-space-sm">
          <div
            className={`p-2 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
              scenario === 'clean'
                ? 'bg-[#06b6d4]/20 text-[#4cd7f6]'
                : scenario === 'split'
                ? 'bg-[#0a0e16] text-[#d0bcff]'
                : 'bg-[#0a0e16] text-[#ffb4ab]'
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">
              {scenario === 'clean'
                ? 'verified'
                : scenario === 'split'
                ? 'emergency_home'
                : 'warning'}
            </span>
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-headline-sm text-headline-sm font-semibold tracking-tight leading-tight">
                {scenario === 'clean'
                  ? 'QUORUM CONSENSUS REACHED'
                  : scenario === 'split'
                  ? 'TOTAL QUORUM COLLAPSE (0/3)'
                  : 'ARTIFACT DISAGREEMENT DETECTED'}
              </span>
              <span
                className={`px-1.5 py-0.5 rounded font-label-caps text-label-caps uppercase text-[9px] font-bold ${
                  scenario === 'clean'
                    ? 'bg-[#06b6d4]/30 text-[#4cd7f6]'
                    : scenario === 'split'
                    ? 'bg-[#571bc1]/40 text-[#d0bcff]'
                    : 'bg-[#0a0e16] text-[#ffb4ab]'
                }`}
              >
                {scenario === 'clean' ? 'APPROVED' : scenario === 'split' ? 'SPLIT' : 'ISOLATED'}
              </span>
            </div>
            <p className="font-body-sm text-body-sm mt-1 leading-snug text-[12px] opacity-90">
              {scenario === 'clean'
                ? 'All 3 builder nodes produced bit-for-bit identical hashes from pinned commit 9b4317f2a890. Artifact verified and approved for release.'
                : scenario === 'split'
                ? 'No two builders agreed on the compiled artifact digest. All production paths are hard-locked under zero-trust quarantine.'
                : 'A compromised builder attempted to sign an altered binary. Quorum consensus isolated the divergent artifact and prevented deployment into production registers.'}
            </p>
          </div>
        </div>
      </div>

      {/* Attack Vector Specs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm">
        <div className="rounded-xl bg-[#181c24] p-space-md flex flex-col gap-1 shadow-sm border border-[#262a33]">
          <span className="font-label-caps text-label-caps uppercase text-[#bcc9cd] text-[10px]">
            Simulated Vector
          </span>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-[#ffb4ab]">coronavirus</span>
            <span className="font-headline-sm text-headline-sm text-[#dfe2ee] font-semibold text-[15px]">
              Dependency Backdoor
            </span>
          </div>
          <span className="font-body-sm text-body-sm text-[#bcc9cd] text-[11px]">
            SolarWinds-style post-fetch injection
          </span>
        </div>

        <div className="rounded-xl bg-[#181c24] p-space-md flex flex-col gap-1 shadow-sm border border-[#262a33]">
          <span className="font-label-caps text-label-caps uppercase text-[#bcc9cd] text-[10px]">
            Target Artifact & Pinned Commit
          </span>
          <div className="flex items-center justify-between">
            <span className="font-mono-lg text-mono-lg text-[#4cd7f6] font-medium text-[13px]">
              libssl-transport
            </span>
            <span className="px-2 py-0.5 rounded bg-[#262a33] text-[#dfe2ee] font-label-caps text-label-caps uppercase text-[10px]">
              v3.0.4
            </span>
          </div>
          <div className="flex items-center gap-1 font-mono-sm text-mono-sm text-[#bcc9cd] text-[11px]">
            <span>Pinned Commit:</span>
            <span className="text-[#dfe2ee]">9b4317f2a890</span>
            <span className="material-symbols-outlined text-[14px] text-[#4cd7f6]">verified</span>
          </div>
        </div>

        <div className="rounded-xl bg-[#181c24] p-space-md flex flex-col gap-1 shadow-sm border border-[#262a33]">
          <span className="font-label-caps text-label-caps uppercase text-[#bcc9cd] text-[10px]">
            Builder Execution
          </span>
          <div className="flex items-center justify-between">
            <span className="font-headline-sm text-headline-sm text-[#dfe2ee] text-[15px]">
              Simulated Enclave
            </span>
            <span className="px-2 py-0.5 rounded bg-[#31353e] text-[#d0bcff] font-label-caps text-label-caps uppercase text-[10px]">
              DEMO HARNESS
            </span>
          </div>
          <span className="font-body-sm text-body-sm text-[#bcc9cd] text-[11px]">
            Deterministic memory layout verification
          </span>
        </div>
      </div>

      {/* 3-Builder Divergence Matrix */}
      <div className="rounded-xl bg-[#0a0e16] p-space-md md:p-space-lg flex flex-col gap-space-md shadow-lg border border-[#262a33]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
          <div>
            <span className="font-label-caps text-label-caps text-[#4cd7f6] uppercase tracking-wider text-[10px]">
              Consensus Engine
            </span>
            <h2 className="font-headline-sm text-headline-sm text-[#dfe2ee] font-semibold">
              3-Builder Divergence Matrix
            </h2>
          </div>
          <div className="flex items-center gap-space-xs">
            <span
              className={`px-2.5 py-1 rounded font-mono-sm text-mono-sm font-semibold text-[11px] border ${
                scenario === 'clean'
                  ? 'bg-[#4cd7f6]/20 text-[#4cd7f6] border-[#4cd7f6]/40'
                  : scenario === 'split'
                  ? 'bg-[#93000a]/40 text-[#ffb4ab] border-[#ffb4ab]/40'
                  : 'bg-[#262a33] text-[#4cd7f6] border-[#31353e]'
              }`}
            >
              {scenario === 'clean'
                ? '3 / 3 Match (100%)'
                : scenario === 'split'
                ? '0 / 3 Match (0.0%)'
                : '2 / 3 Match (66.7%)'}
            </span>
          </div>
        </div>

        {/* 3-Way Segment Bar */}
        <div className="w-full bg-[#262a33] h-2 rounded-full overflow-hidden flex">
          <div
            className={`h-full transition-all duration-500 ${
              scenario === 'split' ? 'bg-[#d0bcff]' : 'bg-[#4cd7f6]'
            }`}
            style={{ width: '33.33%' }}
          ></div>
          <div
            className={`h-full transition-all duration-500 ${
              scenario === 'split' ? 'bg-[#ffb4ab]' : 'bg-[#4cd7f6]'
            }`}
            style={{ width: '33.33%' }}
          ></div>
          <div
            className={`h-full transition-all duration-500 ${
              scenario === 'clean'
                ? 'bg-[#4cd7f6]'
                : scenario === 'split'
                ? 'bg-[#93000a]'
                : 'bg-[#ffb4ab]'
            }`}
            style={{ width: '33.34%' }}
          ></div>
        </div>

        {/* Builder Node Cards */}
        <div className="flex flex-col gap-space-sm">
          {/* Builder A */}
          <div className="rounded-xl bg-[#1c2028] p-space-md flex flex-col gap-space-xs shadow-sm border border-[#262a33]">
            <div className="flex items-start justify-between gap-space-sm">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#31353e] text-[#4cd7f6] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">memory</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-headline-sm text-headline-sm text-[#dfe2ee] font-medium truncate text-[14px]">
                      Builder A
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-[#31353e] text-[#bcc9cd] font-label-caps text-label-caps uppercase text-[9px]">
                      US-EAST (SIMULATED)
                    </span>
                  </div>
                  <span className="font-body-sm text-body-sm text-[#bcc9cd] truncate text-[11px]">
                    Verified Hermetic Runner
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#4cd7f6]/10 text-[#4cd7f6] font-mono-sm text-mono-sm font-semibold shrink-0 text-[10px] border border-[#4cd7f6]/20">
                {scenario === 'clean'
                  ? 'MATCH (1/3 Req)'
                  : scenario === 'split'
                  ? 'DISCORDANT'
                  : 'MATCH (1/2 Req)'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-xs p-space-xs rounded bg-[#0a0e16] mt-1 border border-[#181c24] text-[11px]">
              <div className="flex flex-col">
                <span className="font-label-caps text-label-caps text-[#869397] uppercase text-[9px]">
                  Digest
                </span>
                <div className="flex items-center gap-1 font-mono-sm">
                  <span className="text-[#dfe2ee] font-medium truncate">
                    sha256:8f2a91c78...d91c
                  </span>
                  <span className="px-1 rounded bg-[#4cd7f6]/10 text-[#4cd7f6] font-label-caps text-label-caps text-[9px]">
                    GENUINE
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-label-caps text-label-caps text-[#869397] uppercase text-[9px]">
                  Attestation Key
                </span>
                <span className="font-mono-sm text-[#bcc9cd] truncate">
                  0x9a3C...Simulated Enclave A
                </span>
              </div>
            </div>
          </div>

          {/* Builder B */}
          <div className="rounded-xl bg-[#1c2028] p-space-md flex flex-col gap-space-xs shadow-sm border border-[#262a33]">
            <div className="flex items-start justify-between gap-space-sm">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#31353e] text-[#4cd7f6] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">dns</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-headline-sm text-headline-sm text-[#dfe2ee] font-medium truncate text-[14px]">
                      Builder B
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-[#31353e] text-[#bcc9cd] font-label-caps text-label-caps uppercase text-[9px]">
                      EU-CENTRAL (SIMULATED)
                    </span>
                  </div>
                  <span className="font-body-sm text-body-sm text-[#bcc9cd] truncate text-[11px]">
                    Decentralized Node Cluster
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#4cd7f6]/10 text-[#4cd7f6] font-mono-sm text-mono-sm font-semibold shrink-0 text-[10px] border border-[#4cd7f6]/20">
                {scenario === 'clean'
                  ? 'MATCH (2/3 Req)'
                  : scenario === 'split'
                  ? 'DISCORDANT'
                  : 'MATCH (2/2 Req)'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-xs p-space-xs rounded bg-[#0a0e16] mt-1 border border-[#181c24] text-[11px]">
              <div className="flex flex-col">
                <span className="font-label-caps text-label-caps text-[#869397] uppercase text-[9px]">
                  Digest
                </span>
                <div className="flex items-center gap-1 font-mono-sm">
                  <span className="text-[#dfe2ee] font-medium truncate">
                    {scenario === 'split'
                      ? 'sha256:4192b0c9e...8237'
                      : 'sha256:8f2a91c78...d91c'}
                  </span>
                  <span
                    className={`px-1 rounded font-label-caps text-label-caps text-[9px] ${
                      scenario === 'split'
                        ? 'bg-[#571bc1]/40 text-[#d0bcff]'
                        : 'bg-[#4cd7f6]/10 text-[#4cd7f6]'
                    }`}
                  >
                    {scenario === 'split' ? 'SPLIT' : 'GENUINE'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-label-caps text-label-caps text-[#869397] uppercase text-[9px]">
                  Attestation Key
                </span>
                <span className="font-mono-sm text-[#bcc9cd] truncate">
                  0x77bF...Simulated Node B
                </span>
              </div>
            </div>
          </div>

          {/* Builder C (Dynamic per scenario) */}
          <div
            className={`rounded-xl p-space-md flex flex-col gap-space-xs shadow-sm transition-all border ${
              scenario === 'clean'
                ? 'bg-[#1c2028] border-[#262a33]'
                : scenario === 'split'
                ? 'bg-[#181c24] border-[#571bc1]/40'
                : 'bg-[#93000a]/20 border-[#ffb4ab]/40'
            }`}
          >
            <div className="flex items-start justify-between gap-space-sm">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    scenario === 'clean'
                      ? 'bg-[#31353e] text-[#4cd7f6]'
                      : scenario === 'split'
                      ? 'bg-[#31353e] text-[#d0bcff]'
                      : 'bg-[#93000a]/40 text-[#ffb4ab]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {scenario === 'clean'
                      ? 'memory'
                      : scenario === 'split'
                      ? 'device_unknown'
                      : 'bug_report'}
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-headline-sm text-headline-sm text-[#dfe2ee] font-medium truncate text-[14px]">
                      Builder C {isQuarantined && '(QUARANTINED)'}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded font-label-caps text-label-caps uppercase text-[9px] ${
                        scenario === 'clean'
                          ? 'bg-[#31353e] text-[#bcc9cd]'
                          : scenario === 'split'
                          ? 'bg-[#571bc1]/40 text-[#d0bcff]'
                          : 'bg-[#93000a] text-[#ffdad6]'
                      }`}
                    >
                      {scenario === 'clean'
                        ? 'AP-SOUTH'
                        : scenario === 'split'
                        ? 'DISCORDANT'
                        : isQuarantined
                        ? 'REVOKED'
                        : 'ROGUE'}
                    </span>
                  </div>
                  <span className="font-body-sm text-body-sm text-[#bcc9cd] truncate text-[11px]">
                    {scenario === 'clean'
                      ? 'Decentralized Node - Tokyo'
                      : scenario === 'split'
                      ? 'Independent Non-Deterministic Result'
                      : isQuarantined
                      ? 'Signature Certificate Revoked & Isolated'
                      : 'Compromised Worker Runner'}
                  </span>
                </div>
              </div>
              <span
                className={`px-2 py-0.5 rounded font-mono-sm text-mono-sm font-semibold shrink-0 text-[10px] border ${
                  scenario === 'clean'
                    ? 'bg-[#4cd7f6]/10 text-[#4cd7f6] border-[#4cd7f6]/20'
                    : scenario === 'split'
                    ? 'bg-[#571bc1]/30 text-[#d0bcff] border-[#d0bcff]/30'
                    : 'bg-[#93000a] text-[#ffdad6] border-[#ffb4ab]/40'
                }`}
              >
                {scenario === 'clean'
                  ? 'MATCH (3/3 Req)'
                  : scenario === 'split'
                  ? 'NO CONSENSUS'
                  : 'DIVERGENCE REJECTED'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-xs p-space-xs rounded bg-[#0a0e16] mt-1 border border-[#181c24] text-[11px]">
              <div className="flex flex-col">
                <span className="font-label-caps text-label-caps text-[#869397] uppercase text-[9px]">
                  Digest
                </span>
                <div className="flex items-center gap-1 font-mono-sm">
                  <span
                    className={`font-semibold truncate ${
                      scenario === 'clean'
                        ? 'text-[#dfe2ee]'
                        : scenario === 'split'
                        ? 'text-[#d0bcff]'
                        : 'text-[#ffb4ab]'
                    }`}
                  >
                    {scenario === 'clean'
                      ? 'sha256:8f2a91c78...d91c'
                      : scenario === 'split'
                      ? 'sha256:bb014389e...029c'
                      : 'sha256:71bd44e99...110a'}
                  </span>
                  <span
                    className={`px-1 rounded font-label-caps text-label-caps text-[9px] ${
                      scenario === 'clean'
                        ? 'bg-[#4cd7f6]/10 text-[#4cd7f6]'
                        : scenario === 'split'
                        ? 'bg-[#571bc1]/40 text-[#d0bcff]'
                        : 'bg-[#93000a]/40 text-[#ffb4ab]'
                    }`}
                  >
                    {scenario === 'clean' ? 'GENUINE' : scenario === 'split' ? 'SPLIT' : 'ALTERED'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-label-caps text-label-caps text-[#869397] uppercase text-[9px]">
                  Attestation Status
                </span>
                <span
                  className={`font-mono-sm truncate ${
                    scenario === 'clean' ? 'text-[#bcc9cd]' : 'text-[#ffb4ab] font-medium'
                  }`}
                >
                  {scenario === 'clean'
                    ? '0x53dE...Simulated Node C'
                    : scenario === 'split'
                    ? 'Unreconciled Compiler Environment'
                    : 'Valid Sig, Incompatible Quorum'}
                </span>
              </div>
            </div>

            {scenario !== 'clean' && (
              <div className="p-space-xs rounded bg-[#93000a]/30 flex items-center justify-between text-[#ffdad6] mt-1 text-[11px] border border-[#ffb4ab]/20">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#ffb4ab]">
                    difference
                  </span>
                  <span className="font-mono-sm">
                    {scenario === 'split'
                      ? 'Compiler environment divergence (non-deterministic output)'
                      : '+1.4KB unauthorized telemetry injection hook'}
                  </span>
                </div>
                <span className="font-label-caps uppercase font-bold text-[#ffb4ab] text-[9px]">
                  TAMPER DETECTED
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gatekeeper Governance card */}
      <div className="rounded-xl bg-[#262a33] p-space-md md:p-space-lg flex flex-col gap-space-md shadow-md border border-[#31353e]">
        <div className="flex items-start justify-between flex-wrap gap-space-sm">
          <div className="flex flex-col">
            <span className="font-label-caps text-label-caps uppercase text-[#bcc9cd] text-[10px]">
              Gatekeeper Governance
            </span>
            <h3 className="font-headline-sm text-headline-sm text-[#dfe2ee] font-semibold">
              Quorum Consensus Enforcement Policy
            </h3>
          </div>

          <div
            className={`px-3 py-1.5 rounded-full font-mono-sm text-mono-sm font-bold flex items-center gap-1.5 shadow-sm text-[11px] ${
              scenario === 'clean'
                ? 'bg-[#06b6d4] text-[#003640]'
                : scenario === 'split'
                ? 'bg-[#571bc1] text-[#e9ddff]'
                : 'bg-[#93000a] text-[#ffdad6]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {scenario === 'clean' ? 'check_circle' : 'block'}
            </span>
            <span>
              {scenario === 'clean'
                ? 'CONSENSUS APPROVED & SIGNED'
                : scenario === 'split'
                ? 'FULL PIPELINE SHUTDOWN'
                : 'ROGUE ARTIFACT BLOCKED & REJECTED'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-xs font-mono-sm text-mono-sm text-[11px]">
          <div className="p-space-xs rounded bg-[#0a0e16] flex flex-col border border-[#181c24]">
            <span className="text-[#869397] font-label-caps text-[9px]">POLICY RULE</span>
            <span className="text-[#dfe2ee] font-medium">2 of 3 (66.7%) Consensus</span>
          </div>
          <div className="p-space-xs rounded bg-[#0a0e16] flex flex-col border border-[#181c24]">
            <span className="text-[#869397] font-label-caps text-[9px]">REPORTED DIGESTS</span>
            <span className="text-[#dfe2ee] font-medium">
              {scenario === 'clean'
                ? '3 Identical, 0 Rogue'
                : scenario === 'split'
                ? '3 Discordant Hashes'
                : '2 Identical, 1 Divergent'}
            </span>
          </div>
          <div className="p-space-xs rounded bg-[#0a0e16] flex flex-col border border-[#181c24]">
            <span className="text-[#869397] font-label-caps text-[9px]">AUTOMATED PIPELINE</span>
            <span
              className={`font-medium ${
                scenario === 'clean' ? 'text-[#4cd7f6]' : 'text-[#ffb4ab]'
              }`}
            >
              {scenario === 'clean'
                ? 'Deployment Pipeline Cleared'
                : 'Deployment Halted (Safe Isolation)'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-space-xs pt-space-xs">
          <button
            type="button"
            onClick={handleQuarantine}
            className={`flex-1 py-2 px-space-md rounded-xl font-headline-sm text-headline-sm font-medium flex items-center justify-center gap-1.5 transition-transform active:scale-95 text-[13px] border ${
              isQuarantined
                ? 'bg-[#93000a]/50 text-[#ffb4ab] border-[#ffb4ab]/50'
                : 'bg-[#93000a]/30 text-[#ffb4ab] hover:bg-[#93000a]/40 border-[#ffb4ab]/30'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">shield_person</span>
            <span>{isQuarantined ? 'Builder C Quarantined ✓' : 'Quarantine Builder C'}</span>
          </button>

          <button
            type="button"
            onClick={handlePublishWarning}
            className={`flex-1 py-2 px-space-md rounded-xl font-headline-sm text-headline-sm font-medium flex items-center justify-center gap-1.5 transition-transform active:scale-95 text-[13px] border ${
              isWarningPublished
                ? 'bg-[#571bc1]/40 text-[#d0bcff] border-[#d0bcff]/40'
                : 'bg-[#31353e] text-[#dfe2ee] hover:bg-[#353942] border-[#31353e]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">notification_important</span>
            <span>{isWarningPublished ? 'CVE Alert Published ✓' : 'Publish Supply Chain Warning'}</span>
          </button>

          <button
            type="button"
            onClick={scrollToDiff}
            className="flex-1 py-2 px-space-md rounded-xl bg-[#06b6d4] text-[#003640] hover:brightness-110 font-headline-sm text-headline-sm font-semibold flex items-center justify-center gap-1.5 transition-transform active:scale-95 text-[13px]"
          >
            <span className="material-symbols-outlined text-[20px]">terminal</span>
            <span>Inspect Binary Diff</span>
          </button>
        </div>
      </div>

      {/* Binary Assertion Diff Card */}
      <div
        ref={diffRef}
        className="rounded-xl bg-[#0a0e16] p-space-md flex flex-col gap-space-xs transition-all border border-[#262a33]"
      >
        <div className="flex items-center justify-between pb-space-xs border-b border-[#1c2028]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#4cd7f6]">data_object</span>
            <span className="font-headline-sm text-headline-sm text-[#dfe2ee] font-medium text-[15px]">
              Binary Assertion Diff
            </span>
          </div>
          <span className="font-mono-sm text-mono-sm text-[#bcc9cd] text-[11px]">
            libssl-transport.so.3 (Byte Offset: 0x4B20)
          </span>
        </div>

        <div className="rounded-lg bg-[#181c24] p-space-sm font-mono-sm text-mono-sm flex flex-col gap-1 overflow-x-auto text-[#dfe2ee] border border-[#262a33] text-[11px]">
          <div className="flex items-center gap-2 text-[#bcc9cd]">
            <span className="w-8 shrink-0 text-right text-[#869397]">0419</span>
            <span>&nbsp;&nbsp;OPENSSL_init_crypto(OPENSSL_INIT_LOAD_CONFIG, NULL);</span>
          </div>
          <div className="flex items-center gap-2 text-[#bcc9cd]">
            <span className="w-8 shrink-0 text-right text-[#869397]">0420</span>
            <span>&nbsp;&nbsp;ctx = SSL_CTX_new(TLS_client_method());</span>
          </div>
          <div className="flex items-center gap-2 p-1 rounded bg-[#93000a]/30 text-[#ffb4ab] border border-[#ffb4ab]/20">
            <span className="w-8 shrink-0 text-right font-bold text-[#ffb4ab]">0421+</span>
            <span className="font-bold">
              +&nbsp;pthread_create(&_th, NULL, __exfil_payload_telemetry, target_host);
            </span>
          </div>
          <div className="flex items-center gap-2 p-1 rounded bg-[#93000a]/30 text-[#ffb4ab] border border-[#ffb4ab]/20">
            <span className="w-8 shrink-0 text-right font-bold text-[#ffb4ab]">0422+</span>
            <span className="font-bold">
              +&nbsp;/* INJECTED HOOK: BYPASS INTEGRITY CHECKING FOR REMOTE BEACON */
            </span>
          </div>
          <div className="flex items-center gap-2 text-[#bcc9cd]">
            <span className="w-8 shrink-0 text-right text-[#869397]">0423</span>
            <span>&nbsp;&nbsp;return ctx;</span>
          </div>
        </div>
        <p className="font-body-sm text-body-sm text-[#bcc9cd] pt-1 text-[12px] leading-relaxed">
          The disassembled bytecode above reveals Builder C injected an unauthorized pthread worker function referencing a foreign host. Quorum policy (2/3) isolated and blocked the binary from distribution.
        </p>
      </div>
    </div>
  );
};
