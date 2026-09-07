import React, { useState } from 'react';
import { Download, FileText, CheckCircle2, Clock, AlertCircle, ArrowDownToLine, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '../ui/Card';

export interface PayoutRecord {
  id: string;
  date: string;
  amount: number;
  currency: string;
  referralsCount: number;
  method: string;
  status: 'Paid' | 'Processing' | 'Scheduled';
  invoiceId: string;
}

const SAMPLE_PAYOUTS: PayoutRecord[] = [
  {
    id: 'PO-2025-09',
    date: '15 Sep 2025',
    amount: 16400,
    currency: '₹',
    referralsCount: 31,
    method: 'HDFC Bank (••••4092)',
    status: 'Processing',
    invoiceId: 'INV-RR-0925',
  },
  {
    id: 'PO-2025-08',
    date: '15 Aug 2025',
    amount: 14200,
    currency: '₹',
    referralsCount: 26,
    method: 'HDFC Bank (••••4092)',
    status: 'Paid',
    invoiceId: 'INV-RR-0825',
  },
  {
    id: 'PO-2025-07',
    date: '15 Jul 2025',
    amount: 18500,
    currency: '₹',
    referralsCount: 22,
    method: 'HDFC Bank (••••4092)',
    status: 'Paid',
    invoiceId: 'INV-RR-0725',
  },
  {
    id: 'PO-2025-06',
    date: '15 Jun 2025',
    amount: 9800,
    currency: '₹',
    referralsCount: 14,
    method: 'HDFC Bank (••••4092)',
    status: 'Paid',
    invoiceId: 'INV-RR-0625',
  },
];

interface PayoutHistoryTableProps {
  payouts?: PayoutRecord[];
  totalPaidOut?: number;
  upcomingScheduled?: number;
}

export default function PayoutHistoryTable({
  payouts,
  totalPaidOut = 42500,
  upcomingScheduled = 16400,
}: PayoutHistoryTableProps) {
  const [filter, setFilter] = useState<'All' | 'Paid' | 'Processing'>('All');
  const [search, setSearch] = useState('');

  const activePayouts = payouts && payouts.length > 0 ? payouts : SAMPLE_PAYOUTS;

  const filteredPayouts = activePayouts.filter((p) => {
    if (filter !== 'All' && p.status !== filter) return false;
    if (search && !p.id.toLowerCase().includes(search.toLowerCase()) && !p.date.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleDownloadInvoice = (invoiceId: string) => {
    toast.success(`Downloading invoice ${invoiceId}.pdf`, {
      description: 'Official payment receipt generated.',
    });
  };

  const handleExportCSV = () => {
    const csvHeader = 'Payout ID,Date,Amount,Currency,Referrals,Method,Status\n';
    const csvRows = SAMPLE_PAYOUTS.map(
      (p) => `${p.id},${p.date},${p.amount},${p.currency},${p.referralsCount},"${p.method}",${p.status}`
    ).join('\n');
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'RiskRules-Payout-History.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Payout history exported as CSV');
  };

  return (
    <Card elevation="card" id="payout-history" className="p-6 space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-primary">Payout History</h3>
          <p className="text-xs text-secondary mt-0.5">
            Transparent breakdown of your monthly affiliate earnings and disbursement receipts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Tabs */}
          <div className="inline-flex items-center p-1 rounded-xl bg-surface-0 border border-border">
            {(['All', 'Paid', 'Processing'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  filter === tab
                    ? 'bg-surface-2 text-primary shadow-xs'
                    : 'text-tertiary hover:text-secondary'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-1 hover:bg-surface-2 border border-border text-xs font-semibold text-secondary hover:text-primary transition-colors cursor-pointer"
          >
            <ArrowDownToLine className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-surface-0 border-b border-border text-[11px] font-semibold text-tertiary uppercase tracking-wider">
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Active Referrals</th>
              <th className="py-3 px-4">Payout Method</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Invoice</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filteredPayouts.map((row) => {
              const isPaid = row.status === 'Paid';
              const isProcessing = row.status === 'Processing';

              return (
                <tr key={row.id} className="hover:bg-surface-0/60 transition-colors">
                  <td className="py-3 px-4 font-medium text-primary whitespace-nowrap">
                    {row.date}
                    <span className="block text-[10px] text-tertiary font-mono">{row.id}</span>
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-primary whitespace-nowrap">
                    {row.currency}
                    {row.amount.toLocaleString()}
                  </td>

                  <td className="py-3 px-4 text-secondary whitespace-nowrap">
                    <span className="font-semibold text-primary">{row.referralsCount}</span> traders
                  </td>

                  <td className="py-3 px-4 text-secondary whitespace-nowrap font-mono text-[11px]">
                    {row.method}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    {isPaid && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20 text-[11px]">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Paid</span>
                      </span>
                    )}
                    {isProcessing && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20 text-[11px]">
                        <Clock className="w-3 h-3 animate-spin" style={{ animationDuration: '4s' }} />
                        <span>Processing</span>
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleDownloadInvoice(row.invoiceId)}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-violet-400 hover:text-violet-300 hover:underline cursor-pointer"
                    >
                      <FileText className="w-3 h-3" />
                      <span>{row.invoiceId}</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-tertiary pt-2 border-t border-border/50">
        <div>
          Showing {filteredPayouts.length} of {SAMPLE_PAYOUTS.length} payout cycles
        </div>
        <div className="flex items-center gap-4 mt-2 sm:mt-0 font-medium">
          <span>
            Total Paid Out:{' '}
            <strong className="text-primary font-mono font-bold">₹42,500</strong>
          </span>
          <span>•</span>
          <span>
            Upcoming Scheduled:{' '}
            <strong className="text-emerald-400 font-mono font-bold">₹16,400</strong>
          </span>
        </div>
      </div>
    </Card>
  );
}
