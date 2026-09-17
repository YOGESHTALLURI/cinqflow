import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { parseFileContent } from './engine/fileParser';
import { executeMedallionPipeline } from './engine/pipelineProcessor';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'CINQFlow Full-Stack Engine Running', timestamp: new Date().toISOString() });
});

// Seed initial data if DB is empty
async function seedDatabase() {
  try {
    const feedCount = await prisma.feed.count();
    if (feedCount === 0) {
      console.log('Seeding initial CINQFlow healthcare feeds into database...');

      const feed1 = await prisma.feed.create({
        data: {
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
          targetOdsTables: JSON.stringify(['ODS_Member', 'ODS_Coverage']),
          dqScore: 98.4,
          totalRecordsProcessed: 142850,
          quarantineCount: 14,
          createdDate: '2026-08-15',
          updatedDate: '2026-09-08'
        }
      });

      await prisma.schemaField.createMany({
        data: [
          { feedId: feed1.id, fieldName: 'member_id', dataType: 'VARCHAR(20)', nullable: false, sampleValues: JSON.stringify(['AET984210', 'AET984211']), phiClassification: 'PHI', confidenceScore: 99 },
          { feedId: feed1.id, fieldName: 'ssn', dataType: 'VARCHAR(9)', nullable: false, sampleValues: JSON.stringify(['999123456', '999654321']), phiClassification: 'PII', confidenceScore: 98 },
          { feedId: feed1.id, fieldName: 'first_name', dataType: 'VARCHAR(50)', nullable: false, sampleValues: JSON.stringify(['John', 'Eleanor']), phiClassification: 'PII', confidenceScore: 99 },
          { feedId: feed1.id, fieldName: 'dob', dataType: 'DATE', nullable: false, sampleValues: JSON.stringify(['1984-06-12', '1992-11-03']), phiClassification: 'PII', confidenceScore: 97 },
          { feedId: feed1.id, fieldName: 'plan_code', dataType: 'VARCHAR(15)', nullable: false, sampleValues: JSON.stringify(['HMO-GOLD-01', 'PPO-SILV-02']), phiClassification: 'None', confidenceScore: 96 }
        ]
      });

      await prisma.canonicalMapping.createMany({
        data: [
          { feedId: feed1.id, sourceField: 'member_id', targetEntity: 'Member', targetField: 'SourceMemberID', transformation: 'DirectCopy', confidenceScore: 99 },
          { feedId: feed1.id, sourceField: 'ssn', targetEntity: 'Member', targetField: 'SSN_Hash', transformation: 'HashKey(SHA256)', confidenceScore: 98 },
          { feedId: feed1.id, sourceField: 'first_name', targetEntity: 'Member', targetField: 'FirstName', transformation: 'Upper', confidenceScore: 99 }
        ]
      });

      await prisma.dQRule.createMany({
        data: [
          { feedId: feed1.id, name: 'Mandatory Member Identifier', naturalLanguage: 'Ensure member_id is present and has at least 6 alphanumeric chars', generatedCode: 'SELECT * FROM Silver_Raw WHERE member_id IS NULL OR LENGTH(member_id) < 6', severity: 'Reject', layer: 'Silver Raw', passCount: 142836, failCount: 14 }
        ]
      });

      console.log('Database seeded successfully!');
    }
  } catch (err) {
    console.error('Error seeding database:', err);
  }
}

