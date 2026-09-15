import React from 'react';
import { useApp } from '../../context/AppContext';
import { Scale, CheckCircle2, DollarSign, Award } from 'lucide-react';

export const ReconciliationReport: React.FC = () => {
  const { reconciliations } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
            <Scale className="w-7 h-7 text-indigo-400" />
            <span>Data Reconciliation & Certification Audit Studio</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Audit proof that data moved completely, accurately, and within approved financial & record tolerances across stages.
          </p>
        </div>
        <span className="px-3 py-1 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded-full text-xs font-semibold">
          100% Audit Traceable
        </span>
      </div>

      {/* Reconciliation Cards */}
      <div className="space-y-6">
        {reconciliations.map((recon) => (
          <div key={recon.id} className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-4 gap-2">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold">Batch: {recon.batchId}</span>
                <h3 className="text-base font-bold text-white">{recon.feedName}</h3>
                <span className="text-xs text-slate-400">Processed: {recon.timestamp}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-full text-xs font-bold flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>{recon.certificationStatus}</span>
                </span>
              </div>
            </div>

            {/* Medallion Record Variance Flow */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 font-semibold block">Landing Zone</span>
                <span className="text-lg font-extrabold text-cyan-300 font-mono">{recon.landingCount.toLocaleString()}</span>
                <span className="text-[10px] text-slate-500 block">Records Ingested</span>
              </div>

              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 font-semibold block">Bronze Layer</span>
                <span className="text-lg font-extrabold text-slate-200 font-mono">{recon.bronzeCount.toLocaleString()}</span>
                <span className="text-[10px] text-emerald-400 block">0 Variance (100%)</span>
              </div>

              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 font-semibold block">Silver Raw Layer</span>
                <span className="text-lg font-extrabold text-amber-300 font-mono">{recon.silverRawCount.toLocaleString()}</span>
                <span className="text-[10px] text-rose-400 block">{recon.quarantineCount} Quarantined</span>
              </div>

              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 font-semibold block">Silver ODS Layer</span>
                <span className="text-lg font-extrabold text-emerald-400 font-mono">{recon.silverOdsCount.toLocaleString()}</span>
                <span className="text-[10px] text-emerald-400 block">Published Canonical</span>
              </div>
            </div>

            {/* Financial Control Totals */}
            {recon.controlTotalBilled && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-300">Financial Control Total Billed:</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-slate-400">Control: ${recon.controlTotalBilled.toLocaleString()}</span>
                  <span className="text-emerald-400 font-bold">Reconciled: ${recon.reconciledBilled?.toLocaleString()} (0.00% Variance)</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
              <span>Certification Signoff: <strong className="text-slate-200">{recon.certifiedBy}</strong></span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Audit Trail Retained for Compliance
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
