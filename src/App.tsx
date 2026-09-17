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

// Wave 3 Components
import { VeratoIdentityCenter } from './components/Wave3/VeratoIdentityCenter';
import { IdentityExceptionQueue } from './components/Wave3/IdentityExceptionQueue';
import { MergeSplitEvidenceStudio } from './components/Wave3/MergeSplitEvidenceStudio';
import { IdentityCutoverTelemetry } from './components/Wave3/IdentityCutoverTelemetry';
import { CanonicalModelStudio } from './components/Wave3/CanonicalModelStudio';
import { ComplexFormatStudio } from './components/Wave3/ComplexFormatStudio';
import { FinancialMemberReconciliationPacks } from './components/Wave3/FinancialMemberReconciliationPacks';

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

      {/* Group 5: Identity & Canonical Suite (Wave 3) */}
      {activeTab === 'verato-identity' && <VeratoIdentityCenter />}
      {activeTab === 'identity-exceptions' && <IdentityExceptionQueue />}
      {activeTab === 'merge-split-cards' && <MergeSplitEvidenceStudio />}
      {activeTab === 'identity-telemetry' && <IdentityCutoverTelemetry />}
      {activeTab === 'canonical-model' && <CanonicalModelStudio />}
      {activeTab === 'complex-formats' && <ComplexFormatStudio />}
      {activeTab === 'financial-packs' && <FinancialMemberReconciliationPacks />}
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
