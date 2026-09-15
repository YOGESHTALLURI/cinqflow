import React, { useState } from 'react';
import type { FeedConfig, DQRule, RuleSeverity, MedallionLayer } from '../../types';
import { Sparkles, Code, Play, CheckCircle, ShieldAlert, Plus, CheckCircle2 } from 'lucide-react';

interface Props {
  formData: Partial<FeedConfig>;
  updateFormData: (updates: Partial<FeedConfig>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step4DQRuleStudio: React.FC<Props> = ({ formData, updateFormData, onNext, onBack }) => {
  const defaultRules: DQRule[] = formData.dqRules && formData.dqRules.length > 0
    ? formData.dqRules
    : [
        {
          id: 'r-1',
          name: 'Mandatory Member Identifier',
          naturalLanguage: 'Ensure member_id is present, not empty, and has at least 6 alphanumeric characters.',
          generatedCode: 'SELECT * FROM Silver_Raw WHERE member_id IS NULL OR LENGTH(TRIM(member_id)) < 6',
          severity: 'Reject',
          layer: 'Silver Raw',
          passCount: 9980,
          failCount: 20,
          status: 'Active',
          sampleFailures: [
            { recordId: 'REC-00941', reason: 'member_id is blank', rawData: { member_id: '', ssn: '999001122', first_name: 'David', last_name: 'Miller' } }
          ]
        },
        {
          id: 'r-2',
          name: 'Valid Birth Date Range',
          naturalLanguage: 'Check that dob is a valid date in the past and member age is under 120 years.',
          generatedCode: 'SELECT * FROM Silver_Raw WHERE dob > CURRENT_DATE() OR DATEDIFF(year, dob, CURRENT_DATE()) > 120',
          severity: 'Quarantine',
          layer: 'Silver Raw',
          passCount: 10000,
          failCount: 0,
          status: 'Active'
        }
      ];

  const [rules, setRules] = useState<DQRule[]>(defaultRules);
  const [nlInput, setNlInput] = useState('');
  const [ruleNameInput, setRuleNameInput] = useState('');
  const [severityInput, setSeverityInput] = useState<RuleSeverity>('Quarantine');
  const [layerInput, setLayerInput] = useState<MedallionLayer>('Silver Raw');
  const [isTranslating, setIsTranslating] = useState(false);
  const [justCompiled, setJustCompiled] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, { pass: number; fail: number }>>({});

  const sampleRuleTemplates = [
    { name: 'Positive Claim Billed Amount', text: 'Billed amount must be greater than zero and less than $1,000,000 per claim.', severity: 'Quarantine' as RuleSeverity },
    { name: 'Valid SSN 9-Digit Format', text: 'SSN must be exactly 9 digits and not all zeroes or 999999999.', severity: 'Reject' as RuleSeverity },
    { name: 'Service Date in Past', text: 'Ensure service_date is a valid date and not in the future.', severity: 'Warning' as RuleSeverity }
  ];

  const handleSelectTemplate = (template: { name: string; text: string; severity: RuleSeverity }) => {
    setRuleNameInput(template.name);
    setNlInput(template.text);
    setSeverityInput(template.severity);
  };

  const handleAddNaturalRule = () => {
    const textToCompile = nlInput.trim() || 'Billed amount must be greater than zero and less than $1,000,000 per claim.';
    const nameToUse = ruleNameInput.trim() || 'Positive Claim Billed Amount';

    setIsTranslating(true);
    setJustCompiled(false);

    setTimeout(() => {
      setIsTranslating(false);
      setJustCompiled(true);

      let generatedSql = `SELECT * FROM ${layerInput.replace(' ', '_')} WHERE (${textToCompile.toLowerCase().includes('null') ? 'field IS NULL' : 'invalid_condition'})`;
      if (textToCompile.toLowerCase().includes('member_id')) {
        generatedSql = `SELECT * FROM Silver_Raw WHERE member_id IS NULL OR member_id = ''`;
      } else if (textToCompile.toLowerCase().includes('amount') || textToCompile.toLowerCase().includes('positive') || textToCompile.toLowerCase().includes('zero')) {
        generatedSql = `SELECT * FROM Silver_Raw WHERE billed_amount <= 0 OR billed_amount > 1000000`;
      } else if (textToCompile.toLowerCase().includes('ssn') || textToCompile.toLowerCase().includes('digit')) {
        generatedSql = `SELECT * FROM Silver_Raw WHERE LENGTH(REGEXP_REPLACE(ssn, '[^0-9]', '')) <> 9`;
      } else if (textToCompile.toLowerCase().includes('date') || textToCompile.toLowerCase().includes('future')) {
        generatedSql = `SELECT * FROM Silver_Raw WHERE service_date > CURRENT_DATE()`;
      }

      const newRule: DQRule = {
        id: `r-${Date.now()}`,
        name: nameToUse,
        naturalLanguage: textToCompile,
        generatedCode: generatedSql,
        severity: severityInput,
        layer: layerInput,
        passCount: 9940,
        failCount: 60,
        status: 'Testing'
      };

      const updated = [newRule, ...rules];
      setRules(updated);
      updateFormData({ dqRules: updated });
      setNlInput('');
      setRuleNameInput('');

      setTimeout(() => setJustCompiled(false), 4000);
    }, 600);
  };

  const handleRunRuleTest = (ruleId: string) => {
    setTestResults(prev => ({
      ...prev,
      [ruleId]: { pass: 9980, fail: 20 }
    }));
  };

  const handleNext = () => {
    updateFormData({ dqRules: rules });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            Step 4: Natural-Language Business Rules & Data Quality Studio
          </h2>
          <p className="text-xs text-slate-400">Write rules in plain English. CINQFlow instantly generates executable SQL/PySpark code and tests against sample data.</p>
        </div>
      </div>

      {/* Natural Language Rule Authoring Panel */}
      <div className="glass-card rounded-xl p-5 border border-purple-500/30 bg-slate-900/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Natural-Language Rule Authoring</h3>
          </div>
          <span className="text-[11px] text-purple-300 font-mono">AI Natural Language to SQL Compiler</span>
        </div>

        {/* Quick Rule Templates */}
        <div className="space-y-1.5">
          <span className="text-[11px] text-slate-400 font-semibold block">Quick Plain-English Templates (Click to Auto-Fill):</span>
          <div className="flex flex-wrap gap-2 text-xs">
            {sampleRuleTemplates.map((t, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectTemplate(t)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded-lg border border-slate-700 text-[11px] font-semibold flex items-center gap-1 transition-all"
              >
                <Plus className="w-3 h-3 text-purple-400" />
                <span>{t.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Rule Name (e.g. Positive Billed Amount)"
            value={ruleNameInput}
            onChange={(e) => setRuleNameInput(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 outline-none focus:border-purple-500"
          />

          <select
            value={severityInput}
            onChange={(e) => setSeverityInput(e.target.value as RuleSeverity)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 outline-none focus:border-purple-500"
          >
            <option value="Information">Severity: Information</option>
            <option value="Warning">Severity: Warning</option>
            <option value="Manual Review">Severity: Manual Review</option>
            <option value="Quarantine">Severity: Quarantine (Quarantine Record)</option>
            <option value="Reject">Severity: Reject Record</option>
            <option value="Stop Pipeline">Severity: Stop Pipeline (Critical)</option>
          </select>

          <select
            value={layerInput}
            onChange={(e) => setLayerInput(e.target.value as MedallionLayer)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 outline-none focus:border-purple-500"
          >
            <option value="Landing">Execution Layer: Landing</option>
            <option value="Bronze">Execution Layer: Bronze</option>
            <option value="Silver Raw">Execution Layer: Silver Raw</option>
            <option value="Identity Resolution">Execution Layer: Identity Resolution</option>
            <option value="Silver ODS">Execution Layer: Silver ODS</option>
          </select>
        </div>

        <div className="flex gap-2">
          <textarea
            rows={2}
            placeholder="Describe your data quality rule in plain English e.g. 'Billed amount must be greater than zero and less than $1,000,000 per claim'"
            value={nlInput}
            onChange={(e) => setNlInput(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-slate-100 outline-none focus:border-purple-500"
          />
          <button
            type="button"
            onClick={handleAddNaturalRule}
            disabled={isTranslating}
            className="px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isTranslating ? 'Compiling to SQL...' : 'Compile Rule'}</span>
          </button>
        </div>

        {justCompiled && (
          <div className="bg-emerald-950/70 p-3 rounded-xl border border-emerald-800 text-xs text-emerald-300 font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Rule compiled successfully to SQL and added to the Configured Rules list below!</span>
          </div>
        )}
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Configured Data Quality Rules ({rules.length})</h3>
          <span className="text-[11px] text-slate-400">Total Rules Active: {rules.length}</span>
        </div>

        {rules.map((rule) => (
          <div key={rule.id} className="glass-card rounded-xl p-4 border border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className={`w-4 h-4 ${
                  rule.severity === 'Reject' ? 'text-rose-400' : 'text-amber-400'
                }`} />
                <h4 className="text-xs font-bold text-slate-100">{rule.name}</h4>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-800 text-slate-300 rounded border border-slate-700">
                  Layer: {rule.layer}
                </span>
                <span className={`px-2 py-0.5 text-[10px] font-semibold rounded border ${
                  rule.severity === 'Reject' 
                    ? 'bg-rose-950 text-rose-400 border-rose-800' 
                    : 'bg-amber-950 text-amber-300 border-amber-800'
                }`}>
                  {rule.severity}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleRunRuleTest(rule.id)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded text-[11px] font-semibold flex items-center gap-1.5 border border-slate-700"
              >
                <Play className="w-3 h-3 text-cyan-400" />
                <span>Test Rule on Sample</span>
              </button>
            </div>

            {/* Plain English & SQL Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 block mb-1">Plain English Business Intent:</span>
                <p className="text-slate-300 italic">"{rule.naturalLanguage}"</p>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 font-mono text-[11px]">
                <div className="flex items-center gap-1 text-[10px] text-purple-400 font-bold mb-1">
                  <Code className="w-3 h-3" />
                  <span>Compiled SQL Code:</span>
                </div>
                <code className="text-cyan-300">{rule.generatedCode}</code>
              </div>
            </div>

            {/* Test Results */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/60">
              <div className="flex items-center gap-4">
                <span className="text-slate-400">Test Record Count: <strong className="text-slate-200">10,000</strong></span>
                <span className="text-emerald-400">Passed: <strong>{testResults[rule.id]?.pass || rule.passCount}</strong></span>
                <span className="text-rose-400">Failed: <strong>{testResults[rule.id]?.fail || rule.failCount}</strong></span>
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                Pass Rate: {(((testResults[rule.id]?.pass || rule.passCount) / 10000) * 100).toFixed(1)}%
              </span>
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
          <span>Continue to Step 5: Review & Submit for Approval →</span>
        </button>
      </div>
    </div>
  );
};
