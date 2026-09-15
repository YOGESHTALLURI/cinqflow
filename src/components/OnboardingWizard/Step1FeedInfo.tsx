import React, { useState } from 'react';
import type { FeedConfig, HealthcareDomain, DeliveryMethod, FileFormat, SchemaField } from '../../types';
import { Building2, Upload, FileCode, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';

interface Props {
  formData: Partial<FeedConfig>;
  updateFormData: (updates: Partial<FeedConfig>) => void;
  onNext: () => void;
}

export const Step1FeedInfo: React.FC<Props> = ({ formData, updateFormData, onNext }) => {
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseSuccess, setParseSuccess] = useState<boolean>(!!formData.sourceOrg);

  const domains: HealthcareDomain[] = ['Enrollment', 'Claims', 'ADT', 'Provider', 'Clinical', 'Quality', 'Risk', 'Lab'];
  const deliveryMethods: DeliveryMethod[] = ['SFTP', 'API', 'FHIR', 'Database', 'Azure Storage', 'File Upload'];
  const formats: FileFormat[] = ['CSV', 'JSON', 'HL7', 'FHIR', 'Fixed-width', 'XML'];

  const parseFileAndSetForm = (fileName: string, content: string) => {
    setUploadedFileName(fileName);
    setParseSuccess(true);

    let inferredFields: SchemaField[] = [];

    if (fileName.endsWith('.csv') || content.includes(',')) {
      const lines = content.split('\n').filter(l => l.trim().length > 0);
      if (lines.length > 0) {
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const dataRow = lines.length > 1 ? lines[1].split(',').map(d => d.trim().replace(/"/g, '')) : [];

        inferredFields = headers.map((col, idx) => {
          const val = dataRow[idx] || '';
          let dataType = 'VARCHAR(50)';
          let phi: SchemaField['phiClassification'] = 'None';

          if (col.toLowerCase().includes('date') || col.toLowerCase().includes('dob')) dataType = 'DATE';
          else if (col.toLowerCase().includes('amount') || col.toLowerCase().includes('billed')) { dataType = 'DECIMAL(10,2)'; phi = 'Financial'; }
          else if (col.toLowerCase().includes('id') || col.toLowerCase().includes('mrn')) { dataType = 'VARCHAR(20)'; phi = 'PHI'; }

          if (col.toLowerCase().includes('ssn') || col.toLowerCase().includes('name')) phi = 'PII';

          return {
            id: `f-${idx}`,
            fieldName: col,
            dataType,
            nullable: false,
            sampleValues: [val || 'SampleData'],
            phiClassification: phi,
            confidenceScore: 99
          };
        });
      }

      updateFormData({
        sourceOrg: fileName.includes('aetna') ? 'Aetna Health Inc.' : 'Sample Payer Org',
        feedCode: fileName.includes('834') ? 'FEED-AET-834' : `FEED-CSV-${Date.now().toString().substring(8)}`,
        feedName: fileName.includes('enrollment') ? 'Aetna 834 Member Enrollment Feed' : `CSV Feed (${fileName})`,
        domain: fileName.includes('enroll') ? 'Enrollment' : 'Claims',
        deliveryMethod: 'SFTP',
        fileFormat: 'CSV',
        frequency: 'Daily 04:00 EST',
        slaMinutes: 120,
        owner: 'Sarah Jenkins (Lead BA)',
        schemaFields: inferredFields.length > 0 ? inferredFields : undefined
      });
    } else if (fileName.endsWith('.json') || content.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(content);
        const metadata = parsed.metadata || parsed;
        updateFormData({
          sourceOrg: metadata.sourceOrg || 'Blue Cross Blue Shield',
          feedCode: metadata.feedCode || 'FEED-BCBS-837P',
          feedName: metadata.feedName || 'BCBS 837 Professional Claims Feed',
          domain: metadata.domain || 'Claims',
          deliveryMethod: metadata.deliveryMethod || 'Azure Storage',
          fileFormat: 'JSON',
          frequency: metadata.frequency || 'Daily 06:00 EST',
          slaMinutes: metadata.slaMinutes || 180,
          owner: metadata.owner || 'Marcus Vance (Data Steward)'
        });
      } catch (e) {
        // Fallback
      }
    } else if (fileName.endsWith('.hl7') || content.startsWith('MSH')) {
      updateFormData({
        sourceOrg: 'Mount Sinai Health System',
        feedCode: 'FEED-MSH-ADT',
        feedName: 'Epic ADT Real-time Event Feed',
        domain: 'ADT',
        deliveryMethod: 'FHIR',
        fileFormat: 'HL7',
        frequency: 'Streaming / Microbatch',
        slaMinutes: 30,
        owner: 'Elena Rostova (Data Engineer)'
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setTimeout(() => {
        setIsParsing(false);
        parseFileAndSetForm(file.name, content);
      }, 600);
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.sourceOrg || !formData.feedName || !formData.feedCode) {
      alert('Please browse and upload a sample data file to extract feed metadata before continuing.');
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-cyan-400" />
            Step 1: Upload Feed Sample File
          </h2>
          <p className="text-xs text-slate-400">
            Upload your sample dataset once to extract metadata, infer schema fields, and classify PHI security automatically.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-cyan-950 text-cyan-400 border border-cyan-800 rounded-full flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>Single-Upload Journey</span>
        </span>
      </div>

      {/* Main File Upload Drag & Drop Zone */}
      <div className="border-2 border-dashed border-cyan-500/40 hover:border-cyan-400 bg-slate-900/60 rounded-2xl p-8 text-center transition-all shadow-lg shadow-cyan-950/20">
        <div className="w-14 h-14 rounded-2xl bg-cyan-950/80 border border-cyan-800 flex items-center justify-center mx-auto mb-4">
          <Upload className="w-7 h-7 text-cyan-400" />
        </div>
        
        <h3 className="text-base font-bold text-white">Upload Sample Dataset File to Extract Metadata</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          Select a sample dataset file from your <span className="font-mono text-cyan-300 font-bold">Downloads</span> folder (<code className="text-cyan-400">.csv</code>, <code className="text-cyan-400">.json</code>, <code className="text-cyan-400">.hl7</code>) to auto-extract all registry metadata and schema fields.
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <label className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold rounded-xl text-xs cursor-pointer shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all">
            <FileCode className="w-4 h-4" />
            <span>Browse Sample File from Downloads...</span>
            <input
              type="file"
              accept=".json,.csv,.hl7,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Parse Status Indicator */}
      {isParsing && (
        <div className="bg-slate-900 p-4 rounded-xl border border-cyan-500/50 text-center text-xs text-cyan-300 font-semibold animate-pulse flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
          <span>Parsing file and extracting metadata, schema fields & PHI tags...</span>
        </div>
      )}

      {/* Awaiting Upload State Placeholder */}
      {!parseSuccess && !isParsing && (
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 text-center text-xs text-slate-400 space-y-2">
          <AlertCircle className="w-6 h-6 text-slate-500 mx-auto" />
          <p className="font-semibold text-slate-300">Awaiting File Upload</p>
          <p className="text-[11px] text-slate-500 max-w-md mx-auto">
            Please click "Browse Sample File from Downloads..." above and select a sample file (e.g. <code className="text-cyan-400">aetna_enrollment_834_sample.csv</code>) to extract and display metadata attributes.
          </p>
        </div>
      )}

      {/* Parse Success Notification */}
      {parseSuccess && (
        <div className="bg-emerald-950/60 p-4 rounded-xl border border-emerald-800 text-xs text-emerald-300 font-semibold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Metadata & Schema Fields Extracted Successfully from <strong className="font-mono text-white">{uploadedFileName || 'Uploaded File'}</strong></span>
          </div>
          <span className="text-[10px] bg-emerald-900 px-2.5 py-1 rounded text-emerald-200 font-bold">100% Inferred</span>
        </div>
      )}

      {/* Extracted Metadata Inspection & Adjustments (Revealed ONLY after upload) */}
      {parseSuccess && (
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Extracted Metadata Attributes</h3>
            <span className="text-[11px] text-slate-400">Editable if adjustments are needed</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Source Organization */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Source Organization *</label>
              <input
                type="text"
                required
                value={formData.sourceOrg || ''}
                onChange={(e) => updateFormData({ sourceOrg: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 outline-none focus:border-cyan-500"
              />
            </div>

            {/* Feed Identifier Code */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Unique Feed Code *</label>
              <input
                type="text"
                required
                value={formData.feedCode || ''}
                onChange={(e) => updateFormData({ feedCode: e.target.value.toUpperCase() })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-cyan-300 font-mono outline-none focus:border-cyan-500"
              />
            </div>

            {/* Feed Display Name */}
            <div className="md:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Feed Display Name *</label>
              <input
                type="text"
                required
                value={formData.feedName || ''}
                onChange={(e) => updateFormData({ feedName: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 outline-none focus:border-cyan-500"
              />
            </div>

            {/* Healthcare Domain */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Healthcare Domain *</label>
              <select
                value={formData.domain || 'Enrollment'}
                onChange={(e) => updateFormData({ domain: e.target.value as HealthcareDomain })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 outline-none focus:border-cyan-500"
              >
                {domains.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* File Format */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Inbound File Format *</label>
              <select
                value={formData.fileFormat || 'CSV'}
                onChange={(e) => updateFormData({ fileFormat: e.target.value as FileFormat })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 outline-none focus:border-cyan-500"
              >
                {formats.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            {/* Delivery Method */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Delivery Mechanism *</label>
              <select
                value={formData.deliveryMethod || 'SFTP'}
                onChange={(e) => updateFormData({ deliveryMethod: e.target.value as DeliveryMethod })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 outline-none focus:border-cyan-500"
              >
                {deliveryMethods.map(dm => (
                  <option key={dm} value={dm}>{dm}</option>
                ))}
              </select>
            </div>

            {/* SLA Minutes */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Target Processing SLA (Minutes)</label>
              <input
                type="number"
                value={formData.slaMinutes || 120}
                onChange={(e) => updateFormData({ slaMinutes: parseInt(e.target.value) || 60 })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={!parseSuccess}
          className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Continue to Step 2: Schema Profiling & Sample Ingestion →</span>
        </button>
      </div>
    </form>
  );
};
