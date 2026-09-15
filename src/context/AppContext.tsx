import React, { createContext, useContext, useState } from 'react';
import type { UserRole, FeedConfig, QuarantineRecord, PipelineRun, ReconciliationReport } from '../types';
import { INITIAL_FEEDS, MOCK_QUARANTINE_RECORDS, MOCK_PIPELINE_RUNS, MOCK_RECONCILIATIONS } from '../data/mockData';

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

    // Add reconciliation
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
      setSelectedFeedId
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
