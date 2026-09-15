import React from 'react';
import { useApp } from '../../context/AppContext';
import { Activity, AlertTriangle, Server, Layers, TrendingUp } from 'lucide-react';

export const ObservabilityDashboard: React.FC = () => {
  const { feeds, pipelineRuns, quarantineRecords } = useApp();

  const totalProcessed = feeds.reduce((sum, f) => sum + (f.totalRecordsProcessed || 0), 0);
  const avgDqScore = (feeds.reduce((sum, f) => sum + (f.dqScore || 0), 0) / feeds.length).toFixed(1);
  const totalQuarantine = quarantineRecords.filter(r => r.status === 'Pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
            <Activity className="w-7 h-7 text-cyan-400" />
            <span>Operational Control & Observability Center</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Real-time feed monitoring, file arrival status, SLA tracking, and medallion pipeline metrics.
          </p>
        </div>
        <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-full text-xs font-semibold">
          Platform Operational Health: 99.8%
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Active Feeds</span>
            <Server className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{feeds.length}</p>
          <span className="text-[11px] text-emerald-400 font-semibold">100% Onboarded Wave 1</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Records Processed</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{totalProcessed.toLocaleString()}</p>
          <span className="text-[11px] text-cyan-400 font-semibold">Landing → Silver ODS</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Average Platform DQ Score</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-400">{avgDqScore}%</p>
          <span className="text-[11px] text-slate-400">Target SLA Threshold: 95.0%</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Pending Quarantines</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-extrabold text-rose-400">{totalQuarantine}</p>
          <span className="text-[11px] text-rose-300 font-semibold">Requires BA Action</span>
        </div>
      </div>

      {/* Live Pipeline Execution History */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="px-5 py-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200">Recent Batch Pipeline Execution Runs</span>
          <span className="text-xs text-slate-400 font-mono">Live Medallion Telemetry</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <th className="px-4 py-3">Batch ID</th>
                <th className="px-4 py-3">Feed Name</th>
                <th className="px-4 py-3">File Name</th>
                <th className="px-4 py-3">Stage</th>
                <th className="px-4 py-3">MPI Matches</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {pipelineRuns.map((run) => (
                <tr key={run.id} className="hover:bg-slate-800/40 transition-colors font-mono text-[11px]">
                  <td className="px-4 py-3 font-bold text-cyan-400">{run.batchId}</td>
                  <td className="px-4 py-3 font-sans font-semibold text-slate-200">{run.feedName}</td>
                  <td className="px-4 py-3 text-slate-400">{run.fileName}</td>
                  <td className="px-4 py-3 text-indigo-400 font-semibold">{run.currentStage}</td>
                  <td className="px-4 py-3 text-emerald-400">{run.identityMatchesCount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-950 text-emerald-300 rounded border border-emerald-800">
                      {run.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-slate-500">{run.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
