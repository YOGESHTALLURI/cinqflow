import React from 'react';
import { useApp } from '../../context/AppContext';
import { GitCommit, CheckCircle2, AlertOctagon, XCircle, ShieldCheck } from 'lucide-react';

export const SchemaDriftInspector: React.FC = () => {
  const { schemaDrifts, resolveSchemaDrift } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
            <GitCommit className="w-7 h-7 text-amber-400" />
            <span>Inbound Schema Drift Detection & Business Classification</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Automated detection of new, missing, or altered columns in inbound batch files with business impact analysis.
          </p>
        </div>

        <span className="px-3 py-1 bg-amber-950 text-amber-300 border border-amber-800 rounded-full text-xs font-semibold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Schema Guard Active</span>
        </span>
      </div>

      {/* Active Schema Drifts */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Detected Inbound Schema Changes</h3>

        {schemaDrifts.map((sd) => (
          <div key={sd.id} className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold">{sd.feedName}</span>
                <h3 className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
                  <span>Field:</span>
                  <code className="text-amber-300 font-mono bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">{sd.fieldName}</code>
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                  sd.impact === 'Breaking' 
                    ? 'bg-rose-950 text-rose-400 border border-rose-800' 
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  {sd.impact} Impact
                </span>
                <span className="text-xs text-slate-400 font-mono">{sd.detectedAt}</span>
              </div>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-semibold text-slate-200">Change Classification: <strong className="text-cyan-300">{sd.changeType}</strong></span>
              </div>
              <p className="text-slate-300 leading-relaxed">{sd.details}</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">
                Status: <strong className="text-white">{sd.status}</strong>
              </span>

              {sd.status === 'Detected' ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => resolveSchemaDrift(sd.id, 'Rejected')}
                    className="px-4 py-2 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-semibold rounded-xl flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject Batch & Enforce Contract</span>
                  </button>

                  <button
                    onClick={() => resolveSchemaDrift(sd.id, 'Accepted')}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Accept Drift & Update Data Contract</span>
                  </button>
                </div>
              ) : (
                <span className="text-xs font-bold text-emerald-400">Resolution Applied: {sd.status}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
