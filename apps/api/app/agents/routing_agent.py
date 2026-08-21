from typing import Dict, Any, List

class SmartRoutingAgent:
    """
    Explainable AI (XAI) Smart Routing Agent.
    Maps extracted categories and problem entities to the responsible Government Agency (OPD)
    with a confidence score and explainable legal/operational reasoning.
    """

    OPD_DATABASE = {
        "Transportasi & Lalu Lintas": {
            "id": "OPD-DISHUB",
            "name": "Dinas Perhubungan",
            "confidence": 0.95,
            "reasoning": "Kewenangan pengelolaan, pemeliharaan rambu, APILL, dan rekayasa keselamatan lalu lintas jalan kota berada di bawah Dinas Perhubungan.",
            "jurisdiction": "KOTA_KABUPATEN"
        },
        "Infrastruktur Pekerjaan Umum": {
            "id": "OPD-PUPR-BINAMARGA",
            "name": "Dinas Pekerjaan Umum & Penataan Ruang (Bina Marga)",
            "confidence": 0.94,
            "reasoning": "Tupoksi perbaikan struktur badan jalan, penambalan lubang, perbaikan jembatan, dan normalisasi saluran air jalan kota diampu oleh Dinas PUPR.",
            "jurisdiction": "KOTA_KABUPATEN"
        },
        "Lingkungan Hidup & Kebersihan": {
            "id": "OPD-DLH",
            "name": "Dinas Lingkungan Hidup",
            "confidence": 0.96,
            "reasoning": "Pengangkutan timbulan sampah, penanganan pohon rawan tumbang, dan pengawasan pencemaran lingkungan berada di bawah wewenang DLH.",
            "jurisdiction": "KOTA_KABUPATEN"
        },
        "Kesehatan Masyarakat": {
            "id": "OPD-DINKES",
            "name": "Dinas Kesehatan",
            "confidence": 0.93,
            "reasoning": "Pengawasan mutu layanan faskes tingkat pertama (Puskesmas), RSUD, serta respon pengendalian wabah penyakit dikoordinasikan oleh Dinkes.",
            "jurisdiction": "KOTA_KABUPATEN"
        },
        "Kependudukan & Pencatatan Sipil": {
            "id": "OPD-DISDUKCAPIL",
            "name": "Dinas Kependudukan & Pencatatan Sipil",
            "confidence": 0.97,
            "reasoning": "Penerbitan dokumen kependudukan (KTP-el, KK, Akta) dan pelayanan administrasi sipil merupakan kewenangan eksklusif Disdukcapil.",
            "jurisdiction": "KOTA_KABUPATEN"
        },
        "Pendidikan": {
            "id": "OPD-DISDIK",
            "name": "Dinas Pendidikan",
            "confidence": 0.92,
            "reasoning": "Pembinaan sekolah dasar dan menengah pertama serta penyelesaian keluhan operasional pendidikan diatur oleh Disdik.",
            "jurisdiction": "KOTA_KABUPATEN"
        },
        "Ketertiban & Keamanan Umum": {
            "id": "OPD-SATPOLPP",
            "name": "Satuan Polisi Pamong Praja",
            "confidence": 0.91,
            "reasoning": "Penegakan Perda, penertiban gangguan ketertiban umum dan kenyamanan masyarakat diemban oleh Satpol PP.",
            "jurisdiction": "KOTA_KABUPATEN"
        }
    }

    def route(self, category: str, raw_text: str) -> Dict[str, Any]:
        match = self.OPD_DATABASE.get(category)
        if match:
            return {
                "recommended_department": {
                    "department_id": match["id"],
                    "department_name": match["name"],
                    "confidence_score": match["confidence"],
                    "reasoning": match["reasoning"],
                    "jurisdiction_level": match["jurisdiction"]
                },
                "alternative_departments": [
                    {
                        "department_id": "OPD-KOMINFO",
                        "department_name": "Dinas Komunikasi & Informatika",
                        "confidence_score": 0.35,
                        "reasoning": "Koordinasi integrasi data aduan kanal digital.",
                        "jurisdiction_level": "KOTA_KABUPATEN"
                    }
                ]
            }

        return {
            "recommended_department": {
                "department_id": "OPD-BAG-UMUM",
                "department_name": "Bagian Pelayanan Publik & Tata Pemerintahan",
                "confidence_score": 0.70,
                "reasoning": "Aduan bersifat umum dan memerlukan klarifikasi awal oleh Bagian Umum/Inspektorat.",
                "jurisdiction_level": "KOTA_KABUPATEN"
            },
            "alternative_departments": []
        }
