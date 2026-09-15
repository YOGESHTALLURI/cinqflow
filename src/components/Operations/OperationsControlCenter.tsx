import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Activity, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  PauseCircle, 
  Play, 
  ShieldAlert, 
  TrendingUp, 
  TrendingDown, 
  BookOpen,
  UserPlus
} from 'lucide-react';

export const OperationsControlCenter: React.FC = () => {
  const { 
    failureFingerprints, 
    reliabilityTrends, 
    incidentActions, 
    acknowledgeIncident, 
    assignIncidentOwner, 
    pauseFeedIngestion, 
    triggerBatchRetry,
    reprocessBatchRecovery,
    userRole
  } = useApp();

  const [selectedOwner, setSelectedOwner] = useState('Elena Rostova (Data Engineer)');
  const [selectedRecoveryMode, setSelectedRecoveryMode] = useState<'restart' | 'reprocess' | 'backdate'>('reprocess');
  const [recoveryBatchInput, setRecoveryBatchInput] = useState('BATCH-20260909-004');
  const [justRecovered, setJustRecovered] = useState(false);

  const handleAction = (incidentId: string, actionType: 'ack' | 'assign' | 'pause' | 'retry') => {
    if (actionType === 'ack') {
      acknowledgeIncident(incidentId);
    } else if (actionType === 'assign') {
      assignIncidentOwner(incidentId, selectedOwner);
    } else if (actionType === 'pause') {
      pauseFeedIngestion('feed-004');
    } else if (actionType === 'retry') {
      triggerBatchRetry(incidentId);
    }
  };

  const handleExecuteRecovery = () => {
    reprocessBatchRecovery(recoveryBatchInput, selectedRecoveryMode);
    setJustRecovered(true);
    setTimeout(() => setJustRecovered(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
            <Activity className="w-7 h-7 text-indigo-400" />
            <span>Governed Operations Action Center & Recovery Console</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            AI failure fingerprinting, runbook guide matching, governed incident actions, and batch recovery controls.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
          <span className="text-slate-400">Active Persona:</span>
          <span className="font-bold text-cyan-300 font-mono uppercase">{userRole}</span>
        </div>
      </div>

      {/* Governed Recovery Controls Card (CF-V2-E8-04) */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Governed Batch Recovery Workstation</h3>
          </div>
          <span className="text-xs text-emerald-400 font-mono font-semibold">Idempotency Lock Active (0 Duplicate Risk)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Select Recovery Mode</label>
            <select
              value={selectedRecoveryMode}
              onChange={(e) => setSelectedRecoveryMode(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 outline-none focus:border-cyan-500 font-mono"
            >
              <option value="restart">Restart Pipeline Run (Failed Stage)</option>
              <option value="reprocess">Reprocess Batch (Full Idempotent Re-run)</option>
              <option value="backdate">Backdate Execution Window (Historical Date)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Target Batch ID</label>
            <input
              type="text"
              value={recoveryBatchInput}
              onChange={(e) => setRecoveryBatchInput(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-cyan-300 font-mono outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleExecuteRecovery}
              className="w-full px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-xs rounded-lg shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Execute Governed {selectedRecoveryMode.toUpperCase()} Recovery</span>
            </button>
          </div>
        </div>

        {justRecovered && (
          <div className="bg-emerald-950/80 p-3 rounded-xl border border-emerald-800 text-xs text-emerald-300 font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Recovery operation completed! Pipeline re-executed idempotently and updated the Pipeline Engine.</span>
          </div>
        )}
      </div>

      {/* AI Failure Fingerprinting & Runbook Guide Matching (CF-V2-E12-04) */}
      <div className="glass-card rounded-2xl p-6 border border-purple-500/30 bg-slate-900/60 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Failure Fingerprinting & Runbook Matcher</h3>
          </div>
          <span className="text-xs text-purple-300 font-mono">95% Fingerprint Precision</span>
        </div>

        {failureFingerprints.map((fp) => (
          <div key={fp.id} className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span className="font-mono text-xs font-bold text-rose-400">{fp.errorCode}</span>
                <span className="text-xs font-bold text-slate-200">{fp.rootCause}</span>
              </div>
              <span className="text-[11px] text-purple-300 font-mono bg-purple-950 px-2.5 py-1 rounded border border-purple-800 font-semibold">
                Prior Occurrences: {fp.priorOccurrences} times (Mean Fix: {fp.meanFixTimeMinutes}m)
              </span>
            </div>

            {/* Runbook Match */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-purple-400 block flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  <span>Matched Recovery Runbook ({fp.runbookId})</span>
                </span>
                <p className="font-semibold text-slate-200">{fp.runbookTitle}</p>
                <p className="text-slate-400 text-[11px]">Proposed Resolution: <strong className="text-cyan-300">{fp.proposedFix}</strong></p>
              </div>

              {/* Evidence Bundle */}
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1 font-mono text-[11px]">
                <span className="text-[10px] font-bold text-slate-400 block font-sans">Cited Evidence Rows:</span>
                {fp.evidenceRows.map((ev, idx) => (
                  <div key={idx} className="flex justify-between text-slate-300 border-b border-slate-800/60 py-0.5">
                    <span className="text-cyan-400">{ev.field}</span>
                    <span className="text-rose-400">{ev.error}</span>
                    <span className="text-slate-500">{ev.sample}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Surface Buttons (CF-V2-E12-03) */}
            <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-800/80 gap-2">
              <div className="flex items-center gap-2">
                <select
                  value={selectedOwner}
                  onChange={(e) => setSelectedOwner(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded px-2.5 py-1 outline-none"
                >
                  <option value="Elena Rostova (Data Engineer)">Elena Rostova (Data Engineer)</option>
                  <option value="Marcus Vance (Data Steward)">Marcus Vance (Data Steward)</option>
                  <option value="Sarah Jenkins (Lead BA)">Sarah Jenkins (Lead BA)</option>
                </select>

                <button
                  onClick={() => handleAction(fp.incidentId, 'assign')}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded border border-slate-700 flex items-center gap-1"
                >
                  <UserPlus className="w-3 h-3" />
                  <span>Assign Owner</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAction(fp.incidentId, 'pause')}
                  className="px-3 py-1 bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-800 text-xs font-semibold rounded flex items-center gap-1"
                >
                  <PauseCircle className="w-3.5 h-3.5" />
                  <span>Pause Ingestion</span>
                </button>

                <button
                  onClick={() => handleAction(fp.incidentId, 'retry')}
                  className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded flex items-center gap-1 shadow-md shadow-cyan-600/20"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Trigger Batch Retry</span>
                </button>

                <button
                  onClick={() => handleAction(fp.incidentId, 'ack')}
                  className="px-4 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded flex items-center gap-1 shadow-md shadow-emerald-600/20"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Acknowledge & Resolve</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Feed Reliability Trends & Intelligence (CF-V2-E12-05) */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Enriched Feed Reliability Trends</h3>
          <span className="text-[11px] text-slate-400">Decomposed Reliability Ingredients</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reliabilityTrends.map((rt) => (
            <div key={rt.feedId} className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-cyan-400">{rt.feedCode}</span>
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                  {rt.trendDirection === 'Up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4 text-rose-400" />}
                  <span>{rt.trendDirection}</span>
                </span>
              </div>

              <h4 className="text-xs font-bold text-white line-clamp-1">{rt.feedName}</h4>

              <div className="flex items-end justify-between border-t border-slate-800 pt-2">
                <div>
                  <span className="text-[10px] text-slate-400 block">Overall Reliability Score:</span>
                  <span className="text-xl font-extrabold text-emerald-400 font-mono">{rt.overallReliabilityScore}%</span>
                </div>
                <div className="text-right text-[10px] space-y-0.5 font-mono text-slate-400">
                  <div>DQ Score: <strong className="text-slate-200">{rt.dqScore}%</strong></div>
                  <div>SLA Compliance: <strong className="text-slate-200">{rt.slaComplianceScore}%</strong></div>
                  <div>Reconciliation: <strong className="text-slate-200">{rt.reconciliationScore}%</strong></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Log Trail of Incident Actions */}
      {incidentActions.length > 0 && (
        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-2">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Governed Ops Action Audit Log ({incidentActions.length})</h3>
          <div className="space-y-1 font-mono text-xs text-slate-300">
            {incidentActions.map((act: any) => (
              <div key={act.id} className="bg-slate-900 p-2 rounded flex justify-between">
                <span className="text-cyan-400 font-bold">[{act.actor}] {act.actionType}</span>
                <span className="text-slate-400">{act.notes}</span>
                <span className="text-slate-500">{act.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
