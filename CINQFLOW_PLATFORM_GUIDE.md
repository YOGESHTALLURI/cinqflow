# CINQFlow Platform Documentation: End-to-End Business & Technical Blueprint

---

## Executive Overview
**CINQFlow** is an enterprise self-service healthcare data platform designed to ingest, standardize, validate, transform, and reconcile multi-payer data streams into a single canonical Operational Data Store (ODS). Built around the **Medallion Architecture (Bronze $\rightarrow$ Silver $\rightarrow$ Gold)**, CINQFlow eliminates data silos, ensures 100% financial and record-level auditability, isolates invalid records into Quarantine for steward remediation, and unifies patient identities across disparate sources using probabilistic entity resolution.

---

# PART I: WAVE 1 & WAVE 2 PLATFORM MODULES

---

## Page 1: Business Analyst (BA) Onboarding Wizard

### 1. PAGE PURPOSE: Why does CINQFlow need this page?
* **The Business Problem**: Healthcare payers (Aetna, BlueCross, UnitedHealth, Medicare) send data in completely different formats (CSV, HL7, X12 EDI 834, JSON) with varying column headers, delimiters, and quality levels. Hand-coding custom ETL scripts for every new payer feed takes weeks, creates code debt, and lacks standardized validation contracts.
* **CINQFlow's Solution**: A 5-step self-service wizard that empowers non-technical Business Analysts to onboard a new data feed in under 10 minutes. It automatically profiles files, establishes canonical schema mappings, configures data quality (DQ) validation rules, and generates an immutable business contract with a unique Batch ID link.
* **Who Uses It?**: Business Analysts, Integration Engineers, Data Stewards.
* **User Story Reference**: `CF-V1-E4-01` (Five-Step Onboarding Wizard).

### 2. EVERY SECTION EXPLAINED

#### Step 1: Feed Information & Ingestion Metadata
* **Source System & Payer Name**: Specifies the originating entity (e.g., `AETNA_DAILY_ENROLLMENT`).
* **Ingestion Channel & Protocol**: Configures the transport mechanism (`SFTP`, `S3 Bucket`, `API Endpoint`, `Blob Storage`).
* **Expected Schedule & SLA**: Sets arrival frequency (`Daily`, `Weekly`, `Monthly`) and SLA threshold (e.g., `Must arrive by 06:00 AM EST`).
* **Target Canonical Schema**: Maps the feed to the appropriate ODS domain (`Member Enrollment`, `Medical Claims`, `Pharmacy Claims`, `Provider Directory`).

#### Step 2: Schema Profiling & Raw Inspection
* **File Upload & Sampling**: Parses sample file headers and data rows.
* **Auto-Detected Data Types**: Inspects column types (`String`, `Integer`, `Date`, `Decimal`) and flags null counts.
* **Delimiter & Format Rules**: Auto-detects `,`, `|`, `TAB`, or fixed-width layouts.

#### Step 3: Canonical Schema Mapping (AI-Assisted)
* **Raw Header $\rightarrow$ ODS Target Mapping**: Maps incoming raw headers (e.g., `mbr_dob`, `BIRT_DT`) to standard ODS attributes (e.g., `Date_Of_Birth`).
* **AI Match Confidence Score**:
  $$\text{Match Confidence (\%)} = \text{Similarity}(\text{Header}_{\text{Raw}}, \text{Attribute}_{\text{ODS}}) \times 100$$
* **Transformation Functions**: Applies light field-level formatting (e.g., `UPPERCASE`, `TRIM`, `DATE_FORMAT(YYYY-MM-DD)`).

#### Step 4: Data Quality (DQ) Rule Studio
* **Rule Categories**: Configures `Mandatory Null Checks`, `Format Regex Validation`, `Range Checks`, and `Referential Integrity`.
* **AI Natural Language to SQL Compiler**: Translates business intent (e.g., *"Billed amount must be greater than zero"*) into executable validation logic.
* **Severity Thresholds**: Defines whether a rule failure triggers `QUARANTINE_RECORD` or `REJECT_BATCH`.

#### Step 5: Contract Review & Submission
* **Contract Summary Card**: Displays Feed ID, Canonical Schema, DQ Rule Count, and SLA rules.
* **Batch ID Generator**: Creates the parent contract linkage ID used for all future recurring file arrivals.

---

## Page 2: Feed Registry

