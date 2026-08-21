import { ComplaintTicket } from '@laporpak/shared';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export interface OPDData {
  id: string;
  name: string;
  code: string;
  jurisdiction: string;
  scope: string[];
  sla_standard_hours: number;
}

export interface AnalyticsData {
  summary: {
    total_complaints: number;
    dispatched_count: number;
    pending_count: number;
    spam_rejected_count: number;
    duplicate_clusters: number;
    average_triage_seconds: number;
    pii_protected_count: number;
    ai_accuracy_percent: number;
  };
  hitl_approval_breakdown: {
    direct_approved_percent: number;
    adjusted_draft_percent: number;
    overridden_percent: number;
  };
  opd_performance: Array<{
    name: string;
    code: string;
    tickets_count: number;
    compliance_rate: number;
  }>;
}

export async function fetchComplaints(params?: {
  status?: string;
  urgency?: string;
  search?: string;
}): Promise<ComplaintTicket[]> {
  try {
    const query = new URLSearchParams();
    if (params?.status && params.status !== 'ALL') query.append('status', params.status);
    if (params?.urgency && params.urgency !== 'ALL') query.append('urgency', params.urgency);
    if (params?.search) query.append('search', params.search);

    const res = await fetch(`${API_BASE_URL}/complaints?${query.toString()}`);
    if (!res.ok) throw new Error('Gagal memuat data aduan dari server');
    return await res.json();
  } catch (err) {
    console.warn('Backend API connection warning:', err);
    throw err;
  }
}

export async function submitNewComplaint(payload: {
  raw_content: string;
  reporter_name: string;
  reporter_nik?: string;
  reporter_phone?: string;
  reporter_email?: string;
  channel?: string;
}) {
  const res = await fetch(`${API_BASE_URL}/complaints`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Gagal mengirim aduan baru ke intelligence layer');
  return await res.json();
}

export async function submitHitlAction(
  ticketId: string,
  action: 'APPROVE' | 'OVERRIDE' | 'REJECT' | 'MERGE',
  extra?: { target_opd_id?: string; target_opd_name?: string }
) {
  const res = await fetch(`${API_BASE_URL}/complaints/${ticketId}/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...extra })
  });
  if (!res.ok) throw new Error('Gagal memproses aksi ASN');
  return await res.json();
}

export async function fetchOpds(): Promise<OPDData[]> {
  const res = await fetch(`${API_BASE_URL}/opds`);
  if (!res.ok) throw new Error('Gagal memuat data OPD');
  return await res.json();
}

export async function createOpd(payload: Partial<OPDData>) {
  const res = await fetch(`${API_BASE_URL}/opds`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Gagal menambah OPD baru');
  return await res.json();
}

export async function fetchAnalytics(): Promise<AnalyticsData> {
  const res = await fetch(`${API_BASE_URL}/analytics`);
  if (!res.ok) throw new Error('Gagal memuat data analitik');
  return await res.json();
}

export async function fetchSettings(): Promise<Record<string, string>> {
  const res = await fetch(`${API_BASE_URL}/settings`);
  if (!res.ok) throw new Error('Gagal memuat konfigurasi');
  return await res.json();
}

export async function saveSettings(payload: Record<string, string>) {
  const res = await fetch(`${API_BASE_URL}/settings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Gagal menyimpan konfigurasi');
  return await res.json();
}
