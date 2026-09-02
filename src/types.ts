export type ScenarioType =
  | 'payment_failure'
  | 'checkout_abandonment'
  | 'failed_subscription'
  | 'overdue_invoice'
  | 'receivables';

export type RecoveryStatus =
  | 'identified'
  | 'analyzing'
  | 'intervention_active'
  | 'ptp_active'
  | 'recovered'
  | 'stopped'
  | 'failed';

export type RecoveryChannel =
  | 'razorpay_link'
  | 'whatsapp_ai'
  | 'hinglish_voice'
  | 'mandate_retry'
  | 'dunning_email';

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: 'gemini_agent' | 'razorpay_webhook' | 'compliance_engine' | 'user' | 'customer' | 'system';
  action: string;
  details: string;
  flag?: string;
  case_id?: string;
  event_type?: string;
  metadata?: Record<string, any>;
}

export interface StoppingRuleCheck {
  ruleName: string;
  passed: boolean;
  reason: string;
}

export interface RecoveryCase {
  id: string;
  caseNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  companyName?: string;
  scenario: ScenarioType;
  scenarioLabel?: string;
  amount: number;
  currency: string;
  failureCode?: string;
  failureReason: string;
  bankName?: string;
  paymentMethod?: 'upi' | 'card' | 'mandate_nach' | 'netbanking' | 'wallet';
  riskScore: number; // 0 - 100
  aiScore?: string;
  status: RecoveryStatus;
  createdAt: string;
  lastAttemptAt?: string;
  attemptsCount: number;
  maxAttempts: number;
  channel?: RecoveryChannel;
  rootCauseDiagnosis?: string;
  recoveryStrategy?: string;
  dynamicDiscountPercent?: number;
  stoppingRuleTriggered?: string;
  stoppingRuleChecks?: StoppingRuleCheck[];
  promiseToPayDate?: string;
  promiseToPayAmount?: number;
  promiseStatus?: 'ACTIVE_NUDGE' | 'PAUSED_RETRY' | 'SETTLED' | 'HALTED';
  ptpStatus?: 'pending' | 'honored' | 'breached';
  paymentLinkId?: string;
  paymentUrl?: string;
  recoveredAt?: string;
  recoveredAmount?: number;
  recovered?: boolean;
  resolutionNotes?: string;
  detectionReason?: string;
  discountApplied?: number;
  auditTrail: AuditEntry[];
  customerSentiment?: 'frustrated' | 'cooperative' | 'hesitant' | 'unresponsive' | 'disputing';
}

export interface StoppingRulesConfig {
  maxAttempts: number;
  antiHarassmentHoursStart: number;
  antiHarassmentHoursEnd: number;
  maxDiscountAllowed: number;
  disputeCooldownDays: number;
  blockOnDispute: boolean;
  minAmountForVoiceRecovery: number;
  mandateRetryIntervalHours: number;
}

export interface RazorpaySettings {
  keyId: string;
  keySecretMasked: string;
  hasKeySecret: boolean;
  webhookSecretMasked: string;
  hasWebhookSecret: boolean;
  testMode: boolean;
  webhookEndpointUrl: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'fintech_admin' | 'recovery_manager';
  avatarUrl?: string;
}

export interface BatchRecoveryResult {
  batchId: string;
  totalProcessed: number;
  recoveredCount: number;
  recoveredAmount: number;
  stoppedCount: number;
  ptpCount: number;
  cases: RecoveryCase[];
}

export interface RecoveryAnalytics {
  totalAtRisk: number;
  totalRecovered: number;
  recoveryRatePercent: number;
  activeInFlightCount: number;
  ptpCommittedAmount: number;
  stoppedByRulesCount: number;
  channelBreakdown?: {
    channel: string;
    recoveredAmount: number;
    count: number;
    successRate: number;
  }[];
  cohortVelocity: {
    hourBucket: string;
    recovered: number;
    atRisk: number;
  }[];
  rootCauses: {
    name: string;
    count: number;
    amount: number;
  }[];
}