### 1. PAGE PURPOSE: Why does CINQFlow need this page?
* **The Business Problem**: Enterprise data platforms manage hundreds of active data feeds. Without a single source of truth, organizations suffer from duplicate feed definitions, outdated schemas, unvetted pipeline changes, and zero visibility into feed ownership or version history.
* **CINQFlow's Solution**: The Feed Registry acts as the central governance catalog for all active, paused, and draft data contracts. It provides version control, contract status management, schema change auditing, and 1-click execution testing.
* **Who Uses It?**: Data Governance Officers, Lead BAs, Data Platform Admins.
* **User Story Reference**: `CF-V1-E3-02` (Full Source and Feed Registry).

### 2. EVERY SECTION EXPLAINED

* **Active Feeds Summary Grid**: Displays overall metrics (Total Active Feeds, Average DQ Pass Rate %, SLA Compliance %, Quarantined Record Ratios).
* **Feed Search & Domain Filters**: Filter feeds by Payer, Domain (`Member`, `Claim`, `Provider`), Environment (`Prod`, `Staging`), and Status (`Active`, `Draft`, `Paused`).
* **Feed Detail Drawer / Modal**:
  * **Contract Metadata**: Displays Feed ID (`FEED-AET-834`), Parent Contract ID, Frequency, and Owner Email.
  * **Schema Versioning History**: Tracks `v1.0` $\rightarrow$ `v1.1` schema modifications with diff views.
  * **Associated DQ Rules**: Lists all active validation assertions bound to the feed.
* **Actions Menu**: `Run Test Batch`, `Edit Contract`, `Pause Ingestion`, `Export JSON Schema`.

---

## Page 3: Operations Control & File Arrival Board

### 1. PAGE PURPOSE: Why does CINQFlow need this page?
* **The Business Problem**: Operations teams need real-time visibility into physical file deliveries. Delayed files, corrupt uploads, or missing daily drops cause downstream SLA breaches and prevent healthcare analytics from running on time.
* **CINQFlow's Solution**: The File Arrival Board monitors the Landing Zone in real time. It tracks file delivery against expected SLAs, triggers AI failure fingerprinting on corrupt files, provides step-by-step operational runbooks for failed drops, and initiates execution batches into the Medallion Pipeline.
* **Who Uses It?**: Data Operations Engineers, L2 Support, System Operators.
* **User Story Reference**: `CF-V2-E12-01` (Data Operations Home and File-Arrival Board).

### 2. EVERY SECTION EXPLAINED

* **Arrival Status KPI Cards**:
  * **Expected Today**: Total expected file drops based on active feed schedules.
  * **Arrived On-Time**: Count of files received prior to SLA cutoff.
  * **SLA Breached / Delayed**: Highlighted in Red with countdown timers.
  * **Failed Validation**: Files blocked at landing due to critical format issues.
* **Live File Arrival Feed Table**:
  * **File Name & Timestamp**: e.g., `AETNA_MEMBER_20260917.csv` received at `04:15 AM`.
  * **Size & Row Count Estimate**: File payload size (MB/GB) and estimated record count.
  * **SLA Status Indicator**: Green (`ON_TIME`), Yellow (`WARNING`), Red (`BREACHED`).
* **AI Incident Diagnostics & Failure Fingerprinting**:
  * **Root Cause Diagnostics**: Identifies file corruption (e.g., `SFTP_TRANSFER_INCOMPLETE`, `INVALID_DELIMITER_COUNT`).
  * **Automated Runbook Guidance**: Recommends operational fixes (e.g., *"Contact Payer Aetna SFTP Admin or trigger auto-retry parser"*).
* **Action Controls**: `Trigger Pipeline Run`, `Notify Payer Admin`, `Override SLA`.

---

## Page 4: Medallion Pipeline Engine

### 1. PAGE PURPOSE: Why does CINQFlow need this page?
* **The Business Problem**: Traditional ETL pipelines are opaque "black boxes". When processing fails, operators cannot see which stage failed (Bronze, Silver, or Gold) or what happened to individual records during execution.
* **CINQFlow's Solution**: An interactive Medallion Pipeline Execution Engine that visualizes end-to-end data progression through Bronze (Raw Storage), Silver (Validated & Clean ODS), and Gold (Identity Resolved Data Products). It streams real-time execution logs and displays stage-by-stage record counts.
* **Who Uses It?**: Data Engineers, Operations Staff, Integration Analysts.
* **User Story Reference**: `CF-V0-E8-01` (Pipeline Compiler — Landing to Bronze to Silver Raw).

