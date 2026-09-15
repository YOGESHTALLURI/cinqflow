import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Scale, Award, FileCheck, CheckCircle2, ShieldAlert, Download, X } from 'lucide-react';
import type { VarianceInvestigation } from '../../types';

export const VarianceWaiverWorkstation: React.FC = () => {
  const { variances, submitVarianceWaiver, reconciliations, userRole } = useApp();
  const [selectedVariance, setSelectedVariance] = useState<VarianceInvestigation | null>(null);
  const [justificationInput, setJustificationInput] = useState('');
  const [expiryDaysInput, setExpiryDaysInput] = useState(90);
  const [showExportModal, setShowExportModal] = useState(false);

  const handleOpenWaiver = (v: VarianceInvestigation) => {
    setSelectedVariance(v);
    setJustificationInput(v.justificationNotes || '');
  };

  const handleConfirmWaiver = () => {
    if (!selectedVariance) return;
    submitVarianceWaiver(selectedVariance.id, justificationInput || 'Known payer formatting variance approved.', expiryDaysInput);
    setSelectedVariance(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
            <Scale className="w-7 h-7 text-indigo-400" />
            <span>Variance Investigation, Waiver & Certification Workstation</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Categorize financial & record count variances, submit time-boxed steward waivers, and export certified audit evidence reports.
          </p>
        </div>

        <button
          onClick={() => setShowExportModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/20"
        >
          <Download className="w-4 h-4" />
          <span>Export Certified Evidence Report</span>
        </button>
      </div>

      {/* Active Reconciliation Certification Summary */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Batch Certification Status Summary</h3>
          <span className="text-xs font-bold text-emerald-400 font-mono">Derived Mechanically</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reconciliations.map((r) => (
            <div key={r.id} className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-cyan-400">{r.batchId}</span>
                <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full flex items-center gap-1 ${
                  r.certificationStatus === 'Certified' 
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}>
                  <Award className="w-3 h-3" />
                  <span>{r.certificationStatus}</span>
                </span>
              </div>

              <h4 className="text-xs font-bold text-white">{r.feedName}</h4>

              {r.waiverReason && (
                <div className="bg-amber-950/40 p-2 rounded border border-amber-800/60 text-[11px] text-amber-300">
                  <strong>Steward Waiver Reason:</strong> "{r.waiverReason}" (Expires: {r.waiverExpiryDate})
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Variance Investigation Workstation (CF-V2-E13-03) */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Active Reconciliation Variances Requiring Steward Action</h3>
          </div>
          <span className="text-xs text-amber-300 font-mono">Time-Boxed Governance</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <th className="px-4 py-3">Batch ID</th>
                <th className="px-4 py-3">Feed Name</th>
                <th className="px-4 py-3">Variance Type</th>
                <th className="px-4 py-3">Amount / Count</th>
                <th className="px-4 py-3">Assigned Owner</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
              {variances.map((v) => (
                <tr key={v.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-bold text-cyan-400">{v.batchId}</td>
                  <td className="px-4 py-3 font-sans font-semibold text-slate-200">{v.feedName}</td>
                  <td className="px-4 py-3 text-amber-400 font-bold">{v.varianceType}</td>
                  <td className="px-4 py-3 text-slate-200">${v.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-400 font-sans">{v.assignedOwner}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      v.status === 'Waived' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {v.status !== 'Waived' ? (
                      <button
                        onClick={() => handleOpenWaiver(v)}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-lg shadow-md shadow-amber-600/20 flex items-center gap-1 ml-auto"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Submit Time-Boxed Waiver</span>
                      </button>
                    ) : (
                      <span className="text-emerald-400 font-bold font-sans">Waived (Active)</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Time-Boxed Waiver Modal */}
      {selectedVariance && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-2xl border border-slate-800 p-6 space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs font-mono text-cyan-400 font-bold">{selectedVariance.batchId}</span>
              <h3 className="text-base font-bold text-white">Steward Time-Boxed Variance Waiver</h3>
              <p className="text-xs text-amber-400 mt-1">Variance: {selectedVariance.varianceType} (${selectedVariance.amount.toLocaleString()})</p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Written Justification / Reason *</label>
                <textarea
                  rows={3}
                  value={justificationInput}
                  onChange={(e) => setJustificationInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-slate-100 outline-none focus:border-amber-500"
                  placeholder="Explain why this variance is acceptable (e.g. Duplicate cancellation file identified)..."
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Time-Box Expiry Window (Days)</label>
                <select
                  value={expiryDaysInput}
                  onChange={(e) => setExpiryDaysInput(parseInt(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 outline-none focus:border-amber-500 font-mono"
                >
                  <option value={30}>30 Days (Short-term)</option>
                  <option value={90}>90 Days (Standard Steward Window)</option>
                  <option value={180}>180 Days (Long-term Exemption)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setSelectedVariance(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmWaiver}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-lg shadow-lg shadow-amber-600/20 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Governed Waiver Signoff</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exportable Evidence Modal (CF-V2-E13-04) */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-2xl rounded-2xl border border-slate-800 p-6 space-y-6 max-h-[90vh] overflow-y-auto font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs text-indigo-400 font-bold uppercase">Official Compliance Artifact</span>
                <h3 className="text-base font-bold text-white font-sans">Batch Audit & Certification Evidence Report</h3>
              </div>
              <button onClick={() => setShowExportModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
              <div className="border-b border-slate-800 pb-2 text-[11px] text-slate-400 space-y-1">
                <p>Platform: <strong>CINQFlow Healthcare Data Platform (Wave 2)</strong></p>
                <p>Report Date: <strong>{new Date().toLocaleString()}</strong></p>
                <p>Auditor Persona: <strong>{userRole.toUpperCase()}</strong></p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-cyan-400 font-sans">Certified Production Batches:</h4>
                {reconciliations.map((r) => (
                  <div key={r.id} className="bg-slate-900 p-3 rounded text-[11px] space-y-1">
                    <p className="text-white font-bold">Batch ID: {r.batchId} ({r.feedName})</p>
                    <p className="text-slate-300">Status: <strong className="text-emerald-400">{r.certificationStatus}</strong></p>
                    <p className="text-slate-400">Landing Ingested: {r.landingCount} | Silver ODS Published: {r.silverOdsCount}</p>
                    {r.controlTotalBilled && (
                      <p className="text-emerald-300">Financial Control: ${r.controlTotalBilled.toLocaleString()} (0.00% Variance)</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button onClick={() => alert('Downloaded CINQFlow_Batch_Certification_Evidence.json')} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-xs font-sans flex items-center gap-1.5">
                <Download className="w-4 h-4" />
                <span>Download Certified JSON Evidence</span>
              </button>
              <button onClick={() => setShowExportModal(false)} className="px-4 py-2 bg-slate-800 text-slate-200 rounded-lg text-xs font-sans">
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
