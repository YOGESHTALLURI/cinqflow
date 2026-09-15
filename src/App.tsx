import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { OnboardingWizard } from './components/OnboardingWizard/OnboardingWizard';
import { FeedRegistry } from './components/FeedRegistry/FeedRegistry';
import { PipelineEngine } from './components/PipelineEngine/PipelineEngine';
import { QuarantineCenter } from './components/QuarantineCenter/QuarantineCenter';
import { ObservabilityDashboard } from './components/Observability/ObservabilityDashboard';
import { ReconciliationReport } from './components/Reconciliation/ReconciliationReport';
import { DataCatalog } from './components/DataCatalog/DataCatalog';

// Wave 2 Components
import { FileArrivalBoard } from './components/Operations/FileArrivalBoard';
import { OperationsControlCenter } from './components/Operations/OperationsControlCenter';
import { SchemaDriftInspector } from './components/Operations/SchemaDriftInspector';
import { VarianceWaiverWorkstation } from './components/Operations/VarianceWaiverWorkstation';
import { SidebarNavigation } from './components/SidebarNavigation';

const ActiveView: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <>
      {/* Group 1: Ingestion & Onboarding */}
      {activeTab === 'onboarding' && <OnboardingWizard />}
      {activeTab === 'registry' && <FeedRegistry />}

      {/* Group 2: Pipeline & Data Quality */}
      {activeTab === 'pipeline' && <PipelineEngine />}
      {activeTab === 'quarantine' && <QuarantineCenter />}

      {/* Group 3: Operations & Reliability (Wave 2) */}
      {activeTab === 'file-arrivals' && <FileArrivalBoard />}
      {activeTab === 'ops-control' && <OperationsControlCenter />}
      {activeTab === 'schema-drift' && <SchemaDriftInspector />}

      {/* Group 4: Governance & Reconciliation */}
      {activeTab === 'variance-waivers' && <VarianceWaiverWorkstation />}
      {activeTab === 'observability' && <ObservabilityDashboard />}
      {activeTab === 'reconciliation' && <ReconciliationReport />}
      {activeTab === 'catalog' && <DataCatalog />}
    </>
  );
};

export const AppContent: React.FC = () => {
  return (
    <SidebarNavigation>
      <ActiveView />
    </SidebarNavigation>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
