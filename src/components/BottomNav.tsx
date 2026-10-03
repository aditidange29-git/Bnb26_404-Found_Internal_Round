/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TabType } from '../types/quorum';

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  return (
    <nav
      className="fixed bottom-0 w-full z-50 pb-safe bg-[#0f131c]/90 backdrop-blur-xl border-t border-[#1c2028] shadow-[0_-4px_16px_rgba(0,0,0,0.5)]"
      aria-label="Application navigation"
    >
      <div className="flex justify-between items-center h-16 px-space-xs max-w-xl mx-auto">
        {/* Tab 1: Dashboard */}
        <button
          type="button"
          onClick={() => onSelectTab('dashboard')}
          className={`flex-1 flex flex-col items-center justify-center h-full min-w-[44px] min-h-[44px] transition-colors ${
            activeTab === 'dashboard' ? 'text-[#4cd7f6] font-medium' : 'text-[#bcc9cd] hover:text-[#dfe2ee]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">grid_view</span>
          <span className="font-mono-sm text-mono-sm mt-0.5 text-[10px]">Dashboard</span>
        </button>

        {/* Tab 2: Releases */}
        <button
          type="button"
          onClick={() => onSelectTab('releases')}
          className={`flex-1 flex flex-col items-center justify-center h-full min-w-[44px] min-h-[44px] transition-colors ${
            activeTab === 'releases' ? 'text-[#4cd7f6] font-medium' : 'text-[#bcc9cd] hover:text-[#dfe2ee]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">layers</span>
          <span className="font-mono-sm text-mono-sm mt-0.5 text-[10px]">Releases</span>
        </button>

        {/* Tab 3: Center Elevated Verify Action */}
        <button
          type="button"
          onClick={() => onSelectTab('verify')}
          className="flex-1 flex flex-col items-center justify-center h-full min-w-[44px] min-h-[44px] group"
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 ${
              activeTab === 'verify'
                ? 'bg-[#06b6d4] text-[#003640] shadow-[0_0_16px_rgba(6,182,212,0.6)] scale-105'
                : 'bg-[#06b6d4]/90 text-[#003640] shadow-[0_0_12px_rgba(6,182,212,0.3)] group-hover:brightness-110'
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">add_moderator</span>
          </div>
          <span className="font-mono-sm text-mono-sm text-[#4cd7f6] mt-0.5 font-medium text-[10px]">
            Verify
          </span>
        </button>

        {/* Tab 4: Tamper Demo */}
        <button
          type="button"
          onClick={() => onSelectTab('tamper')}
          className={`flex-1 flex flex-col items-center justify-center h-full min-w-[44px] min-h-[44px] transition-colors relative ${
            activeTab === 'tamper' ? 'text-[#4cd7f6] font-medium' : 'text-[#bcc9cd] hover:text-[#dfe2ee]'
          }`}
        >
          <div className="relative">
            <span className={`material-symbols-outlined text-[20px] ${activeTab === 'tamper' ? 'text-[#ffb4ab]' : 'text-[#ffb4ab]/80'}`}>
              gpp_maybe
            </span>
            <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded bg-[#93000a]/50 border border-[#ffb4ab]/30 text-[#ffb4ab] font-label-caps text-[8px] uppercase font-bold tracking-tight">
              DEMO
            </span>
          </div>
          <span className="font-mono-sm text-mono-sm mt-0.5 text-[10px]">Tamper</span>
        </button>

        {/* Tab 5: Attest / Audit */}
        <button
          type="button"
          onClick={() => onSelectTab('attest')}
          className={`flex-1 flex flex-col items-center justify-center h-full min-w-[44px] min-h-[44px] transition-colors ${
            activeTab === 'attest' ? 'text-[#4cd7f6] font-medium' : 'text-[#bcc9cd] hover:text-[#dfe2ee]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">verified_user</span>
          <span className="font-mono-sm text-mono-sm mt-0.5 text-[10px]">Attest</span>
        </button>
      </div>
    </nav>
  );
};
