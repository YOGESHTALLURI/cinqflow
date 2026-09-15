export type UserRole = 
  | 'ba'           // Business Analyst
  | 'steward'      // Data Steward
  | 'engineer'     // Data Engineer
  | 'ops'          // Operations
  | 'approver'     // Approver
  | 'admin';       // Administrator

export type HealthcareDomain = 
  | 'Enrollment'
  | 'Claims'
  | 'ADT'
  | 'Provider'
  | 'Clinical'
  | 'Quality'
  | 'Risk'
  | 'Lab';

export type DeliveryMethod = 
  | 'SFTP'
  | 'API'
  | 'FHIR'
  | 'Database'
  | 'Azure Storage'
  | 'File Upload';

export type FileFormat = 
  | 'CSV'
  | 'JSON'
  | 'HL7'
  | 'FHIR'
  | 'Fixed-width'
  | 'XML';

export type FeedStatus = 
  | 'Draft'
  | 'In Review'
  | 'Approved'
  | 'Active'
  | 'Paused'
  | 'Retired';

export type MedallionLayer = 
  | 'Landing'
  | 'Bronze'
  | 'Silver Raw'
  | 'Identity Resolution'
  | 'Silver ODS';

export type RuleSeverity = 
  | 'Information'
  | 'Warning'
  | 'Manual Review'
  | 'Quarantine'
  | 'Reject'
  | 'Stop Pipeline';

export interface SchemaField {
  id: string;
  fieldName: string;
  dataType: string;
  nullable: boolean;
  sampleValues: string[];
  phiClassification?: 'PII' | 'PHI' | 'Financial' | 'None';
  confidenceScore: number; // 0 to 100
  fixedWidthWidth?: number;
}

export interface CanonicalMapping {
  id: string;
  sourceField: string;
  targetEntity: string;   // e.g. 'Member', 'Claim', 'Coverage'
  targetField: string;    // e.g. 'MemberID', 'BirthDate', 'TotalBilled'
  transformation: string; // e.g. 'DateFormatter(YYYYMMDD)', 'DirectCopy', 'HashKey', 'Upper'
  confidenceScore: number;
  isCustom: boolean;
}

export interface DQRule {
  id: string;
  name: string;
  naturalLanguage: string;
  generatedCode: string; // SQL / PySpark code snippet
  severity: RuleSeverity;
  layer: MedallionLayer;
  passCount: number;
  failCount: number;
  status: 'Active' | 'Draft' | 'Testing';
  sampleFailures?: Array<{ recordId: string; reason: string; rawData: Record<string, any> }>;
}

export interface FeedConfig {
  id: string;
  feedCode: string;
  sourceOrg: string;
  feedName: string;
  domain: HealthcareDomain;
  deliveryMethod: DeliveryMethod;
  fileFormat: FileFormat;
  frequency: string; // e.g. "Daily 04:00 EST"
  slaMinutes: number;
  status: FeedStatus;
  wave: string; // e.g. "Wave 1"
  owner: string;
  targetOdsTables: string[];
  schemaFields: SchemaField[];
  mappings: CanonicalMapping[];
  dqRules: DQRule[];
  lastBatchDate?: string;
  dqScore?: number;
  totalRecordsProcessed?: number;
  quarantineCount?: number;
  createdDate: string;
  updatedDate: string;
}

export interface QuarantineRecord {
  id: string;
  feedId: string;
  feedName: string;
  batchId: string;
  layer: MedallionLayer;
  fieldName: string;
  errorReason: string;
  severity: RuleSeverity;
  recordData: Record<string, any>;
  phiMasked: boolean;
  status: 'Pending' | 'Waived' | 'Corrected' | 'Reprocessed';
  timestamp: string;
}

export interface StageStat {
  stage: MedallionLayer;
  recordsIn: number;
  recordsOut: number;
  quarantined: number;
  durationMs: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

export interface PipelineRun {
  id: string;
  feedId: string;
  feedName: string;
  batchId: string;
  fileReceived: string;
  fileName: string;
  fileSizeBytes: number;
  status: 'Running' | 'Success' | 'Failed' | 'Quarantine Flagged';
  currentStage: MedallionLayer;
  stageStats: Record<MedallionLayer, StageStat>;
  identityMatchesCount: number;
  unresolvedIdentitiesCount: number;
  reconciliationStatus: 'Match' | 'Variance' | 'Pending';
  logTrace: string[];
  timestamp: string;
}

export interface ReconciliationReport {
  id: string;
  batchId: string;
  feedName: string;
  timestamp: string;
  landingCount: number;
  bronzeCount: number;
  silverRawCount: number;
  silverOdsCount: number;
  quarantineCount: number;
  varianceCount: number;
  controlTotalBilled?: number;
  reconciledBilled?: number;
  certificationStatus: 'Certified' | 'Variance Exception' | 'Pending Approval';
  certifiedBy?: string;
}

export interface BusinessGlossaryTerm {
  id: string;
  term: string;
  category: 'Domain' | 'Metric' | 'Canonical Model' | 'Data Quality';
  definition: string;
  phiType: string;
  synonyms: string[];
  owner: string;
}
