import React, { useState } from 'react';
import type { FeedConfig, CanonicalMapping } from '../../types';
import { ArrowRight, Sparkles, Plus, Trash2 } from 'lucide-react';

interface Props {
  formData: Partial<FeedConfig>;
  updateFormData: (updates: Partial<FeedConfig>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step3CanonicalMapping: React.FC<Props> = ({ formData, updateFormData, onNext, onBack }) => {
  const defaultMappings: CanonicalMapping[] = formData.mappings && formData.mappings.length > 0
    ? formData.mappings
    : [
        { id: 'm1', sourceField: 'member_id', targetEntity: 'Member', targetField: 'SourceMemberID', transformation: 'DirectCopy', confidenceScore: 99, isCustom: false },
        { id: 'm2', sourceField: 'ssn', targetEntity: 'Member', targetField: 'SSN_Hash', transformation: 'HashKey(SHA256)', confidenceScore: 98, isCustom: false },
        { id: 'm3', sourceField: 'first_name', targetEntity: 'Member', targetField: 'FirstName', transformation: 'Upper', confidenceScore: 99, isCustom: false },
        { id: 'm4', sourceField: 'last_name', targetEntity: 'Member', targetField: 'LastName', transformation: 'Upper', confidenceScore: 99, isCustom: false },
        { id: 'm5', sourceField: 'dob', targetEntity: 'Member', targetField: 'BirthDate', transformation: 'DateFormatter(YYYY-MM-DD)', confidenceScore: 97, isCustom: false },
        { id: 'm6', sourceField: 'plan_code', targetEntity: 'Coverage', targetField: 'PlanID', transformation: 'DirectCopy', confidenceScore: 96, isCustom: false }
      ];

  const [mappings, setMappings] = useState<CanonicalMapping[]>(defaultMappings);

  const canonicalEntities = ['Member', 'Coverage', 'Claim', 'ClaimLine', 'Encounter', 'Provider', 'Facility', 'LabResult'];
  const transformations = ['DirectCopy', 'HashKey(SHA256)', 'DateFormatter(YYYY-MM-DD)', 'Upper', 'Lower', 'Decimal2Digits', 'LookupTranslation', 'NullIfEmpty'];

  const handleUpdateMapping = (id: string, key: keyof CanonicalMapping, value: any) => {
    const updated = mappings.map(m => m.id === id ? { ...m, [key]: value } : m);
    setMappings(updated);
    updateFormData({ mappings: updated });
  };

  const handleAddMapping = () => {
    const newM: CanonicalMapping = {
      id: `m-${Date.now()}`,
      sourceField: '',
      targetEntity: 'Member',
      targetField: '',
      transformation: 'DirectCopy',
      confidenceScore: 100,
      isCustom: true
    };
    const updated = [...mappings, newM];
    setMappings(updated);
    updateFormData({ mappings: updated });
  };

  const handleDeleteMapping = (id: string) => {
    const updated = mappings.filter(m => m.id !== id);
    setMappings(updated);
    updateFormData({ mappings: updated });
  };

  const handleNext = () => {
    updateFormData({ mappings });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            Step 3: Canonical Mapping & Transformation Studio
          </h2>
          <p className="text-xs text-slate-400">Map inbound source fields to CINQCARE Silver ODS canonical entities and specify transformations.</p>
        </div>
        <button
          onClick={handleAddMapping}
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Custom Field Mapping</span>
        </button>
      </div>

      {/* Mapping Rows */}
      <div className="space-y-3">
        {mappings.map((m) => (
          <div key={m.id} className="glass-card rounded-xl p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            {/* Source Field */}
            <div className="w-full md:w-1/4">
              <label className="block text-[11px] text-slate-400 font-semibold mb-1">Source Field</label>
              <input
                type="text"
                placeholder="Source Field Name"
                value={m.sourceField}
                onChange={(e) => handleUpdateMapping(m.id, 'sourceField', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-cyan-300 font-mono outline-none focus:border-cyan-500"
              />
            </div>

            <ArrowRight className="hidden md:block w-4 h-4 text-slate-500 mt-4" />

            {/* Target Canonical Entity & Field */}
            <div className="w-full md:w-1/3 flex gap-2">
              <div className="w-1/2">
                <label className="block text-[11px] text-slate-400 font-semibold mb-1">Target Entity</label>
                <select
                  value={m.targetEntity}
                  onChange={(e) => handleUpdateMapping(m.id, 'targetEntity', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
                >
                  {canonicalEntities.map(ent => (
                    <option key={ent} value={ent}>{ent}</option>
                  ))}
                </select>
              </div>

              <div className="w-1/2">
                <label className="block text-[11px] text-slate-400 font-semibold mb-1">Target Field</label>
                <input
                  type="text"
                  placeholder="Target Field"
                  value={m.targetField}
                  onChange={(e) => handleUpdateMapping(m.id, 'targetField', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-mono outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Transformation Rule */}
            <div className="w-full md:w-1/4">
              <label className="block text-[11px] text-slate-400 font-semibold mb-1">Transformation Rule</label>
              <select
                value={m.transformation}
                onChange={(e) => handleUpdateMapping(m.id, 'transformation', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500 font-mono"
              >
                {transformations.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Action */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-emerald-400 font-semibold">{m.confidenceScore}% Match</span>
              <button
                type="button"
                onClick={() => handleDeleteMapping(m.id)}
                className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-lg"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs rounded-lg shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
        >
          <span>Continue to Step 4: Natural-Language DQ Rules →</span>
        </button>
      </div>
    </div>
  );
};
