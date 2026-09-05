export type UrgencyLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type TicketStatus =
  | 'PENDING_TRIAGE'
  | 'PENDING_APPROVAL'
  | 'PENDING_MANUAL_ROUTING'
  | 'DISPATCHED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'SPAM_REJECTED'
  | 'DUPLICATE_MERGED';

export type SLAStatus = 'NORMAL' | 'WARNING' | 'BREACHED';

export interface ReporterInfo {
  name: string;
  nik: string;
  phone: string;
  email: string;
}

export interface SecurityStatus {
  isSpam: boolean;
  spamConfidence: number;
  spamReason?: string;
  piiDetected: string[];
  maskedContent: string;
  originalEncryptedPreview?: string;
}

export interface DeduplicationInfo {
  isDuplicateSuspect: boolean;
  similarityScore: number;
  parentTicketId?: string;
  clusterIncidentName?: string;
  duplicateCount?: number;
  parentTicketStatus?: string;
  parentTicket?: {
    id: string;
    status: string;
    assignedOpdName?: string;
    approvedByAsn?: string;
  };
}

export interface ExtractedEntities {
  location?: string;
  landmark?: string;
  city?: string;
  district?: string;
  issueType?: string;
  impactSubject?: string;
}

export interface TriageAssessment {
  category: string;
  subCategory?: string;
  urgencyLevel: UrgencyLevel;
  urgencyReason: string;
  extractedEntities: ExtractedEntities;
  slaDeadlineHours: number;
}

export interface DepartmentRecommendation {
  departmentId: string;
  departmentName: string;
  confidenceScore: number; // 0.0 - 1.0
  reasoning: string;
  jurisdictionLevel: 'KOTA_KABUPATEN' | 'PROVINSI' | 'NASIONAL_KEMENTERIAN';
}

export interface SmartRouting {
  recommendedDepartment: DepartmentRecommendation | null;
  alternativeDepartments: DepartmentRecommendation[];
}

export interface ResponseDraft {
  draftTitle: string;
  draftBody: string;
  tone: 'Formal Official' | 'Empathetic Urgent' | 'Informational';
  knowledgeBaseCitations?: string[];
}

export interface SLAInfo {
  slaHours: number;
  reportedAt: string;
  deadlineAt: string;
  remainingMinutes: number;
  status: SLAStatus;
  escalationTierRecommended?: 'SEKDA' | 'KEPALA_DINAS' | 'INSPEKTORAT';
}

export interface ComplaintTicket {
  id: string;
  externalTicketId: string;
  channel: string;
  reportedAt: string;
  reporter: ReporterInfo;
  rawContent: string;
  security: SecurityStatus;
  deduplication: DeduplicationInfo;
  triage: TriageAssessment;
  routing: SmartRouting;
  responseCopilot: ResponseDraft;
  sla: SLAInfo;
  status: TicketStatus;
  assignedOpdId?: string;
  assignedOpdName?: string;
  approvedByAsn?: {
    asnName: string;
    asnNip: string;
    approvedAt: string;
    overrideOccurred: boolean;
  };
}
