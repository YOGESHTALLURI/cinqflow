import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { MedallionLayer } from '../../types';
import { 
  Workflow, 
  Play, 
  ShieldAlert, 
  Database, 
  Layers, 
  FileText, 
  UserCheck, 
  Terminal, 
  ChevronRight
} from 'lucide-react';

export const PipelineEngine: React.FC = () => {
  const { feeds, pipelineRuns, runPipeline, selectedFeedId, setSelectedFeedId } = useApp();
  const [activeStageTab, setActiveStageTab] = useState<MedallionLayer>('Silver ODS');
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedFeed = feeds.find(f => f.id === selectedFeedId) || feeds[0];
  const latestRun = pipelineRuns.find(r => r.feedId === selectedFeed?.id) || pipelineRuns[0];

  const stages: { layer: MedallionLayer; title: string; desc: string; icon: any }[] = [
    { layer: 'Landing', title: '1. Landing Zone', desc: 'File arrival, checksum & batch registration', icon: FileText },
    { layer: 'Bronze', title: '2. Bronze Layer', desc: 'Raw append store & audit lineage metadata', icon: Layers },
    { layer: 'Silver Raw', title: '3. Silver Raw', desc: 'Schema contract, parsing & DQ quarantine filter', icon: ShieldAlert },
    { layer: 'Identity Resolution', title: '4. Identity Resolution', desc: 'MPI Link ID person crosswalk matching', icon: UserCheck },
    { layer: 'Silver ODS', title: '5. Silver ODS', desc: 'Canonical member-centric operational model', icon: Database },
  ];

  const handleSimulateRun = () => {
    if (!selectedFeed) return;
    setIsProcessing(true);
    setTimeout(() => {
      runPipeline(selectedFeed.id);
      setIsProcessing(false);
    }, 1200);
  };

  const getLogs = (): string[] => {
    if (!latestRun || !latestRun.logTrace) return [];
    if (Array.isArray(latestRun.logTrace)) return latestRun.logTrace;
    if (typeof latestRun.logTrace === 'string') {
      try {
        const parsed = JSON.parse(latestRun.logTrace);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return [latestRun.logTrace];
      }
    }
    return [];
  };

  const getStageStat = (layer: MedallionLayer) => {
    if (!latestRun || !latestRun.stageStats) return undefined;
    let statsObj: any = latestRun.stageStats;
    if (typeof statsObj === 'string') {
      try {
        statsObj = JSON.parse(statsObj);
      } catch {
        return undefined;
      }
    }
    return statsObj ? statsObj[layer] : undefined;
  };

  const getOdsRows = (): any[] => {
    if (latestRun && latestRun.validOdsRows) {
      let rowsObj = latestRun.validOdsRows;
      if (typeof rowsObj === 'string') {
        try {
          rowsObj = JSON.parse(rowsObj);
        } catch {
          rowsObj = [];
        }
      }
      if (Array.isArray(rowsObj) && rowsObj.length > 0) return rowsObj;
    }
    return [
      {
        surrogateKey: 'ODS-MBR-0010291',
        linkId: 'LNK-8849-0129',
        sourceMemberId: 'AET984210',
        memberName: 'JOHN SMITH',
        planCode: 'HMO-GOLD-01',
        effectiveDate: '2026-01-01',
        status: 'ODS Inserted'
      },
      {
        surrogateKey: 'ODS-MBR-0010292',
        linkId: 'LNK-8849-0130',
        sourceMemberId: 'AET984211',
        memberName: 'ELEANOR VANCE',
        planCode: 'PPO-SILV-02',
        effectiveDate: '2026-01-01',
        status: 'ODS Inserted'
      }
    ];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
            <Workflow className="w-7 h-7 text-cyan-400" />
            <span>Medallion Pipeline & Canonical Execution Engine</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Automated processing from Landing Zone through Bronze → Silver Raw → Identity Resolution → Silver ODS.
          </p>
        </div>

        {/* Feed Selector & Trigger */}
        <div className="flex items-center gap-3">
          <select
            value={selectedFeed?.id || ''}
            onChange={(e) => setSelectedFeedId(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-100 outline-none focus:border-cyan-500"
          >
            {feeds.map(f => (
              <option key={f.id} value={f.id}>{f.feedCode} - {f.feedName}</option>
            ))}
          </select>

          <button
            onClick={handleSimulateRun}
            disabled={isProcessing}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
          >
            <Play className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
            <span>{isProcessing ? 'Processing Pipeline...' : 'Trigger Pipeline Run'}</span>
          </button>
        </div>
      </div>

      {/* Visual Medallion Flow Pipeline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {stages.map((stg) => {
          const Icon = stg.icon;
          const stat = getStageStat(stg.layer);
          const isSelected = activeStageTab === stg.layer;

          return (
            <button
              key={stg.layer}
              onClick={() => setActiveStageTab(stg.layer)}
              className={`glass-card p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
                isSelected 
                  ? 'border-cyan-500/60 bg-cyan-950/20 ring-1 ring-cyan-500/40 shadow-lg' 
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center border border-slate-700">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  {stat?.durationMs ? `${stat.durationMs}ms` : 'Active'}
                </span>
              </div>

              <h4 className="text-xs font-bold text-white mb-0.5">{stg.title}</h4>
              <p className="text-[10px] text-slate-400 leading-tight line-clamp-2">{stg.desc}</p>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                <span className="text-slate-500">Processed:</span>
                <span className="font-mono font-bold text-cyan-300">
                  {stat?.recordsOut ? stat.recordsOut.toLocaleString() : '10,000'} Recs
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Stage Detail Inspector */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-4 gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-cyan-400" />
              <span>Inspection View: {activeStageTab} Layer Output Data</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Batch: <span className="font-mono text-cyan-300">{latestRun?.batchId}</span> | File: <span className="font-mono text-slate-300">{latestRun?.fileName}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-400">Identity Matches: <strong className="text-emerald-400 font-mono">{latestRun?.identityMatchesCount}</strong></span>
            <span className="text-slate-400">Reconciliation: <strong className="text-cyan-400 font-mono">{latestRun?.reconciliationStatus}</strong></span>
          </div>
        </div>

        {/* Stage Records Preview Table */}
        <div className="glass-card rounded-xl overflow-hidden border border-slate-800">
          <div className="px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 text-xs font-bold text-slate-300 flex justify-between">
            <span>Canonical Data Preview ({activeStageTab})</span>
            <span className="text-slate-500 text-[11px] font-mono">ODS Schema Version 1.4</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="bg-slate-900/60 text-[11px] text-slate-400 border-b border-slate-800">
                  <th className="px-4 py-2">Surrogate Key</th>
                  <th className="px-4 py-2">Link ID (MPI)</th>
                  <th className="px-4 py-2">Source Member ID</th>
                  <th className="px-4 py-2">Member Name</th>
                  <th className="px-4 py-2">Plan Code</th>
                  <th className="px-4 py-2">Effective Date</th>
                  <th className="px-4 py-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-[11px]">
                {getOdsRows().map((row: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="px-4 py-2.5 text-cyan-300">{row.surrogateKey || row.id || `ODS-${idx+1}`}</td>
                    <td className="px-4 py-2.5 text-indigo-400">{row.linkId || `LNK-8849-01${idx+1}`}</td>
                    <td className="px-4 py-2.5 text-slate-300">{row.sourceMemberId || row.memberId || '-'}</td>
                    <td className="px-4 py-2.5 text-slate-200">{row.memberName || row.name || '-'}</td>
                    <td className="px-4 py-2.5 text-slate-400">{row.planCode || row.plan || '-'}</td>
                    <td className="px-4 py-2.5 text-slate-400">{row.effectiveDate || row.effDate || '2026-01-01'}</td>
                    <td className="px-4 py-2.5 text-right font-bold text-emerald-400">{row.status || 'ODS Inserted'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Terminal Log Console */}
        <div className="glass-card rounded-xl p-4 border border-slate-800 bg-slate-950 font-mono text-xs text-slate-300 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold border-b border-slate-900 pb-2">
            <Terminal className="w-4 h-4" />
            <span>Execution Trace Log (Batch {latestRun?.batchId})</span>
          </div>

          <div className="space-y-1 text-[11px] max-h-40 overflow-y-auto pr-2">
            {getLogs().map((log, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <ChevronRight className="w-3 h-3 text-cyan-500 shrink-0 mt-0.5" />
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
