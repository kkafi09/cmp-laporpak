import datetime
import uuid
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import Complaint, OPD, SystemSetting, User, AuditLog
from app.auth import create_token, get_current_user, hash_password, verify_password, require_admin
from app.agents.pii_shield import PIIShieldAgent
from app.agents.spam_filter import SpamFilterAgent
from app.agents.deduplication import SemanticDeduplicationAgent
from app.agents.triage_agent import TriageAgent
from app.agents.routing_agent import SmartRoutingAgent
from app.agents.response_agent import ResponseCopilotAgent

router = APIRouter()

@router.post("/auth/login")
def login(payload: Dict[str, Any], db: Session = Depends(get_db)):
    username = str(payload.get("username", "")).strip()
    user = db.query(User).filter(
        (User.username == username) | (User.email == username.lower()),
        User.is_active == True,
    ).first()
    if not user or not verify_password(str(payload.get("password", "")), user.password_hash):
        raise HTTPException(status_code=401, detail="Username atau password salah")
    return {"token": create_token(user), "user": user_public(user)}

@router.post("/auth/register")
def register(payload: Dict[str, Any], db: Session = Depends(get_db)):
    username = str(payload.get("username") or payload.get("email", "")).strip().lower()
    password = str(payload.get("password", ""))
    if not username or len(password) < 8 or not payload.get("name") or not payload.get("email"):
        raise HTTPException(status_code=400, detail="Nama, email/username, dan password minimal 8 karakter wajib diisi")
    if db.query(User).filter(User.username == username).first():
        raise HTTPException(status_code=409, detail="Username sudah digunakan")
    user = User(id=f"usr-{uuid.uuid4().hex}", username=username, name=str(payload["name"]).strip(), email=str(payload["email"]).strip().lower(), password_hash=hash_password(password), role="CITIZEN")
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"token": create_token(user), "user": user_public(user)}

@router.get("/auth/me")
def me(user: User = Depends(get_current_user)):
    return user_public(user)

def hmac_compare(left: str, right: str) -> bool:
    import hmac
    return hmac.compare_digest(left, right)

def user_public(user: User):
    return {"id": user.id, "username": user.username, "name": user.name, "email": user.email, "role": user.role, "nip": user.nip, "agency": user.agency}

def audit(db, user, action, entity_type, entity_id, before=None, after=None, reason=None):
    db.add(AuditLog(actor_user_id=user.id if user else None, actor_name=user.name if user else "System", action=action, entity_type=entity_type, entity_id=entity_id, before_value=before, after_value=after, reason=reason))

pii_agent = PIIShieldAgent()
spam_agent = SpamFilterAgent()
dedup_agent = SemanticDeduplicationAgent()
triage_agent = TriageAgent()
routing_agent = SmartRoutingAgent()
response_agent = ResponseCopilotAgent()

# ----------------- COMPLAINTS ENDPOINTS ----------------- #

