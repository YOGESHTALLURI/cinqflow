import type { FeedConfig, QuarantineRecord, PipelineRun, ReconciliationReport, BusinessGlossaryTerm } from '../types';

export const INITIAL_FEEDS: FeedConfig[] = [
  {
    id: 'feed-001',
    feedCode: 'FEED-AET-834',
    sourceOrg: 'Aetna Health Inc.',
    feedName: 'Aetna 834 Member Enrollment Feed',
    domain: 'Enrollment',
    deliveryMethod: 'SFTP',
    fileFormat: 'CSV',
    frequency: 'Daily 04:00 EST',
    slaMinutes: 120,
    status: 'Active',
    wave: 'Wave 1',
    owner: 'Sarah Jenkins (Lead BA)',
    targetOdsTables: ['ODS_Member', 'ODS_Coverage', 'ODS_MemberCrosswalk'],
    dqScore: 98.4,
    totalRecordsProcessed: 142850,
    quarantineCount: 14,
    createdDate: '2026-08-15',
    updatedDate: '2026-09-08',
    schemaFields: [
      { id: 'f1', fieldName: 'member_id', dataType: 'VARCHAR(20)', nullable: false, sampleValues: ['AET984210', 'AET984211'], phiClassification: 'PHI', confidenceScore: 99 },
      { id: 'f2', fieldName: 'ssn', dataType: 'VARCHAR(9)', nullable: false, sampleValues: ['999123456', '999654321'], phiClassification: 'PII', confidenceScore: 98 },
      { id: 'f3', fieldName: 'first_name', dataType: 'VARCHAR(50)', nullable: false, sampleValues: ['John', 'Eleanor'], phiClassification: 'PII', confidenceScore: 99 },
      { id: 'f4', fieldName: 'last_name', dataType: 'VARCHAR(50)', nullable: false, sampleValues: ['Smith', 'Vance'], phiClassification: 'PII', confidenceScore: 99 },
      { id: 'f5', fieldName: 'dob', dataType: 'DATE', nullable: false, sampleValues: ['1984-06-12', '1992-11-03'], phiClassification: 'PII', confidenceScore: 97 },
      { id: 'f6', fieldName: 'gender', dataType: 'CHAR(1)', nullable: true, sampleValues: ['M', 'F'], phiClassification: 'None', confidenceScore: 99 },
      { id: 'f7', fieldName: 'plan_code', dataType: 'VARCHAR(15)', nullable: false, sampleValues: ['HMO-GOLD-01', 'PPO-SILV-02'], phiClassification: 'None', confidenceScore: 96 },
      { id: 'f8', fieldName: 'effective_date', dataType: 'DATE', nullable: false, sampleValues: ['2026-01-01', '2026-01-01'], phiClassification: 'None', confidenceScore: 98 }
    ],
    mappings: [
      { id: 'm1', sourceField: 'member_id', targetEntity: 'Member', targetField: 'SourceMemberID', transformation: 'DirectCopy', confidenceScore: 99, isCustom: false },
      { id: 'm2', sourceField: 'ssn', targetEntity: 'Member', targetField: 'SSN_Hash', transformation: 'HashKey(SHA256)', confidenceScore: 98, isCustom: false },
      { id: 'm3', sourceField: 'first_name', targetEntity: 'Member', targetField: 'FirstName', transformation: 'Upper', confidenceScore: 99, isCustom: false },
      { id: 'm4', sourceField: 'last_name', targetEntity: 'Member', targetField: 'LastName', transformation: 'Upper', confidenceScore: 99, isCustom: false },
      { id: 'm5', sourceField: 'dob', targetEntity: 'Member', targetField: 'BirthDate', transformation: 'DateFormatter(YYYY-MM-DD)', confidenceScore: 97, isCustom: false },
      { id: 'm6', sourceField: 'plan_code', targetEntity: 'Coverage', targetField: 'PlanID', transformation: 'DirectCopy', confidenceScore: 96, isCustom: false }
    ],
    dqRules: [
      {
        id: 'r1',
        name: 'Mandatory Member Identifier',
        naturalLanguage: 'Ensure member_id is present, not empty, and has at least 6 alphanumeric characters.',
        generatedCode: 'SELECT * FROM Silver_Raw WHERE member_id IS NULL OR LENGTH(TRIM(member_id)) < 6',
        severity: 'Reject',
        layer: 'Silver Raw',
        passCount: 142836,
        failCount: 14,
        status: 'Active',
        sampleFailures: [
          { recordId: 'REC-00941', reason: 'member_id is blank', rawData: { member_id: '', ssn: '999001122', first_name: 'David', last_name: 'Miller' } }
        ]
      },
      {
        id: 'r2',
        name: 'Valid Birth Date Range',
        naturalLanguage: 'Check that dob is a valid date in the past and member age is under 120 years.',
        generatedCode: 'SELECT * FROM Silver_Raw WHERE dob > CURRENT_DATE() OR DATEDIFF(year, dob, CURRENT_DATE()) > 120',
        severity: 'Quarantine',
        layer: 'Silver Raw',
        passCount: 142850,
        failCount: 0,
        status: 'Active'
      }
    ]
  },
  {
    id: 'feed-002',
    feedCode: 'FEED-BCBS-837P',
    sourceOrg: 'Blue Cross Blue Shield',
    feedName: 'BCBS 837 Professional Claims Feed',
    domain: 'Claims',
    deliveryMethod: 'Azure Storage',
    fileFormat: 'JSON',
    frequency: 'Daily 06:00 EST',
    slaMinutes: 180,
    status: 'Active',
    wave: 'Wave 1',
    owner: 'Marcus Vance (Data Steward)',
    targetOdsTables: ['ODS_ClaimHeader', 'ODS_ClaimLine', 'ODS_ClaimDiagnosis'],
    dqScore: 96.8,
    totalRecordsProcessed: 521400,
    quarantineCount: 82,
    createdDate: '2026-08-20',
    updatedDate: '2026-09-09',
    schemaFields: [
      { id: 'f10', fieldName: 'claim_id', dataType: 'VARCHAR(30)', nullable: false, sampleValues: ['CLM-2026-9001', 'CLM-2026-9002'], phiClassification: 'None', confidenceScore: 99 },
      { id: 'f11', fieldName: 'member_id', dataType: 'VARCHAR(20)', nullable: false, sampleValues: ['AET984210', 'BCB441200'], phiClassification: 'PHI', confidenceScore: 98 },
      { id: 'f12', fieldName: 'provider_npi', dataType: 'VARCHAR(10)', nullable: false, sampleValues: ['1982736450', '1092837465'], phiClassification: 'None', confidenceScore: 99 },
      { id: 'f13', fieldName: 'service_date', dataType: 'DATE', nullable: false, sampleValues: ['2026-08-30', '2026-09-01'], phiClassification: 'None', confidenceScore: 97 },
      { id: 'f14', fieldName: 'icd10_diag_1', dataType: 'VARCHAR(10)', nullable: false, sampleValues: ['E11.9', 'I10'], phiClassification: 'None', confidenceScore: 95 },
      { id: 'f15', fieldName: 'billed_amount', dataType: 'DECIMAL(10,2)', nullable: false, sampleValues: ['350.00', '1250.50'], phiClassification: 'Financial', confidenceScore: 99 }
    ],
    mappings: [
      { id: 'm10', sourceField: 'claim_id', targetEntity: 'Claim', targetField: 'ClaimNumber', transformation: 'DirectCopy', confidenceScore: 99, isCustom: false },
      { id: 'm11', sourceField: 'member_id', targetEntity: 'Claim', targetField: 'SourceMemberID', transformation: 'DirectCopy', confidenceScore: 98, isCustom: false },
      { id: 'm12', sourceField: 'provider_npi', targetEntity: 'Claim', targetField: 'BillingProviderNPI', transformation: 'DirectCopy', confidenceScore: 99, isCustom: false },
      { id: 'm13', sourceField: 'billed_amount', targetEntity: 'Claim', targetField: 'TotalBilledAmount', transformation: 'Decimal2Digits', confidenceScore: 99, isCustom: false }
    ],
    dqRules: [
      {
        id: 'r10',
        name: 'Positive Claim Billed Amount',
        naturalLanguage: 'Billed amount must be greater than zero and less than $1,000,000 per claim.',
        generatedCode: 'SELECT * FROM Silver_Raw WHERE billed_amount <= 0 OR billed_amount > 1000000',
        severity: 'Quarantine',
        layer: 'Silver Raw',
        passCount: 521318,
        failCount: 82,
        status: 'Active'
      }
    ]
  },
  {
    id: 'feed-003',
    feedCode: 'FEED-MSH-ADT',
    sourceOrg: 'Mount Sinai Health System',
    feedName: 'Epic ADT Real-time Event Feed',
    domain: 'ADT',
    deliveryMethod: 'FHIR',
    fileFormat: 'HL7',
    frequency: 'Streaming / Microbatch (15 mins)',
    slaMinutes: 30,
    status: 'Active',
    wave: 'Wave 1',
    owner: 'Elena Rostova (Data Engineer)',
    targetOdsTables: ['ODS_Encounter', 'ODS_AdmissionHistory'],
    dqScore: 99.1,
    totalRecordsProcessed: 89400,
    quarantineCount: 3,
    createdDate: '2026-08-25',
    updatedDate: '2026-09-09',
    schemaFields: [
      { id: 'f20', fieldName: 'mrn', dataType: 'VARCHAR(25)', nullable: false, sampleValues: ['MRN-774102', 'MRN-774103'], phiClassification: 'PHI', confidenceScore: 99 },
      { id: 'f21', fieldName: 'event_type', dataType: 'VARCHAR(10)', nullable: false, sampleValues: ['A01_ADMIT', 'A03_DISCHARGE'], phiClassification: 'None', confidenceScore: 99 },
      { id: 'f22', fieldName: 'admission_timestamp', dataType: 'TIMESTAMP', nullable: false, sampleValues: ['2026-09-09T08:15:00Z'], phiClassification: 'None', confidenceScore: 98 }
    ],
    mappings: [],
    dqRules: []
  },
  {
    id: 'feed-004',
    feedCode: 'FEED-QUEST-LAB',
    sourceOrg: 'Quest Diagnostics',
    feedName: 'Quest Diagnostics Lab Results Feed',
    domain: 'Lab',
    deliveryMethod: 'SFTP',
    fileFormat: 'CSV',
    frequency: 'Daily 02:00 EST',
    slaMinutes: 120,
    status: 'In Review',
    wave: 'Wave 1',
    owner: 'Sarah Jenkins (Lead BA)',
    targetOdsTables: ['ODS_LabResult'],
    dqScore: 94.2,
    totalRecordsProcessed: 35000,
    quarantineCount: 12,
    createdDate: '2026-09-01',
    updatedDate: '2026-09-09',
    schemaFields: [],
    mappings: [],
    dqRules: []
  },
  {
    id: 'feed-005',
    feedCode: 'FEED-CENT-PROV',
    sourceOrg: 'Centene Corporation',
    feedName: 'Centene Provider Network Roster',
    domain: 'Provider',
    deliveryMethod: 'File Upload',
    fileFormat: 'Fixed-width',
    frequency: 'Weekly (Sunday)',
    slaMinutes: 240,
    status: 'Draft',
    wave: 'Wave 1',
    owner: 'Marcus Vance (Data Steward)',
    targetOdsTables: ['ODS_Provider', 'ODS_Facility'],
    dqScore: 0,
    totalRecordsProcessed: 0,
    quarantineCount: 0,
    createdDate: '2026-09-05',
    updatedDate: '2026-09-09',
    schemaFields: [],
    mappings: [],
    dqRules: []
  }
];