### 2. EVERY SECTION EXPLAINED

* **Medallion Stage Progress Flow**:
  1. **Landing Zone**: Physical file arrival validation.
  2. **Bronze Layer (Raw Store)**: Exact raw file ingestion without alteration.
  3. **Silver Layer (Validation & DQ)**: Application of canonical mapping and DQ rule evaluation. Invalid rows are routed to Quarantine.
  4. **Gold Layer (ODS & Linkage)**: Publishing clean canonical records and executing Identity Resolution (`linkId`).
* **Live Pipeline Metrics Banner**:
  * **Batch ID**: e.g., `BATCH-20260917-001`.
  * **Execution Duration**: Real-time timer (e.g., `14.2 seconds`).
  * **Processing Throughput**: Records per second (e.g., `352 rec/sec`).
  * **Pass Rate / Quarantine Ratio**: % of records reaching ODS vs Quarantine.
* **Real-Time Log Stream Console**: Terminal view streaming live execution logs (`INFO`, `WARN`, `ERROR`, `SUCCESS`).
* **Output Data Preview Table**: Dynamic view showing sample transformed rows inside the target ODS schema.

---

## Page 5: Quarantine Center & Data Steward Remediation

### 1. PAGE PURPOSE: Why does CINQFlow need this page?
* **The Business Problem**: In traditional systems, when a file contains 18 invalid records (out of 5,000), either the entire file is rejected (blocking 4,920 valid records) or dirty data is pushed into the production database.
* **CINQFlow's Solution**: CINQFlow isolates bad records into a dedicated Quarantine Center while letting valid records proceed smoothly to the ODS. Data Stewards can inspect, edit, auto-fix, and re-inject corrected records directly back into the pipeline.
* **Who Uses It?**: Data Stewards, Compliance Specialists, Operations Analysts.
* **User Story Reference**: `CF-V1-E7-03` & `CF-V2-E7-05` (Quarantine Exception Management).

### 2. EVERY SECTION EXPLAINED

* **Quarantine Overview Dashboard**:
  * **Total Quarantined Records**: e.g., `18 Records`.
  * **Top Failure Reasons**: Breakdown by rule violation (`INVALID_DATE_FORMAT`, `MISSING_MANDATORY_ZIP`, `INVALID_GENDER_CODE`).
  * **Impacted Payers & Feeds**: Filter records by originating batch or feed contract.
* **Interactive Exception Grid**:
  * **Record ID & Line Number**: Pinpoints exact location in source file.
  * **Raw Value vs Expected Schema**: Highlights failing cell in red with tooltip explanation.
  * **Rule Violated**: e.g., `DQ-RULE-104: DOB format must be YYYY-MM-DD`.
* **Smart Remediation Toolbar**:
  * **AI 1-Click Fix Suggestions**: Recommends auto-corrections (e.g., convert `04/12/1985` $\rightarrow$ `1985-04-12`).
  * **Inline Data Editing**: Allows data stewards to manually correct fields.
  * **Batch Re-Submit**: Re-executes DQ validation on remediated rows and pushes passed records to Silver ODS.
  * **Bulk Discard / Reject**: Marks unfixable records as permanently rejected with audit reason logging.

---

## Page 6: Reconciliation & Audit Control

### 1. PAGE PURPOSE: Why does CINQFlow need this page?
* **The Business Problem**: Healthcare regulatory auditors (CMS, HIPAA, SOX) demand mathematical proof that no patient records or dollar amounts vanished unaccounted for between the incoming raw file and the final ODS database.
* **CINQFlow's Solution**: A Multi-Stage Lineage Audit Matrix that reconciles both Record Counts and Financial Control Totals ($) across all 5 Medallion layers, proving zero data loss or financial leakage with 100% mathematical precision.
* **Who Uses It?**: Compliance Auditors, Lead BAs, Financial Controllers.
* **User Story Reference**: `CF-V0-E13-01` (Count Reconciliation & Drop Ledger).

### 2. EVERY SECTION EXPLAINED

#### Section A: Multi-Stage Record Balancing Equation
Reconciles record counts across stages to prove no rows were lost:
$$\text{Landing Count} = \text{Silver ODS Published} + \text{Quarantined Exceptions} + \text{Rejected}$$