@router.get("/complaints")
def list_complaints(
    status: Optional[str] = None,
    urgency: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Complaint)
    
    if status and status != "ALL":
        query = query.filter(Complaint.status == status)
    if urgency and urgency != "ALL":
        query = query.filter(Complaint.urgency_level == urgency)
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            (Complaint.masked_content.ilike(search_fmt)) |
            (Complaint.id.ilike(search_fmt)) |
            (Complaint.category.ilike(search_fmt)) |
            (Complaint.raw_content.ilike(search_fmt))
        )
        
    complaints = query.order_by(Complaint.reported_at.desc()).all()
    
    result = []
    for c in complaints:
        result.append({
            "id": c.id,
            "externalTicketId": c.external_ticket_id or f"LAPOR-{c.id}",
            "channel": c.channel,
            "reportedAt": c.reported_at.strftime("%Y-%m-%d %H:%M:%S") if c.reported_at else "",
            "reporter": {
                "name": c.reporter_name,
                "nik": c.reporter_nik or "",
                "phone": c.reporter_phone or "",
                "email": c.reporter_email or ""
            },
            "rawContent": c.raw_content,
            "security": {
                "isSpam": c.is_spam,
                "spamConfidence": c.spam_confidence,
                "spamReason": c.spam_reason,
                "piiDetected": c.pii_detected or [],
                "maskedContent": c.masked_content,
                "originalEncryptedPreview": None
            },
            "deduplication": {
                "isDuplicateSuspect": c.is_duplicate_suspect,
                "similarityScore": c.similarity_score,
                "parentTicketId": c.parent_ticket_id,
                "clusterIncidentName": c.cluster_incident_name
            },
            "triage": {
                "category": c.category,
                "subCategory": c.sub_category,
                "urgencyLevel": c.urgency_level,
                "urgencyReason": c.urgency_reason or "",
                "extractedEntities": c.extracted_entities or {},
                "slaDeadlineHours": c.sla_deadline_hours
            },
            "routing": {
                "recommendedDepartment": {
                    "departmentId": c.recommended_opd_id,
                    "departmentName": c.recommended_opd_name,
                    "confidenceScore": c.routing_confidence,
                    "reasoning": c.routing_reasoning or "",
                    "jurisdictionLevel": "KOTA_KABUPATEN"
                },
                    "alternativeDepartments": c.alternative_opds or []
            },
            "responseCopilot": {
                "draftTitle": c.response_draft_title or "",
                "draftBody": c.response_draft_body or "",
                "tone": c.response_tone or "Formal Official"
            },
            "sla": {
                "slaHours": c.sla_deadline_hours,
                "reportedAt": c.reported_at.strftime("%Y-%m-%d %H:%M:%S") if c.reported_at else "",
                "deadlineAt": (c.reported_at + datetime.timedelta(hours=c.sla_deadline_hours or 48)).strftime("%Y-%m-%d %H:%M:%S") if c.reported_at else "",
                "remainingMinutes": max(0, int(((c.reported_at + datetime.timedelta(hours=c.sla_deadline_hours or 48)) - datetime.datetime.utcnow()).total_seconds() / 60)) if c.reported_at else 0,
                "status": sla_status(c)
            },
            "status": c.status,
            "assignedOpdId": c.assigned_opd_id,
            "assignedOpdName": c.assigned_opd_name,
            "approvedByAsn": {
                "asnName": c.approved_by_asn_name or "",
                "asnNip": c.approved_by_asn_nip or "",
                "approvedAt": c.approved_at.strftime("%Y-%m-%d %H:%M:%S") if c.approved_at else "",
                "overrideOccurred": c.override_occurred
            } if c.approved_by_asn_name else None
        })
    return result

def sla_status(c):
    if not c.reported_at: return "NORMAL"
    ratio = (datetime.datetime.utcnow() - c.reported_at).total_seconds() / (3600 * (c.sla_deadline_hours or 48))
    return "BREACHED" if ratio >= 1 else "WARNING" if ratio >= .75 else "NORMAL"

