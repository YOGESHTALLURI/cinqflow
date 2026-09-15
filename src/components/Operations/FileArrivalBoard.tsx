import React from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, AlertCircle, CheckCircle2, Radio, ArrowUpRight, Server, ShieldCheck } from 'lucide-react';

export const FileArrivalBoard: React.FC = () => {
  const { fileArrivals, runPipeline, setActiveTab, setSelectedFeedId } = useApp();

  const handleTriggerArrival = (feedId: string) => {
    runPipeline(feedId);
    setSelectedFeedId(feedId);
    setActiveTab('pipeline');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
            <Clock className="w-7 h-7 text-cyan-400" />
            <span>Data Operations Home & File-Arrival Board</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Real-time file arrival schedules, SLA countdown timers, late arrival alerts, and ingestion listeners.
          </p>
        </div>
        <span className="px-3 py-1 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded-full text-xs font-semibold flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Arrival Listeners Active</span>
        </span>
      </div>

      {/* SLA Status Cards Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Monitored Channels</span>
            <Server className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{fileArrivals.length}</p>
          <span className="text-[11px] text-slate-400">SFTP, Azure, FHIR, API</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">On-Time Arrivals</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-400">
            {fileArrivals.filter(f => f.status === 'On-Time' || f.status === 'Streaming').length}
          </p>
          <span className="text-[11px] text-emerald-400 font-semibold">100% SLA Compliant</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Late / Missing Files</span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-extrabold text-rose-400">
            {fileArrivals.filter(f => f.status === 'Late' || f.status === 'Missing').length}
          </p>
          <span className="text-[11px] text-rose-300 font-semibold">Escalation Triggered</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Listener Uptime</span>
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-extrabold text-indigo-400">99.99%</p>
          <span className="text-[11px] text-slate-400">Wave 2 Production Guard</span>
        </div>
      </div>

      {/* File Arrival Board Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="px-5 py-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200">Scheduled Inbound Data Arrival Window Board</span>
          <span className="text-xs text-cyan-400 font-mono font-semibold">Live Listener Protocol: Active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <th className="px-4 py-3">Feed Code</th>
                <th className="px-4 py-3">Feed Display Name</th>
                <th className="px-4 py-3">Delivery Method</th>
                <th className="px-4 py-3">Expected Arrival Window</th>
                <th className="px-4 py-3">Actual Timestamp</th>
                <th className="px-4 py-3">SLA Countdown</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {fileArrivals.map((fa) => (
                <tr key={fa.id} className="hover:bg-slate-800/40 transition-colors font-mono text-[11px]">
                  <td className="px-4 py-3 font-bold text-cyan-400">{fa.feedCode}</td>
                  <td className="px-4 py-3 font-sans font-semibold text-slate-200">{fa.feedName}</td>
                  <td className="px-4 py-3 text-slate-400">{fa.deliveryMethod}</td>
                  <td className="px-4 py-3 text-slate-300">{fa.expectedTime}</td>
                  <td className="px-4 py-3 text-slate-400">{fa.actualTime || 'Awaiting file arrival...'}</td>
                  <td className="px-4 py-3">
                    {fa.slaMinutesRemaining >= 0 ? (
                      <span className="text-emerald-400 font-bold">{fa.slaMinutesRemaining} mins remaining</span>
                    ) : (
                      <span className="text-rose-400 font-bold">{Math.abs(fa.slaMinutesRemaining)} mins SLA BREACH</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                      fa.status === 'On-Time' 
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                        : fa.status === 'Streaming'
                        ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                        : 'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}>
                      {fa.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleTriggerArrival(fa.feedId)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 ml-auto"
                    >
                      <span>Simulate Arrival</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