#### Section B: Financial Control Balancing
Reconciles financial totals ($) across layers:
$$\text{Financial Variance (\$)} = \text{Control Total Billed} - (\text{ODS Reconciled Billed} + \text{Quarantine Billed})$$

---

# PART II: WAVE 3 BLUEPRINT — IDENTITY & CANONICAL MODEL SUITE
*(Official 11 User Stories from CINQFLOW_User_Stories (1).docx)*

---

## Story 1: `CF-V3-E5-05` — Profiling for Complex Formats
* **Epic**: Epic 5 (Schema Discovery & Profiling)
* **Persona**: Business Analyst (Standard Flow)

### 1. STORY PURPOSE & BUSINESS PROBLEM
* **The Business Problem**: Standard flat CSV profilers fail when encountering complex healthcare payloads like nested CMS BCDA FHIR ExplanationOfBenefit (EOB) NDJSON, HL7 ADT JSON, or fixed-width text files (CCLF layouts). Manual interpretation of repeating groups, nested trees, and positional column boundaries takes days and causes mapping errors.
* **CINQFlow's Solution**: Extends the schema profiler with a visual resource tree viewer, per-path fill rate counters, automatic flattening proposals, and statistical fixed-width boundary detection with layout reference cross-checking.

### 2. EVERY SECTION EXPLAINED
* **Nested Resource Tree Viewer**: Visualizes JSON/FHIR nested structures (e.g. claim items `1–40`, adjudications `3–8`) with fill rate percentages at every node path.
* **Flattening Proposal Generator**: Proposes candidate 1-to-many flattening rules directly consumable by the Mapping Studio.
* **Fixed-Width Boundary Detector**: Statistically analyzes byte-alignment and presents side-by-side boundary interpretations against CCLF specification guides for analyst selection.
* **Happy Path**: BA uploads BCDA EOB sample; profiler renders path counts, fill rates, and auto-generates flattening rules.
* **Exception Handling**: When 2 plausible boundary options exist for fixed-width columns, both options are displayed with statistical evidence for BA selection.
* **Don'ts**: Never flatten silently without explicit analyst approval.

---

## Story 2: `CF-V3-E6-05` — Structural Transforms for Complex Healthcare Formats
* **Epic**: Epic 6 (Canonical Mapping & Transformation Studio)
* **Persona**: Data Engineer (Standard Flow)

### 1. STORY PURPOSE & BUSINESS PROBLEM
* **The Business Problem**: Complex formats carry vital clinical and financial meaning (claim adjustments, cancellations, unpivoting wide diagnosis arrays). Hand-coded transformations risk double-counting adjustment chains, losing original claim lineage, or mishandling per-source ADT date quirks.
* **CINQFlow's Solution**: A robust transform library that derives claim lineage (`Original`, `Adjustment`, `Cancellation`), normalizes payment signs ($+500 / -500 / +450 \rightarrow \text{Net } \$450$), unpivots wide diagnosis arrays, and applies configurable per-source ADT parser quirks without modifying historical versions in place.

### 2. EVERY SECTION EXPLAINED
* **Claim Lineage Derivation Rules**:
  * No related claim ID $\rightarrow$ `ORIGINAL`
  * Replaced-by claim ID $\rightarrow$ `CANCELLATION`
  * Prior claim ID $\rightarrow$ `ADJUSTMENT`
* **Net Position Financial Calculator**:
  $$\text{Net Position} = \sum \text{Payment}_{\text{Original}} + \sum \text{Payment}_{\text{Adjustment}} - \sum \text{Payment}_{\text{Cancellation}}$$
* **ADT Source Quirk Manager**: Declarative configuration editor for source-specific date formats and known typos.
* **Don'ts**: Never double-count adjustment chains in financial metrics; never update prior versions in place.

---

## Story 3: `CF-V3-E8-05` — Silver Raw to Silver ODS Stage — Canonical Loading
* **Epic**: Epic 8 (Medallion Execution Engine & Compiler)
* **Persona**: Data Engineer (Standard Flow)