@router.post("/complaints")
def create_complaint(payload: Dict[str, Any], db: Session = Depends(get_db)):
    raw_content = payload.get("raw_content", "").strip()
    if not raw_content:
        raise HTTPException(status_code=400, detail="Konten aduan tidak boleh kosong.")
        
    reporter_name = payload.get("reporter_name", "Warga Masyarakat")
    reporter_nik = payload.get("reporter_nik", "")
    reporter_phone = payload.get("reporter_phone", "")
    reporter_email = payload.get("reporter_email", "")
    channel = payload.get("channel", "SP4N_LAPOR_PORTAL")

    # Step 1: Security & PII Masking (UU PDP No. 27/2022)
    masked_text, pii_detected = pii_agent.mask_text(raw_content)

    # Step 2: Spam & Bot Classifier
    is_spam, spam_conf, spam_reason = spam_agent.classify(raw_content)

    # Step 3: Semantic Deduplication Engine
    existing = db.query(Complaint).filter(Complaint.is_spam == False).all()
    existing_dicts = [{"id": e.id, "masked_content": e.masked_content, "category": e.category, "cluster_incident_name": e.cluster_incident_name} for e in existing]
    is_dup, sim_score, parent_id, cluster_name = dedup_agent.find_duplicate(masked_text, existing_dicts)

    # Step 4: AI Triage & Risk Assessment
    triage_res = triage_agent.analyze(masked_text)

    # Step 5: Explainable Smart Routing (XAI) against live DB OPDs
    routing_res = routing_agent.route(triage_res["category"], masked_text, db)
    recommended_opd = routing_res["recommended_department"]

    # Step 6: Response Copilot
    response_draft = response_agent.generate_draft(
        reporter_name=reporter_name,
        category=triage_res["category"],
        urgency=triage_res["urgency_level"],
        opd_name=recommended_opd["department_name"] if recommended_opd else "Tim routing manual",
        masked_text=masked_text
    )

    # Generate Ticket ID
    today_str = datetime.datetime.now().strftime("%Y%m%d")
    ticket_id = f"LPK-{today_str}-{uuid.uuid4().hex[:8].upper()}"

    new_complaint = Complaint(
        id=ticket_id,
        external_ticket_id=payload.get("external_ticket_id") or f"LAPOR-{today_str}-{uuid.uuid4().hex[:8].upper()}",
        channel=channel,
        reported_at=datetime.datetime.utcnow(),
        reporter_name=reporter_name,
        reporter_nik=reporter_nik,
        reporter_phone=reporter_phone,
        reporter_email=reporter_email,
        raw_content=raw_content,
        masked_content=masked_text,
        is_spam=is_spam,
        spam_confidence=spam_conf,
        spam_reason=spam_reason,
        pii_detected=pii_detected,
        is_duplicate_suspect=is_dup,
        similarity_score=sim_score,
        parent_ticket_id=parent_id,
        cluster_incident_name=cluster_name,
        category=triage_res["category"],
        sub_category=triage_res["sub_category"],
        urgency_level=triage_res["urgency_level"],
        urgency_reason=triage_res["urgency_reason"],
        extracted_entities=triage_res["extracted_entities"],
        sla_deadline_hours=triage_res["sla_deadline_hours"],
        recommended_opd_id=recommended_opd["department_id"] if recommended_opd else None,
        recommended_opd_name=recommended_opd["department_name"] if recommended_opd else None,
        routing_confidence=recommended_opd["confidence_score"] if recommended_opd else 0,
        routing_reasoning=recommended_opd["reasoning"] if recommended_opd else "Tidak ada rule aktif yang cocok; menunggu routing manual.",
        response_draft_title=response_draft["draft_title"],
        response_draft_body=response_draft["draft_body"],
        response_tone=response_draft["tone"],
        status="SPAM_REJECTED" if is_spam else ("PENDING_APPROVAL" if recommended_opd else "PENDING_MANUAL_ROUTING")
    )

    db.add(new_complaint)
    db.commit()
    db.refresh(new_complaint)

    return {
        "status": "success",
        "ticket_id": ticket_id,
        "complaint": {
            "id": new_complaint.id,
            "category": new_complaint.category,
            "urgency": new_complaint.urgency_level,
            "recommended_opd": new_complaint.recommended_opd_name,
            "confidence": new_complaint.routing_confidence,
            "pii_masked": new_complaint.masked_content,
            "status": new_complaint.status
        }
    }

@router.post("/complaints/{ticket_id}/assign")
def assign_complaint(ticket_id: str, payload: Dict[str, Any], db: Session = Depends(get_db), user: User = Depends(require_admin)):
    complaint = db.query(Complaint).filter(Complaint.id == ticket_id).first()
    opd = db.query(OPD).filter(OPD.id == payload.get("opd_id"), OPD.is_active == True).first()
    if not complaint: raise HTTPException(status_code=404, detail="Tiket tidak ditemukan")
    if not opd: raise HTTPException(status_code=400, detail="OPD aktif tidak ditemukan")
    if complaint.status != "PENDING_MANUAL_ROUTING": raise HTTPException(status_code=409, detail="Tiket tidak menunggu routing manual")
    before = {"status": complaint.status, "assignedOpdId": complaint.assigned_opd_id}
    complaint.recommended_opd_id = opd.id
    complaint.recommended_opd_name = opd.name
    complaint.assigned_opd_id = opd.id
    complaint.assigned_opd_name = opd.name
    complaint.status = "PENDING_APPROVAL"
    audit(db, user, "ASSIGN", "COMPLAINT", ticket_id, before, {"status": complaint.status, "assignedOpdId": opd.id}, payload.get("reason"))
    db.commit()
    return {"status": "success", "ticket_id": ticket_id, "new_status": complaint.status, "assigned_opd": opd.name}

