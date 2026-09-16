import type { FeedConfig, PipelineRun, QuarantineRecord, FileArrival, SchemaDrift, FailureFingerprint, VarianceInvestigation, ReconciliationReport } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? (import.meta.env.VITE_API_BASE_URL.endsWith('/api') ? import.meta.env.VITE_API_BASE_URL : `${import.meta.env.VITE_API_BASE_URL}/api`)
  : 'http://localhost:5000/api';

export const apiService = {
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      return res.ok;
    } catch {
      return false;
    }
  },

  async fetchFeeds(): Promise<FeedConfig[]> {
    const res = await fetch(`${API_BASE_URL}/feeds`);
    if (!res.ok) throw new Error('Failed to fetch feeds');
    return res.json();
  },

  async createFeed(feedData: Partial<FeedConfig>): Promise<FeedConfig> {
    const res = await fetch(`${API_BASE_URL}/feeds`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedData)
    });
    if (!res.ok) throw new Error('Failed to create feed');
    return res.json();
  },

  async parseSampleFile(fileName: string, content: string) {
    const res = await fetch(`${API_BASE_URL}/feeds/upload-sample`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName, content })
    });
    if (!res.ok) throw new Error('Failed to parse file');
    return res.json();
  },

  async runPipeline(feedId: string, fileName?: string, rawRows?: any[]) {
    const res = await fetch(`${API_BASE_URL}/pipelines/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feedId, fileName, rawRows })
    });
    if (!res.ok) throw new Error('Pipeline execution failed');
    return res.json();
  },

  async fetchPipelineRuns(): Promise<PipelineRun[]> {
    const res = await fetch(`${API_BASE_URL}/pipelines/runs`);
    if (!res.ok) throw new Error('Failed to fetch pipeline runs');
    return res.json();
  },

  async fetchQuarantineRecords(): Promise<QuarantineRecord[]> {
    const res = await fetch(`${API_BASE_URL}/quarantine`);
    if (!res.ok) throw new Error('Failed to fetch quarantine records');
    return res.json();
  },

  async fetchFileArrivals(): Promise<FileArrival[]> {
    const res = await fetch(`${API_BASE_URL}/file-arrivals`);
    if (!res.ok) throw new Error('Failed to fetch file arrivals');
    return res.json();
  },

  async fetchSchemaDrifts(): Promise<SchemaDrift[]> {
    const res = await fetch(`${API_BASE_URL}/schema-drifts`);
    if (!res.ok) throw new Error('Failed to fetch schema drifts');
    return res.json();
  },

  async updateSchemaDrift(id: string, status: 'Accepted' | 'Rejected'): Promise<SchemaDrift> {
    const res = await fetch(`${API_BASE_URL}/schema-drifts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update schema drift');
    return res.json();
  },

  async fetchFailureFingerprints(): Promise<FailureFingerprint[]> {
    const res = await fetch(`${API_BASE_URL}/failure-fingerprints`);
    if (!res.ok) throw new Error('Failed to fetch failure fingerprints');
    return res.json();
  },

  async fetchVariances(): Promise<VarianceInvestigation[]> {
    const res = await fetch(`${API_BASE_URL}/variances`);
    if (!res.ok) throw new Error('Failed to fetch variances');
    return res.json();
  },

  async submitVarianceWaiver(id: string, notes: string, expiryDays: number): Promise<VarianceInvestigation> {
    const res = await fetch(`${API_BASE_URL}/variances/${id}/waiver`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes, expiryDays })
    });
    if (!res.ok) throw new Error('Failed to submit variance waiver');
    return res.json();
  },

  async fetchReconciliations(): Promise<ReconciliationReport[]> {
    const res = await fetch(`${API_BASE_URL}/reconciliations`);
    if (!res.ok) throw new Error('Failed to fetch reconciliations');
    return res.json();
  }
};

