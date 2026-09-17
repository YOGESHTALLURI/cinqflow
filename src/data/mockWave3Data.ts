import type {
  VeratoRequestLog,
  IdentityException,
  MergeSplitEvidenceCard,
  IdentityTelemetry,
  CanonicalODSModel,
  ComplexFormatNode,
  NettedFinancialPack,
  SetWiseMemberCheck
} from '../types/wave3';

export const MOCK_VERATO_REQUESTS: VeratoRequestLog[] = [
  {
    id: 'VER-REQ-901',
    batchId: 'BATCH-20260917-001',
    memberId: 'MBR-AET-9001',
    rawPayload: { firstName: 'ROBERT', lastName: 'TAYLOR', dob: '1985-04-12', zip: '10001' },
    requestHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    responseHash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    status: 'RESOLVED',
    resolvedLinkId: 'LINK-88392',
    confidenceScore: 98.4,
    retryCount: 0,
    timestamp: '2026-09-17T04:15:22Z'
  },
  {
    id: 'VER-REQ-902',
    batchId: 'BATCH-20260917-001',
    memberId: 'MBR-BCBS-4420',
    rawPayload: { firstName: 'BOB', lastName: 'SMITH', dob: '1985-04-12', zip: '10001' },
    requestHash: 'a7c93e43b123901b802a43fe91a08272f1092837461928471928374619283746',
    responseHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    status: 'RESOLVED',
    resolvedLinkId: 'LINK-88392',
    confidenceScore: 96.5,
    retryCount: 1,
    timestamp: '2026-09-17T04:15:28Z'
  },
  {
    id: 'VER-REQ-903',
    batchId: 'BATCH-20260917-001',
    memberId: 'MBR-FID-8819',
    rawPayload: { firstName: 'ELIZABETH', lastName: 'VANCE', dob: '1979-11-03', zip: '90210' },
    requestHash: '6dcd4ce23d88e2ee95680a163ec86398b928f092837461928471928374619283',
    responseHash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    status: 'UNRESOLVED',
    confidenceScore: 62.1,
    retryCount: 3,
    timestamp: '2026-09-17T04:15:35Z'
  }
];

export const MOCK_IDENTITY_EXCEPTIONS: IdentityException[] = [
  {
    id: 'ID-EXC-101',
    personName: 'Elizabeth Vance / E. Vance',
    dob: '1979-11-03',
    ssnMasked: '***-**-6789',
    occurrencesCount: 3,
    affectedBatches: ['BATCH-20260917-001', 'BATCH-20260916-004'],
    primaryReason: 'Multiple candidate linkIds (LINK-9012 vs LINK-9088) with conflicting middle initial',
    assignedSteward: 'Sarah Jenkins (Data Steward)',
    agingDays: 2,
    slaStatus: 'ON_TRACK',
    status: 'OPEN'
  },
  {
    id: 'ID-EXC-102',
    personName: 'Michael O\'Connor',
    dob: '1968-07-25',
    ssnMasked: '***-**-1122',
    occurrencesCount: 1,
    affectedBatches: ['BATCH-20260917-001'],
    primaryReason: 'Verato API Timeout (Retry Exhausted after 5 attempts)',
    assignedSteward: 'David Miller (Lead Steward)',
    agingDays: 4,
    slaStatus: 'WARNING',
    status: 'IN_REVIEW'
  },
  {
    id: 'ID-EXC-103',
    personName: 'Alex Rivera',
    dob: '1992-01-15',
    ssnMasked: '***-**-8899',
    occurrencesCount: 5,
    affectedBatches: ['BATCH-20260915-002', 'BATCH-20260916-001', 'BATCH-20260917-001'],
    primaryReason: 'Low Demographic Match Confidence (54.2% threshold breach)',
    assignedSteward: 'Unassigned',
    agingDays: 6,
    slaStatus: 'ESCALATED',
    status: 'OPEN'
  }
];

