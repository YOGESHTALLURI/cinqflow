export interface VeratoRequestLog {
  id: string;
  batchId: string;
  memberId: string;
  rawPayload: any;
  requestHash: string;
  responseHash: string;
  status: 'RESOLVED' | 'UNRESOLVED' | 'RETRY_EXHAUSTED' | 'TRANSIENT_FAILURE';
  resolvedLinkId?: string;
  confidenceScore: number;
  retryCount: number;
  timestamp: string;
}

export interface IdentityException {
  id: string;
  personName: string;
  dob: string;
  ssnMasked: string;
  occurrencesCount: number;
  affectedBatches: string[];
  primaryReason: string;
  assignedSteward?: string;
  agingDays: number;
  slaStatus: 'ON_TRACK' | 'WARNING' | 'ESCALATED';
  status: 'OPEN' | 'IN_REVIEW' | 'REMEDIATED' | 'REJECTED';
}

export interface MergeSplitEvidenceCard {
  id: string;
  type: 'MERGE_PROPOSAL' | 'SPLIT_PROPOSAL';
  targetLinkId: string;
  sourceRecordA: {
    source: string;
    localId: string;
    name: string;
    dob: string;
    address: string;
    zip: string;
  };
  sourceRecordB: {
    source: string;
    localId: string;
    name: string;
    dob: string;
    address: string;
    zip: string;
  };
  demographicMatchScore: number;
  aiEvidenceSummary: string;
  consequencePreview: {
    addressesRepointed: number;
    claimsRelinked: number;
    duplicateProfilesCollapsed: number;
    impactedPayerFeeds: string[];
  };
  decisionState: 'PENDING_HUMAN_APPROVAL' | 'APPROVED_BY_STEWARD' | 'REJECTED_BY_STEWARD';
  reviewedBy?: string;
  reviewedAt?: string;
  verificationMatchPercent?: number;
}

export interface IdentityTelemetry {
  date: string;
  submittedCount: number;
  resolvedCount: number;
  unresolvedCount: number;
  failedRetryCount: number;
  fidelisBothKeysCoveragePct: number;
  optumBothKeysCoveragePct: number;
  molinaBothKeysCoveragePct: number;
  cutoverReadinessScore: number;
}

export interface CanonicalODSModel {
  version: string;
  domain: string; // Member, Claim, Provider, Encounter
  tableName: string;
  surrogateKeyName: string;
  sourceKeyName: string;
  status: 'DRAFT' | 'ACTIVE_VERSION' | 'DEPRECATED';
  createdAt: string;
  columnsCount: number;
  downstreamConsumerCount: number;
  changesSummary: string;
  certificationStatus: 'CERTIFIED' | 'RELATIONAL_ORPHANS_DETECTED' | 'UNTESTED';
}

export interface ComplexFormatNode {
  path: string;
  name: string;
  type: 'OBJECT' | 'ARRAY' | 'STRING' | 'NUMBER';
  fillRatePct: number;
  repeatingCountRange?: string;
  children?: ComplexFormatNode[];
}

export interface NettedFinancialPack {
  batchId: string;
  payerName: string;
  monthYear: string;
  originalPaidAmount: number;
  adjustmentAmount: number;
  cancellationAmount: number;
  netReconciledBilled: number;
  controlTotalBilled: number;
  dollarVariance: number;
  status: 'MATCHED_ZERO_VARIANCE' | 'VARIANCE_FLAGGED';
}

export interface SetWiseMemberCheck {
  batchId: string;
  totalIncomingMembers: number;
  totalOdsMembers: number;
  matchedCount: number;
  missingInOdsSet: string[]; // Member IDs present in source but missing in ODS
  extraInOdsSet: string[];   // Member IDs in ODS but missing in source
  discrepancyReason: string;
}
