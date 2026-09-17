import React, { useState } from 'react';
import { MOCK_NETTED_FINANCIAL_PACKS, MOCK_SETWISE_MEMBER_CHECKS } from '../../data/mockWave3Data';
import { Scale, DollarSign, Users } from 'lucide-react';


export const FinancialMemberReconciliationPacks: React.FC = () => {
  const [financialPacks] = useState(MOCK_NETTED_FINANCIAL_PACKS);
  const [memberCheck] = useState(MOCK_SETWISE_MEMBER_CHECKS);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Scale className="w-7 h-7 text-emerald-400" />
              Financial & Member Reconciliation Packs
            </h2>
            <span className="px-2 py-0.5 text-xs font-bold rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
              Wave 3 · CF-V3-E13-02
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Reconciliation extended beyond counts: netted financial totals by payer/month ($) and set-wise member universe comparison ($A \setminus B$ and $B \setminus A$).
          </p>
        </div>
      </div>

      {/* Grid: Financial Pack & Set-Wise Member Check */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Netted Financial Totals Pack */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Netted Financial Reconciliation Pack
            </h3>
            <span className="text-xs font-mono text-emerald-400">Month-End Fidelis Claims</span>
          </div>

          <div className="space-y-4 text-xs">
            {financialPacks.map((pack) => (
              <div key={pack.batchId} className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3 font-mono">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="font-bold text-white">{pack.payerName}</span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    {pack.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-300 text-[11px]">
                  <div>Control Billed: <strong className="text-white">${pack.controlTotalBilled.toFixed(2)}</strong></div>
                  <div>Reconciled Net: <strong className="text-emerald-400">${pack.netReconciledBilled.toFixed(2)}</strong></div>
                  <div>Original Paid: <span className="text-slate-400">${pack.originalPaidAmount.toFixed(2)}</span></div>
                  <div>Adjusted Net: <span className="text-slate-400">${pack.adjustmentAmount.toFixed(2)}</span></div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-sm font-bold">
                  <span className="text-slate-400">Financial Variance:</span>
                  <span className="text-emerald-400 font-mono">${pack.dollarVariance.toFixed(2)} (0.00% Variance)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Set-Wise Member Universe Comparison */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              Set-Wise Member Universe Comparator
            </h3>
            <span className="text-xs font-mono text-cyan-300">Mathematical Set Checking</span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3 font-mono">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-slate-900 p-3 rounded border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Incoming Source Set</span>
                  <strong className="text-white text-lg">{memberCheck.totalIncomingMembers.toLocaleString()} Members</strong>
                </div>
                <div className="bg-slate-900 p-3 rounded border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Published ODS Set</span>
                  <strong className="text-cyan-400 text-lg">{memberCheck.totalOdsMembers.toLocaleString()} Members</strong>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800 text-[11px]">
                <div className="flex justify-between text-amber-300">
                  <span>Missing in ODS Set (Source \ ODS):</span>
                  <span className="font-bold">{memberCheck.missingInOdsSet.join(', ')}</span>
                </div>
                <div className="flex justify-between text-cyan-300">
                  <span>Extra in ODS Set (ODS \ Source):</span>
                  <span className="font-bold">{memberCheck.extraInOdsSet.join(', ')}</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-900 rounded border border-slate-800 text-slate-300 text-[10px]">
                <span className="text-slate-400 block font-bold">Discrepancy Explanation:</span>
                {memberCheck.discrepancyReason}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
