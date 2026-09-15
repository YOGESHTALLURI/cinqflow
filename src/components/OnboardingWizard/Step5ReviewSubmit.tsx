import React, { useState } from 'react';
import type { FeedConfig } from '../../types';
import { CheckCircle2, Send, FileText, Database } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  formData: Partial<FeedConfig>;
  onSubmit: (finalFeed: FeedConfig) => void;
  onBack: () => void;
}

export const Step5ReviewSubmit: React.FC<Props> = ({ formData, onSubmit, onBack }) => {
  const [approverNotes, setApproverNotes] = useState('Configuration validated against sample data. Ready for technical review.');

  const handleFinalSubmit = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    const finalFeed: FeedConfig = {
      id: `feed-${Date.now()}`,
      feedCode: formData.feedCode || `FEED-${Date.now().toString().substring(8)}`,
      sourceOrg: formData.sourceOrg || 'Unknown Source',
      feedName: formData.feedName || 'New Onboarded Feed',
      domain: formData.domain || 'Enrollment',
      deliveryMethod: formData.deliveryMethod || 'SFTP',
      fileFormat: formData.fileFormat || 'CSV',
      frequency: formData.frequency || 'Daily 04:00 EST',
      slaMinutes: formData.slaMinutes || 120,
      status: 'In Review',
      wave: 'Wave 1',
      owner: formData.owner || 'Sarah Jenkins (Lead BA)',
      targetOdsTables: ['ODS_Member', 'ODS_Coverage'],
      schemaFields: formData.schemaFields || [],
      mappings: formData.mappings || [],
      dqRules: formData.dqRules || [],
      dqScore: 100,
      totalRecordsProcessed: 0,
      quarantineCount: 0,
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0]
    };

    onSubmit(finalFeed);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Step 5: Onboarding Checklist & Approval Submission
          </h2>
          <p className="text-xs text-slate-400">Review complete feed configuration before submitting into the multi-stage release workflow.</p>
        </div>
        <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-full text-xs font-semibold">
          Ready for Review
        </span>
      </div>

      {/* Onboarding Summary Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-4 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
            <FileText className="w-4 h-4" />
            <span>Feed Registry Metadata</span>
          </div>
          <div className="text-xs space-y-1 text-slate-300">
            <p><strong>Feed Code:</strong> <span className="font-mono text-cyan-300">{formData.feedCode}</span></p>
            <p><strong>Source Org:</strong> {formData.sourceOrg}</p>
            <p><strong>Feed Name:</strong> {formData.feedName}</p>
            <p><strong>Domain:</strong> {formData.domain}</p>
            <p><strong>Delivery:</strong> {formData.deliveryMethod} ({formData.fileFormat})</p>
            <p><strong>SLA Target:</strong> {formData.slaMinutes} minutes</p>
          </div>
        </div>

        <div className="glass-card rounded-xl p-4 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
            <Database className="w-4 h-4" />
            <span>Configured Assets Summary</span>
          </div>
          <div className="text-xs space-y-1 text-slate-300">
            <p><strong>Schema Fields Inferred:</strong> {formData.schemaFields?.length || 0} Fields</p>
            <p><strong>PHI Fields Classified:</strong> {formData.schemaFields?.filter(f => f.phiClassification === 'PHI' || f.phiClassification === 'PII').length || 0} Fields</p>
            <p><strong>Canonical Mappings:</strong> {formData.mappings?.length || 0} Mappings</p>
            <p><strong>DQ Rules Authoring:</strong> {formData.dqRules?.length || 0} Rules</p>
            <p><strong>Target ODS Model:</strong> Silver ODS Canonical</p>
          </div>
        </div>
      </div>

      {/* Approval Notes */}
      <div className="glass-card rounded-xl p-4 border border-slate-800 space-y-2">
        <label className="block text-xs font-semibold text-slate-300">BA Submission Notes / Justification</label>
        <textarea
          rows={3}
          value={approverNotes}
          onChange={(e) => setApproverNotes(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-slate-100 outline-none focus:border-cyan-500"
        />
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
          onClick={handleFinalSubmit}
          className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-xs rounded-lg shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>Submit Configuration for Approval & Publication</span>
        </button>
      </div>
    </div>
  );
};
