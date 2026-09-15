import React, { createContext, useContext, useState } from 'react';
import type { 
  UserRole, 
  FeedConfig, 
  QuarantineRecord, 
  PipelineRun, 
  ReconciliationReport,
  FileArrival,
  SchemaDrift,
  FailureFingerprint,
  FeedReliabilityTrend,
  VarianceInvestigation,
  OpsIncidentAction
} from '../types';
import { 
  INITIAL_FEEDS, 
  MOCK_QUARANTINE_RECORDS, 
  MOCK_PIPELINE_RUNS, 
  MOCK_RECONCILIATIONS,
  MOCK_FILE_ARRIVALS,
  MOCK_SCHEMA_DRIFTS,
  MOCK_FAILURE_FINGERPRINTS,
  MOCK_RELIABILITY_TRENDS,
  MOCK_VARIANCES
} from '../data/mockData';

interface AppContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  phiMasked: boolean;
  setPhiMasked: (masked: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  feeds: FeedConfig[];
  addFeed: (newFeed: FeedConfig) => void;
  updateFeedStatus: (feedId: string, status: FeedConfig['status']) => void;
  quarantineRecords: QuarantineRecord[];
  resolveQuarantine: (id: string, action: 'Waived' | 'Corrected' | 'Reprocessed', updatedData?: Record<string, any>) => void;
  pipelineRuns: PipelineRun[];
  runPipeline: (feedId: string) => void;
  reconciliations: ReconciliationReport[];
  selectedFeedId: string | null;
  setSelectedFeedId: (id: string | null) => void;

  // --- Wave 2 Additions ---
  fileArrivals: FileArrival[];
  schemaDrifts: SchemaDrift[];
  failureFingerprints: FailureFingerprint[];
  reliabilityTrends: FeedReliabilityTrend[];
  variances: VarianceInvestigation[];
  incidentActions: OpsIncidentAction[];
  
  acknowledgeIncident: (incidentId: string) => void;
  assignIncidentOwner: (incidentId: string, owner: string) => void;
  pauseFeedIngestion: (feedId: string) => void;
  triggerBatchRetry: (batchId: string) => void;
  resolveSchemaDrift: (driftId: string, action: 'Accepted' | 'Rejected') => void;
  submitVarianceWaiver: (varianceId: string, notes: string, expiryDays: number) => void;
  reprocessBatchRecovery: (batchId: string, mode: 'restart' | 'reprocess' | 'backdate') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole>('ba');
  const [phiMasked, setPhiMasked] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('onboarding');
  const [feeds, setFeeds] = useState<FeedConfig[]>(INITIAL_FEEDS);
  const [quarantineRecords, setQuarantineRecords] = useState<QuarantineRecord[]>(MOCK_QUARANTINE_RECORDS);
  const [pipelineRuns, setPipelineRuns] = useState<PipelineRun[]>(MOCK_PIPELINE_RUNS);
  const [reconciliations, setReconciliations] = useState<ReconciliationReport[]>(MOCK_RECONCILIATIONS);
  const [selectedFeedId, setSelectedFeedId] = useState<string | null>('feed-001');

  // Wave 2 State
  const [fileArrivals] = useState<FileArrival[]>(MOCK_FILE_ARRIVALS);
  const [schemaDrifts, setSchemaDrifts] = useState<SchemaDrift[]>(MOCK_SCHEMA_DRIFTS);
  const [failureFingerprints, setFailureFingerprints] = useState<FailureFingerprint[]>(MOCK_FAILURE_FINGERPRINTS);
  const [reliabilityTrends] = useState<FeedReliabilityTrend[]>(MOCK_RELIABILITY_TRENDS);
  const [variances, setVariances] = useState<VarianceInvestigation[]>(MOCK_VARIANCES);
  const [incidentActions, setIncidentActions] = useState<OpsIncidentAction[]>([]);

  const addFeed = (newFeed: FeedConfig) => {
    setFeeds(prev => [newFeed, ...prev]);
  };

  const updateFeedStatus = (feedId: string, status: FeedConfig['status']) => {
    setFeeds(prev => prev.map(f => f.id === feedId ? { ...f, status, updatedDate: new Date().toISOString().split('T')[0] } : f));
  };

  const resolveQuarantine = (id: string, action: 'Waived' | 'Corrected' | 'Reprocessed', updatedData?: Record<string, any>) => {
    setQuarantineRecords(prev => prev.map(q => {
      if (q.id === id) {
        return {
          ...q,
          status: action,
          recordData: updatedData ? updatedData : q.recordData
        };
      }
      return q;
    }));
  };

  const runPipeline = (feedId: string) => {
    const feed = feeds.find(f => f.id === feedId);
    if (!feed) return;

    const newRunId = `run-${Math.floor(1000 + Math.random() * 9000)}`;
    const batchId = `BATCH-${new Date().toISOString().replace(/[-:T.]/g, '').substring(0, 12)}`;
    
    const newRun: PipelineRun = {
      id: newRunId,
      feedId: feed.id,
      feedName: feed.feedName,
      batchId: batchId,
      fileReceived: new Date().toLocaleString(),
      fileName: `${feed.feedCode.toLowerCase()}_sample.csv`,
      fileSizeBytes: 2450100,
      status: 'Success',
      currentStage: 'Silver ODS',
      stageStats: {
        'Landing': { stage: 'Landing', recordsIn: 5000, recordsOut: 5000, quarantined: 0, durationMs: 1200, status: 'completed' },
        'Bronze': { stage: 'Bronze', recordsIn: 5000, recordsOut: 5000, quarantined: 0, durationMs: 1800, status: 'completed' },
        'Silver Raw': { stage: 'Silver Raw', recordsIn: 5000, recordsOut: 4995, quarantined: 5, durationMs: 3400, status: 'completed' },
        'Identity Resolution': { stage: 'Identity Resolution', recordsIn: 4995, recordsOut: 4995, quarantined: 0, durationMs: 2900, status: 'completed' },
        'Silver ODS': { stage: 'Silver ODS', recordsIn: 4995, recordsOut: 4995, quarantined: 0, durationMs: 4100, status: 'completed' }
      },
      identityMatchesCount: 4920,
      unresolvedIdentitiesCount: 75,
      reconciliationStatus: 'Match',
      logTrace: [
        `File arrival detected for ${feed.feedName}`,
        `Landing Zone checksum validated`,
        `Bronze layer appended with metadata`,
        `Silver Raw schema enforcement executed (5 records quarantined)`,
        `Identity Resolution matched 4,920 member LinkIDs`,
        `Silver ODS canonical tables updated successfully`
      ],
      timestamp: new Date().toLocaleString()
    };

    setPipelineRuns(prev => [newRun, ...prev]);

    const newRecon: ReconciliationReport = {
      id: `recon-${Math.floor(100 + Math.random() * 900)}`,
      batchId: batchId,
      feedName: feed.feedName,
      timestamp: new Date().toLocaleString(),
      landingCount: 5000,
      bronzeCount: 5000,
      silverRawCount: 4995,
      silverOdsCount: 4995,
      quarantineCount: 5,
      varianceCount: 0,
      certificationStatus: 'Certified',
      certifiedBy: 'Automated Pipeline Engine'
    };

    setReconciliations(prev => [newRecon, ...prev]);
  };

  // --- Wave 2 Action Handlers ---

  const acknowledgeIncident = (incidentId: string) => {
    setFailureFingerprints(prev => prev.map(f => f.incidentId === incidentId ? { ...f, status: 'Resolved' } : f));
    const newAct: OpsIncidentAction = {
      id: `act-${Date.now()}`,
      incidentId,
      actionType: 'Acknowledge',
      actor: userRole.toUpperCase(),
      timestamp: new Date().toLocaleString(),
      notes: 'Acknowledged by operator.'
    };
    setIncidentActions(prev => [newAct, ...prev]);
  };

  const assignIncidentOwner = (incidentId: string, owner: string) => {
    const newAct: OpsIncidentAction = {
      id: `act-${Date.now()}`,
      incidentId,
      actionType: 'Assign',
      actor: userRole.toUpperCase(),
      timestamp: new Date().toLocaleString(),
      notes: `Assigned to ${owner}`
    };
    setIncidentActions(prev => [newAct, ...prev]);
  };

  const pauseFeedIngestion = (feedId: string) => {
    updateFeedStatus(feedId, 'Paused');
    const newAct: OpsIncidentAction = {
      id: `act-${Date.now()}`,
      incidentId: feedId,
      actionType: 'Pause Ingestion',
      actor: userRole.toUpperCase(),
      timestamp: new Date().toLocaleString(),
      notes: `Feed ${feedId} ingestion paused.`
    };
    setIncidentActions(prev => [newAct, ...prev]);
  };

  const triggerBatchRetry = (batchId: string) => {
    const newAct: OpsIncidentAction = {
      id: `act-${Date.now()}`,
      incidentId: batchId,
      actionType: 'Trigger Retry',
      actor: userRole.toUpperCase(),
      timestamp: new Date().toLocaleString(),
      notes: `Triggered idempotency retry for batch ${batchId}`
    };
    setIncidentActions(prev => [newAct, ...prev]);
  };

  const resolveSchemaDrift = (driftId: string, action: 'Accepted' | 'Rejected') => {
    setSchemaDrifts(prev => prev.map(sd => sd.id === driftId ? { ...sd, status: action } : sd));
  };

  const submitVarianceWaiver = (varianceId: string, notes: string, expiryDays: number) => {
    const expiryDate = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    setVariances(prev => prev.map(v => {
      if (v.id === varianceId) {
        return {
          ...v,
          status: 'Waived',
          justificationNotes: notes,
          waiverExpiryDate: expiryDate
        };
      }
      return v;
    }));

    // Update reconciliation certification status to Certified-with-Waiver
    setReconciliations(prev => prev.map(r => ({
      ...r,
      certificationStatus: 'Certified-with-Waiver',
      waiverReason: notes,
      waiverExpiryDate: expiryDate
    })));
  };

  const reprocessBatchRecovery = (batchId: string, mode: 'restart' | 'reprocess' | 'backdate') => {
    const newRunId = `run-rec-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRun: PipelineRun = {
      id: newRunId,
      feedId: 'feed-002',
      feedName: 'BCBS 837 Professional Claims Feed',
      batchId: `${batchId}-${mode.toUpperCase()}`,
      fileReceived: new Date().toLocaleString(),
      fileName: `recovered_${mode}_bcbs_claims.json`,
      fileSizeBytes: 18450100,
      status: 'Success',
      currentStage: 'Silver ODS',
      stageStats: {
        'Landing': { stage: 'Landing', recordsIn: 25000, recordsOut: 25000, quarantined: 0, durationMs: 2900, status: 'completed' },
        'Bronze': { stage: 'Bronze', recordsIn: 25000, recordsOut: 25000, quarantined: 0, durationMs: 3800, status: 'completed' },
        'Silver Raw': { stage: 'Silver Raw', recordsIn: 25000, recordsOut: 25000, quarantined: 0, durationMs: 6100, status: 'completed' },
        'Identity Resolution': { stage: 'Identity Resolution', recordsIn: 25000, recordsOut: 25000, quarantined: 0, durationMs: 5400, status: 'completed' },
        'Silver ODS': { stage: 'Silver ODS', recordsIn: 25000, recordsOut: 25000, quarantined: 0, durationMs: 8200, status: 'completed' }
      },
      identityMatchesCount: 25000,
      unresolvedIdentitiesCount: 0,
      reconciliationStatus: 'Match',
      logTrace: [
        `[RECOVERY ${mode.toUpperCase()}] Initiated for Batch ${batchId}`,
        `Idempotent state lock acquired — no duplicate records inserted`,
        `Re-executing Silver Raw DQ rules`,
        `Identity resolution crosswalk matched 25,000 member LinkIDs`,
        `Silver ODS canonical state successfully updated`
      ],
      timestamp: new Date().toLocaleString()
    };

    setPipelineRuns(prev => [newRun, ...prev]);
  };

  return (
    <AppContext.Provider value={{
      userRole,
      setUserRole,
      phiMasked,
      setPhiMasked,
      activeTab,
      setActiveTab,
      feeds,
      addFeed,
      updateFeedStatus,
      quarantineRecords,
      resolveQuarantine,
      pipelineRuns,
      runPipeline,
      reconciliations,
      selectedFeedId,
      setSelectedFeedId,

      fileArrivals,
      schemaDrifts,
      failureFingerprints,
      reliabilityTrends,
      variances,
      incidentActions,
      acknowledgeIncident,
      assignIncidentOwner,
      pauseFeedIngestion,
      triggerBatchRetry,
      resolveSchemaDrift,
      submitVarianceWaiver,
      reprocessBatchRecovery
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
