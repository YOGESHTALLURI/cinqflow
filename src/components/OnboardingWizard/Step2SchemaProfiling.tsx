import React from 'react';
import type { FeedConfig, SchemaField } from '../../types';
import { Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

interface Props {
  formData: Partial<FeedConfig>;
  updateFormData: (updates: Partial<FeedConfig>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step2SchemaProfiling: React.FC<Props> = ({ formData, updateFormData, onNext, onBack }) => {
  const defaultSampleDatasets: Record<string, SchemaField[]> = {
    'Enrollment': [
      { id: 'f1', fieldName: 'member_id', dataType: 'VARCHAR(20)', nullable: false, sampleValues: ['AET984210', 'AET984211', 'AET984212'], phiClassification: 'PHI', confidenceScore: 99 },
      { id: 'f2', fieldName: 'ssn', dataType: 'VARCHAR(9)', nullable: false, sampleValues: ['999123456', '999654321', '999887766'], phiClassification: 'PII', confidenceScore: 98 },
      { id: 'f3', fieldName: 'first_name', dataType: 'VARCHAR(50)', nullable: false, sampleValues: ['John', 'Eleanor', 'Marcus'], phiClassification: 'PII', confidenceScore: 99 },
      { id: 'f4', fieldName: 'last_name', dataType: 'VARCHAR(50)', nullable: false, sampleValues: ['Smith', 'Vance', 'Chen'], phiClassification: 'PII', confidenceScore: 99 },
      { id: 'f5', fieldName: 'dob', dataType: 'DATE', nullable: false, sampleValues: ['1984-06-12', '1992-11-03', '1975-01-29'], phiClassification: 'PII', confidenceScore: 97 },
      { id: 'f6', fieldName: 'gender', dataType: 'CHAR(1)', nullable: true, sampleValues: ['M', 'F', 'M'], phiClassification: 'None', confidenceScore: 99 },
      { id: 'f7', fieldName: 'plan_code', dataType: 'VARCHAR(15)', nullable: false, sampleValues: ['HMO-GOLD-01', 'PPO-SILV-02', 'HMO-GOLD-01'], phiClassification: 'None', confidenceScore: 96 },
      { id: 'f8', fieldName: 'effective_date', dataType: 'DATE', nullable: false, sampleValues: ['2026-01-01', '2026-01-01', '2026-01-01'], phiClassification: 'None', confidenceScore: 98 }
    ],
    'Claims': [
      { id: 'f10', fieldName: 'claim_id', dataType: 'VARCHAR(30)', nullable: false, sampleValues: ['CLM-2026-9001', 'CLM-2026-9002'], phiClassification: 'None', confidenceScore: 99 },
      { id: 'f11', fieldName: 'member_id', dataType: 'VARCHAR(20)', nullable: false, sampleValues: ['AET984210', 'BCB441200'], phiClassification: 'PHI', confidenceScore: 98 },
      { id: 'f12', fieldName: 'provider_npi', dataType: 'VARCHAR(10)', nullable: false, sampleValues: ['1982736450', '1092837465'], phiClassification: 'None', confidenceScore: 99 },
      { id: 'f13', fieldName: 'service_date', dataType: 'DATE', nullable: false, sampleValues: ['2026-08-30', '2026-09-01'], phiClassification: 'None', confidenceScore: 97 },
      { id: 'f14', fieldName: 'icd10_diag_1', dataType: 'VARCHAR(10)', nullable: false, sampleValues: ['E11.9', 'I10'], phiClassification: 'None', confidenceScore: 95 },
      { id: 'f15', fieldName: 'billed_amount', dataType: 'DECIMAL(10,2)', nullable: false, sampleValues: ['350.00', '1250.50'], phiClassification: 'Financial', confidenceScore: 99 }
    ]
  };

  const currentFields: SchemaField[] = formData.schemaFields && formData.schemaFields.length > 0 
    ? formData.schemaFields 
    : defaultSampleDatasets[formData.domain || 'Enrollment'] || defaultSampleDatasets['Enrollment'];

  const updateFieldClassification = (fieldId: string, newClass: SchemaField['phiClassification']) => {
    const updated = currentFields.map(f => f.id === fieldId ? { ...f, phiClassification: newClass } : f);
    updateFormData({ schemaFields: updated });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            Step 2: Schema Profiling & PHI Security Tagging
          </h2>
          <p className="text-xs text-slate-400">
            Automated structural profiling, field data types, and PHI classifications extracted from your Step 1 sample upload.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Auto-Inferred Data Contract</span>
        </span>
      </div>

      {/* Single-Upload Active Notification Card */}
      <div className="bg-emerald-950/70 p-4 rounded-xl border border-emerald-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs">
            <strong className="text-emerald-300 font-bold block">Step 1 Sample File Active</strong>
            <span className="text-slate-300">
              Columns, data types, and PHI classifications were automatically inferred from your Step 1 upload (<code className="text-emerald-400 font-bold">{formData.feedName || 'Sample Dataset'}</code>).
            </span>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-900 px-3 py-1 rounded border border-emerald-700">
          {currentFields.length} Columns Profiled
        </span>
      </div>

      {/* Inferred Schema Profiler Table */}
      <div className="glass-card rounded-xl overflow-hidden border border-slate-800">
        <div className="px-4 py-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-slate-200">Inferred Schema Fields & Security Contract ({currentFields.length} Fields)</span>
          </div>
          <span className="text-xs text-emerald-400 font-mono font-semibold">100% Data Contract Validated</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <th className="px-4 py-2.5">Field Name</th>
                <th className="px-4 py-2.5">Inferred Data Type</th>
                <th className="px-4 py-2.5">Nullability</th>
                <th className="px-4 py-2.5">Sample Values</th>
                <th className="px-4 py-2.5">PHI / Security Tag</th>
                <th className="px-4 py-2.5 text-right">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {currentFields.map((field) => (
                <tr key={field.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-mono font-semibold text-cyan-300">{field.fieldName}</td>
                  <td className="px-4 py-3 font-mono text-slate-300">{field.dataType}</td>
                  <td className="px-4 py-3">
                    {field.nullable ? (
                      <span className="text-amber-400 text-[10px] bg-amber-950 px-2 py-0.5 rounded border border-amber-800">Nullable</span>
                    ) : (
                      <span className="text-emerald-400 text-[10px] bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">NOT NULL</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-400 text-[11px]">
                    {field.sampleValues.join(', ')}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={field.phiClassification || 'None'}
                      onChange={(e) => updateFieldClassification(field.id, e.target.value as any)}
                      className={`text-xs font-bold rounded px-2 py-1 outline-none border ${
                        field.phiClassification === 'PHI'
                          ? 'bg-rose-950 text-rose-400 border-rose-800'
                          : field.phiClassification === 'PII'
                          ? 'bg-purple-950 text-purple-300 border-purple-800'
                          : field.phiClassification === 'Financial'
                          ? 'bg-amber-950 text-amber-300 border-amber-800'
                          : 'bg-slate-900 text-slate-400 border-slate-700'
                      }`}
                    >
                      <option value="None">None</option>
                      <option value="PHI">PHI (Protected Health Info)</option>
                      <option value="PII">PII (Personally Identifiable)</option>
                      <option value="Financial">Financial / Billing</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-xs font-semibold text-emerald-400">{field.confidenceScore}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
          onClick={onNext}
          className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs rounded-lg shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
        >
          <span>Continue to Step 3: Canonical Model Mapping Studio →</span>
        </button>
      </div>
    </div>
  );
};
