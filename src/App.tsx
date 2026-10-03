/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BuilderNode, TabType, VerificationRecord } from './types/quorum';
import { INITIAL_BUILDERS, INITIAL_RECORDS } from './data/initialData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { ReleaseInspectorView } from './components/ReleaseInspectorView';
import { VerifyWizardView } from './components/VerifyWizardView';
import { TamperDemoView } from './components/TamperDemoView';
import { AttestationsHistoryView } from './components/AttestationsHistoryView';
import { DocsModal } from './components/DocsModal';
import { VerificationTestSuite } from './components/VerificationTestSuite';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [selectedRecord, setSelectedRecord] = useState<VerificationRecord | null>(null);
  const [isTestSuiteOpen, setIsTestSuiteOpen] = useState(false);
  const [records, setRecords] = useState<VerificationRecord[]>(() => {
    try {
      const saved = localStorage.getItem('quorum_records');
      if (saved) {
        const parsed: VerificationRecord[] = JSON.parse(saved);
        const hasCosign = parsed.some((r) => r.id === 'QRM-COSIGN-2.4.1-REPRO');
        if (!hasCosign && INITIAL_RECORDS.length > 0) {
          return [INITIAL_RECORDS[0], ...parsed];
        }
        return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_RECORDS;
  });

  const [builders] = useState<BuilderNode[]>(INITIAL_BUILDERS);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [wizardPreset, setWizardPreset] = useState<'cosign' | 'besu' | 'gateway' | 'ethereum' | 'transport'>('cosign');
  const [wizardDemoPath, setWizardDemoPath] = useState<'consensus' | 'divergent'>('consensus');
  const [wizardAutoRun, setWizardAutoRun] = useState<boolean>(false);

  // Sync records to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('quorum_records', JSON.stringify(records));
    } catch {
      // ignore
    }
  }, [records]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleSelectRecord = (record: VerificationRecord) => {
    setSelectedRecord(record);
    setIsTestSuiteOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLaunchRealPackageDemo = (path: 'consensus' | 'divergent', autoRun = true) => {
    setWizardPreset('cosign');
    setWizardDemoPath(path);
    setWizardAutoRun(autoRun);
    setSelectedRecord(null);
    setIsTestSuiteOpen(false);
    setActiveTab('verify');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (selectedRecord) {
      setSelectedRecord(null);
    } else if (isTestSuiteOpen) {
      setIsTestSuiteOpen(false);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab: TabType) => {
    setSelectedRecord(null);
    setIsTestSuiteOpen(false);
    if (tab === 'verify') {
      setWizardPreset('cosign');
      setWizardDemoPath('consensus');
      setWizardAutoRun(false);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewVerificationRecord = (newRecord: VerificationRecord) => {
    setRecords((prev) => [newRecord, ...prev]);
  };

  const isDetailView = selectedRecord !== null || isTestSuiteOpen;

  return (
    <div className="bg-[#0f131c] text-[#dfe2ee] flex flex-col min-h-screen selection:bg-[#06b6d4]/30 selection:text-[#4cd7f6]">
      {/* Top Fixed Header */}
      <Header
        showBack={isDetailView}
        onBack={handleBack}
        title={selectedRecord ? 'Release Inspector' : isTestSuiteOpen ? 'Verification Test Suite' : undefined}
        subtitle={selectedRecord ? 'QUORUM // PROVENANCE' : isTestSuiteOpen ? '14 DETERMINISTIC VALIDATIONS' : undefined}
        onOpenDocs={() => setIsDocsOpen(true)}
        onOpenTestSuite={() => {
          setSelectedRecord(null);
          setIsTestSuiteOpen(!isTestSuiteOpen);
        }}
        isTestSuiteOpen={isTestSuiteOpen}
      />

      {/* Main Content Area */}
      <main className="flex flex-col relative w-full pt-16 pb-20 bg-[#0f131c] flex-1 max-w-2xl mx-auto">
        {selectedRecord ? (
          <ReleaseInspectorView
            record={selectedRecord}
            onBack={() => setSelectedRecord(null)}
            showToast={showToast}
          />
        ) : isTestSuiteOpen ? (
          <VerificationTestSuite
            records={records}
            onClose={() => setIsTestSuiteOpen(false)}
            showToast={showToast}
          />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <DashboardView
                records={records}
                onStartVerify={() => {
                  setWizardPreset('cosign');
                  setWizardDemoPath('consensus');
                  setWizardAutoRun(false);
                  setActiveTab('verify');
                }}
                onOpenDocs={() => setIsDocsOpen(true)}
                onSelectTamperDemo={() => setActiveTab('tamper')}
                onSelectRecord={handleSelectRecord}
                onOpenTestSuite={() => setIsTestSuiteOpen(true)}
                onLaunchRealPackageDemo={handleLaunchRealPackageDemo}
                showToast={showToast}
              />
            )}

            {activeTab === 'releases' && (
              <AttestationsHistoryView
                records={records}
                builders={builders}
                onSelectRecord={handleSelectRecord}
                showToast={showToast}
              />
            )}

            {activeTab === 'verify' && (
              <VerifyWizardView
                initialPreset={wizardPreset}
                initialDemoPath={wizardDemoPath}
                autoRun={wizardAutoRun}
                onVerificationComplete={handleNewVerificationRecord}
                onInspectRecord={handleSelectRecord}
                onCancel={() => setActiveTab('dashboard')}
                showToast={showToast}
              />
            )}

            {activeTab === 'tamper' && <TamperDemoView showToast={showToast} />}

            {activeTab === 'attest' && (
              <AttestationsHistoryView
                records={records}
                builders={builders}
                onSelectRecord={handleSelectRecord}
                showToast={showToast}
              />
            )}
          </>
        )}
      </main>

      {/* Fixed Bottom Navigation */}
      <BottomNav
        activeTab={selectedRecord ? ('releases' as TabType) : isTestSuiteOpen ? ('dashboard' as TabType) : activeTab}
        onSelectTab={handleTabChange}
      />

      {/* Spec / Docs Modal */}
      <DocsModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
        onStartVerify={() => {
          setSelectedRecord(null);
          setIsTestSuiteOpen(false);
          setActiveTab('verify');
        }}
      />

      {/* Floating Global Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 max-w-sm w-11/12 bg-[#181c24] border border-[#4cd7f6]/50 text-[#dfe2ee] px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 font-mono-sm text-[12px] animate-bounce">
          <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">verified</span>
          <span className="flex-1 leading-snug">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-[#869397] hover:text-[#dfe2ee]"
          >
            <span className="material-symbols-outlined text-[14px]">close</span>
          </button>
        </div>
      )}
    </div>
  );
}
