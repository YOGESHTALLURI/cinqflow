import React, { useState } from 'react';
import { MOCK_COMPLEX_PROFILER_TREE } from '../../data/mockWave3Data';
import { Layers, Calculator, ChevronRight, FileCode } from 'lucide-react';

export const ComplexFormatStudio: React.FC = () => {
  const [tree] = useState(MOCK_COMPLEX_PROFILER_TREE);
  const [nettedClaim] = useState({
    originalAmount: 500,
    cancellationAmount: -500,
    adjustmentAmount: 450,
    netPosition: 450
  });


  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Layers className="w-7 h-7 text-pink-400" />
              Complex Formats Studio (FHIR / HL7 / CCLF)
            </h2>
            <span className="px-2 py-0.5 text-xs font-bold rounded bg-pink-950 text-pink-400 border border-pink-800 font-mono">
              Wave 3 · CF-V3-E5-05 & CF-V3-E6-05
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Resource tree profiling for nested NDJSON/FHIR EOB payloads, CCLF fixed-width boundary detection, and netted claim lineage calculator.
          </p>
        </div>
      </div>

      {/* Grid: FHIR Tree & Netted Claim Lineage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: FHIR EOB Resource Tree Explorer */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileCode className="w-4 h-4 text-pink-400" />
              FHIR EOB Resource Tree & Path Fill Rates
            </h3>
            <span className="text-xs font-mono text-pink-300">NDJSON EOB Payload</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2 text-xs font-mono text-slate-300 overflow-x-auto">
            <div className="font-bold text-cyan-300">{tree.name} (Fill Rate: {tree.fillRatePct}%)</div>
            {tree.children?.map((child) => (
              <div key={child.path} className="ml-4 space-y-1">
                <div className="flex items-center justify-between text-slate-200">
                  <span className="flex items-center gap-1">
                    <ChevronRight className="w-3 h-3 text-pink-400" />
                    {child.name}
                  </span>
                  <span className="text-emerald-400 font-semibold">{child.fillRatePct}% Fill</span>
                </div>

                {child.children && (
                  <div className="ml-4 space-y-1 border-l border-slate-800 pl-3">
                    {child.children.map((gChild) => (
                      <div key={gChild.path} className="flex items-center justify-between text-slate-400 text-[11px]">
                        <span>└─ {gChild.name}</span>
                        <span className="text-slate-300">{gChild.fillRatePct}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Claim Lineage & Payment Netting Calculator */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-400" />
              Claim Lineage Derivation & Payment Netting
            </h3>
            <span className="text-xs font-mono text-emerald-400">CF-V3-E6-05 Worked Example</span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-2 font-mono">
              <div className="flex justify-between items-center text-slate-300">
                <span>1. Original Claim (No Related Claim):</span>
                <span className="text-emerald-400 font-bold">+${nettedClaim.originalAmount}.00</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>2. Replaced-By Claim (Cancellation):</span>
                <span className="text-red-400 font-bold">${nettedClaim.cancellationAmount}.00</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>3. Prior Claim (Adjustment):</span>
                <span className="text-emerald-400 font-bold">+${nettedClaim.adjustmentAmount}.00</span>
              </div>
              <div className="border-t border-slate-800 pt-2 flex justify-between items-center text-sm font-bold">
                <span className="text-white">Calculated Net Position:</span>
                <span className="text-cyan-300">${nettedClaim.netPosition}.00</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-950/30 border border-emerald-800/60 rounded text-emerald-300 text-[11px] leading-relaxed">
              <strong className="font-bold block text-emerald-200">Zero Double-Counting Guarantee:</strong>
              Net position matches the worked example ($500 original - $500 cancellation + $450 adjustment = $450 net position). Prior claim versions are never updated in place.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