export const MOCK_MERGE_SPLIT_CARDS: MergeSplitEvidenceCard[] = [
  {
    id: 'CARD-MERGE-88392',
    type: 'MERGE_PROPOSAL',
    targetLinkId: 'LINK-88392',
    sourceRecordA: {
      source: 'Aetna (AET-9901)',
      localId: 'MBR-90001',
      name: 'Robert J. Smith',
      dob: '1985-04-12',
      address: '123 Main St',
      zip: '10001'
    },
    sourceRecordB: {
      source: 'BlueCross (BCBS-4420)',
      localId: 'MBR-BCBS-4420',
      name: 'Bob Smith',
      dob: '1985-04-12',
      address: '123 Main Street, Apt 4B',
      zip: '10001'
    },
    demographicMatchScore: 96.5,
    aiEvidenceSummary: 'Strong demographic match: DOB is exact, Address refers to same physical location (Main St vs Main Street Apt 4B), Name "Bob" is a verified nickname derivative of "Robert".',
    consequencePreview: {
      addressesRepointed: 2,
      claimsRelinked: 4,
      duplicateProfilesCollapsed: 1,
      impactedPayerFeeds: ['Aetna Daily Enrollment', 'BCBS Member Feed']
    },
    decisionState: 'PENDING_HUMAN_APPROVAL'
  },
  {
    id: 'CARD-SPLIT-90112',
    type: 'SPLIT_PROPOSAL',
    targetLinkId: 'LINK-90112',
    sourceRecordA: {
      source: 'Fidelis Claims',
      localId: 'MBR-FID-1002',
      name: 'James L. Wilson Sr.',
      dob: '1955-08-30',
      address: '450 Oak Ave',
      zip: '90210'
    },
    sourceRecordB: {
      source: 'Hospital ADT',
      localId: 'HOSP- Wilson-Jr',
      name: 'James L. Wilson Jr.',
      dob: '1982-12-14',
      address: '450 Oak Ave',
      zip: '90210'
    },
    demographicMatchScore: 42.0,
    aiEvidenceSummary: 'Father/Son profile collision detected. Same address and last name, but distinct birth years (1955 vs 1982) and Jr/Sr suffix differentiation.',
    consequencePreview: {
      addressesRepointed: 1,
      claimsRelinked: 7,
      duplicateProfilesCollapsed: 0,
      impactedPayerFeeds: ['Fidelis Claims', 'Hospital ADT Feed']
    },
    decisionState: 'PENDING_HUMAN_APPROVAL'
  }
];

export const MOCK_IDENTITY_TELEMETRY: IdentityTelemetry[] = [
  {
    date: '2026-09-17',
    submittedCount: 10000,
    resolvedCount: 9940,
    unresolvedCount: 18,
    failedRetryCount: 42,
    fidelisBothKeysCoveragePct: 99.8,
    optumBothKeysCoveragePct: 99.1,
    molinaBothKeysCoveragePct: 97.4,
    cutoverReadinessScore: 98.6
  },
  {
    date: '2026-09-16',
    submittedCount: 9850,
    resolvedCount: 9800,
    unresolvedCount: 12,
    failedRetryCount: 38,
    fidelisBothKeysCoveragePct: 99.8,
    optumBothKeysCoveragePct: 99.0,
    molinaBothKeysCoveragePct: 97.2,
    cutoverReadinessScore: 98.4
  }
];

export const MOCK_CANONICAL_MODELS: CanonicalODSModel[] = [
  {
    version: 'v3.1.0',
    domain: 'Member Enrollment',
    tableName: 'ods_member_enrollment',
    surrogateKeyName: 'member_sk (BIGINT)',
    sourceKeyName: 'source_member_id (VARCHAR)',
    status: 'ACTIVE_VERSION',
    createdAt: '2026-09-01',
    columnsCount: 34,
    downstreamConsumerCount: 12,
    changesSummary: 'Added normalized payment attributes (billed_amt, allowed_amt) and effective-dated SCD Type 2 tracking',
    certificationStatus: 'CERTIFIED'
  },
  {
    version: 'v3.0.0',
    domain: 'Medical Claims',
    tableName: 'ods_medical_claims',
    surrogateKeyName: 'claim_sk (BIGINT)',
    sourceKeyName: 'claim_id (VARCHAR)',
    status: 'ACTIVE_VERSION',
    createdAt: '2026-08-15',
    columnsCount: 48,
    downstreamConsumerCount: 18,
    changesSummary: 'Added claim lineage derivation fields (original_claim_id, adjustment_sequence_no)',
    certificationStatus: 'CERTIFIED'
  },
  {
    version: 'v3.2.0-DRAFT',
    domain: 'Provider Directory',
    tableName: 'ods_provider_directory',
    surrogateKeyName: 'provider_sk (BIGINT)',
    sourceKeyName: 'npi (VARCHAR)',
    status: 'DRAFT',
    createdAt: '2026-09-15',
    columnsCount: 22,
    downstreamConsumerCount: 5,
    changesSummary: 'Proposed addition of telehealth_enabled (BOOLEAN) and taxonomy_code_secondary',
    certificationStatus: 'UNTESTED'
  }
];

