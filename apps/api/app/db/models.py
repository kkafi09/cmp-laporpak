import datetime
from sqlalchemy import Column, String, Text, Boolean, Float, Integer, DateTime, JSON
from app.db.database import Base

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(String, primary_key=True, index=True) # e.g. LPK-20260820-0042
    external_ticket_id = Column(String, index=True, nullable=True) # e.g. LAPOR-2026-08821
    channel = Column(String, default="SP4N_LAPOR_WEB") # SP4N_LAPOR_WEB, SP4N_LAPOR_MOBILE, SMS
    reported_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Reporter Info (Raw / Encrypted storage)
    reporter_name = Column(String, nullable=False)
    reporter_nik = Column(String, nullable=True)
    reporter_phone = Column(String, nullable=True)
    reporter_email = Column(String, nullable=True)
    
    # Content
    raw_content = Column(Text, nullable=False)
    masked_content = Column(Text, nullable=False)
    
    # Security Status (UU PDP & Spam)
    is_spam = Column(Boolean, default=False)
    spam_confidence = Column(Float, default=0.0)
    spam_reason = Column(String, nullable=True)
    pii_detected = Column(JSON, default=list) # e.g. ["NIK_16_DIGIT", "PHONE_NUMBER"]
    
    # Deduplication
    is_duplicate_suspect = Column(Boolean, default=False)
    similarity_score = Column(Float, default=0.0)
    parent_ticket_id = Column(String, nullable=True)
    cluster_incident_name = Column(String, nullable=True)
    
    # AI Triage & Urgency
    category = Column(String, nullable=False)
    sub_category = Column(String, nullable=True)
    urgency_level = Column(String, default="MEDIUM") # CRITICAL, HIGH, MEDIUM, LOW
    urgency_reason = Column(Text, nullable=True)
    extracted_entities = Column(JSON, default=dict) # location, landmark, city, issueType
    sla_deadline_hours = Column(Integer, default=48)
    
    # Smart Routing (XAI)
    recommended_opd_id = Column(String, nullable=True)
    recommended_opd_name = Column(String, nullable=True)
    routing_confidence = Column(Float, default=0.0)
    routing_reasoning = Column(Text, nullable=True)
    alternative_opds = Column(JSON, default=list)
    
    # Response Copilot
    response_draft_title = Column(String, nullable=True)
    response_draft_body = Column(Text, nullable=True)
    response_tone = Column(String, default="Formal Official")
    
    # Status & HITL Decision
    status = Column(String, default="PENDING_APPROVAL") # PENDING_APPROVAL, DISPATCHED, IN_PROGRESS, RESOLVED, SPAM_REJECTED, DUPLICATE_MERGED
    assigned_opd_id = Column(String, nullable=True)
    assigned_opd_name = Column(String, nullable=True)
    approved_by_asn_name = Column(String, nullable=True)
    approved_by_asn_nip = Column(String, nullable=True)
    approved_at = Column(DateTime, nullable=True)
    override_occurred = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class OPD(Base):
    __tablename__ = "opds"

    id = Column(String, primary_key=True, index=True) # e.g. OPD-DISHUB
    name = Column(String, nullable=False)
    code = Column(String, nullable=False)
    jurisdiction = Column(String, default="KOTA_KABUPATEN")
    scope = Column(JSON, default=list) # Array of handled issue scopes
    sla_standard_hours = Column(Integer, default=48)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class SystemSetting(Base):
    __tablename__ = "system_settings"

    key = Column(String, primary_key=True, index=True)
    value = Column(String, nullable=False)
    description = Column(String, nullable=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