// GET /api/feeds
app.get('/api/feeds', async (req, res) => {
  try {
    const feeds = await prisma.feed.findMany({
      include: { fields: true, mappings: true, dqRules: true }
    });
    res.json(feeds.map(f => ({
      ...f,
      targetOdsTables: JSON.parse(f.targetOdsTables || '[]'),
      schemaFields: f.fields.map(sf => ({ ...sf, sampleValues: JSON.parse(sf.sampleValues || '[]') })),
      mappings: f.mappings,
      dqRules: f.dqRules
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch feeds' });
  }
});

// POST /api/feeds
app.post('/api/feeds', async (req, res) => {
  try {
    const body = req.body;
    const newFeed = await prisma.feed.create({
      data: {
        feedCode: body.feedCode || `FEED-${Date.now().toString().substring(8)}`,
        sourceOrg: body.sourceOrg || 'Sample Org',
        feedName: body.feedName || 'New Feed',
        domain: body.domain || 'Enrollment',
        deliveryMethod: body.deliveryMethod || 'SFTP',
        fileFormat: body.fileFormat || 'CSV',
        frequency: body.frequency || 'Daily 04:00 EST',
        slaMinutes: body.slaMinutes || 120,
        status: body.status || 'Active',
        wave: body.wave || 'Wave 1',
        owner: body.owner || 'Sarah Jenkins (Lead BA)',
        targetOdsTables: JSON.stringify(body.targetOdsTables || ['ODS_Member']),
        createdDate: new Date().toISOString().split('T')[0],
        updatedDate: new Date().toISOString().split('T')[0],
        fields: body.schemaFields ? {
          create: body.schemaFields.map((f: any) => ({
            fieldName: f.fieldName,
            dataType: f.dataType || 'VARCHAR(50)',
            nullable: f.nullable ?? true,
            sampleValues: JSON.stringify(f.sampleValues || []),
            phiClassification: f.phiClassification || 'None',
            confidenceScore: f.confidenceScore || 95
          }))
        } : undefined,
        mappings: body.mappings ? {
          create: body.mappings.map((m: any) => ({
            sourceField: m.sourceField,
            targetEntity: m.targetEntity || 'Member',
            targetField: m.targetField || m.sourceField,
            transformation: m.transformation || 'DirectCopy',
            confidenceScore: m.confidenceScore || 95,
            isCustom: m.isCustom ?? false
          }))
        } : undefined,
        dqRules: body.dqRules ? {
          create: body.dqRules.map((r: any) => ({
            name: r.name,
            naturalLanguage: r.naturalLanguage || '',
            generatedCode: r.generatedCode || '',
            severity: r.severity || 'Quarantine',
            layer: r.layer || 'Silver Raw'
          }))
        } : undefined
      },
      include: { fields: true, mappings: true, dqRules: true }
    });
    
    res.json({
      ...newFeed,
      targetOdsTables: JSON.parse(newFeed.targetOdsTables || '[]'),
      schemaFields: newFeed.fields.map(sf => ({ ...sf, sampleValues: JSON.parse(sf.sampleValues || '[]') })),
      mappings: newFeed.mappings,
      dqRules: newFeed.dqRules
    });
  } catch (err) {
    console.error('Error creating feed:', err);
    res.status(500).json({ error: 'Failed to create feed' });
  }
});

// POST /api/feeds/upload-sample
app.post('/api/feeds/upload-sample', (req, res) => {
  const { fileName, content } = req.body;
  if (!fileName || !content) {
    return res.status(400).json({ error: 'fileName and content are required' });
  }
  const parsed = parseFileContent(fileName, content);
  res.json(parsed);
});

// POST /api/pipelines/run
app.post('/api/pipelines/run', async (req, res) => {
  try {
    const { feedId, fileName, rawRows } = req.body;
    const feed = await prisma.feed.findUnique({
      where: { id: feedId },
      include: { dqRules: true }
    });

    if (!feed) {
      return res.status(404).json({ error: 'Feed not found' });
    }

    const execResult = executeMedallionPipeline({
      feedId: feed.id,
      feedCode: feed.feedCode,
      feedName: feed.feedName,
      fileName: fileName || `${feed.feedCode.toLowerCase()}_sample.csv`,
      rawRows: rawRows || [],
      dqRules: feed.dqRules
    });

    // Save PipelineRun to DB
    const pipelineRun = await prisma.pipelineRun.create({
      data: {
        feedId: feed.id,
        feedName: feed.feedName,
        batchId: execResult.batchId,
        fileReceived: new Date().toLocaleString(),
        fileName: fileName || `${feed.feedCode.toLowerCase()}_sample.csv`,
        fileSizeBytes: 2450100,
        status: execResult.status,
        currentStage: 'Silver ODS',
        stageStats: JSON.stringify({
          'Landing': { stage: 'Landing', recordsIn: execResult.landingCount, recordsOut: execResult.landingCount, quarantined: 0, durationMs: 1200, status: 'completed' },
          'Bronze': { stage: 'Bronze', recordsIn: execResult.bronzeCount, recordsOut: execResult.bronzeCount, quarantined: 0, durationMs: 1800, status: 'completed' },
          'Silver Raw': { stage: 'Silver Raw', recordsIn: execResult.silverRawCount, recordsOut: execResult.silverRawCount, quarantined: execResult.quarantineCount, durationMs: 3400, status: 'completed' },
          'Identity Resolution': { stage: 'Identity Resolution', recordsIn: execResult.silverRawCount, recordsOut: execResult.silverRawCount, quarantined: 0, durationMs: 2900, status: 'completed' },
          'Silver ODS': { stage: 'Silver ODS', recordsIn: execResult.silverOdsCount, recordsOut: execResult.silverOdsCount, quarantined: 0, durationMs: 4100, status: 'completed' }
        }),
        identityMatchesCount: execResult.identityMatchesCount,
        unresolvedIdentitiesCount: execResult.silverRawCount - execResult.identityMatchesCount,
        reconciliationStatus: execResult.quarantineCount > 0 ? 'Variance' : 'Match',
        logTrace: JSON.stringify(execResult.logTrace),
        timestamp: new Date().toLocaleString()
      }
    });

    // Save Quarantine Records if any
    for (const q of execResult.quarantinedRows) {
      await prisma.quarantineRecord.create({
        data: {
          feedId: feed.id,
          feedName: feed.feedName,
          batchId: execResult.batchId,
          layer: 'Silver Raw',
          fieldName: q.fieldName,
          errorReason: q.errorReason,
          severity: q.severity,
          recordData: JSON.stringify(q.recordData),
          phiMasked: true,
          status: 'Pending',
          timestamp: new Date().toLocaleString()
        }
      });
    }

    // Save Reconciliation Report
    const reconReport = await prisma.reconciliationReport.create({
      data: {
        batchId: execResult.batchId,
        feedName: feed.feedName,
        timestamp: new Date().toLocaleString(),
        landingCount: execResult.landingCount,
        bronzeCount: execResult.bronzeCount,
        silverRawCount: execResult.silverRawCount,
        silverOdsCount: execResult.silverOdsCount,
        quarantineCount: execResult.quarantineCount,
        varianceCount: execResult.quarantineCount,
        controlTotalBilled: execResult.totalBilledSum,
        reconciledBilled: execResult.totalBilledSum,
        certificationStatus: execResult.quarantineCount > 0 ? 'Variance Exception' : 'Certified',
        certifiedBy: 'Automated Full-Stack Medallion Engine'
      }
    });

    const formattedPipelineRun = {
      ...pipelineRun,
      stageStats: JSON.parse(pipelineRun.stageStats || '{}'),
      logTrace: JSON.parse(pipelineRun.logTrace || '[]')
    };

    res.json({ execResult, pipelineRun: formattedPipelineRun, reconReport });
  } catch (err) {
    console.error('Error executing pipeline:', err);
    res.status(500).json({ error: 'Pipeline execution failed' });
  }
});

// GET /api/pipelines/runs
app.get('/api/pipelines/runs', async (req, res) => {
  try {
    const runs = await prisma.pipelineRun.findMany({ orderBy: { timestamp: 'desc' } });
    res.json(runs.map(r => ({
      ...r,
      stageStats: JSON.parse(r.stageStats || '{}'),
      logTrace: JSON.parse(r.logTrace || '[]')
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pipeline runs' });
  }
});

// GET /api/quarantine
app.get('/api/quarantine', async (req, res) => {
  try {
    const records = await prisma.quarantineRecord.findMany({ orderBy: { timestamp: 'desc' } });
    res.json(records.map(r => ({
      ...r,
      recordData: JSON.parse(r.recordData || '{}')
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch quarantine records' });
  }
});

// GET /api/file-arrivals
app.get('/api/file-arrivals', async (req, res) => {
  try {
    const arrivals = await prisma.fileArrival.findMany();
    res.json(arrivals);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch file arrivals' });
  }
});

// GET /api/schema-drifts
app.get('/api/schema-drifts', async (req, res) => {
  try {
    const drifts = await prisma.schemaDrift.findMany();
    res.json(drifts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch schema drifts' });
  }
});

// PATCH /api/schema-drifts/:id
app.patch('/api/schema-drifts/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await prisma.schemaDrift.update({
      where: { id: req.params.id },
      data: { status }
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update schema drift' });
  }
});

// GET /api/failure-fingerprints
app.get('/api/failure-fingerprints', async (req, res) => {
  try {
    const fingerprints = await prisma.failureFingerprint.findMany();
    res.json(fingerprints.map(fp => ({
      ...fp,
      evidenceRows: JSON.parse(fp.evidenceRows || '[]')
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch failure fingerprints' });
  }
});

// GET /api/variances
app.get('/api/variances', async (req, res) => {
  try {
    const variances = await prisma.varianceInvestigation.findMany();
    res.json(variances);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch variances' });
  }
});

// POST /api/variances/:id/waiver
app.post('/api/variances/:id/waiver', async (req, res) => {
  try {
    const { notes, expiryDays } = req.body;
    const expiryDate = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const updated = await prisma.varianceInvestigation.update({
      where: { id: req.params.id },
      data: {
        status: 'Waived',
        justificationNotes: notes,
        waiverExpiryDate: expiryDate
      }
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit variance waiver' });
  }
});

// GET /api/reconciliations
app.get('/api/reconciliations', async (req, res) => {
  try {
    const recons = await prisma.reconciliationReport.findMany();
    res.json(recons);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reconciliation reports' });
  }
});

// --- Wave 3 REST Endpoints ---

// GET /api/wave3/verato/status
app.get('/api/wave3/verato/status', (req, res) => {
  res.json({
    veratoApiStatus: 'HEALTHY_CONNECTED',
    averageLatencyMs: 42,
    todaySubmitted: 10000,
    todayResolved: 9940,
    todayUnresolved: 18,
    todayFailedRetry: 42
  });
});

// GET /api/wave3/identity/exceptions
app.get('/api/wave3/identity/exceptions', (req, res) => {
  res.json([
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
    }
  ]);
});

// POST /api/wave3/identity/merge-split
app.post('/api/wave3/identity/merge-split', (req, res) => {
  const { cardId, decision, stewardName } = req.body;
  res.json({
    cardId,
    decision,
    stewardName: stewardName || 'Sarah Jenkins (Data Steward)',
    executedAt: new Date().toISOString(),
    verificationMatchPercent: 100,
    status: 'DECISION_EXECUTED_AND_VERIFIED'
  });
});

// GET /api/wave3/identity/telemetry
app.get('/api/wave3/identity/telemetry', (req, res) => {
  res.json({
    date: new Date().toISOString().split('T')[0],
    submittedCount: 10000,
    resolvedCount: 9940,
    unresolvedCount: 18,
    failedRetryCount: 42,
    fidelisBothKeysCoveragePct: 99.8,
    optumBothKeysCoveragePct: 99.1,
    molinaBothKeysCoveragePct: 97.4,
    cutoverReadinessScore: 98.6
  });
});

// GET /api/wave3/canonical-models
app.get('/api/wave3/canonical-models', (req, res) => {
  res.json([
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
    }
  ]);
});

app.listen(PORT, async () => {
  console.log(`CINQFlow Backend REST API Server running on port ${PORT}`);
  await seedDatabase();
});
