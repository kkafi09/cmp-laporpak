import datetime
from sqlalchemy.orm import Session
from app.db.database import Base, engine, SessionLocal
from app.db.models import Complaint, OPD, SystemSetting

INITIAL_OPDS = [
    {
        "id": "OPD-DISHUB",
        "name": "Dinas Perhubungan",
        "code": "DISHUB",
        "jurisdiction": "KOTA_KABUPATEN",
        "scope": ["Lampu Lalu Lintas / APILL", "Rambu Jalan", "Marka Jalan", "Angkutan Kota", "Terminal", "Kemacetan Lalu Lintas", "Parkir Liar"],
        "sla_standard_hours": 12
    },
    {
        "id": "OPD-PUPR-BINAMARGA",
        "name": "Dinas Pekerjaan Umum & Penataan Ruang (Bina Marga)",
        "code": "PUPR_BINAMARGA",
        "jurisdiction": "KOTA_KABUPATEN",
        "scope": ["Jalan Berlubang / Rusak", "Jembatan Rusak", "Trotoar Amblas", "Drainase / Saluran Air Tersumbat", "Banjir Genangan"],
        "sla_standard_hours": 24
    },
    {
        "id": "OPD-DLH",
        "name": "Dinas Lingkungan Hidup",
        "code": "DLH",
        "jurisdiction": "KOTA_KABUPATEN",
        "scope": ["Tumpukan Sampah Liar", "Pencemaran Limbah", "Pohon Tumbang / Rawan Roboh", "Polusi Bau", "Kebersihan Taman Kota"],
        "sla_standard_hours": 48
    },
    {
        "id": "OPD-DINKES",
        "name": "Dinas Kesehatan",
        "code": "DINKES",
        "jurisdiction": "KOTA_KABUPATEN",
        "scope": ["Pelayanan Puskesmas", "RSUD", "Wabah Penyakit / DBD", "Antrean BPJS Kesehatan", "Kelayakan Obat & Makanan"],
        "sla_standard_hours": 24
    },
    {
        "id": "OPD-DISDUKCAPIL",
        "name": "Dinas Kependudukan & Pencatatan Sipil",
        "code": "DISDUKCAPIL",
        "jurisdiction": "KOTA_KABUPATEN",
        "scope": ["KTP Elektronik", "Kartu Keluarga", "Akta Kelahiran", "Pungli Administrasi Kependudukan", "Antrean Layanan Kependudukan"],
        "sla_standard_hours": 48
    },
    {
        "id": "OPD-SATPOLPP",
        "name": "Satuan Polisi Pamong Praja",
        "code": "SATPOLPP",
        "jurisdiction": "KOTA_KABUPATEN",
        "scope": ["Ketertiban Umum", "Penertiban PKL Ilegal", "Kebisingan Malam Hari", "Pelanggaran Perda", "Pengemis / PMKS"],
        "sla_standard_hours": 12
    },
    {
        "id": "OPD-DISDIK",
        "name": "Dinas Pendidikan",
        "code": "DISDIK",
        "jurisdiction": "KOTA_KABUPATEN",
        "scope": ["Gedung Sekolah Rusak", "Pungutan Liar Sekolah", "Zonasi PPDB", "Kekerasan / Bullying di Sekolah"],
        "sla_standard_hours": 72
    },
    {
        "id": "BBPJN-KEMENPUPR",
        "name": "Balai Besar Pelaksanaan Jalan Nasional (Kementerian PUPR)",
        "code": "BBPJN_KEMENPUPR",
        "jurisdiction": "NASIONAL_KEMENTERIAN",
        "scope": ["Jalan Nasional", "Jembatan Nasional / Flyover Antar Kota", "Jalan Tol"],
        "sla_standard_hours": 48
    }
]