export const MOCK_QUARANTINE_RECORDS: QuarantineRecord[] = [
  {
    id: 'QR-9001',
    feedId: 'feed-001',
    feedName: 'Aetna 834 Member Enrollment Feed',
    batchId: 'BATCH-20260909-001',
    layer: 'Silver Raw',
    fieldName: 'member_id',
    errorReason: 'Mandatory Member Identifier missing or empty',
    severity: 'Reject',
    recordData: {
      member_id: '',
      ssn: '999441122',
      first_name: 'Michael',
      last_name: 'Chang',
      dob: '1979-04-18',
      plan_code: 'HMO-GOLD-01'
    },
    phiMasked: true,
    status: 'Pending',
    timestamp: '2026-09-09 04:12:30'
  },
  {
    id: 'QR-9002',
    feedId: 'feed-002',
    feedName: 'BCBS 837 Professional Claims Feed',
    batchId: 'BATCH-20260909-004',
    layer: 'Silver Raw',
    fieldName: 'billed_amount',
    errorReason: 'Billed amount (-150.00) is negative',
    severity: 'Quarantine',
    recordData: {
      claim_id: 'CLM-2026-9812',
      member_id: 'AET984210',
      provider_npi: '1982736450',
      service_date: '2026-09-02',
      billed_amount: -150.00,
      icd10_diag_1: 'E11.9'
    },
    phiMasked: false,
    status: 'Pending',
    timestamp: '2026-09-09 06:14:05'
  },
  {
    id: 'QR-9003',
    feedId: 'feed-002',
    feedName: 'BCBS 837 Professional Claims Feed',
    batchId: 'BATCH-20260909-004',
    layer: 'Silver Raw',
    fieldName: 'provider_npi',
    errorReason: 'Provider NPI is 8 digits (expected 10 digits)',
    severity: 'Manual Review',
    recordData: {
      claim_id: 'CLM-2026-9815',
      member_id: 'BCB441200',
      provider_npi: '19827364',
      service_date: '2026-09-03',
      billed_amount: 450.00,
      icd10_diag_1: 'I10'
    },
    phiMasked: false,
    status: 'Pending',
    timestamp: '2026-09-09 06:18:22'
  }
];

