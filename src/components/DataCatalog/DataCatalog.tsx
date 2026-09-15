import React, { useState } from 'react';
import { MOCK_GLOSSARY_TERMS } from '../../data/mockData';
import { BookOpen, Search, Shield, Tag } from 'lucide-react';

export const DataCatalog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const terms = MOCK_GLOSSARY_TERMS.filter(t => {
    const matchesSearch = t.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'ALL' || t.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['ALL', 'Canonical Model', 'Metric', 'Domain', 'Data Quality'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-purple-400" />
            <span>Data Catalog & Healthcare Business Glossary</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Governed source of truth for platform entities, business metrics, canonical schemas, and PHI classifications.
          </p>
        </div>
        <span className="px-3 py-1 bg-purple-950 text-purple-300 border border-purple-800 rounded-full text-xs font-semibold">
          Governed Knowledge Base
        </span>
      </div>

      {/* Search Bar & Category Filters */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search catalog terms, canonical models, or healthcare metrics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Glossary Terms Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {terms.map((term) => (
          <div key={term.id} className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4 hover:border-purple-500/40 transition-all">
            <div className="flex items-center justify-between gap-2">
              <span className="px-2.5 py-1 text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800 rounded-full">
                {term.category}
              </span>
              <span className="text-[11px] font-semibold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/60 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span>{term.phiType}</span>
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{term.term}</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">{term.definition}</p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-1">
                <Tag className="w-3 h-3 text-slate-500" />
                <span>Synonyms: {term.synonyms.join(', ')}</span>
              </div>
              <span>Owner: <strong className="text-slate-200">{term.owner}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