def init_db():
    db: Session = SessionLocal()
    try:
        # seed opd if empty
        if db.query(OPD).count() == 0:
            for opd_data in INITIAL_OPDS:
                db.add(OPD(
                    id=opd_data["id"],
                    name=opd_data["name"],
                    code=opd_data["code"],
                    jurisdiction=opd_data["jurisdiction"],
                    scope=opd_data["scope"],
                    sla_standard_hours=opd_data["sla_standard_hours"]
                ))
            db.commit()

        # seed default settings if empty
        if db.query(SystemSetting).count() == 0:
            default_settings = [
                SystemSetting(key="primary_llm_model", value="gemini-1.5-pro", description="Model Reasoning Utama"),
                SystemSetting(key="dedup_similarity_threshold", value="0.65", description="Threshold Cosine Similarity Duplikasi"),
                SystemSetting(key="enable_pii_masking", value="true", description="Wajib Sensor PII UU PDP No. 27/2022"),
                SystemSetting(key="gemini_api_key", value="", description="Google Gemini API Key")
            ]
            db.add_all(default_settings)
            db.commit()

        # seed initial realistic complaints
        if db.query(Complaint).count() == 0:
            initial_complaints = [
                Complaint(
                    id="LPK-20260820-0042",
                    external_ticket_id="LAPOR-2026-08821",
                    channel="SP4N_LAPOR_WEB",
                    reported_at=datetime.datetime.now() - datetime.timedelta(minutes=15),
                    reporter_name="Budi Santoso",
                    reporter_nik="3271012345670001",
                    reporter_phone="081298765432",
                    reporter_email="budi.santoso@email.com",
                    raw_content="Tolong pak lampu lalu lintas di perempatan lampu merah depan SMPN 1 Jl. Pemuda padam dari pagi. Bahaya banget anak-anak sekolah mau menyeberang hampir tertabrak motor yang ngebut. NIK saya 3271012345670001 jika butuh verifikasi. Tolong segera diperbaiki dinas terkait.",
                    masked_content="Tolong pak lampu lalu lintas di perempatan lampu merah depan SMPN 1 Jl. Pemuda padam dari pagi. Bahaya banget anak-anak sekolah mau menyeberang hampir tertabrak motor yang ngebut. NIK saya [TERMASKING: NIK] jika butuh verifikasi. Tolong segera diperbaiki dinas terkait.",
                    is_spam=False,
                    spam_confidence=0.02,
                    pii_detected=["NIK_16_DIGIT"],
                    is_duplicate_suspect=True,
                    similarity_score=0.91,
                    parent_ticket_id="LPK-20260820-0012",
                    cluster_incident_name="APILL Padam Simpang SMPN 1 Jl. Pemuda",
                    category="Transportasi & Lalu Lintas",
                    sub_category="Perlengkapan Jalan & Pengaturan Lalu Lintas (APILL)",
                    urgency_level="HIGH",
                    urgency_reason="Potensi kecelakaan tinggi di zona aman sekolah (SMPN 1) pada jam sibuk akibat lampu pengatur lalu lintas padam.",
                    extracted_entities={"location": "Perempatan Jl. Pemuda depan SMPN 1", "city": "Kota Bogor"},
                    sla_deadline_hours=12,
                    recommended_opd_id="OPD-DISHUB",
                    recommended_opd_name="Dinas Perhubungan",
                    routing_confidence=0.95,
                    routing_reasoning="Kewenangan pemeliharaan sarana APILL dan rekayasa keselamatan lalu lintas jalan kota berada pada Dinas Perhubungan.",
                    response_draft_title="Tanggapan Aduan Fasilitas Lalu Lintas Jl. Pemuda",
                    response_draft_body="Yth. Budi Santoso, terima kasih atas kepedulian Anda terhadap keselamatan publik. Laporan Anda mengenai traffic light padam di depan SMPN 1 Jl. Pemuda telah diverifikasi dan didisposisikan ke Tim Sarana Prasarana Dinas Perhubungan Kota Bogor. Petugas teknis sedang meluncur ke lokasi untuk perbaikan. Mohon pengguna jalan tetap berhati-hati.",
                    response_tone="Empathetic Urgent",
                    status="PENDING_APPROVAL"
                ),
                Complaint(
                    id="LPK-20260820-0041",
                    external_ticket_id="LAPOR-2026-08819",
                    channel="SP4N_LAPOR_MOBILE",
                    reported_at=datetime.datetime.now() - datetime.timedelta(minutes=45),
                    reporter_name="Siti Rahmawati",
                    reporter_nik="3271029876540002",
                    reporter_phone="085712349988",
                    reporter_email="siti.rahma@email.com",
                    raw_content="Jalan amblas dan pipa bocor air menggenangi separuh Jl. Pajajaran samping Rumah Sakit PMI. Pengendara motor banyak yang tergelincir jatuh tadi subuh. Hubungi saya di 085712349988 untuk detail titiknya.",
                    masked_content="Jalan amblas dan pipa bocor air menggenangi separuh Jl. Pajajaran samping Rumah Sakit PMI. Pengendara motor banyak yang tergelincir jatuh tadi subuh. Hubungi saya di [TERMASKING: NO_TELP] untuk detail titiknya.",
                    is_spam=False,
                    spam_confidence=0.01,
                    pii_detected=["PHONE_NUMBER"],
                    is_duplicate_suspect=False,
                    similarity_score=0.42,
                    category="Infrastruktur Pekerjaan Umum",
                    sub_category="Pemeliharaan Jalan & Jembatan",
                    urgency_level="CRITICAL",
                    urgency_reason="Kondisi jalan amblas dan air menggenang telah menimbulkan korban pengendara roda dua tergelincir di jalur akses ambulans RS.",
                    extracted_entities={"location": "Jl. Pajajaran samping RS PMI", "city": "Kota Bogor"},
                    sla_deadline_hours=2,
                    recommended_opd_id="OPD-PUPR-BINAMARGA",
                    recommended_opd_name="Dinas Pekerjaan Umum & Penataan Ruang (Bina Marga)",
                    routing_confidence=0.94,
                    routing_reasoning="Penanganan darurat jalan amblas dan koordinasi perbaikan utilitas jalan merupakan tanggung jawab dinas teknis PUPR.",
                    response_draft_title="Penanganan Tanggap Darurat Jalan Amblas Jl. Pajajaran",
                    response_draft_body="Yth. Siti Rahmawati, laporan darurat mengenai jalan amblas dan genangan air di samping RS PMI telah kami tindak lanjuti sebagai prioritas TINGKAT KRITIS. Tim Reaksi Cepat Dinas PUPR bersama Dinas Perhubungan telah dikerahkan ke lokasi untuk memasang rambu pengaman dan memulai penanganan teknis darurat.",
                    response_tone="Empathetic Urgent",
                    status="PENDING_APPROVAL"
                ),
                Complaint(
                    id="LPK-20260820-0040",
                    external_ticket_id="LAPOR-2026-08815",
                    channel="SP4N_LAPOR_SMS",
                    reported_at=datetime.datetime.now() - datetime.timedelta(hours=2),
                    reporter_name="Ahmad Fauzi",
                    reporter_nik="3271034455660003",
                    reporter_phone="081388776655",
                    reporter_email="fauzi@domain.id",
                    raw_content="Sampah menumpuk liar di pinggir kali Ciliwung jembatan merah dekat pasar. Baunya sangat menyengat dan mulai mencemari air sungai. Tolong angkut gerobak sampahnya.",
                    masked_content="Sampah menumpuk liar di pinggir kali Ciliwung jembatan merah dekat pasar. Baunya sangat menyengat dan mulai mencemari air sungai. Tolong angkut gerobak sampahnya.",
                    is_spam=False,
                    spam_confidence=0.03,
                    pii_detected=[],
                    is_duplicate_suspect=False,
                    similarity_score=0.35,
                    category="Lingkungan Hidup & Kebersihan",
                    sub_category="Pengelolaan Persampahan & Ruang Terbuka Hijau",
                    urgency_level="MEDIUM",
                    urgency_reason="Polusi bau dan potensi pencemaran aliran sungai akibat penumpukan sampah liar di sekitar area pasar.",
                    extracted_entities={"location": "Pinggir kali Ciliwung jembatan merah dekat pasar", "city": "Kota Bogor"},
                    sla_deadline_hours=48,
                    recommended_opd_id="OPD-DLH",
                    recommended_opd_name="Dinas Lingkungan Hidup",
                    routing_confidence=0.96,
                    routing_reasoning="Pengangkutan timbulan sampah liar dan pemeliharaan kebersihan lingkungan merupakan tugas pokok DLH.",
                    response_draft_title="Tanggapan Penanganan Sampah Liar Jembatan Merah",
                    response_draft_body="Yth. Bapak Ahmad Fauzi, terima kasih atas laporannya. Pengaduan terkait tumpukan sampah di area Kali Ciliwung Jembatan Merah telah kami disposisikan ke UPT Pengelolaan Sampah Dinas Lingkungan Hidup untuk jadwal pengangkutan armada truk sampah hari ini.",
                    response_tone="Formal Official",
                    status="PENDING_APPROVAL"
                )
            ]
            db.add_all(initial_complaints)
            db.commit()
    finally:
        db.close()
