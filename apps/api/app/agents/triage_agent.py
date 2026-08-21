import re
from typing import Dict, Any

class TriageAgent:
    """
    Triage & Risk Assessment Agent.
    Categorizes complaints, extracts location/landmark entities, and calculates Urgency score & SLA.
    """

    CRITICAL_KEYWORDS = ["meninggal", "korban", "nyawa", "amblas", "jembatan putus", "kebakaran", "meledak", "tertusuk", "kritis", "darurat", "tabrakan beruntun"]
    HIGH_KEYWORDS = ["lampu merah padam", "lampu lalu lintas mati", "sekolah", "anak-anak", "bahaya", "pohon tumbang", "tiang roboh", "rawan kecelakaan", "pipa gas", "tangki bocor"]
    MEDIUM_KEYWORDS = ["jalan berlubang", "sampah", "bau", "antrean", "pungli", "trotoar", "selokan", "drainase tersumbat", "ktp", "izin lambat"]

    def analyze(self, text: str) -> Dict[str, Any]:
        text_lower = text.lower()
        
        # 1. Determine Urgency
        if any(kw in text_lower for kw in self.CRITICAL_KEYWORDS):
            urgency = "CRITICAL"
            reason = "Terdeteksi potensi bahaya fatal terhadap keselamatan jiwa masyarakat atau kegagalan struktur darurat."
            sla_hours = 2
        elif any(kw in text_lower for kw in self.HIGH_KEYWORDS):
            urgency = "HIGH"
            reason = "Gangguan fasilitas publik di zona lalu lintas padat atau area pendidikan/publik yang berpotensi memicu kecelakaan."
            sla_hours = 12
        elif any(kw in text_lower for kw in self.MEDIUM_KEYWORDS):
            urgency = "MEDIUM"
            reason = "Kendala layanan atau kerusakan infrastruktur publik non-darurat yang mengganggu kenyamanan warga."
            sla_hours = 48
        else:
            urgency = "LOW"
            reason = "Informasi, permohonan penjelasan, atau saran perbaikan non-mendesak."
            sla_hours = 120

        # 2. Extract Category
        if any(kw in text_lower for kw in ["lampu lalu lintas", "traffic light", "apill", "rambu", "kemacetan", "angkot", "parkir"]):
            category = "Transportasi & Lalu Lintas"
            sub_category = "Perlengkapan Jalan & Pengaturan Lalu Lintas (APILL)"
        elif any(kw in text_lower for kw in ["jalan", "lubang", "aspal", "jembatan", "trotoar", "pipa", "drainase", "gorong-gorong"]):
            category = "Infrastruktur Pekerjaan Umum"
            sub_category = "Pemeliharaan Jalan & Jembatan"
        elif any(kw in text_lower for kw in ["sampah", "limbah", "bau", "sungai", "taman", "pohon"]):
            category = "Lingkungan Hidup & Kebersihan"
            sub_category = "Pengelolaan Persampahan & Ruang Terbuka Hijau"
        elif any(kw in text_lower for kw in ["puskesmas", "rumah sakit", "rsud", "obat", "bpjs", "dokter", "dbd"]):
            category = "Kesehatan Masyarakat"
            sub_category = "Fasilitas Pelayanan Kesehatan"
        elif any(kw in text_lower for kw in ["ktp", "kartu keluarga", "akta", "dukcapil", "pencatatan sipil"]):
            category = "Kependudukan & Pencatatan Sipil"
            sub_category = "Administrasi Kependudukan"
        elif any(kw in text_lower for kw in ["sekolah", "guru", "gedung sd", "smp", "sma", "ppdb", "pungutan sekolah"]):
            category = "Pendidikan"
            sub_category = "Sarana & Prasarana Sekolah"
        elif any(kw in text_lower for kw in ["pkl", "pengemis", "kebisingan", "razia", "miras", "tertib"]):
            category = "Ketertiban & Keamanan Umum"
            sub_category = "Penegakan Peraturan Daerah"
        else:
            category = "Pelayanan Publik Umum"
            sub_category = "Layanan Pengaduan Umum"

        # 3. Extract Location entities (heuristic)
        location_match = re.search(r'(?:jl\.|jalan|depan|samping|dekat|kawasan|simpang|perempatan|kelurahan|kecamatan)\s+([A-Za-z0-9\s]+?)(?:[,.]|\s+(?:dari|segera|tolong|karena|yg|yang|dan))', text, re.IGNORECASE)
        extracted_location = location_match.group(0).strip() if location_match else "Lokasi disebutkan dalam narasi laporan"

        return {
            "category": category,
            "sub_category": sub_category,
            "urgency_level": urgency,
            "urgency_reason": reason,
            "sla_deadline_hours": sla_hours,
            "extracted_entities": {
                "location": extracted_location,
                "city": "Wilayah Kerja Pemerintah Daerah Terkait"
            }
        }