### 1. STORY PURPOSE & BUSINESS PROBLEM
* **The Business Problem**: Raw data in Silver Raw must be transformed into certified canonical ODS tables. Without standardized surrogate key generation, effective-dated history tracking, and business deduplication, member dimensions become fragmented.
* **CINQFlow's Solution**: Extends the execution engine to apply canonical mappings, resolve identity crosswalks, generate surrogate keys, execute deterministic business deduplication, track effective-dated history, and load canonical facts, dimensions, and bridge tables.

### 2. EVERY SECTION EXPLAINED
* **Change-Capture & History Engine**: Supports `Current-Only` in-place updates vs `Effective-Dated` SCD Type 2 history.
* **Precedence-Based Business Deduplication**: Merges duplicate rows using configurable payer/source precedence rules while retaining lost values in history logs.
* **Surrogate Key & Source Crosswalk Generator**: Appends platform surrogate keys while preserving raw source identifiers on every row.
* **Don'ts**: Never load a record whose identity is unresolved—unresolved identities hold visibly for exception processing.

---

## Story 4: `CF-V3-E9-01` — Verato Identity Stage in the Pipeline
* **Epic**: Epic 9 (Identity Resolution & LinkId Crosswalk)
* **Persona**: Data Engineer (Standard Flow)

### 1. STORY PURPOSE & BUSINESS PROBLEM
* **The Business Problem**: Healthcare members exist across multiple payers (Molina, Optum, Fidelis, CMS). Without a enterprise Master Person Index (MPI), the same patient has different local IDs, rendering 360-degree patient analytics impossible.
* **CINQFlow's Solution**: Embeds an automated Verato identity resolution stage into the Medallion pipeline. Extracts identity attributes, calls Verato APIs with retries, stores request/response payloads with SHA-256 hashes, and maintains the `linkId` crosswalk table.

### 2. EVERY SECTION EXPLAINED
* **Identity Pipeline Stage Controls**:
  * Standardized Verato API Request Generator.
  * Audit Payload Storage (stores exact JSON request/response with hash signatures).
  * Exponential Backoff Retry Handler.
* **Identity Reconciliation Equation**:
  $$\text{Submitted Records} = \text{Resolved (linkId)} + \text{Unresolved (Quarantine)} + \text{Failed (Retry)}$$
* **Happy Path Proof**: Out of $10,000$ input records: $9,940$ resolve instantly, $42$ resolve on retry, $18$ move to exception queue ($9,940 + 42 + 18 = 10,000$).
* **Don'ts**: Never fabricate a `linkId`; never send member attributes outside the approved request specification.

---

## Story 5: `CF-V3-E9-02` — Identity Exception Queue
* **Epic**: Epic 9 (Identity Resolution & LinkId Crosswalk)
* **Persona**: Data Steward (Standard Flow)

### 1. STORY PURPOSE & BUSINESS PROBLEM
* **The Business Problem**: Identity resolution failures (unresolved records, low-confidence matches, API errors) historically fell into black-hole log files without clear ownership, SLA deadlines, or deduplication.
* **CINQFlow's Solution**: A centralized Identity Exception Queue that deduplicates occurrences (same person failing in 3 batches = 1 item with 3 occurrences), tracks queue aging, assigns items to stewards, and automatically re-injects resolved records back into the ODS pipeline.

### 2. EVERY SECTION EXPLAINED
* **Deduplicated Exception Grid**: Groups multiple failure occurrences under a single master person exception card.
* **Source Demographics Health Dashboard**: Visualizes failure counts by originating payer to flag payers sending dirty demographic data.
* **SLA Aging & Escalation Matrix**: Auto-escalates un-actioned items to steward managers upon SLA expiry.
* **Don'ts**: Never auto-resolve identity exceptions without human governance.

---

## Story 6: `CF-V3-E9-03` — Merge & Split Decisions — Evidence Card & Consequence Preview
* **Epic**: Epic 9 (Identity Resolution & LinkId Crosswalk)
* **Persona**: Data Steward (AI-Assisted Flow)

### 1. STORY PURPOSE & BUSINESS PROBLEM
* **The Business Problem**: Merging two patient profiles (or splitting one profile) is the highest-risk action in healthcare. Incorrect merges link one patient's medical history to another person.
* **CINQFlow's Solution**: AI prepares a comprehensive **Evidence Card** (side-by-side demographics, source history, prior identity events) and a **Consequence Preview** (showing exactly which addresses repoint, which claims re-link). **The final merge/split execution requires explicit human steward approval—100% human-in-the-loop.**

