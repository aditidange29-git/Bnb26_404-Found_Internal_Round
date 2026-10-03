/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartVerify: () => void;
}

export const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose, onStartVerify }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#181c24] border border-[#31353e] rounded-2xl max-w-lg w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#262a33] flex items-center justify-between bg-[#1c2028]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[22px]">menu_book</span>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-[#dfe2ee] font-semibold">
                Quorum Protocol Specification
              </h3>
              <p className="font-mono-sm text-[11px] text-[#bcc9cd]">SLSA Level 4 & Multi-Party Consensus</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#262a33] hover:bg-[#31353e] text-[#bcc9cd] hover:text-[#dfe2ee] flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 font-body-sm text-[#dfe2ee]/90">
          <div className="bg-[#0f131c] rounded-xl p-3.5 border border-[#262a33] space-y-2">
            <div className="flex items-center gap-2 text-[#4cd7f6] font-mono-sm uppercase tracking-wider font-semibold">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              The Core Thesis: Don't Trust the Binary
            </div>
            <p className="text-[13px] leading-relaxed text-[#bcc9cd]">
              Traditional software distribution assumes that when you download a package from NPM, PyPI, or GitHub Releases, the compiled binary was built from the open-source git commit claimed by the author. In reality, a single compromised CI runner or developer laptop can inject a backdoor into the released binary without touching the source repository (e.g., SolarWinds, XZ Utils).
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-headline-sm text-[15px] font-semibold text-[#dfe2ee] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6]"></span>
              The 6-Step Quorum Verification Workflow
            </h4>
            <div className="grid grid-cols-1 gap-2 font-mono-sm text-[12px]">
              <div className="p-2.5 rounded-lg bg-[#1c2028] border border-[#262a33] flex items-start gap-2.5">
                <span className="text-[#4cd7f6] font-bold">01</span>
                <div>
                  <strong className="text-[#dfe2ee]">Pinned Source Commit:</strong> The verification begins from an immutable Git tree SHA (e.g., <code className="text-[#4cd7f6]">c8812bf9</code>) rather than a mutable branch or floating tag.
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#1c2028] border border-[#262a33] flex items-start gap-2.5">
                <span className="text-[#4cd7f6] font-bold">02</span>
                <div>
                  <strong className="text-[#dfe2ee]">Independent Builder Enclaves:</strong> Independent cloud providers (AWS Nitro Enclaves, GCP Confidential VMs, Baremetal Intel SGX) receive the build manifest without network egress.
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#1c2028] border border-[#262a33] flex items-start gap-2.5">
                <span className="text-[#4cd7f6] font-bold">03</span>
                <div>
                  <strong className="text-[#dfe2ee]">Reproducible Builds:</strong> Toolchains enforce zero timestamps, fixed file paths, and deterministic compiler flags to achieve bit-for-bit parity.
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#1c2028] border border-[#262a33] flex items-start gap-2.5">
                <span className="text-[#4cd7f6] font-bold">04</span>
                <div>
                  <strong className="text-[#dfe2ee]">Artifact SHA-256 Calculation:</strong> Each isolated node computes a cryptographic digest of the built artifact bytecode.
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#1c2028] border border-[#262a33] flex items-start gap-2.5">
                <span className="text-[#4cd7f6] font-bold">05</span>
                <div>
                  <strong className="text-[#dfe2ee]">Signed Hardware Attestation:</strong> Enclaves sign the digest with their internal Ed25519 TPM keys, generating in-toto compatible proof statements.
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#1c2028] border border-[#262a33] flex items-start gap-2.5">
                <span className="text-[#4cd7f6] font-bold">06</span>
                <div>
                  <strong className="text-[#dfe2ee]">Quorum Policy Evaluation:</strong> The gatekeeper checks if <code className="text-[#4cd7f6]">M of N</code> (e.g. 2 of 3) builders produced identical digests with valid signatures.
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#1c2028] p-3 rounded-xl border border-[#262a33] space-y-1">
            <span className="font-label-caps uppercase text-[#4cd7f6]">Byzantine Fault Tolerance (BFT)</span>
            <p className="text-[12px] text-[#bcc9cd]">
              Even if an attacker compromises 1 builder or 1 cloud provider, the remaining honest enclave nodes outvote the rogue node, preventing the tampered package from reaching production registries.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#262a33] bg-[#1c2028] flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#262a33] hover:bg-[#31353e] text-[#dfe2ee] font-body-sm transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onStartVerify();
            }}
            className="px-4 py-2 rounded-lg bg-[#06b6d4] hover:brightness-110 text-[#003640] font-headline-sm text-[13px] font-semibold flex items-center gap-1.5 shadow-md transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">add_moderator</span>
            <span>Initiate Verification</span>
          </button>
        </div>
      </div>
    </div>
  );
};
