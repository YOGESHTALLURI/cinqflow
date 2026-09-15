import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { QuarantineRecord } from '../../types';
import { ShieldAlert, Eye, EyeOff, Edit3, AlertTriangle } from 'lucide-react';

export const QuarantineCenter: React.FC = () => {
  const { quarantineRecords, resolveQuarantine, phiMasked, setPhiMasked } = useApp();
  const [editingRecord, setEditingRecord] = useState<QuarantineRecord | null>(null);
  const [editFormData, setEditFormData] = useState<Record<string, any>>({});

  const handleStartEdit = (rec: QuarantineRecord) => {
    setEditingRecord(rec);
    setEditFormData({ ...rec.recordData });
  };

  const handleSaveResolution = (action: 'Waived' | 'Corrected' | 'Reprocessed') => {
    if (!editingRecord) return;
    resolveQuarantine(editingRecord.id, action, editFormData);
    setEditingRecord(null);
  };

  const maskValue = (val: string, isPhi: boolean) => {
    if (!phiMasked || !isPhi) return val;
    if (val.length <= 4) return '****';
    return `${val.substring(0, 2)}***${val.substring(val.length - 2)}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
            <ShieldAlert className="w-7 h-7 text-rose-400" />
            <span>Data Quality Quarantine & Exception Resolution Center</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Review, remediate, waive, or reprocess records quarantined during Silver Raw & Identity Resolution layers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setPhiMasked(!phiMasked)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2"
          >
            {phiMasked ? <EyeOff className="w-4 h-4 text-emerald-400" /> : <Eye className="w-4 h-4 text-amber-400" />}
            <span>PHI Masking: {phiMasked ? 'ON (Masked)' : 'OFF (Unmasked)'}</span>
          </button>
        </div>
      </div>

      {/* Quarantine Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="px-5 py-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200">Active Quarantined Exceptions ({quarantineRecords.filter(r => r.status === 'Pending').length} Pending Action)</span>
          <span className="text-xs text-rose-400 font-mono font-semibold">Zero Unresolved Discards Rule</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <th className="px-4 py-3">Record ID</th>
                <th className="px-4 py-3">Feed Name</th>
                <th className="px-4 py-3">Layer</th>
                <th className="px-4 py-3">Quarantine Reason</th>
                <th className="px-4 py-3">Record Snippet</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {quarantineRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-cyan-400">{rec.id}</td>
                  <td className="px-4 py-3 font-semibold text-slate-200">{rec.feedName}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-800 text-slate-300 rounded border border-slate-700">
                      {rec.layer}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-rose-300 font-medium">
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>{rec.errorReason}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-400">
                    {JSON.stringify(
                      Object.fromEntries(
                        Object.entries(rec.recordData).slice(0, 3).map(([k, v]) => [
                          k,
                          k.includes('ssn') || k.includes('name') ? maskValue(String(v), true) : v
                        ])
                      )
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      rec.status === 'Pending' 
                        ? 'bg-rose-950 text-rose-400 border border-rose-800' 
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {rec.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {rec.status === 'Pending' ? (
                      <button
                        onClick={() => handleStartEdit(rec)}
                        className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-lg shadow-md shadow-cyan-600/20 flex items-center gap-1 ml-auto"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Remediate</span>
                      </button>
                    ) : (
                      <span className="text-slate-500 text-[11px]">Resolved</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit & Remediation Modal */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-xl rounded-2xl border border-slate-800 p-6 space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs font-mono text-cyan-400 font-bold">{editingRecord.id}</span>
              <h3 className="text-base font-bold text-white">Exception Remediation & Correction</h3>
              <p className="text-xs text-rose-400 mt-1">{editingRecord.errorReason}</p>
            </div>

            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-slate-300">Edit Record Values</h4>
              {Object.keys(editingRecord.recordData).map((key) => (
                <div key={key}>
                  <label className="block text-[11px] font-mono text-cyan-400 mb-1">{key}</label>
                  <input
                    type="text"
                    value={editFormData[key] ?? ''}
                    onChange={(e) => setEditFormData({ ...editFormData, [key]: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setEditingRecord(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={() => handleSaveResolution('Waived')}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-lg"
              >
                Waive Warning
              </button>

              <button
                onClick={() => handleSaveResolution('Reprocessed')}
                className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-xs rounded-lg shadow-lg shadow-emerald-500/20"
              >
                Save & Reprocess Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
