export interface InferredField {
  id: string;
  fieldName: string;
  dataType: string;
  nullable: boolean;
  sampleValues: string[];
  phiClassification: 'PHI' | 'PII' | 'Financial' | 'None';
  confidenceScore: number;
}

export function parseFileContent(fileName: string, content: string): { fields: InferredField[]; rowCount: number; rawRows: any[] } {
  let fields: InferredField[] = [];
  let rawRows: any[] = [];

  if (fileName.endsWith('.csv') || content.includes(',')) {
    const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length > 0) {
      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        const rowObj: Record<string, string> = {};
        headers.forEach((h, idx) => {
          rowObj[h] = values[idx] || '';
        });
        rawRows.push(rowObj);
      }

      fields = headers.map((col, idx) => {
        const samples = rawRows.slice(0, 3).map((r: any) => r[col]).filter(Boolean);
        let dataType = 'VARCHAR(50)';
        let phiClassification: InferredField['phiClassification'] = 'None';

        const colLower = col.toLowerCase();
        if (colLower.includes('date') || colLower.includes('dob')) {
          dataType = 'DATE';
          phiClassification = colLower.includes('dob') ? 'PII' : 'None';
        } else if (colLower.includes('amount') || colLower.includes('billed') || colLower.includes('paid')) {
          dataType = 'DECIMAL(10,2)';
          phiClassification = 'Financial';
        } else if (colLower.includes('id') || colLower.includes('mrn') || colLower.includes('npi')) {
          dataType = 'VARCHAR(20)';
          phiClassification = colLower.includes('npi') ? 'None' : 'PHI';
        }

        if (colLower.includes('ssn') || colLower.includes('name') || colLower.includes('phone') || colLower.includes('email')) {
          phiClassification = 'PII';
        }

        return {
          id: `f-${idx + 1}`,
          fieldName: col,
          dataType,
          nullable: false,
          sampleValues: samples.length > 0 ? samples : ['SampleValue'],
          phiClassification,
          confidenceScore: 99
        };
      });
    }
  } else if (fileName.endsWith('.json') || content.trim().startsWith('{') || content.trim().startsWith('[')) {
    try {
      const parsed = JSON.parse(content);
      const rows = Array.isArray(parsed) ? parsed : (parsed.records || [parsed]);
      rawRows = rows;
      if (rows.length > 0) {
        const headers = Object.keys(rows[0]);
        fields = headers.map((col, idx) => {
          const samples = rows.slice(0, 3).map((r: any) => String(r[col])).filter(Boolean);
          let phi: InferredField['phiClassification'] = 'None';
          const colLower = col.toLowerCase();
          if (colLower.includes('ssn') || colLower.includes('name')) phi = 'PII';
          else if (colLower.includes('member') || colLower.includes('mrn')) phi = 'PHI';
          else if (colLower.includes('amount')) phi = 'Financial';

          return {
            id: `f-${idx + 1}`,
            fieldName: col,
            dataType: typeof rows[0][col] === 'number' ? 'DECIMAL(10,2)' : 'VARCHAR(50)',
            nullable: false,
            sampleValues: samples,
            phiClassification: phi,
            confidenceScore: 98
          };
        });
      }
    } catch (e) {
      // Fallback
    }
  }

  return { fields, rowCount: rawRows.length, rawRows };
}
