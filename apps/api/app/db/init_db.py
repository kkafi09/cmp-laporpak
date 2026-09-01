from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.db.models import OPD, SystemSetting

# Official catalog bootstrap. Complaint and user data are never seeded automatically.
INITIAL_OPDS = [
    {"id":"OPD-DISHUB","name":"Dinas Perhubungan","code":"DISHUB","jurisdiction":"KOTA_KABUPATEN","scope":["Lampu Lalu Lintas / APILL","Rambu Jalan","Marka Jalan","Angkutan Kota","Terminal","Kemacetan Lalu Lintas","Parkir Liar"],"sla_standard_hours":12},
    {"id":"OPD-PUPR-BINAMARGA","name":"Dinas Pekerjaan Umum & Penataan Ruang (Bina Marga)","code":"PUPR_BINAMARGA","jurisdiction":"KOTA_KABUPATEN","scope":["Jalan Berlubang / Rusak","Jembatan Rusak","Trotoar Amblas","Drainase / Saluran Air Tersumbat","Banjir Genangan"],"sla_standard_hours":24},
    {"id":"OPD-DLH","name":"Dinas Lingkungan Hidup","code":"DLH","jurisdiction":"KOTA_KABUPATEN","scope":["Tumpukan Sampah Liar","Pencemaran Limbah","Pohon Tumbang / Rawan Roboh","Polusi Bau","Kebersihan Taman Kota"],"sla_standard_hours":48},
    {"id":"OPD-DINKES","name":"Dinas Kesehatan","code":"DINKES","jurisdiction":"KOTA_KABUPATEN","scope":["Pelayanan Puskesmas","RSUD","Wabah Penyakit / DBD","Antrean BPJS Kesehatan","Kelayakan Obat & Makanan"],"sla_standard_hours":24},
    {"id":"OPD-DISDUKCAPIL","name":"Dinas Kependudukan & Pencatatan Sipil","code":"DISDUKCAPIL","jurisdiction":"KOTA_KABUPATEN","scope":["KTP Elektronik","Kartu Keluarga","Akta Kelahiran","Pungli Administrasi Kependudukan","Antrean Layanan Kependudukan"],"sla_standard_hours":48},
    {"id":"OPD-SATPOLPP","name":"Satuan Polisi Pamong Praja","code":"SATPOLPP","jurisdiction":"KOTA_KABUPATEN","scope":["Ketertiban Umum","Penertiban PKL Ilegal","Kebisingan Malam Hari","Pelanggaran Perda","Pengemis / PMKS"],"sla_standard_hours":12},
    {"id":"OPD-DISDIK","name":"Dinas Pendidikan","code":"DISDIK","jurisdiction":"KOTA_KABUPATEN","scope":["Gedung Sekolah Rusak","Pungutan Liar Sekolah","Zonasi PPDB","Kekerasan / Bullying di Sekolah"],"sla_standard_hours":72},
    {"id":"BBPJN-KEMENPUPR","name":"Balai Besar Pelaksanaan Jalan Nasional (Kementerian PUPR)","code":"BBPJN_KEMENPUPR","jurisdiction":"NASIONAL_KEMENTERIAN","scope":["Jalan Nasional","Jembatan Nasional / Flyover Antar Kota","Jalan Tol"],"sla_standard_hours":48},
]

def init_db():
    db: Session = SessionLocal()
    try:
        if db.query(OPD).count() == 0:
            db.add_all([OPD(**item) for item in INITIAL_OPDS])
        if db.query(SystemSetting).count() == 0:
            db.add_all([
                SystemSetting(key="primary_llm_model", value=""),
                SystemSetting(key="dedup_similarity_threshold", value="0.65"),
                SystemSetting(key="enable_pii_masking", value="true"),
                SystemSetting(key="ai_provider_enabled", value="false"),
            ])
        db.commit()
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
    print("Database catalog initialized")
