import { ComplaintTicket } from '@laporpak/shared';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

async function request(path: string, init: RequestInit = {}) {
  const token = localStorage.getItem('laporpak_auth_token');
  const res = await fetch(`${API_BASE_URL}${path}`, { ...init, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(init.headers || {}) } });
  if (!res.ok) { const body = await res.json().catch(() => ({})); throw new Error(body.detail || 'Permintaan gagal'); }
  return res.json();
}
export async function loginApi(username: string, password: string) { return request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }); }
export async function registerApi(payload: { name: string; email: string; phone?: string; nik?: string; password: string }) { return request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }); }
export async function meApi() { return request('/auth/me'); }

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

    return await request(`/complaints?${query.toString()}`);
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
  return request('/complaints', { method: 'POST', body: JSON.stringify(payload) });
}

export async function submitHitlAction(
  ticketId: string,
  action: 'APPROVE' | 'OVERRIDE' | 'REJECT' | 'MERGE' | 'UPDATE_STATUS' | 'UPDATE_DRAFT',
  extra?: { target_opd_id?: string; target_opd_name?: string; parent_ticket_id?: string; status?: string; draft_body?: string; reason?: string }
) {
  return request(`/complaints/${ticketId}/action`, { method: 'POST', body: JSON.stringify({ action, ...extra }) });
}

export async function fetchOpds(): Promise<OPDData[]> {
  return request('/opds');
}

export async function createOpd(payload: Partial<OPDData>) {
  return request('/opds', { method: 'POST', body: JSON.stringify(payload) });
}
export async function updateOpd(id: string, payload: Partial<OPDData>) { return request(`/opds/${id}`, { method: 'PUT', body: JSON.stringify(payload) }); }
export async function deleteOpd(id: string) { return request(`/opds/${id}`, { method: 'DELETE' }); }

export async function fetchAnalytics(): Promise<AnalyticsData> {
  return request('/analytics');
}

export async function fetchSettings(): Promise<Record<string, string>> {
  return request('/settings');
}

export async function saveSettings(payload: Record<string, string>) {
  return request('/settings', { method: 'POST', body: JSON.stringify(payload) });
}
