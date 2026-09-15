import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navigation } from './components/Navigation';
import { OnboardingWizard } from './components/OnboardingWizard/OnboardingWizard';
import { FeedRegistry } from './components/FeedRegistry/FeedRegistry';
import { PipelineEngine } from './components/PipelineEngine/PipelineEngine';
import { QuarantineCenter } from './components/QuarantineCenter/QuarantineCenter';
import { ObservabilityDashboard } from './components/Observability/ObservabilityDashboard';
import { ReconciliationReport } from './components/Reconciliation/ReconciliationReport';
import { DataCatalog } from './components/DataCatalog/DataCatalog';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <main className="pb-16">
      {activeTab === 'onboarding' && <OnboardingWizard />}
      {activeTab === 'registry' && <FeedRegistry />}
      {activeTab === 'pipeline' && <PipelineEngine />}
      {activeTab === 'quarantine' && <QuarantineCenter />}
      {activeTab === 'observability' && <ObservabilityDashboard />}
      {activeTab === 'reconciliation' && <ReconciliationReport />}
      {activeTab === 'catalog' && <DataCatalog />}
    </main>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
        <Navigation />
        <MainContent />

        {/* Footer */}
        <footer className="border-t border-slate-800/80 bg-slate-950 py-4 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
            <span>CINQFlow Platform &copy; 2026 CINQCARE Inc. All Rights Reserved.</span>
            <span>Landing Zone → Bronze → Silver Raw → Identity Resolution → Silver ODS</span>
          </div>
        </footer>
      </div>
    </AppProvider>
  );
};

export default App;
