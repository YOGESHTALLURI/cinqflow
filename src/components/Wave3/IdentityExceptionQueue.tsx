import React, { useState } from 'react';
import { MOCK_IDENTITY_EXCEPTIONS } from '../../data/mockWave3Data';
import { ShieldAlert, UserCheck, CheckCircle2 } from 'lucide-react';


export const IdentityExceptionQueue: React.FC = () => {
  const [exceptions, setExceptions] = useState(MOCK_IDENTITY_EXCEPTIONS);

  const handleRemediate = (id: string) => {
    setExceptions(prev => prev.map(item => item.id === id ? { ...item, status: 'REMEDIATED' } : item));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <ShieldAlert className="w-7 h-7 text-amber-400" />
              Identity Exception Triage Queue
            </h2>
            <span className="px-2 py-0.5 text-xs font-bold rounded bg-amber-950 text-amber-400 border border-amber-800 font-mono">
              Wave 3 · CF-V3-E9-02
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Deduplicated queue for identity resolution failures, retry exhaustion, and SLA aging matrix. Same person across multiple batches grouped as 1 exception card.
          </p>
        </div>
      </div>

      {/* Triage Grid */}
      <div className="space-y-4">
        {exceptions.map((item) => (
          <div 
            key={item.id}
            className={`bg-slate-900 border rounded-xl p-5 space-y-4 transition ${
              item.status === 'REMEDIATED' ? 'border-emerald-800/60 bg-emerald-950/10' :
              item.slaStatus === 'ESCALATED' ? 'border-red-800 bg-red-950/10' : 'border-slate-800'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-amber-400">{item.id}</span>
                <h3 className="text-base font-bold text-white">{item.personName}</h3>
                <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-slate-300">
                  SSN: {item.ssnMasked}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-slate-300">
                  DOB: {item.dob}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 text-xs font-bold rounded font-mono ${
                  item.slaStatus === 'ON_TRACK' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                  item.slaStatus === 'WARNING' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                  'bg-red-950 text-red-400 border border-red-800'
                }`}>
                  SLA Aging: {item.agingDays} Days ({item.slaStatus})
                </span>

                <span className={`px-2 py-0.5 text-xs font-bold rounded font-mono ${
                  item.status === 'REMEDIATED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                  'bg-slate-800 text-slate-300'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400">Primary Failure Reason:</span>
                <p className="text-slate-200 mt-1 font-semibold">{item.primaryReason}</p>
              </div>

              <div>
                <span className="text-slate-400">Deduplicated Occurrences:</span>
                <div className="text-white font-mono font-bold mt-1">
                  {item.occurrencesCount} Failure Events across {item.affectedBatches.length} Batches
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                  Batches: {item.affectedBatches.join(', ')}
                </div>
              </div>

              <div>
                <span className="text-slate-400">Assigned Steward:</span>
                <div className="text-cyan-300 font-semibold mt-1 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  {item.assignedSteward}
                </div>
              </div>
            </div>

            {item.status !== 'REMEDIATED' && (
              <div className="flex justify-end border-t border-slate-800 pt-3">
                <button
                  onClick={() => handleRemediate(item.id)}
                  className="px-4 py-2 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve Exception Remediation & Re-Inject to ODS
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
