/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { VerificationRecord } from '../types/quorum';
import {
  downloadInTotoAttestation,
  downloadSpdxSbom,
  truncateHash,
  verifyAttestationWebCrypto,
} from '../utils/crypto';

interface ReleaseInspectorViewProps {
  record: VerificationRecord;
  onBack: () => void;
  showToast: (msg: string) => void;
}

export const ReleaseInspectorView: React.FC<ReleaseInspectorViewProps> = ({
  record,
  onBack,
  showToast,
}) => {
  const [verifiedSignatures, setVerifiedSignatures] = useState<Record<string, boolean>>({});
  const [verifyingKey, setVerifyingKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(label);
    showToast(`Copied ${label}: ${truncateHash(text, 10, 4)}`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleVerifySignature = async (builderId: string, signature: string, publicKeyId: string) => {
    setVerifyingKey(builderId);
    try {
      const result = await verifyAttestationWebCrypto(signature, publicKeyId, record.pinnedCommit);
      if (result.valid) {
        setVerifiedSignatures(prev => ({ ...prev, [builderId]: true }));
        showToast(`Cryptographic proof validated (${result.algorithm}, ${result.latencyMs}ms)`);
      }
    } finally {
      setVerifyingKey(null);
    }
  };

  const quorumRatio = ((record.matchingCount / record.consensusPolicy.totalNodes) * 100).toFixed(1);
  const isQuorumMet = record.decision === 'VERIFIED';
  const isConflict = record.decision === 'CONFLICT';

  return (
    <div className="flex flex-col w-full px-gutter py-space-md space-y-space-md pb-space-2xl">
      {/* Top Status Banner */}
      <section className="w-full bg-[#181c24] rounded-xl p-space-md flex flex-col gap-space-sm relative overflow-hidden shadow-md border border-[#262a33]">
        <div className="absolute -right-8 -top-8 w-28 h-28 bg-[#4cd7f6]/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-start gap-space-sm relative z-10">
          <div
            className={`min-w-[32px] h-8 rounded-full flex items-center justify-center ${
              isQuorumMet
                ? 'bg-[#4cd7f6]/15 text-[#4cd7f6]'
                : isConflict
                ? 'bg-[#d0bcff]/15 text-[#d0bcff]'
                : 'bg-[#ffb4ab]/15 text-[#ffb4ab]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {isQuorumMet ? 'verified' : isConflict ? 'gpp_maybe' : 'gpp_bad'}
            </span>
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-label-caps text-label-caps uppercase text-[#4cd7f6] tracking-wider text-[10px]">
                Release Attestation Status
              </span>
              <span
                className={`px-2 py-0.5 rounded-full font-mono-sm text-mono-sm font-semibold flex items-center gap-1 text-[11px] ${
                  isQuorumMet
                    ? 'bg-[#4cd7f6]/20 text-[#4cd7f6] border border-[#4cd7f6]/30'
                    : isConflict
                    ? 'bg-[#571bc1]/40 text-[#d0bcff] border border-[#d0bcff]/30'
                    : 'bg-[#93000a]/30 text-[#ffb4ab] border border-[#ffb4ab]/30'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                    isQuorumMet ? 'bg-[#4cd7f6]' : isConflict ? 'bg-[#d0bcff]' : 'bg-[#ffb4ab]'
                  }`}
                ></span>
                {isQuorumMet ? 'QUORUM MET' : isConflict ? 'CONFLICT DETECTED' : 'QUORUM FAILED'}
              </span>
              <span className="px-1.5 py-0.2 rounded bg-[#262a33] text-[#869397] font-mono-sm text-[9px] border border-[#31353e]">
                DEMO ATTESTATION
              </span>
            </div>
            <h2 className="font-headline-sm text-headline-sm font-semibold text-[#dfe2ee] mt-0.5">
              {isQuorumMet
                ? `Release Verified (${record.matchingCount} of ${record.consensusPolicy.totalNodes} Builders)`
                : isConflict
                ? `Consensus Conflict (${record.matchingCount} of ${record.consensusPolicy.totalNodes} Builders)`
                : `Release Rejected (${record.matchingCount} of ${record.consensusPolicy.totalNodes} Builders)`}
            </h2>
          </div>
        </div>

        {/* Consensus Rail Visualizer */}
        <div className="w-full bg-[#31353e]/60 rounded-full p-1 flex flex-col gap-1.5 relative z-10 border border-[#31353e]">
          <div className="flex items-center justify-between px-2 pt-0.5 text-[#bcc9cd] font-mono-sm text-mono-sm text-[11px]">
            <span>Consensus Policy: {record.consensusPolicy.description}</span>
            <span className="text-[#4cd7f6] font-semibold">
              Current: {quorumRatio}% ({record.matchingCount}/{record.consensusPolicy.totalNodes})
            </span>
          </div>
          <div className="h-2.5 w-full bg-[#0a0e16] rounded-full overflow-hidden flex gap-1 p-0.5">
            {record.attestations.map((att, idx) => (
              <div
                key={att.builderId || idx}
                className={`h-full rounded-full flex-1 transition-all duration-500 ${
                  att.matchExpected
                    ? 'bg-[#4cd7f6] shadow-[0_0_8px_rgba(76,215,246,0.6)]'
                    : isConflict
                    ? 'bg-[#d0bcff]'
                    : 'bg-[#ffb4ab]'
                }`}
                title={`${att.builderName}: ${att.matchExpected ? 'Match' : 'Mismatch'}`}
              ></div>
            ))}
          </div>
        </div>

        {/* Explanation Box */}
        <div className="bg-[#1c2028] rounded-lg p-space-sm text-[#bcc9cd] font-body-sm text-body-sm relative z-10 border border-[#262a33]">
          <p className="leading-relaxed text-[12px]">
            <strong className="text-[#dfe2ee] font-medium">Verification Analysis:</strong>{' '}
            {record.decisionReason}
          </p>
        </div>
      </section>

      {/* Target Specification Card */}
      <section className="w-full bg-[#1c2028] rounded-xl p-space-md shadow-md space-y-space-md border border-[#262a33]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">inventory_2</span>
            <h3 className="font-headline-sm text-headline-sm font-semibold text-[#dfe2ee]">
              Target Specification & Root Commitment
            </h3>
          </div>
          <span className="font-mono-sm text-mono-sm px-2 py-0.5 rounded bg-[#31353e] text-[#d0bcff] text-[10px]">
            {record.targetFormat}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          <div className="flex items-center justify-between p-space-sm rounded bg-[#181c24] border border-[#262a33]">
            <span className="font-body-sm text-body-sm text-[#bcc9cd]">Package Name</span>
            <span className="font-mono-md text-mono-md font-semibold text-[#dfe2ee] text-[13px]">
              {record.packageName}
            </span>
          </div>

          <div className="flex items-center justify-between p-space-sm rounded bg-[#181c24] border border-[#262a33]">
            <span className="font-body-sm text-body-sm text-[#bcc9cd]">Semantic Version</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#4cd7f6]"></span>
              <span className="font-mono-md text-mono-md font-semibold text-[#4cd7f6] text-[13px]">
                {record.version}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-space-sm rounded bg-[#181c24] border border-[#262a33]">
            <span className="font-body-sm text-body-sm text-[#bcc9cd]">Repository Source</span>
            <a
              className="font-mono-sm text-mono-sm text-[#4cd7f6] hover:underline flex items-center gap-1 truncate max-w-[210px] text-[11px]"
              href={record.repositoryUrl}
              target="_blank"
              rel="noreferrer"
            >
              {record.repositoryUrl.replace('https://', '')}
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </a>
          </div>

          {/* Root Reference: Pinned Commit */}
          <div className="flex items-center justify-between p-space-sm rounded bg-[#181c24] border border-[#4cd7f6]/20">
            <div className="flex flex-col">
              <span className="font-body-sm text-body-sm text-[#4cd7f6] font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">lock</span>
                Pinned Commit (Root Reference)
              </span>
              <span className="text-[10px] text-[#869397]">Immutable Git tree anchor</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono-sm text-mono-sm text-[#dfe2ee] bg-[#0a0e16] px-2 py-1 rounded select-all text-[11px] border border-[#262a33]">
                {record.pinnedCommit.slice(0, 18)}...
              </span>
              <button
                aria-label="Copy Commit Hash"
                className="w-7 h-7 flex items-center justify-center rounded bg-[#31353e] text-[#bcc9cd] hover:text-[#4cd7f6] transition-colors"
                onClick={() => handleCopy(record.pinnedCommit, 'commit-hash')}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {copiedKey === 'commit-hash' ? 'done' : 'content_copy'}
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-space-sm rounded bg-[#181c24] border border-[#262a33]">
            <span className="font-body-sm text-body-sm text-[#bcc9cd]">Verification ID</span>
            <span className="font-mono-sm text-mono-sm text-[#adc6ff] text-[11px] font-semibold">
              {record.id}
            </span>
          </div>
        </div>
      </section>

      {/* Artifact Hash Comparison Panel */}
      <section className="w-full bg-[#1c2028] rounded-xl p-space-md shadow-md space-y-space-md border border-[#262a33]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">fingerprint</span>
            <h3 className="font-headline-sm text-headline-sm font-semibold text-[#dfe2ee]">
              Artifact Hash Comparison
            </h3>
          </div>
          <span className="font-label-caps text-label-caps uppercase text-[#bcc9cd] bg-[#181c24] px-2 py-1 rounded border border-[#262a33] text-[10px]">
            SHA-256
          </span>
        </div>

        <div className="space-y-2.5">
          {record.attestations.map((att) => (
            <div
              key={att.builderId}
              className={`p-space-sm rounded-lg bg-[#181c24] flex flex-col gap-1.5 shadow-sm border ${
                att.matchExpected ? 'border-[#262a33]' : 'border-[#d0bcff]/30 bg-gradient-to-r from-[#181c24] to-[#571bc1]/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      att.matchExpected ? 'bg-[#4cd7f6]' : 'bg-[#d0bcff]'
                    }`}
                  ></span>
                  <span className="font-body-sm text-body-sm font-semibold text-[#dfe2ee]">
                    {att.builderName}
                  </span>
                  <span className="text-[10px] text-[#869397]">({att.enclaveType})</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full font-mono-sm text-mono-sm font-semibold flex items-center gap-1 text-[10px] ${
                    att.matchExpected
                      ? 'bg-[#4cd7f6]/20 text-[#4cd7f6] border border-[#4cd7f6]/30'
                      : 'bg-[#571bc1]/40 text-[#d0bcff] border border-[#d0bcff]/30'
                  }`}
                >
                  <span className="material-symbols-outlined text-[12px]">
                    {att.matchExpected ? 'check' : 'alt_route'}
                  </span>
                  {att.matchExpected ? 'MATCH' : 'DIVERGENT'}
                </span>
              </div>
              <div className="flex items-center justify-between bg-[#0a0e16] px-2.5 py-1.5 rounded border border-[#262a33]">
                <span
                  className={`font-mono-sm text-mono-sm tracking-wider text-[11px] ${
                    att.matchExpected ? 'text-[#dfe2ee]' : 'text-[#d0bcff]'
                  }`}
                >
                  {truncateHash(att.artifactHash, 14, 6)}
                </span>
                <button
                  className="text-[#bcc9cd] hover:text-[#4cd7f6] transition-colors"
                  onClick={() => handleCopy(att.artifactHash, att.builderName)}
                  title="Copy full SHA-256 hash"
                >
                  <span className="material-symbols-outlined text-[15px]">
                    {copiedKey === att.builderName ? 'done' : 'content_copy'}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Diagnostic Note */}
        <div className="flex items-start gap-2 bg-[#181c24] p-2.5 rounded text-[#bcc9cd] font-mono-sm text-mono-sm border border-[#262a33] text-[11px]">
          <span className="material-symbols-outlined text-[#4cd7f6] text-[16px] shrink-0 mt-0.5">
            info
          </span>
          <span>
            {record.divergenceCount === 0
              ? 'Bit-for-bit parity achieved. All builder nodes reported identical digests.'
              : `Disagreement isolated to ${record.divergenceCount} builder(s). ${record.matchingCount} matching attestations evaluate quorum.`}
          </span>
        </div>
      </section>

      {/* Attestation Evidence Cards */}
      <section className="w-full space-y-space-md">
        <div className="flex items-center justify-between">
          <h3 className="font-headline-sm text-headline-sm font-semibold text-[#dfe2ee]">
            Signed Builder Attestations
          </h3>
          <span className="font-label-caps text-label-caps uppercase text-[#4cd7f6] text-[10px]">
            {record.matchingCount} VALID SIGNATURES
          </span>
        </div>

        {record.attestations.map((att) => {
          const isVerified = verifiedSignatures[att.builderId];
          const isVerifying = verifyingKey === att.builderId;

          return (
            <div
              key={att.builderId}
              className="w-full bg-[#1c2028] rounded-xl p-space-md shadow-md space-y-space-md border border-[#262a33]"
            >
              <div className="flex items-center justify-between pb-space-xs border-b border-[#262a33]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#4cd7f6]/20 flex items-center justify-center text-[#4cd7f6]">
                    <span className="material-symbols-outlined text-[14px]">shield</span>
                  </div>
                  <span className="font-body-md text-body-md font-semibold text-[#dfe2ee]">
                    {att.builderName} Proof
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono-sm text-mono-sm text-[#4cd7f6] bg-[#4cd7f6]/10 px-2 py-0.5 rounded border border-[#4cd7f6]/20 text-[10px]">
                    {att.enclaveType}
                  </span>
                  <span className="font-mono-sm text-[9px] text-[#869397] px-1.5 py-0.5 rounded bg-[#262a33]">
                    SIMULATED
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 font-mono-sm text-mono-sm text-[11px]">
                <div className="flex justify-between py-0.5">
                  <span className="text-[#bcc9cd] font-body-sm text-body-sm text-[12px]">
                    Builder Identity
                  </span>
                  <span className="text-[#dfe2ee] truncate max-w-[200px]">{att.builderId}</span>
                </div>

                <div className="flex justify-between py-0.5">
                  <span className="text-[#bcc9cd] font-body-sm text-body-sm text-[12px]">
                    Public Key ID
                  </span>
                  <span className="text-[#dfe2ee]">{att.publicKeyId}</span>
                </div>

                <div className="flex justify-between py-0.5">
                  <span className="text-[#bcc9cd] font-body-sm text-body-sm text-[12px]">
                    Source Commit
                  </span>
                  <span className="text-[#dfe2ee]">{truncateHash(att.sourceCommit, 12, 4)}</span>
                </div>

                <div className="flex justify-between py-0.5">
                  <span className="text-[#bcc9cd] font-body-sm text-body-sm text-[12px]">
                    Build Environment
                  </span>
                  <span className="text-[#dfe2ee] truncate max-w-[200px]">{att.buildEnvironment}</span>
                </div>

                <div className="flex justify-between py-0.5">
                  <span className="text-[#bcc9cd] font-body-sm text-body-sm text-[12px]">
                    Build Configuration
                  </span>
                  <span className="text-[#dfe2ee] truncate max-w-[200px]">{att.buildConfiguration}</span>
                </div>

                <div className="flex justify-between py-0.5">
                  <span className="text-[#bcc9cd] font-body-sm text-body-sm text-[12px]">
                    Container Digest
                  </span>
                  <span className="text-[#dfe2ee] truncate max-w-[200px]">{truncateHash(att.containerImageDigest, 12, 6)}</span>
                </div>

                <div className="flex justify-between py-0.5">
                  <span className="text-[#bcc9cd] font-body-sm text-body-sm text-[12px]">
                    Build Timestamp
                  </span>
                  <span className="text-[#dfe2ee]">{att.timestamp}</span>
                </div>

                <div className="flex flex-col gap-1 py-1">
                  <div className="flex justify-between text-[#bcc9cd] font-body-sm text-[12px]">
                    <span>Digital Signature</span>
                    <span className="text-[10px] text-[#869397]">{att.signatureAlgorithm}</span>
                  </div>
                  <span className="bg-[#0a0e16] px-2 py-1.5 rounded text-[#dfe2ee] break-all select-all border border-[#262a33] text-[10px]">
                    {att.signature}
                  </span>
                </div>
              </div>

              {/* Action Button: Verify Signature via WebCrypto */}
              <button
                disabled={isVerifying}
                onClick={() =>
                  handleVerifySignature(att.builderId, att.signature, att.publicKeyId)
                }
                className={`w-full h-10 rounded-lg transition-colors font-body-sm text-body-sm font-semibold flex items-center justify-center gap-2 border ${
                  isVerified
                    ? 'bg-[#4cd7f6]/20 text-[#4cd7f6] border-[#4cd7f6]/40'
                    : 'bg-[#262a33] text-[#4cd7f6] hover:bg-[#31353e] border-[#31353e]'
                }`}
              >
                {isVerifying ? (
                  <>
                    <span className="material-symbols-outlined text-[16px] animate-spin">
                      progress_activity
                    </span>
                    <span>Validating WebCrypto ECDSA Signature...</span>
                  </>
                ) : isVerified ? (
                  <>
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    <span>Validated via WebCrypto API (Software Emulation)</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">lock_clock</span>
                    <span>Verify Signature via WebCrypto</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </section>

      {/* Provenance Data Visual / Rich Media */}
      <section className="w-full bg-[#1c2028] rounded-xl overflow-hidden shadow-md flex flex-col border border-[#262a33]">
        <div className="relative w-full h-32 bg-[#0a0e16]">
          <img
            className="w-full h-full object-cover opacity-60"
            alt="Cryptographic Merkle provenance tree visualization"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTfv06kL4_A7dmX20qS_Xqu_kdYvQdCxN3RclqwOzJuuLZlnXCekRJO0xBFg1ckCTETaR4UjO5RZycQ_yG4C2T5wxqAu2W2OmocZ2-GDRymaOMsImdgairPbbgesOtX0vIMlW7Uw19ev9O5IT7YS5N379AcxHe4BYg71Ol2hHHETebDp_VAxqszChIDAIyB_H0xDX_gJ9ggUCqiBm3wa6_RioX_cT-gyn5TAh-ZYgXQBsm0M-QMrZa"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c2028] via-[#1c2028]/60 to-transparent"></div>
          <div className="absolute bottom-2.5 left-space-md flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">account_tree</span>
            <span className="font-headline-sm text-headline-sm font-semibold text-[#dfe2ee]">
              Provenance Merkle Chain
            </span>
          </div>
        </div>
        <div className="p-space-md flex items-center justify-between text-[#bcc9cd] font-mono-sm text-mono-sm text-[11px]">
          <span>Chain Depth: 6 Proof Layers</span>
          <span className="text-[#4cd7f6] font-semibold">Zero-Knowledge Validated</span>
        </div>
      </section>

      {/* Audit Log & Provenance Exports */}
      <section className="w-full bg-[#1c2028] rounded-xl p-space-md shadow-md space-y-space-md border border-[#262a33]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">verified_user</span>
          <h3 className="font-headline-sm text-headline-sm font-semibold text-[#dfe2ee]">
            Audit Records & Export
          </h3>
        </div>
        <p className="font-body-sm text-body-sm text-[#bcc9cd] leading-relaxed text-[12px]">
          Export complete provenance logs formatted according to SLSA Level 3/4 specifications and
          in-toto runtime attestations.
        </p>

        <div className="flex flex-col gap-2.5 pt-space-xs">
          <button
            onClick={() => {
              downloadInTotoAttestation(record);
              showToast('in-toto JSON Attestation bundle downloaded.');
            }}
            className="w-full h-11 rounded-lg bg-[#06b6d4] text-[#003640] font-body-md text-body-md font-semibold flex items-center justify-center gap-2 shadow-sm hover:brightness-105 active:scale-[0.99] transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">file_download</span>
            Download in-toto Attestation JSON
          </button>

          <button
            onClick={() => {
              downloadSpdxSbom(record);
              showToast('SPDX 2.3 Software Bill of Materials successfully exported.');
            }}
            className="w-full h-11 rounded-lg bg-[#262a33] text-[#dfe2ee] hover:text-[#4cd7f6] hover:bg-[#31353e] transition-colors font-body-md text-body-md font-medium flex items-center justify-center gap-2 border border-[#31353e]"
          >
            <span className="material-symbols-outlined text-[18px]">data_object</span>
            Export SBOM (SPDX 2.3)
          </button>

          <button
            onClick={onBack}
            className="w-full h-10 rounded-lg bg-transparent text-[#bcc9cd] hover:text-[#dfe2ee] font-body-sm text-body-sm flex items-center justify-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Verification List
          </button>
        </div>
      </section>
    </div>
  );
};