export const MOCK_PIPELINE_RUNS: PipelineRun[] = [
  {
    id: 'run-8801',
    feedId: 'feed-001',
    feedName: 'Aetna 834 Member Enrollment Feed',
    batchId: 'BATCH-20260909-001',
    fileReceived: '2026-09-09 04:02:11',
    fileName: 'aetna_enrollment_20260909.csv',
    fileSizeBytes: 4291040,
    status: 'Quarantine Flagged',
    currentStage: 'Silver ODS',
    stageStats: {
      'Landing': { stage: 'Landing', recordsIn: 10000, recordsOut: 10000, quarantined: 0, durationMs: 1400, status: 'completed' },
      'Bronze': { stage: 'Bronze', recordsIn: 10000, recordsOut: 10000, quarantined: 0, durationMs: 2100, status: 'completed' },
      'Silver Raw': { stage: 'Silver Raw', recordsIn: 10000, recordsOut: 9999, quarantined: 1, durationMs: 4500, status: 'completed' },
      'Identity Resolution': { stage: 'Identity Resolution', recordsIn: 9999, recordsOut: 9999, quarantined: 0, durationMs: 3800, status: 'completed' },
      'Silver ODS': { stage: 'Silver ODS', recordsIn: 9999, recordsOut: 9999, quarantined: 0, durationMs: 5200, status: 'completed' }
    },
    identityMatchesCount: 9850,
    unresolvedIdentitiesCount: 149,
    reconciliationStatus: 'Match',
    logTrace: [
      '04:02:11 [INFO] Landing Zone: File arrival detected aetna_enrollment_20260909.csv (4.2 MB)',
      '04:02:13 [INFO] Bronze: Ingested raw batch with audit metadata (BatchId: BATCH-20260909-001)',
      '04:02:17 [WARN] Silver Raw: Rule r1 (Mandatory Member Identifier) failed for 1 record -> Quarantined',
      '04:02:21 [INFO] Identity Resolution: Submitted 9999 records to Verato MPI Crosswalk -> 9850 Matched LinkID',
      '04:02:26 [INFO] Silver ODS: Published 9999 canonical records into ODS_Member & ODS_Coverage'
    ],
    timestamp: '2026-09-09 04:02:26'
  },
  {
    id: 'run-8802',
    feedId: 'feed-002',
    feedName: 'BCBS 837 Professional Claims Feed',
    batchId: 'BATCH-20260909-004',
    fileReceived: '2026-09-09 06:01:45',
    fileName: 'bcbs_claims_20260909.json',
    fileSizeBytes: 18450100,
    status: 'Success',
    currentStage: 'Silver ODS',
    stageStats: {
      'Landing': { stage: 'Landing', recordsIn: 25000, recordsOut: 25000, quarantined: 0, durationMs: 3100, status: 'completed' },
      'Bronze': { stage: 'Bronze', recordsIn: 25000, recordsOut: 25000, quarantined: 0, durationMs: 4200, status: 'completed' },
      'Silver Raw': { stage: 'Silver Raw', recordsIn: 25000, recordsOut: 24998, quarantined: 2, durationMs: 7800, status: 'completed' },
      'Identity Resolution': { stage: 'Identity Resolution', recordsIn: 24998, recordsOut: 24998, quarantined: 0, durationMs: 6500, status: 'completed' },
      'Silver ODS': { stage: 'Silver ODS', recordsIn: 24998, recordsOut: 24998, quarantined: 0, durationMs: 9100, status: 'completed' }
    },
    identityMatchesCount: 24900,
    unresolvedIdentitiesCount: 98,
    reconciliationStatus: 'Match',
    logTrace: [
      '06:01:45 [INFO] Landing Zone: File arrival detected bcbs_claims_20260909.json (18.4 MB)',
      '06:01:49 [INFO] Bronze: Append raw ingestion complete',
      '06:01:57 [INFO] Silver Raw: Data contract validated',
      '06:02:03 [INFO] Identity Resolution: Person Link ID crosswalk updated',
      '06:02:12 [INFO] Silver ODS: Financial reconciliation verified ($4,285,190.50 billed)'
    ],
    timestamp: '2026-09-09 06:02:12'
  }
];

