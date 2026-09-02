import React, { useState, useRef } from 'react';
import {
  Upload,
  FileSpreadsheet,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  PlusCircle,
  Download,
  Trash2,
  HelpCircle,
  TrendingUp,
  Cpu,
  Layers,
  PhoneCall,
  QrCode,
  CreditCard,
  Building2,
  Clock,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { ScenarioType } from '../types';

interface IngestViewProps {
  onAddCase: (newCase: any) => Promise<void>;
  onBulkAddCases?: (cases: any[]) => Promise<boolean>;
  onNavigateTab: (tab: any) => void;
}

interface ParsedCaseRow {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  companyName?: string;
  amount: number;
  scenario: ScenarioType;
  scenarioLabel: string;
  failureReason: string;
  bankName: string;
  paymentMethod: string;
  daysOverdue: number;
  riskLevel: 'critical' | 'high' | 'moderate' | 'low';
  riskScore: number;
  recommendedAction: string;
  actionIcon: 'qr' | 'voice' | 'card' | 'retry';
}

const SAMPLE_CSV_DATA = `CustomerName,CustomerEmail,CustomerPhone,CompanyName,Amount,Scenario,BankName,PaymentMethod,FailureReason,DaysOverdue
Aditya Birla Logistics,billing@adityabirla.com,+91 9820123456,Aditya Birla Group,84500,overdue_invoice,HDFC Bank,netbanking,Net-30 Enterprise Invoice Overdue by 14 Days,14
Meera Nambiar,meera.nambiar@gmail.com,+91 9845112233,,4999,payment_failure,SBI,upi,UPI Switch 504 Timeout during checkout renewal,3
Zomato Gold Merchant,ops@zomatopartner.in,+91 9988776655,Zomato Partner Network,32000,failed_subscription,ICICI Bank,mandate_nach,E-Mandate Auto-Debit recurring limit exceeded,8
Vikramaditya Rao,vikram.rao@techcorp.io,+91 9711223344,TechCorp Solutions,14500,checkout_abandonment,Axis Bank,card,Debit Card 3DS 2.0 Auth Timeout during OTP verification,2
Swiggy Cloud Kitchens,finance@swiggykitchens.com,+91 9911002233,Swiggy Vendor Hub,65000,receivables,Kotak Bank,netbanking,Vendor ERP Reconciliation mismatch on monthly billing,18
Pooja Hegde Studios,accounts@poojahegde.com,+91 9822334455,,8999,failed_subscription,HDFC Bank,card,Card Token Expired for Annual Creative Cloud Suite,5
Ritesh Hospitality,ritesh@hotelgrand.in,+91 9833445566,Grand Palace Hotels,42000,overdue_invoice,Yes Bank,netbanking,Quarterly SaaS CRM invoice unpaid past grace period,11
Anirudh Ravichander,anirudh.sound@studio.in,+91 9811224466,,12500,payment_failure,IndusInd Bank,upi,GPay UPI daily velocity limit hit on sound library purchase,1`;

export const IngestView: React.FC<IngestViewProps> = ({
  onAddCase,
  onBulkAddCases,
  onNavigateTab,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeMode, setActiveMode] = useState<'sheet' | 'single'>('sheet');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Single Case Form State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [amount, setAmount] = useState('7500');
  const [scenario, setScenario] = useState<ScenarioType>('payment_failure');
  const [failureReason, setFailureReason] = useState('HDFC UPI Switch Latency 504 Timeout');
  const [bankName, setBankName] = useState('HDFC Bank');
  const [daysOverdue, setDaysOverdue] = useState('4');
  const [isSubmittingSingle, setIsSubmittingSingle] = useState(false);

  // Sheet Upload State
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedCaseRow[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccessMsg, setImportSuccessMsg] = useState('');
  const [dragOver, setDragOver] = useState(false);

  // Helper to determine AI recommendation based on row parameters
  const determineRecommendation = (
    scenario: ScenarioType,
    amount: number,
    daysOverdue: number,
    failureReason: string
  ): { action: string; icon: 'qr' | 'voice' | 'card' | 'retry' } => {
    const reasonLower = (failureReason || '').toLowerCase();
    if (scenario === 'overdue_invoice' || scenario === 'receivables' || amount > 50000 || daysOverdue > 10) {
      return {
        action: 'Deploy Hinglish AI Voice Bot + WhatsApp Smart Paylink with P2P Lock',
        icon: 'voice',
      };
    }
    if (scenario === 'failed_subscription' || reasonLower.includes('mandate') || reasonLower.includes('token')) {
      return {
        action: 'Issue Token Refresh Direct Link & Razorpay 0% EMI Re-subscription',
        icon: 'card',
      };
    }
    if (reasonLower.includes('upi') || reasonLower.includes('504') || reasonLower.includes('timeout')) {
      return {
        action: 'Generate Instant Dynamic UPI QR with Multi-Bank Switch Fallback',
        icon: 'qr',
      };
    }
    return {
      action: 'Automated Razorpay Smart Link via WhatsApp & SMS with 3-Step Escalation',
      icon: 'retry',
    };
  };

  // Parse CSV string into structured case rows
  const parseCSVContent = (text: string, filename: string) => {
    setIsParsing(true);
    try {
      const lines = text
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 0);
      if (lines.length <= 1) {
        alert('The uploaded file is empty or missing data rows.');
        setIsParsing(false);
        return;
      }

      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/[^a-z0-9]/g, ''));
      const rows: ParsedCaseRow[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map((v) => v.trim());
        if (values.length < 3) continue;

        // Extract fields by column headers or fall back to position
        const nameIdx = headers.findIndex((h) => h.includes('name') && !h.includes('bank') && !h.includes('company'));
        const emailIdx = headers.findIndex((h) => h.includes('email') || h.includes('mail'));
        const phoneIdx = headers.findIndex((h) => h.includes('phone') || h.includes('mobile') || h.includes('contact'));
        const companyIdx = headers.findIndex((h) => h.includes('company') || h.includes('org'));
        const amountIdx = headers.findIndex((h) => h.includes('amount') || h.includes('due') || h.includes('value'));
        const scenarioIdx = headers.findIndex((h) => h.includes('scenario') || h.includes('type'));
        const bankIdx = headers.findIndex((h) => h.includes('bank'));
        const methodIdx = headers.findIndex((h) => h.includes('method') || h.includes('channel'));
        const reasonIdx = headers.findIndex((h) => h.includes('reason') || h.includes('cause') || h.includes('failure'));
        const overdueIdx = headers.findIndex((h) => h.includes('overdue') || h.includes('days') || h.includes('age'));

        const cName = nameIdx !== -1 && values[nameIdx] ? values[nameIdx] : values[0] || `Merchant ${i}`;
        const cEmail = emailIdx !== -1 && values[emailIdx] ? values[emailIdx] : `${cName.toLowerCase().replace(/[^a-z]/g, '.')}@example.com`;
        const cPhone = phoneIdx !== -1 && values[phoneIdx] ? values[phoneIdx] : `+91 ${9800000000 + i * 11111}`;
        const compName = companyIdx !== -1 ? values[companyIdx] : '';
        const amt = amountIdx !== -1 && Number(values[amountIdx]) ? Number(values[amountIdx]) : 4999 + i * 1500;
        
        let scen: ScenarioType = 'payment_failure';
        if (scenarioIdx !== -1 && values[scenarioIdx]) {
          const val = values[scenarioIdx].toLowerCase();
          if (val.includes('checkout') || val.includes('abandon')) scen = 'checkout_abandonment';
          else if (val.includes('sub') || val.includes('mandate')) scen = 'failed_subscription';
          else if (val.includes('invoice')) scen = 'overdue_invoice';
          else if (val.includes('rec')) scen = 'receivables';
        }

        const bank = bankIdx !== -1 && values[bankIdx] ? values[bankIdx] : 'HDFC Bank';
        const method = methodIdx !== -1 && values[methodIdx] ? values[methodIdx] : 'upi';
        const reason = reasonIdx !== -1 && values[reasonIdx] ? values[reasonIdx] : 'Gateway switch response delay';
        const overdue = overdueIdx !== -1 && Number(values[overdueIdx]) ? Number(values[overdueIdx]) : Math.floor(Math.random() * 10) + 1;

        const riskLevel: 'critical' | 'high' | 'moderate' | 'low' =
          overdue >= 14 || amt > 50000 ? 'critical' : overdue >= 7 || amt > 20000 ? 'high' : overdue >= 3 ? 'moderate' : 'low';
        const riskScore = riskLevel === 'critical' ? 92 : riskLevel === 'high' ? 82 : riskLevel === 'moderate' ? 68 : 45;

        const rec = determineRecommendation(scen, amt, overdue, reason);

        rows.push({
          id: `parsed_${Date.now()}_${i}`,
          customerName: cName,
          customerEmail: cEmail,
          customerPhone: cPhone,
          companyName: compName,
          amount: amt,
          scenario: scen,
          scenarioLabel: scen.replace('_', ' ').toUpperCase(),
          failureReason: reason,
          bankName: bank,
          paymentMethod: method,
          daysOverdue: overdue,
          riskLevel,
          riskScore,
          recommendedAction: rec.action,
          actionIcon: rec.icon,
        });
      }

      setParsedRows(rows);
      setUploadedFileName(filename);
    } catch (err) {
      console.error('CSV Parsing error:', err);
      alert('Error parsing CSV file. Please verify format.');
    } finally {
      setIsParsing(false);
    }
  };

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      parseCSVContent(text, file.name);
    };
    reader.readAsText(file);
  };

  // Drag and drop handlers
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target?.result as string;
        parseCSVContent(text, file.name);
      };
      reader.readAsText(file);
    }
  };

  // Load Demo Sample Data
  const handleLoadDemoSpreadsheet = () => {
    parseCSVContent(SAMPLE_CSV_DATA, 'revora_enterprise_failed_cases_demo.csv');
  };

  // Download Sample CSV Template
  const handleDownloadTemplate = () => {
    const blob = new Blob([SAMPLE_CSV_DATA], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'revora_failed_cases_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Import all parsed cases into live recovery engine
  const handleImportAllCases = async () => {
    if (parsedRows.length === 0) return;
    setIsImporting(true);

    try {
      if (onBulkAddCases) {
        const success = await onBulkAddCases(parsedRows);
        if (success) {
          setImportSuccessMsg(`Successfully imported ${parsedRows.length} cases into the Autonomous Recovery Queue!`);
          setTimeout(() => {
            onNavigateTab('queue');
          }, 1500);
        }
      } else {
        // Fallback to sequential addition
        for (const row of parsedRows) {
          await onAddCase(row);
        }
        setImportSuccessMsg(`Successfully imported ${parsedRows.length} cases!`);
        setTimeout(() => {
          onNavigateTab('queue');
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      alert('Error importing cases. Please try again.');
    } finally {
      setIsImporting(false);
    }
  };

  // Pre-fill single case form
  const handlePreFillSingle = () => {
    setCustomerName('Rajeyo Haldar');
    setCustomerEmail('rajeyo.haldar@example.com');
    setCustomerPhone('+91 9876543210');
    setCompanyName('Haldar Fintech Labs');
    setAmount('4999');
    setScenario('payment_failure');
    setFailureReason('HDFC Bank Gateway 504 Timeout on ₹4,999 annual subscription renewal');
    setBankName('HDFC Bank');
    setDaysOverdue('3');
  };

  // Submit single case
  const handleSubmitSingle = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingSingle(true);
    try {
      await onAddCase({
        customerName,
        customerEmail,
        customerPhone,
        companyName,
        amount: Number(amount),
        scenario,
        failureReason,
        bankName,
        daysOverdue: Number(daysOverdue),
        paymentMethod: 'upi',
      });
      setImportSuccessMsg(`Case successfully ingested! Autonomous workflow active.`);
      setTimeout(() => {
        onNavigateTab('queue');
      }, 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingSingle(false);
    }
  };

  // Sheet Summary Metrics
  const totalAmountAnalyzed = parsedRows.reduce((sum, r) => sum + r.amount, 0);
  const criticalCount = parsedRows.filter((r) => r.riskLevel === 'critical').length;
  const highCount = parsedRows.filter((r) => r.riskLevel === 'high').length;
  const upiCount = parsedRows.filter((r) => r.failureReason.toLowerCase().includes('upi') || r.paymentMethod === 'upi').length;
  const voiceCount = parsedRows.filter((r) => r.actionIcon === 'voice').length;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200 font-sans pb-10">
      {/* Top Header & Mode Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Data Ingestion & AI Diagnostic Engine
            </h2>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
              Bulk Intelligence
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Upload CSV/Excel failure sheets for automated AI triage, root-cause diagnosis, and recommended recovery workflows.
          </p>
        </div>

        {/* Tab Mode Buttons */}
        <div className={`p-1 rounded-xl border flex items-center gap-1 self-start md:self-auto ${
          isDark ? 'bg-black/40 border-white/10' : 'bg-slate-100 border-slate-300'
        }`}>
          <button
            onClick={() => setActiveMode('sheet')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMode === 'sheet'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                : isDark
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Upload Data Sheet (CSV/Excel)</span>
          </button>

          <button
            onClick={() => setActiveMode('single')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMode === 'single'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                : isDark
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Single Case Entry</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {importSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2.5 shadow-lg shadow-emerald-950/40">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <span>{importSuccessMsg}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 1: SHEET UPLOAD & AI DIAGNOSTIC ENGINE */}
      {/* ========================================================================= */}
      {activeMode === 'sheet' && (
        <div className="space-y-6">
          {/* Upload Dropzone & Action Bar */}
          <div
            className={`p-6 sm:p-8 rounded-3xl border transition-all ${
              dragOver
                ? 'border-blue-500 bg-blue-500/10'
                : isDark
                ? 'bg-[#080d1a] border-white/10'
                : 'bg-white border-slate-200 shadow-sm'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600/20 via-indigo-600/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Upload className="w-8 h-8 animate-bounce" />
              </div>

              <div>
                <h3 className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {uploadedFileName ? `Active Sheet: ${uploadedFileName}` : 'Drag & Drop your Failed Cases Spreadsheet'}
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-lg mx-auto">
                  Supports .csv, .xlsx, or exported CRM transaction files with columns like Customer, Amount, Bank, Failure Reason, Days Overdue.
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv, .xlsx, .xls, .json, .txt"
                className="hidden"
                onChange={handleFileUpload}
              />

              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-blue-600/30 transition-all"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Browse & Upload CSV File</span>
                </button>

                <button
                  type="button"
                  onClick={handleLoadDemoSpreadsheet}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                    isDark
                      ? 'bg-white/5 hover:bg-white/10 border-white/10 text-cyan-300'
                      : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Load Enterprise Sample Sheet (8 Cases)</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                    isDark
                      ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                      : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                  }`}
                  title="Download a formatted sample CSV template to fill"
                >
                  <Download className="w-4 h-4 text-slate-400" />
                  <span>Download Sample CSV Template</span>
                </button>

                {parsedRows.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setParsedRows([]);
                      setUploadedFileName(null);
                    }}
                    className="px-3 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* AI Diagnostic Summary & Recommendations (Appears when sheet is parsed) */}
          {parsedRows.length > 0 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-200">
              {/* Executive Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div className={`p-4 rounded-2xl border ${
                  isDark ? 'bg-[#080d18] border-white/10' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <div className="text-slate-400 text-[11px] font-semibold uppercase">Total Exposure In Sheet</div>
                  <div className="text-xl font-black text-white font-mono mt-1 text-emerald-400">
                    ₹{totalAmountAnalyzed.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">{parsedRows.length} transactions analyzed</div>
                </div>

                <div className={`p-4 rounded-2xl border ${
                  isDark ? 'bg-[#080d18] border-white/10' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <div className="text-slate-400 text-[11px] font-semibold uppercase">Critical & High Risk</div>
                  <div className="text-xl font-black text-rose-400 font-mono mt-1">
                    {criticalCount + highCount} Cases
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Requires immediate automated outreach</div>
                </div>

                <div className={`p-4 rounded-2xl border ${
                  isDark ? 'bg-[#080d18] border-white/10' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <div className="text-slate-400 text-[11px] font-semibold uppercase">Instant UPI QR Eligible</div>
                  <div className="text-xl font-black text-cyan-400 font-mono mt-1">
                    {upiCount} Cases
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Single-tap GPay/PhonePe switch recovery</div>
                </div>

                <div className={`p-4 rounded-2xl border ${
                  isDark ? 'bg-[#080d18] border-white/10' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <div className="text-slate-400 text-[11px] font-semibold uppercase">Voice Bot Recommendations</div>
                  <div className="text-xl font-black text-indigo-400 font-mono mt-1">
                    {voiceCount} High-Ticket
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Hinglish conversation + P2P register</div>
                </div>
              </div>

              {/* AI Strategic Action Plan Card */}
              <div className={`p-5 rounded-2xl border ${
                isDark ? 'bg-gradient-to-r from-blue-950/30 via-indigo-950/20 to-[#080d1a] border-blue-500/20' : 'bg-blue-50/50 border-blue-200'
              }`}>
                <div className="flex items-center gap-2 mb-2.5">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                  <h4 className={`text-sm font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    AI Sheet Diagnostic & Automated Action Protocol
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white border-slate-200'}`}>
                    <div className="font-bold text-cyan-400 flex items-center gap-1.5 mb-1">
                      <QrCode className="w-3.5 h-3.5" />
                      <span>1. Dynamic UPI Fallback</span>
                    </div>
                    <p className="text-slate-300 text-[11px]">
                      For 504 timeouts and bank switch drops, dispatch dynamic Razorpay links with direct Intent QR for immediate settlement.
                    </p>
                  </div>

                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white border-slate-200'}`}>
                    <div className="font-bold text-indigo-400 flex items-center gap-1.5 mb-1">
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>2. Hinglish AI Voice Escalation</span>
                    </div>
                    <p className="text-slate-300 text-[11px]">
                      For high-ticket enterprise invoices (&gt;₹30k or &gt;10 days overdue), trigger polite AI voice calls with Promise-to-Pay registration.
                    </p>
                  </div>

                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white border-slate-200'}`}>
                    <div className="font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>3. RBI Compliance Guardrails</span>
                    </div>
                    <p className="text-slate-300 text-[11px]">
                      Strict 3-contact attempt cap, 7 PM – 9 AM IST cooling period, and automatic grace pause upon Promise-to-Pay.
                    </p>
                  </div>
                </div>
              </div>

              {/* Data Table Review */}
              <div className={`rounded-2xl border overflow-hidden ${
                isDark ? 'bg-[#080d18] border-white/10' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className={`px-4 py-3 border-b flex items-center justify-between ${
                  isDark ? 'bg-white/[0.02] border-white/10' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-300">Parsed Records Review</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      {parsedRows.length} Rows Ready
                    </span>
                  </div>

                  {/* Primary CTA Button */}
                  <button
                    onClick={handleImportAllCases}
                    disabled={isImporting}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>
                      {isImporting
                        ? 'Importing & Deploying...'
                        : `Import All ${parsedRows.length} Cases (₹${totalAmountAnalyzed.toLocaleString('en-IN')})`}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className={`border-b text-[11px] font-mono uppercase tracking-wider ${
                        isDark ? 'border-white/10 bg-white/[0.01] text-slate-400' : 'border-slate-200 bg-slate-100/50 text-slate-600'
                      }`}>
                        <th className="py-3 px-4">Customer / Entity</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Bank / Channel</th>
                        <th className="py-3 px-4">Failure Reason</th>
                        <th className="py-3 px-4">Overdue</th>
                        <th className="py-3 px-4">Risk Level</th>
                        <th className="py-3 px-4">AI Recommended Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {parsedRows.map((row) => (
                        <tr key={row.id} className={isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50'}>
                          <td className="py-3 px-4 font-semibold text-white">
                            <div>{row.customerName}</div>
                            {row.companyName && (
                              <div className="text-[10px] text-slate-400 font-normal">{row.companyName}</div>
                            )}
                            <div className="text-[10px] text-slate-500 font-mono">{row.customerEmail}</div>
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                            ₹{row.amount.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-200">{row.bankName}</div>
                            <div className="text-[10px] text-slate-400 uppercase font-mono">{row.paymentMethod}</div>
                          </td>
                          <td className="py-3 px-4 max-w-xs text-slate-300 text-[11px]">
                            {row.failureReason}
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-300">
                            {row.daysOverdue} days
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                              row.riskLevel === 'critical'
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                                : row.riskLevel === 'high'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                                : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                            }`}>
                              {row.riskLevel}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-[11px] text-cyan-300 font-medium max-w-xs">
                            <div className="flex items-center gap-1.5">
                              {row.actionIcon === 'voice' && <PhoneCall className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                              {row.actionIcon === 'qr' && <QrCode className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                              {row.actionIcon === 'card' && <CreditCard className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                              {row.actionIcon === 'retry' && <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                              <span>{row.recommendedAction}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Bottom Ingest CTA */}
                <div className={`p-4 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isDark ? 'bg-white/[0.02] border-white/10' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="text-xs text-slate-400">
                    Ready to deploy Razorpay recovery links, Hinglish voice campaigns, and automated retries for all records.
                  </div>
                  <button
                    onClick={handleImportAllCases}
                    disabled={isImporting}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>{isImporting ? 'Processing Deployment...' : 'Deploy Autonomous Recovery Pipeline'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: SINGLE CASE ENTRY FORM */}
      {/* ========================================================================= */}
      {activeMode === 'single' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Manual Transaction Ingestion
            </h3>
            <button
              type="button"
              onClick={handlePreFillSingle}
              className="px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pre-fill Sample Case</span>
            </button>
          </div>

          <form onSubmit={handleSubmitSingle} className={`p-6 rounded-2xl border space-y-5 shadow-2xl ${
            isDark ? 'bg-[#080d18] border-white/10' : 'bg-white border-slate-200'
          }`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Customer Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Rajeyo Haldar"
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 ${
                    isDark ? 'bg-black/50 border-white/10 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Customer Email</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="e.g. rajeyo.haldar@example.com"
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 ${
                    isDark ? 'bg-black/50 border-white/10 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Phone Number (WhatsApp)</label>
                <input
                  type="text"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 ${
                    isDark ? 'bg-black/50 border-white/10 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Company / Entity (Optional)</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Haldar Labs Pvt Ltd"
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 ${
                    isDark ? 'bg-black/50 border-white/10 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Amount (INR ₹)</label>
                <input
                  type="number"
                  required
                  min={100}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="4999"
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-none focus:border-blue-500 ${
                    isDark ? 'bg-black/50 border-white/10 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Bank Gateway</label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 ${
                    isDark ? 'bg-black/50 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="HDFC Bank">HDFC Bank</option>
                  <option value="ICICI Bank">ICICI Bank</option>
                  <option value="State Bank of India">State Bank of India (SBI)</option>
                  <option value="Axis Bank">Axis Bank</option>
                  <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                  <option value="Yes Bank">Yes Bank</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Revenue Failure Scenario</label>
              <select
                value={scenario}
                onChange={(e) => setScenario(e.target.value as ScenarioType)}
                className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 ${
                  isDark ? 'bg-black/50 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option value="payment_failure">Payment Degradation / Gateway Switch Timeout</option>
                <option value="checkout_abandonment">Checkout Drop-Off / 3DS OTP Verification</option>
                <option value="failed_subscription">Failed Subscription e-Mandate Auto-Debit</option>
                <option value="overdue_invoice">B2B Overdue Invoice (Net-30 Lapsed)</option>
                <option value="receivables">B2B Receivables Chaser</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Failure Diagnostics / Reason</label>
              <input
                type="text"
                required
                value={failureReason}
                onChange={(e) => setFailureReason(e.target.value)}
                placeholder="e.g. HDFC UPI switch timeout 504 on transaction payload"
                className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 ${
                  isDark ? 'bg-black/50 border-white/10 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmittingSingle}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{isSubmittingSingle ? 'Ingesting into Pipeline...' : 'Ingest & Deploy Autonomous Recovery'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