### 2. EVERY SECTION EXPLAINED
* **AI Evidence Card Component**: Side-by-side demographic diff (Name, DOB, SSN, Zip, Prior Addresses).
* **Consequence Preview Modal**: Explicitly lists re-pointing impacts (e.g. *"2 addresses repoint, 1 duplicate collapses, Member C2 marked merged-to-C1"*).
* **Post-Change Verification Engine**: Re-evaluates target state post-execution to verify 100% alignment with preview.
* **Flip-Flop Detector**: Flags records oscillating between merge/split states across runs.
* **Don'ts**: NEVER execute a merge or split automatically, at any confidence level, under any condition.

---

## Story 7: `CF-V3-E9-04` — Identity Reconciliation & Cutover Telemetry
* **Epic**: Epic 9 (Identity Resolution & LinkId Crosswalk)
* **Persona**: Operations (Standard Flow)

### 1. STORY PURPOSE & BUSINESS PROBLEM
* **The Business Problem**: Migrating off legacy SQL Server patient keys to `linkId` is historically a high-risk "leap of faith" with no empirical proof of key parity.
* **CINQFlow's Solution**: Automates daily identity accounting scorecards (`Submitted = Resolved + Unresolved + Failed`) and coverage telemetry (`linkId` vs legacy `OurID` coverage % over time), providing empirical evidence for legacy key cutover.

### 2. EVERY SECTION EXPLAINED
* **Daily Identity Parity Scorecard**: Automated daily check verifying 100% key parity between lake and legacy DB.
* **Coverage Telemetry Trend Chart**: Tracks both-keys coverage percentage per payer (e.g., Fidelis at `99.8%` for 30 consecutive days).
* **Coverage Regression Alerting**: Triggers alerts if a payer's match rate drops unexpectedly.
* **Don'ts**: Never write data to legacy databases; never report coverage without showing the denominator.

---

## Story 8: `CF-V3-E10-01` — Deploy the Canonical ODS Model as Versioned Truth
* **Epic**: Epic 10 (Canonical ODS Model & Versioned Schema)
* **Persona**: Data Engineer (Standard Flow)

### 1. STORY PURPOSE & BUSINESS PROBLEM
* **The Business Problem**: Healthcare data models often live in contested spreadsheets ("draft" vs "final"), leading to schema mismatches when pipelines load data into production tables.
* **CINQFlow's Solution**: Deploys approved canonical model workbooks (Member, Enrollment, Claims, Lines, Diagnosis/Procedure, Provider, Encounter) as versioned, managed database tables with surrogate keys, raw source key retention, and audit headers.

### 2. EVERY SECTION EXPLAINED
* **Workbook Discrepancy Resolver**: Side-by-side decision tool to resolve draft vs final workbook differences before deployment.
* **Versioned DDL Deployment Engine**: Deploys tables tagged with semantic version IDs (e.g., `v3.0.0`).
* **Audit Column Injector**: Mandates `_batch_id`, `_source_id`, `_created_at`, `_updated_at` on every table.
* **Don'ts**: Never deploy any entity whose workbook discrepancies remain undecided.

---

## Story 9: `CF-V3-E10-02` — Model Versions and the Downstream Data Contract
* **Epic**: Epic 10 (Canonical ODS Model & Versioned Schema)
* **Persona**: Business Analyst (Standard Flow)

### 1. STORY PURPOSE & BUSINESS PROBLEM
* **The Business Problem**: Downstream analytics teams are surprised when ODS schema changes break their dashboards and reports.
* **CINQFlow's Solution**: Extends the Model Browser with version diff views ("what changed and why"), stable downstream data contract pages, deprecation lead-time notices, and automated consumer impact analysis based on data lineage graphs.

### 2. EVERY SECTION EXPLAINED
* **Visual Model Version Diff Tool**: Highlights added, modified, or deprecated fields between schema versions.
* **Downstream Contract Portal**: Public schema contract page linking directly to ODS table definitions.
* **Lineage-Based Consumer Impact Analyzer**: Automatically identifies and notifies affected downstream report owners prior to breaking changes.
* **Don'ts**: Never present proposed schema changes as live before formal release.

---

## Story 10: `CF-V3-E10-03` — ODS Certification & Consumer Compatibility Gate
* **Epic**: Epic 10 (Canonical ODS Model & Versioned Schema)
* **Persona**: Data Steward (Standard Flow)