export const MOCK_COMPLEX_PROFILER_TREE: ComplexFormatNode = {
  path: 'ExplanationOfBenefit',
  name: 'ExplanationOfBenefit (Resource Tree)',
  type: 'OBJECT',
  fillRatePct: 100,
  children: [
    {
      path: 'ExplanationOfBenefit.id',
      name: 'id (EOB Claim ID)',
      type: 'STRING',
      fillRatePct: 100
    },
    {
      path: 'ExplanationOfBenefit.patient',
      name: 'patient (Reference)',
      type: 'OBJECT',
      fillRatePct: 100,
      children: [
        { path: 'ExplanationOfBenefit.patient.reference', name: 'reference (Patient/LINK-88392)', type: 'STRING', fillRatePct: 100 }
      ]
    },
    {
      path: 'ExplanationOfBenefit.item',
      name: 'item (Repeating Claim Lines 1–40)',
      type: 'ARRAY',
      fillRatePct: 98.5,
      repeatingCountRange: '1 - 40 items per claim',
      children: [
        { path: 'ExplanationOfBenefit.item.sequence', name: 'sequence (Line Number)', type: 'NUMBER', fillRatePct: 100 },
        { path: 'ExplanationOfBenefit.item.servicedDate', name: 'servicedDate', type: 'STRING', fillRatePct: 96.2 },
        {
          path: 'ExplanationOfBenefit.item.adjudication',
          name: 'adjudication (Payment Adjustments 3–8)',
          type: 'ARRAY',
          fillRatePct: 100,
          repeatingCountRange: '3 - 8 entries',
          children: [
            { path: 'ExplanationOfBenefit.item.adjudication.category', name: 'category (Paid/Allowed/Copay)', type: 'STRING', fillRatePct: 100 },
            { path: 'ExplanationOfBenefit.item.adjudication.amount', name: 'amount (Decimal)', type: 'NUMBER', fillRatePct: 100 }
          ]
        }
      ]
    }
  ]
};

export const MOCK_NETTED_FINANCIAL_PACKS: NettedFinancialPack[] = [
  {
    batchId: 'BATCH-20260917-001',
    payerName: 'Fidelis Care Daily Claims',
    monthYear: 'September 2026',
    originalPaidAmount: 500.00,
    adjustmentAmount: 450.00,
    cancellationAmount: 500.00,
    netReconciledBilled: 450.00,
    controlTotalBilled: 450.00,
    dollarVariance: 0.00,
    status: 'MATCHED_ZERO_VARIANCE'
  },
  {
    batchId: 'BATCH-20260916-004',
    payerName: 'Aetna Member Claims',
    monthYear: 'September 2026',
    originalPaidAmount: 12500.00,
    adjustmentAmount: 1200.00,
    cancellationAmount: 800.00,
    netReconciledBilled: 12900.00,
    controlTotalBilled: 12900.00,
    dollarVariance: 0.00,
    status: 'MATCHED_ZERO_VARIANCE'
  }
];

export const MOCK_SETWISE_MEMBER_CHECKS: SetWiseMemberCheck = {
  batchId: 'BATCH-20260917-001',
  totalIncomingMembers: 5000,
  totalOdsMembers: 5000,
  matchedCount: 4982,
  missingInOdsSet: ['MBR-90812', 'MBR-90813'],
  extraInOdsSet: ['MBR-77001', 'MBR-77002'],
  discrepancyReason: '2 members terminated prior to effective date; 2 members added via retro-adjustment'
};