export const MOCK_RECONCILIATIONS: ReconciliationReport[] = [
  {
    id: 'recon-101',
    batchId: 'BATCH-20260909-001',
    feedName: 'Aetna 834 Member Enrollment Feed',
    timestamp: '2026-09-09 04:03:00',
    landingCount: 10000,
    bronzeCount: 10000,
    silverRawCount: 9999,
    silverOdsCount: 9999,
    quarantineCount: 1,
    varianceCount: 0,
    certificationStatus: 'Certified',
    certifiedBy: 'Automated DQ Engine & Operations Signoff'
  },
  {
    id: 'recon-102',
    batchId: 'BATCH-20260909-004',
    feedName: 'BCBS 837 Professional Claims Feed',
    timestamp: '2026-09-09 06:03:00',
    landingCount: 25000,
    bronzeCount: 25000,
    silverRawCount: 24998,
    silverOdsCount: 24998,
    quarantineCount: 2,
    varianceCount: 0,
    controlTotalBilled: 4285190.50,
    reconciledBilled: 4285190.50,
    certificationStatus: 'Certified',
    certifiedBy: 'Marcus Vance (Data Steward)'
  }
];

export const MOCK_GLOSSARY_TERMS: BusinessGlossaryTerm[] = [
  {
    id: 'term-1',
    term: 'Member Link ID (Person ID)',
    category: 'Canonical Model',
    definition: 'Universal unique person identifier assigned by MPI (Verato) after crosswalking source member numbers across Aetna, BCBS, and clinical feeds.',
    phiType: 'PHI Key',
    synonyms: ['GlobalPersonID', 'LinkID', 'MPI_ID'],
    owner: 'Identity & Data Governance Team'
  },
  {
    id: 'term-2',
    term: 'PMPM (Per Member Per Month)',
    category: 'Metric',
    definition: 'Calculated healthcare cost measure representing dollars spent per enrolled member per calendar month.',
    phiType: 'None',
    synonyms: ['Cost Per Member'],
    owner: 'Actuarial & Analytics Team'
  },
  {
    id: 'term-3',
    term: 'Silver ODS (Operational Data Store)',
    category: 'Canonical Model',
    definition: 'Clean, normalized, member-centric data model representing single source of truth for CINQCARE downstream analytics, quality, and risk applications.',
    phiType: 'PHI Enriched',
    synonyms: ['Canonical Model', 'Silver Layer'],
    owner: 'Platform Engineering'
  }
];
