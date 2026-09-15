import type { FeedConfig, PipelineRun, QuarantineRecord } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

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
  }
};
