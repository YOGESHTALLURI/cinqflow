import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { FeedConfig } from '../../types';
import { 
  Database, 
  Search, 
  Filter, 
  Play, 
  Copy, 
  ExternalLink, 
  Building2, 
  X
} from 'lucide-react';

export const FeedRegistry: React.FC = () => {
  const { feeds, runPipeline, setActiveTab, setSelectedFeedId } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [domainFilter, setDomainFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [activeModalFeed, setActiveModalFeed] = useState<FeedConfig | null>(null);

  const filteredFeeds = feeds.filter(f => {
    const matchesSearch = f.feedName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.feedCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.sourceOrg.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = domainFilter === 'ALL' || f.domain === domainFilter;
    const matchesStatus = statusFilter === 'ALL' || f.status === statusFilter;
    return matchesSearch && matchesDomain && matchesStatus;
  });

  const handleRunPipeline = (feed: FeedConfig) => {
    runPipeline(feed.id);
    setSelectedFeedId(feed.id);
    setActiveTab('pipeline');
  };

  const handleCloneFeed = (feed: FeedConfig) => {
    alert(`Feed ${feed.feedCode} copied as template for new onboarding wizard draft.`);
    setActiveTab('onboarding');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
            <Database className="w-7 h-7 text-cyan-400" />
            <span>Source & Feed Registry Inventory</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Centralized source of truth for all onboarded healthcare data feeds across Wave 1.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('onboarding')}
          className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-cyan-500/20"
        >
          + Onboard New Feed
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search feeds by name, code, or source organization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 outline-none focus:border-cyan-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-200 outline-none"
            >
              <option value="ALL">All Domains</option>
              <option value="Enrollment">Enrollment</option>
              <option value="Claims">Claims</option>
              <option value="ADT">ADT</option>
              <option value="Provider">Provider</option>
              <option value="Lab">Lab</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-200 outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="In Review">In Review</option>
              <option value="Draft">Draft</option>
              <option value="Paused">Paused</option>
            </select>
          </div>
        </div>
      </div>

      {/* Feed Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFeeds.map((feed) => (
          <div key={feed.id} className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono text-[11px] font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
                  {feed.feedCode}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  feed.status === 'Active' ? 'badge-active' : feed.status === 'In Review' ? 'badge-review' : 'badge-draft'
                }`}>
                  {feed.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">{feed.feedName}</h3>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                <span>{feed.sourceOrg}</span>
              </p>
            </div>

            {/* Metadata Pills */}
            <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 block">Domain:</span>
                <span className="font-semibold text-slate-200">{feed.domain}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Delivery:</span>
                <span className="font-semibold text-slate-200">{feed.deliveryMethod} ({feed.fileFormat})</span>
              </div>
              <div>
                <span className="text-slate-500 block">Schedule:</span>
                <span className="font-semibold text-slate-200 truncate block">{feed.frequency}</span>
              </div>
              <div>
                <span className="text-slate-500 block">DQ Quality Score:</span>
                <span className="font-bold text-emerald-400">{feed.dqScore ? `${feed.dqScore}%` : 'N/A'}</span>
              </div>
            </div>

            {/* Action Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <button
                onClick={() => setActiveModalFeed(feed)}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>Inspect Config</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCloneFeed(feed)}
                  title="Clone feed as template"
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleRunPipeline(feed)}
                  className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Run Pipeline</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Feed Config Inspection Modal */}
      {activeModalFeed && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-3xl rounded-2xl border border-slate-800 p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold">{activeModalFeed.feedCode}</span>
                <h3 className="text-lg font-bold text-white">{activeModalFeed.feedName}</h3>
              </div>
              <button
                onClick={() => setActiveModalFeed(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-900 p-3 rounded-xl">
                <div>
                  <span className="text-slate-500 block">Owner:</span>
                  <span className="font-semibold text-slate-200">{activeModalFeed.owner}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Status:</span>
                  <span className="font-bold text-cyan-400">{activeModalFeed.status}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Total Records:</span>
                  <span className="font-semibold text-slate-200">{(activeModalFeed.totalRecordsProcessed ?? 0).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Quarantined:</span>
                  <span className="font-semibold text-rose-400">{activeModalFeed.quarantineCount} Records</span>
                </div>
              </div>

              {/* Mappings */}
              <div>
                <h4 className="font-bold text-slate-200 mb-2">Canonical Mappings ({activeModalFeed.mappings.length})</h4>
                <div className="space-y-1 bg-slate-950 p-3 rounded-xl font-mono text-[11px]">
                  {activeModalFeed.mappings.map(m => (
                    <div key={m.id} className="flex justify-between border-b border-slate-900 py-1 text-slate-300">
                      <span className="text-cyan-400">{m.sourceField}</span>
                      <span>→ {m.targetEntity}.{m.targetField}</span>
                      <span className="text-purple-400">[{m.transformation}]</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* DQ Rules */}
              <div>
                <h4 className="font-bold text-slate-200 mb-2">Configured DQ Rules ({activeModalFeed.dqRules.length})</h4>
                <div className="space-y-2">
                  {activeModalFeed.dqRules.map(r => (
                    <div key={r.id} className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <div className="flex justify-between font-bold text-slate-200 mb-1">
                        <span>{r.name}</span>
                        <span className="text-amber-400 font-mono text-[10px]">{r.severity}</span>
                      </div>
                      <p className="text-slate-400 italic text-[11px]">"{r.naturalLanguage}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveModalFeed(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg text-xs"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
