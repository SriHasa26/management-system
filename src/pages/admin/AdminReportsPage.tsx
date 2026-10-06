import React from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { FileSpreadsheet, Download } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

export const AdminReportsPage: React.FC = () => {
  const { success } = useToast();

  const reports = [
    { title: 'Monthly Tuition Fee Collection Report', format: 'Excel / CSV', period: 'September 2026' },
    { title: 'Student Attendance & Absence Ledger', format: 'PDF / Excel', period: 'Term to Date' },
    { title: 'Subject Benchmark & Diagnostic Score Sheet', format: 'PDF', period: 'Mid-Term 2026' },
    { title: 'New Admissions & Enquiries Conversion Summary', format: 'Excel', period: 'FY 2026-27' },
  ];

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-2xl font-serif font-bold text-[#173F35]">Operational Reports & Exports</h2>
        <p className="text-xs text-stone-500">
          Generate official spreadsheets, audit trails, and student performance summaries.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((r, idx) => (
          <Card key={idx} variant="paper" className="p-6 border-[#EDE6D8] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-[#F0F5F3] text-[#2E6B57]">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#173F35]">{r.title}</h4>
                <p className="text-xs text-stone-500">{r.period} • {r.format}</p>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              icon={<Download className="w-3.5 h-3.5" />}
              onClick={() => success('Report Exported', `Generated ${r.title} for download.`)}
            >
              Export
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