### 1. STORY PURPOSE & BUSINESS PROBLEM
* **The Business Problem**: Downstream systems consume ODS data without knowing if relational integrity checks passed, risking corrupted reports (e.g., claims referencing non-existent members).
* **CINQFlow's Solution**: Enforces a strict automated publication gate for Silver ODS. Validates relationship integrity (orphaned claims, dangling provider references), verifies contract compatibility, holds publication on failure, and atomically notifies registered downstream consumers upon success.

### 2. EVERY SECTION EXPLAINED
* **Relational Integrity Validator**: Scans for orphaned claims or dangling foreign keys before publication.
* **Atomic Publication Gate**: Ensures a batch is published to downstream consumers **in full or not at all**.
* **Self-Approval Blocker**: Enforces segregation of duties—authors can never approve their own schema changes.
* **Don'ts**: Never publish partially; never let changes bypass named approver gates.

---

## Story 11: `CF-V3-E13-02` — Financial & Member Reconciliation Packs
* **Epic**: Epic 13 (Financial Balancing & Audit Matrix)
* **Persona**: Operations (Standard Flow)

### 1. STORY PURPOSE & BUSINESS PROBLEM
* **The Business Problem**: Count-only reconciliation misses silent data corruption, such as correct row counts with incorrect dollar amounts or a shrunken member universe.
* **CINQFlow's Solution**: Extends reconciliation to financial totals by payer and month (properly netting adjustment chains) and set-wise member universe comparisons across layers and legacy systems during coexistence.

### 2. EVERY SECTION EXPLAINED
* **Netted Financial Reconciliation Pack**: Calculates paid/allowed/billed amounts with adjustment chains netted correctly:
  $$\text{Reconciled Dollars} = \sum \text{Paid}_{\text{Original}} + \sum \text{Paid}_{\text{Adjustment}} - \sum \text{Paid}_{\text{Cancellation}}$$
* **Set-Wise Member Universe Comparator**: Evaluates member sets mathematically ($A \setminus B$ and $B \setminus A$) to identify exact missing or extra member IDs rather than just comparing aggregate totals.
* **Coexistence Drift Trending**: Tracks member universe stability over time against legacy databases.
* **Don'ts**: Never compare financial totals without applying netting rules; raw sums of claim events produce incorrect balances by construction.

---

## Wave 3 Master User Story Matrix

| Story ID | Story Title | Epic | Persona | Flow Type | Primary Value Proposition |
| :---: | :--- | :--- | :--- | :---: | :--- |
| `CF-V3-E5-05` | Profiling for Complex Formats | Epic 5 | Business Analyst | Standard | Profile FHIR EOB NDJSON, HL7 & fixed-width |
| `CF-V3-E6-05` | Structural Transforms for Complex Formats | Epic 6 | Data Engineer | Standard | Flatten FHIR claims & derive netted claim lineage |
| `CF-V3-E8-05` | Silver Raw to Silver ODS Stage | Epic 8 | Data Engineer | Standard | Canonical loading, surrogate keys & dedup |
| `CF-V3-E9-01` | Verato Identity Stage in Pipeline | Epic 9 | Data Engineer | Standard | Verato API integration & `linkId` crosswalk |
| `CF-V3-E9-02` | Identity Exception Queue | Epic 9 | Data Steward | Standard | Deduplicated queue for identity resolution errors |
| `CF-V3-E9-03` | Merge & Split Decisions | Epic 9 | Data Steward | **AI** | AI evidence card + human-always approval |
| `CF-V3-E9-04` | Identity Reconciliation & Telemetry | Epic 9 | Operations | Standard | Daily identity parity & legacy key cutover proof |
| `CF-V3-E10-01`| Deploy Canonical ODS Model | Epic 10 | Data Engineer | Standard | Managed versioned ODS tables from workbooks |
| `CF-V3-E10-02`| Model Versions & Downstream Contract | Epic 10 | Business Analyst | Standard | Version diffs & consumer impact analysis |
| `CF-V3-E10-03`| ODS Certification & Consumer Gate | Epic 10 | Data Steward | Standard | Relational integrity validation & publication gate |
| `CF-V3-E13-02`| Financial & Member Reconciliation Packs | Epic 13 | Operations | Standard | Netted claim dollar balancing & set-wise member check |