@router.post("/complaints/{ticket_id}/action")
def perform_action(ticket_id: str, payload: Dict[str, Any], db: Session = Depends(get_db), user: User = Depends(require_admin)):
    complaint = db.query(Complaint).filter(Complaint.id == ticket_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Tiket tidak ditemukan.")

    action = payload.get("action") # APPROVE, OVERRIDE, REJECT, MERGE
    if action not in {"APPROVE", "OVERRIDE", "REJECT", "MERGE", "UPDATE_STATUS", "UPDATE_DRAFT"}:
        raise HTTPException(status_code=400, detail="Aksi tidak dikenal")
    before = {"status": complaint.status, "assignedOpdId": complaint.assigned_opd_id, "draftBody": complaint.response_draft_body}
    asn_name, asn_nip = user.name, user.nip or ""
    
    if action == "APPROVE":
        if complaint.status != "PENDING_APPROVAL": raise HTTPException(status_code=409, detail="Tiket tidak sedang menunggu approval")
        complaint.status = "DISPATCHED"
        complaint.assigned_opd_id = complaint.recommended_opd_id
        complaint.assigned_opd_name = complaint.recommended_opd_name
        complaint.approved_by_asn_name = asn_name
        complaint.approved_by_asn_nip = asn_nip
        complaint.approved_at = datetime.datetime.utcnow()
    elif action == "OVERRIDE":
        override_opd_id = payload.get("target_opd_id")
        opd = db.query(OPD).filter(OPD.id == override_opd_id, OPD.is_active == True).first()
        if not opd: raise HTTPException(status_code=400, detail="OPD tujuan tidak valid")
        override_opd_name = opd.name
        complaint.status = "DISPATCHED"
        complaint.assigned_opd_id = override_opd_id
        complaint.assigned_opd_name = override_opd_name
        complaint.approved_by_asn_name = asn_name
        complaint.approved_by_asn_nip = asn_nip
        complaint.approved_at = datetime.datetime.utcnow()
        complaint.override_occurred = True
    elif action == "REJECT":
        if complaint.status != "PENDING_APPROVAL": raise HTTPException(status_code=409, detail="Tiket tidak sedang menunggu approval")
        complaint.status = "SPAM_REJECTED"
    elif action == "MERGE":
        parent_id = payload.get("parent_ticket_id")
        if not db.query(Complaint).filter(Complaint.id == parent_id).first(): raise HTTPException(status_code=400, detail="Tiket induk tidak ditemukan")
        complaint.parent_ticket_id = parent_id
        complaint.status = "DUPLICATE_MERGED"
    elif action == "UPDATE_STATUS":
        next_status = payload.get("status")
        allowed = {"DISPATCHED": {"IN_PROGRESS", "RESOLVED"}, "IN_PROGRESS": {"RESOLVED"}, "RESOLVED": set()}
        if next_status not in allowed.get(complaint.status, set()): raise HTTPException(status_code=409, detail="Transisi status tidak valid")
        complaint.status = next_status
    elif action == "UPDATE_DRAFT":
        if complaint.status != "PENDING_APPROVAL": raise HTTPException(status_code=409, detail="Draft hanya dapat diubah sebelum approval")
        complaint.response_draft_body = str(payload.get("draft_body", "")).strip()
        if not complaint.response_draft_body: raise HTTPException(status_code=400, detail="Draft tidak boleh kosong")

    db.commit()
    db.refresh(complaint)

    audit(db, user, action, "COMPLAINT", ticket_id, before, {"status": complaint.status, "assignedOpdId": complaint.assigned_opd_id, "draftBody": complaint.response_draft_body}, payload.get("reason"))
    db.commit()
    return {
        "status": "success",
        "ticket_id": ticket_id,
        "new_status": complaint.status,
        "assigned_opd": complaint.assigned_opd_name
    }

# ----------------- OPD MANAGEMENT ENDPOINTS ----------------- #

@router.get("/opds")
def list_opds(db: Session = Depends(get_db)):
    opds = db.query(OPD).filter(OPD.is_active == True).all()
    return [
        {
            "id": o.id,
            "name": o.name,
            "code": o.code,
            "jurisdiction": o.jurisdiction,
            "scope": o.scope or [],
            "sla_standard_hours": o.sla_standard_hours
        }
        for o in opds
    ]

@router.post("/opds")
def create_opd(payload: Dict[str, Any], db: Session = Depends(get_db), user: User = Depends(require_admin)):
    opd_id = payload.get("id") or f"OPD-{payload.get('code', 'CUSTOM').upper()}"
    if not payload.get("name") or not payload.get("code"): raise HTTPException(status_code=400, detail="Nama dan kode OPD wajib diisi")
    if db.query(OPD).filter(OPD.id == opd_id).first(): raise HTTPException(status_code=409, detail="Kode OPD sudah digunakan")
    new_opd = OPD(
        id=opd_id,
        name=payload.get("name"),
        code=payload.get("code"),
        jurisdiction=payload.get("jurisdiction", "KOTA_KABUPATEN"),
        scope=payload.get("scope", []),
        sla_standard_hours=payload.get("sla_standard_hours", 48)
    )
    db.add(new_opd)
    db.commit()
    db.refresh(new_opd)
    return {"status": "success", "opd": {"id": new_opd.id, "name": new_opd.name}}

@router.put("/opds/{opd_id}")
def update_opd(opd_id: str, payload: Dict[str, Any], db: Session = Depends(get_db), user: User = Depends(require_admin)):
    opd = db.query(OPD).filter(OPD.id == opd_id).first()
    if not opd:
        raise HTTPException(status_code=404, detail="OPD tidak ditemukan")
    if "name" in payload:
        opd.name = payload["name"]
    if "code" in payload:
        opd.code = payload["code"]
    if "scope" in payload:
        opd.scope = payload["scope"]
    if "sla_standard_hours" in payload:
        opd.sla_standard_hours = payload["sla_standard_hours"]
    db.commit()
    return {"status": "success", "message": "OPD berhasil diperbarui"}

@router.delete("/opds/{opd_id}")
def delete_opd(opd_id: str, db: Session = Depends(get_db), user: User = Depends(require_admin)):
    opd = db.query(OPD).filter(OPD.id == opd_id, OPD.is_active == True).first()
    if not opd: raise HTTPException(status_code=404, detail="OPD tidak ditemukan")
    opd.is_active = False
    audit(db, user, "DELETE", "OPD", opd_id, {"is_active": True}, {"is_active": False})
    db.commit()
    return {"status": "success", "message": "OPD dinonaktifkan"}

# ----------------- ANALYTICS & STATS ENDPOINTS ----------------- #

@router.get("/analytics")
def get_full_analytics(db: Session = Depends(get_db), user: User = Depends(require_admin)):
    total = db.query(Complaint).count()
    dispatched = db.query(Complaint).filter(Complaint.status == "DISPATCHED").count()
    pending = db.query(Complaint).filter(Complaint.status == "PENDING_APPROVAL").count()
    spam = db.query(Complaint).filter(Complaint.status == "SPAM_REJECTED").count()
    duplicates = db.query(Complaint).filter(Complaint.is_duplicate_suspect == True).count()
    overridden = db.query(Complaint).filter(Complaint.override_occurred == True).count()
    edited_drafts = db.query(AuditLog).filter(AuditLog.action == "UPDATE_DRAFT").count()
    
    # Calculate real accuracy and HITL direct approval rates
    direct_approved = dispatched - overridden
    direct_rate = round((direct_approved / dispatched * 100), 1) if dispatched > 0 else 0
    override_rate = round((overridden / dispatched * 100), 1) if dispatched > 0 else 0

    # OPD performance breakdown
    opds = db.query(OPD).all()
    opd_stats = []
    for o in opds:
        opd_tickets = db.query(Complaint).filter(Complaint.assigned_opd_id == o.id).count()
        opd_stats.append({
            "name": o.name,
            "code": o.code,
            "tickets_count": opd_tickets,
            "compliance_rate": round((opd_tickets / max(dispatched, 1)) * 100, 1)
        })

    return {
        "summary": {
            "total_complaints": total,
            "dispatched_count": dispatched,
            "pending_count": pending,
            "spam_rejected_count": spam,
            "duplicate_clusters": duplicates,
            "average_triage_seconds": 0,
            "pii_protected_count": total,
            "ai_accuracy_percent": round(sum(1 for c in db.query(Complaint).all() if c.routing_confidence >= .85) / total * 100, 1) if total else 0
        },
        "hitl_approval_breakdown": {
            "direct_approved_percent": direct_rate,
            "adjusted_draft_percent": round((edited_drafts / max(dispatched, 1)) * 100, 1),
            "overridden_percent": override_rate
        },
        "opd_performance": opd_stats
    }

@router.get("/settings")
def get_settings(db: Session = Depends(get_db), user: User = Depends(require_admin)):
    settings = db.query(SystemSetting).all()
    return {s.key: ("********" if s.key.endswith("api_key") and s.value else s.value) for s in settings}

@router.post("/settings")
def save_settings(payload: Dict[str, str], db: Session = Depends(get_db), user: User = Depends(require_admin)):
    for key, value in payload.items():
        if key.endswith("api_key") and (not value or str(value).startswith("*")):
            continue
        setting = db.query(SystemSetting).filter(SystemSetting.key == key).first()
        if setting:
            setting.value = str(value)
        else:
            db.add(SystemSetting(key=key, value=str(value)))
    db.commit()
    return {"status": "success", "message": "Pengaturan sistem berhasil disimpan"}
