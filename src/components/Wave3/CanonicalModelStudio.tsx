import React, { useState } from 'react';
import { MOCK_CANONICAL_MODELS } from '../../data/mockWave3Data';
import { Database, GitCommit, CheckCircle2 } from 'lucide-react';

export const CanonicalModelStudio: React.FC = () => {
  const [models] = useState(MOCK_CANONICAL_MODELS);

  const [selectedModel, setSelectedModel] = useState(models[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Database className="w-7 h-7 text-indigo-400" />
              Canonical ODS Model & Versioned Contracts
            </h2>
            <span className="px-2 py-0.5 text-xs font-bold rounded bg-indigo-950 text-indigo-400 border border-indigo-800 font-mono">
              Wave 3 · CF-V3-E10-01 / 02 / 03
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Deployed versioned ODS tables with surrogate key maps, downstream contract view ("what changed & why"), and Silver ODS relational integrity certification gate.
          </p>
        </div>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {models.map((model) => (
          <div 
            key={model.version}
            onClick={() => setSelectedModel(model)}
            className={`cursor-pointer bg-slate-900 border rounded-xl p-5 space-y-4 transition ${
              selectedModel.version === model.version ? 'border-indigo-500 bg-indigo-950/20 shadow-lg shadow-indigo-500/10' : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 text-xs font-mono font-bold rounded bg-indigo-950 text-indigo-400 border border-indigo-800">
                {model.version}
              </span>
              <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                model.certificationStatus === 'CERTIFIED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
              }`}>
                {model.certificationStatus}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{model.domain}</h3>
              <p className="text-xs font-mono text-cyan-300 mt-0.5">{model.tableName}</p>
            </div>

            <div className="text-xs space-y-1 text-slate-400 border-t border-slate-800 pt-3 font-mono">
              <div>Surrogate Key: <strong className="text-slate-200">{model.surrogateKeyName}</strong></div>
              <div>Source Key: <strong className="text-slate-200">{model.sourceKeyName}</strong></div>
              <div>Columns: <strong className="text-slate-200">{model.columnsCount}</strong> | Consumers: <strong className="text-indigo-400">{model.downstreamConsumerCount} Apps</strong></div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Model Detail & Contract Portal */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">
              Versioned Downstream Data Contract ({selectedModel.version})
            </span>
            <h3 className="text-xl font-bold text-white mt-1">{selectedModel.tableName}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-bold font-mono rounded bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Certification Gate Passed (0 Orphaned Claims)
            </span>
          </div>
        </div>

        {/* Change History Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2 text-xs">
          <span className="font-bold text-indigo-300 flex items-center gap-1 font-mono">
            <GitCommit className="w-4 h-4" /> What Changed & Why (Contract Changelog):
          </span>
          <p className="text-slate-300">{selectedModel.changesSummary}</p>
        </div>
      </div>
    </div>
  );
};
