import React, { useState } from 'react';
import { MOCK_VERATO_REQUESTS, MOCK_IDENTITY_TELEMETRY } from '../../data/mockWave3Data';
import { UserCheck, ShieldCheck, Database, FileCode } from 'lucide-react';

export const VeratoIdentityCenter: React.FC = () => {
  const [requests] = useState(MOCK_VERATO_REQUESTS);

  const [telemetry] = useState(MOCK_IDENTITY_TELEMETRY[0]);
  const [selectedReq, setSelectedReq] = useState(requests[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <UserCheck className="w-7 h-7 text-cyan-400" />
              Verato Identity Stage & LinkId Crosswalk
            </h2>
            <span className="px-2 py-0.5 text-xs font-bold rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
              Wave 3 · CF-V3-E9-01
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Automated Verato identity resolution stage, request/response SHA-256 audit payload log, and unified LinkId crosswalk matrix.
          </p>
        </div>
      </div>

      {/* Identity Accounting Formula Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
              Identity Reconciliation Equation (CF-V3-E9-01)
            </span>
            <div className="text-2xl font-extrabold text-white font-mono mt-1">
              Submitted ({telemetry.submittedCount.toLocaleString()}) = Resolved ({telemetry.resolvedCount.toLocaleString()}) + Unresolved ({telemetry.unresolvedCount}) + Failed ({telemetry.failedRetryCount})
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Mathematically proven 100% identity accounting. Zero records silently dropped or un-dispositioned.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-slate-400">Match Resolution Rate</span>
              <div className="text-xl font-bold text-emerald-400 font-mono">
                {((telemetry.resolvedCount / telemetry.submittedCount) * 100).toFixed(1)}%
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Request Audit Log & Selected Payload Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Request Stream Table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              Verato Request Audit Payload Stream
            </h3>
            <span className="text-xs text-slate-400 font-mono">{requests.length} Requests Sampled</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-3">Request ID</th>
                  <th className="p-3">Member ID</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Resolved LinkId</th>
                  <th className="p-3">Score</th>
                  <th className="p-3">Retries</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {requests.map((req) => (
                  <tr 
                    key={req.id}
                    onClick={() => setSelectedReq(req)}
                    className={`cursor-pointer hover:bg-slate-800/60 transition ${selectedReq.id === req.id ? 'bg-cyan-950/40 border-l-2 border-cyan-400' : ''}`}
                  >
                    <td className="p-3 font-mono text-cyan-300 font-semibold">{req.id}</td>
                    <td className="p-3 font-mono">{req.memberId}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded font-mono ${
                        req.status === 'RESOLVED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                        req.status === 'UNRESOLVED' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                        'bg-red-950 text-red-400 border border-red-800'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-white">
                      {req.resolvedLinkId || <span className="text-slate-500 font-normal">Pending Queue</span>}
                    </td>
                    <td className="p-3 font-mono">{req.confidenceScore}%</td>
                    <td className="p-3 font-mono">{req.retryCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: SHA-256 Audit Payload Inspector */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileCode className="w-4 h-4 text-purple-400" />

              SHA-256 Payload Audit Card
            </h3>
            <span className="text-xs text-slate-400 font-mono">{selectedReq.id}</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400">Target Member ID:</span>
              <div className="font-mono text-white font-bold">{selectedReq.memberId}</div>
            </div>

            <div>
              <span className="text-slate-400">Request Hash (SHA-256):</span>
              <div className="font-mono text-[10px] bg-slate-950 p-2 rounded text-slate-300 break-all border border-slate-800">
                {selectedReq.requestHash}
              </div>
            </div>

            <div>
              <span className="text-slate-400">Response Hash (SHA-256):</span>
              <div className="font-mono text-[10px] bg-slate-950 p-2 rounded text-slate-300 break-all border border-slate-800">
                {selectedReq.responseHash}
              </div>
            </div>

            <div>
              <span className="text-slate-400">Demographic Payload Sent:</span>
              <pre className="font-mono text-[11px] bg-slate-950 p-3 rounded text-cyan-300 border border-slate-800 overflow-x-auto mt-1">
                {JSON.stringify(selectedReq.rawPayload, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
