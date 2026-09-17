import React, { useState } from 'react';
import { MOCK_IDENTITY_TELEMETRY } from '../../data/mockWave3Data';
import { Activity, ShieldCheck, ArrowUpRight } from 'lucide-react';


export const IdentityCutoverTelemetry: React.FC = () => {
  const [telemetry] = useState(MOCK_IDENTITY_TELEMETRY[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Activity className="w-7 h-7 text-emerald-400" />
              Identity Reconciliation & Cutover Telemetry
            </h2>
            <span className="px-2 py-0.5 text-xs font-bold rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
              Wave 3 · CF-V3-E9-04
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Empirical telemetry tracking LinkId vs legacy SQL Server OurID coverage percentage over time for evidence-based cutover readiness.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <span className="text-xs text-slate-400">Cutover Readiness Score</span>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">
            {telemetry.cutoverReadinessScore}%
          </div>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1 font-mono">
            <ArrowUpRight className="w-3 h-3" /> Ready for Legacy Key Cutover
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <span className="text-xs text-slate-400">Fidelis Both-Keys Coverage</span>
          <div className="text-2xl font-extrabold text-cyan-400 font-mono mt-1">
            {telemetry.fidelisBothKeysCoveragePct}%
          </div>
          <span className="text-[10px] text-slate-400 block mt-1 font-mono">30 Consecutive Days Stable</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <span className="text-xs text-slate-400">Optum Both-Keys Coverage</span>
          <div className="text-2xl font-extrabold text-purple-400 font-mono mt-1">
            {telemetry.optumBothKeysCoveragePct}%
          </div>
          <span className="text-[10px] text-slate-400 block mt-1 font-mono">Passed Parity Gate</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <span className="text-xs text-slate-400">Molina Both-Keys Coverage</span>
          <div className="text-2xl font-extrabold text-amber-400 font-mono mt-1">
            {telemetry.molinaBothKeysCoveragePct}%
          </div>
          <span className="text-[10px] text-amber-400 block mt-1 font-mono">Slight Drift Warning</span>
        </div>
      </div>

      {/* Standing Daily Scorecard Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Standing Daily Parity Scorecard (Lake vs Legacy Database)
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 bg-slate-950 rounded border border-slate-800">
            <div>
              <strong className="text-white font-mono">Daily Identity Parity Assertion</strong>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Submitted ({telemetry.submittedCount.toLocaleString()}) = Resolved ({telemetry.resolvedCount.toLocaleString()}) + Unresolved ({telemetry.unresolvedCount}) + Failed ({telemetry.failedRetryCount})
              </p>
            </div>
            <span className="px-2.5 py-1 text-xs font-bold rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
              PARITY PASSED
            </span>
          </div>

          <div className="p-4 bg-slate-950 rounded border border-slate-800 space-y-2">
            <span className="text-slate-300 font-bold">Cutover Evidence Summary:</span>
            <p className="text-slate-400 text-xs">
              Key parity between CINQFlow Delta Lake and legacy SQL Server database has held for 30 consecutive days with zero unexplained key drops. Both-keys coverage denominator is verified at 10,000 members.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
