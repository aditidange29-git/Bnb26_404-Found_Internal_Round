/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface HeaderProps {
  onBack?: () => void;
  showBack?: boolean;
  title?: string;
  subtitle?: string;
  onOpenDocs?: () => void;
  onOpenTestSuite?: () => void;
  isTestSuiteOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onBack,
  showBack = false,
  title,
  subtitle,
  onOpenTestSuite,
  isTestSuiteOpen = false,
}) => {
  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-[#0f131c]/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#1c2028]">
      <div className="h-16 px-gutter flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
          {showBack && (
            <button
              aria-label="Go back"
              className="min-w-[44px] min-h-[44px] -ml-2 flex items-center justify-center text-[#dfe2ee] hover:text-[#4cd7f6] transition-colors"
              onClick={onBack}
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back_ios_new</span>
            </button>
          )}

          {/* Inline SVG logo — no external dependency */}
          <svg
            aria-label="Quorum Hexagonal Verification Logo"
            className="h-8 w-8 cursor-pointer shrink-0"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={onBack}
          >
            {/* Hexagon outline */}
            <polygon
              points="16,2 28,9 28,23 16,30 4,23 4,9"
              stroke="#4cd7f6"
              strokeWidth="1.5"
              fill="#06b6d4"
              fillOpacity="0.15"
            />
            {/* Inner check/shield mark */}
            <polyline
              points="11,16 14.5,20 21,12"
              stroke="#4cd7f6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <div className="flex flex-col">
            {title ? (
              <>
                <h1 className="font-headline-sm text-headline-sm font-semibold tracking-tight text-[#dfe2ee] truncate max-w-[200px]">
                  {title}
                </h1>
                <span className="font-label-caps text-label-caps uppercase text-[#bcc9cd] tracking-wider">
                  {subtitle || 'QUORUM // PROVENANCE'}
                </span>
              </>
            ) : (
              <>
                <div className="flex items-center gap-space-xs">
                  <span className="font-headline-sm text-headline-sm font-semibold tracking-tight text-[#dfe2ee] leading-none">
                    QUORUM
                  </span>
                  <span className="font-label-caps text-label-caps uppercase px-1 py-0.5 rounded bg-[#262a33] text-[#4cd7f6] tracking-widest text-[9px]">
                    v2.4-mainnet
                  </span>
                </div>
                <span className="font-label-caps text-label-caps uppercase text-[#bcc9cd] tracking-wider text-[10px]">
                  SUPPLY CHAIN VERIFIER
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-space-sm sm:gap-space-md">
          {onOpenTestSuite && (
            <button
              onClick={onOpenTestSuite}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono-sm text-[11px] transition-all border active:scale-95 ${
                isTestSuiteOpen
                  ? 'bg-[#06b6d4] text-[#003640] border-[#4cd7f6] font-semibold shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                  : 'bg-[#181c24] text-[#4cd7f6] hover:bg-[#262a33] border-[#4cd7f6]/40'
              }`}
              title="Verification Test Suite (14 Tests)"
            >
              <span className="material-symbols-outlined text-[15px]">fact_check</span>
              <span className="hidden xs:inline">Test Suite</span>
              <span className={`px-1 py-0.2 rounded-full text-[9px] font-bold ${isTestSuiteOpen ? 'bg-black/20 text-[#003640]' : 'bg-[#4cd7f6]/20 text-[#4cd7f6]'}`}>
                14/14
              </span>
            </button>
          )}

          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#181c24] border border-[#262a33]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4cd7f6] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4cd7f6]"></span>
            </span>
            <span className="font-mono-sm text-mono-sm text-[#bcc9cd] font-medium hidden xs:inline">
              12 Nodes
            </span>
            <span className="font-mono-sm text-mono-sm text-[#4cd7f6] font-semibold text-[10px] uppercase">
              SYNCED
            </span>
          </div>

          <div className="relative flex items-center justify-center">
            <div
              aria-label="User profile"
              className="w-8 h-8 rounded-full bg-[#262a33] ring-1 ring-[#4cd7f6]/40 flex items-center justify-center text-[#4cd7f6] font-semibold text-[12px] select-none"
            >
              Q
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#4cd7f6] rounded-full ring-2 ring-[#0f131c]"></span>
          </div>
        </div>
      </div>
    </header>
  );
};
