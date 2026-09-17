import React, { useState } from 'react';
import { MOCK_MERGE_SPLIT_CARDS } from '../../data/mockWave3Data';
import { Sparkles, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';


export const MergeSplitEvidenceStudio: React.FC = () => {
  const [cards, setCards] = useState(MOCK_MERGE_SPLIT_CARDS);

  const handleDecision = (id: string, decision: 'APPROVED_BY_STEWARD' | 'REJECTED_BY_STEWARD') => {
    setCards(prev => prev.map(card => card.id === id ? {
      ...card,
      decisionState: decision,
      reviewedBy: 'Sarah Jenkins (Data Steward)',
      reviewedAt: new Date().toISOString().split('T')[0],
      verificationMatchPercent: 100
    } : card));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-7 h-7 text-purple-400" />
              AI Merge & Split Evidence Cards Studio
            </h2>
            <span className="px-2 py-0.5 text-xs font-bold rounded bg-purple-950 text-purple-400 border border-purple-800 font-mono">
              Wave 3 · CF-V3-E9-03 (Human Always)
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            AI-prepared demographic side-by-side evidence cards with concrete consequence previews. Final execution strictly requires explicit human steward approval.
          </p>
        </div>
      </div>

      {/* Mandatory Policy Alert */}
      <div className="bg-amber-950/40 border border-amber-800/80 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200">
          <strong className="font-bold uppercase tracking-wider text-amber-300">Mandatory Policy Guardrail (CF-V3-E9-03):</strong>
          <p className="mt-0.5">
            Identity merges and splits change record ownership and are never executed automatically at any confidence level. The AI prepares the evidence card and consequence preview; execution happens strictly upon explicit steward sign-off.
          </p>
        </div>
      </div>

      {/* Evidence Cards List */}
      <div className="space-y-8">
        {cards.map((card) => (
          <div key={card.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            {/* Card Title & Type */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-purple-400">{card.id}</span>
                <span className={`px-2.5 py-1 text-xs font-extrabold rounded font-mono ${
                  card.type === 'MERGE_PROPOSAL' ? 'bg-indigo-950 text-indigo-400 border border-indigo-800' :
                  'bg-pink-950 text-pink-400 border border-pink-800'
                }`}>
                  {card.type}
                </span>
                <span className="text-xs text-slate-400 font-mono">Target LinkId: <strong className="text-white">{card.targetLinkId}</strong></span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">Demographic Match Score:</span>
                <span className="text-sm font-bold font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800">
                  {card.demographicMatchScore}% Confidence
                </span>
              </div>
            </div>

            {/* Side-by-Side Demographic Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Record A */}
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-cyan-400 font-mono">Source Record A</span>
                  <span className="text-[11px] font-mono text-slate-400">{card.sourceRecordA.source}</span>
                </div>
                <div className="text-xs space-y-1">
                  <div><span className="text-slate-500">Local ID:</span> <span className="font-mono text-slate-200">{card.sourceRecordA.localId}</span></div>
                  <div><span className="text-slate-500">Name:</span> <span className="font-bold text-white">{card.sourceRecordA.name}</span></div>
                  <div><span className="text-slate-500">DOB:</span> <span className="font-mono text-slate-300">{card.sourceRecordA.dob}</span></div>
                  <div><span className="text-slate-500">Address:</span> <span className="text-slate-300">{card.sourceRecordA.address}, {card.sourceRecordA.zip}</span></div>
                </div>
              </div>

              {/* Record B */}
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-purple-400 font-mono">Source Record B</span>
                  <span className="text-[11px] font-mono text-slate-400">{card.sourceRecordB.source}</span>
                </div>
                <div className="text-xs space-y-1">
                  <div><span className="text-slate-500">Local ID:</span> <span className="font-mono text-slate-200">{card.sourceRecordB.localId}</span></div>
                  <div><span className="text-slate-500">Name:</span> <span className="font-bold text-white">{card.sourceRecordB.name}</span></div>
                  <div><span className="text-slate-500">DOB:</span> <span className="font-mono text-slate-300">{card.sourceRecordB.dob}</span></div>
                  <div><span className="text-slate-500">Address:</span> <span className="text-slate-300">{card.sourceRecordB.address}, {card.sourceRecordB.zip}</span></div>
                </div>
              </div>
            </div>

            {/* AI Evidence Summary & Consequence Preview */}
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-3 text-xs">
              <div>
                <span className="font-bold text-purple-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> AI Demographic Evidence Analysis:
                </span>
                <p className="text-slate-300 mt-1">{card.aiEvidenceSummary}</p>
              </div>

              <div className="border-t border-slate-800 pt-3">
                <span className="font-bold text-cyan-300">Consequence Preview (Post-Approval State Impact):</span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2 font-mono text-[11px]">
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Addresses Repointed</span>
                    <strong className="text-white text-sm">{card.consequencePreview.addressesRepointed}</strong>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Claims Relinked</span>
                    <strong className="text-white text-sm">{card.consequencePreview.claimsRelinked}</strong>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Profiles Collapsed</span>
                    <strong className="text-white text-sm">{card.consequencePreview.duplicateProfilesCollapsed}</strong>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Impacted Feeds</span>
                    <strong className="text-cyan-300 text-[10px]">{card.consequencePreview.impactedPayerFeeds.length} Feeds</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Decision Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-4">
              <div className="text-xs text-slate-400">
                Decision Governance State: {' '}
                <span className="font-bold font-mono text-white">{card.decisionState}</span>
                {card.reviewedBy && (
                  <span className="text-emerald-400 block text-[11px] mt-0.5">
                    Verified by {card.reviewedBy} on {card.reviewedAt} (100% Post-Verification Match)
                  </span>
                )}
              </div>

              {card.decisionState === 'PENDING_HUMAN_APPROVAL' ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleDecision(card.id, 'REJECTED_BY_STEWARD')}
                    className="px-4 py-2 text-xs font-bold text-red-400 bg-red-950/60 hover:bg-red-900 border border-red-800 rounded-lg transition flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" /> Reject Proposal
                  </button>
                  <button
                    onClick={() => handleDecision(card.id, 'APPROVED_BY_STEWARD')}
                    className="px-4 py-2 text-xs font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve & Execute Merge/Split
                  </button>
                </div>
              ) : (
                <span className="px-3 py-1.5 text-xs font-bold font-mono rounded bg-slate-800 text-emerald-400 border border-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Steward Decision Executed & Verified
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
