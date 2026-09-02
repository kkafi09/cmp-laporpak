<p align="center">
  <img src="apps/web/src/assets/LaporPak%20Main%20Logo.svg" alt="LaporPak! Logo" width="380" />
</p>

<h1 align="center">LaporPak!</h1>

<p align="center">
  <strong>Next-Generation Agentic Intelligence Layer for Public Complaint Management</strong><br>
  <em>Copilot Cerdas Berbasis Human-in-the-Loop (HITL) untuk Akselerasi Tata Kelola Pengaduan Publik Nasional</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Version-1.0.0-E5252A?style=for-the-badge" alt="Version 1.0.0" />
  <img src="https://img.shields.io/badge/Compliance-UU_PDP_No._27/2022-8B5CF6?style=for-the-badge" alt="UU PDP Compliant" />
  <img src="https://img.shields.io/badge/Standard-SPBE_Perpres_95/2018-059669?style=for-the-badge" alt="SPBE Standard" />
  <img src="https://img.shields.io/badge/Governance-Human--in--the--Loop-D97706?style=for-the-badge" alt="Human-in-the-Loop" />
</p>

<p align="center">
  <a href="#-sekilas-laporpak">Sekilas Produk</a> •
  <a href="#-masalah--solusi-startup-pitch">Latar Belakang</a> •
  <a href="#-fitur-unggulan">Fitur Unggulan</a> •
  <a href="#-arsitektur-sistem--pipeline-agen">Arsitektur Agen</a> •
  <a href="#-antarmuka--pengalaman-pengguna">UI/UX Portal</a> •
  <a href="#-spesifikasi-kontrak-api">Spesifikasi API</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-panduan-instalasi--menjalankan-sistem">Panduan Instalasi</a> •
  <a href="#-tata-kelola-keamanan--etika-ai">Keamanan & Etika AI</a>
</p>

---

## 💡 Sekilas LaporPak!

**LaporPak!** adalah **Agentic Intelligence Layer** berbasis **Arsitektur Hibrida (*Hybrid Architecture*)** yang bertindak sebagai *Virtual Copilot & Decision Support System* di belakang layar sistem pengaduan nasional (seperti **SP4N-LAPOR!**).

Dirancang khusus untuk ekosistem **GovTech Indonesia**, LaporPak! merampingkan rantai birokrasi verifikasi awal melalui:
1. **Sensor PII Otomatis & Deterministik Lokal** sesuai mandat **UU PDP No. 27/2022** sebelum data disentuh oleh cloud LLM.
2. **Deteksi Duplikasi Semantik (Vector Similarity)** untuk mengelompokkan laporan viral warga ke dalam satu tiket induk (*Parent-Child clustering*).
3. **AI Triage & Urgency Matrix** untuk mengekstrak entitas lokasi dan menetapkan prioritas SLA secara objektif.
4. **Explainable Smart Routing (XAI)** yang merekomendasikan Organisasi Perangkat Daerah (OPD) tujuan dengan *Confidence Score* dan rujukan Tupoksi resmi.
5. **Response Copilot** yang menyusun draf tanggapan birokrasi formal empatik dalam hitungan detik.
6. **Kendali Penuh Human-in-the-Loop (HITL)** di mana persetujuan (*approval*), modifikasi, dan diskresi hukum tetap 100% berada di tangan Aparatur Sipil Negara (ASN).

---

## ⚡ Masalah & Solusi

### Masalah Nasional
Sistem pengaduan publik skala nasional seperti SP4N-LAPOR! melayani lebih dari **679 instansi pemerintah** dan memproses lebih dari **151.500 laporan aduan per tahun**. Lonjakan ini menciptakan hambatan operasional (*bottleneck*) serius:
- **30,2% Disposisi Keliru / Terlambat**: Laporan sering terlempar antar-dinas karena ketidakjelasan kewenangan wilayah/tupoksi.
- **Beban Verifikasi Manual**: Petugas ASN menghabiskan 30 menit hingga 4 jam per tiket hanya untuk membaca dan memilah narasi laporan panjang.
- **Redundansi Insiden Viral**: 1 jalan berlubang atau lampu padam dilaporkan oleh puluhan warga berbeda, menyumbat antrean verifikasi.
- **Risiko Pelanggaran UU PDP**: NIK, No. HP, dan alamat pribadi pelapor terpampang telanjang tanpa redaksi otomatis.
- **Aduan Mangkrak**: ~25% tiket melanggar ambang batas SLA tanpa sistem peringatan dini yang proaktif.

### Solusi & Matriks Dampak LaporPak!

| Indikator Kunci (KPI) | Baseline Manual Tradisional | Dengan LaporPak! |
| :--- | :--- | :--- |
| **Durasi Verifikasi & Triage** | 30 menit – 4 jam / tiket | **< 10 Detik / tiket** (Rekomendasi Instan) |
| **Akurasi Disposisi Pertama** | ~69,8% (30,2% salah lempar) | **≥ 92,5% Disposisi Tepat Sasaran** |
| **Proteksi Data Pribadi (PII)** | 0% (Screening manual rawan lolos) | **100% Deterministik Termasking Lokal** |
| **Deteksi Duplikasi Semantik** | Manual / Hampir tidak terdeteksi | **F1-Score ≥ 0.88** (Klasterisasi Insiden Otomatis) |
| **Penyusunan Draf Tanggapan** | 15 – 45 menit / tiket | **< 3 Detik** (Draf Resmi Siap Edit) |
| **Mitigasi Aduan Mangkrak** | ~25% Tiket Melewati SLA | **Penurunan > 60%** berkat Auto-Warning & Escalation |

---

## 🚀 Fitur Unggulan

### 1. 🛡️ Security & Trust Gateway (UU PDP No. 27/2022)
- **Local Deterministic PII Sanitizer**: Menggunakan regex engine & local SpaCy NER untuk menyensor 16-digit NIK, nomor KK, nomor handphone (+62/08xx), email, nomor rekening bank, dan alamat rumah spesifik sebelum payload dikirimkan ke model AI.
- **Zero Data Leakage**: Data PII asli diisolasi dan dienkripsi (AES-256) di database relasional privat, hanya dapat dibuka oleh ASN berwenang via hak akses RBAC.
- **Spam & Abuse Firewall**: Mendeteksi tautan promosi komersial ilegal, judi online (*judol*), pinjaman online ilegal (*pinjol*), pornografi, dan teks *nonsense/bot* untuk langsung dikarantina tanpa membuang komputasi LLM.

### 2. 🧬 Semantic Deduplication Engine
- **Vector Space & Cosine Similarity**: Mengonversi teks laporan menjadi representasi vektor numerik berdimensi tinggi untuk menemukan kesamaan substansi makna meskipun menggunakan gaya bahasa atau dialek berbeda.
- **Parent-Child Incident Clustering**: Laporan dengan kemiripan di atas ambang batas (default: $\ge 0.65 - 0.85$) secara otomatis ditandai sebagai `DUPLICATE_SUSPECT` dan ditautkan ke Tiket Induk.
- **One-Click Multi-Notification**: Saat tiket insiden induk diselesaikan oleh dinas terkait, seluruh warga dalam klaster laporan tersebut menerima pembaruan status serentak.

### 3. 🧠 AI Triage & Dynamic Urgency Matrix
- **Entity & Landmark Extraction**: Secara otomatis mengidentifikasi titik lokasi (nama jalan, simpang, fasilitas terdekat), subjek terlapor, dan kategori pelayanan publik.
- **Scoring Matriks Risiko 4 Tingkat**:
  - `CRITICAL` (SLA < 2 Jam): Ancaman jiwa, jembatan putus, ledakan, kebakaran aktif.
  - `HIGH` (SLA < 12 Jam): Lampu lalu lintas jalan protokol padam, pipa air utama jebol, pohon rawan tumbang di area sekolah.
  - `MEDIUM` (SLA < 48 Jam): Jalan berlubang non-arteri, drainase tersumbat, pungli non-kekerasan.
  - `LOW` (SLA < 5 Hari): Konsultasi informasi publik, saran taman kota, permohonan data.
- **Analisis Sentimen & Frustrasi Warga**: Memetakan tingkat urgensi emosional untuk memprioritaskan antrean mediasi komunikasi.

### 4. 🧭 Explainable Smart Routing (XAI)
- **Rekomendasi Berjenjang**: Memberikan rekomendasi 1 OPD utama (*Top Recommendation*) dengan *Confidence Score* persentase tinggi, dilengkapi 2 opsi alternatif dinas terkait.
- **Explainability / XAI Reasoning**: Menjelaskan argumen penalaran di balik rekomendasi berdasarkan kesesuaian tugas pokok dan fungsi (Tupoksi) regulasi pemerintah daerah.
- **Disambiguasi Kewenangan Wilayah**: Mampu membedakan kewenangan jalan nasional (KemenPUPR / BBPJN), jalan provinsi (Dinas Bina Marga Provinsi), dan jalan kota/kabupaten (Dinas PUPR Daerah).

### 5. ✍️ Response Copilot (AI Bureaucratic Draft Writer)
- **Standar Pelayanan KepmenpanRB**: Menghasilkan draf respons resmi yang santun, empatik, jelas, dan memuat estimasi tindak lanjut serta kontak darurat dinas pelaksana.
- **Tone Presets**: Mendukung variasi gaya komunikasi (`Empathetic Urgent` untuk laporan darurat, `Formal Official` untuk aduan reguler).
- **Interactive Inline Studio**: Editor terpadu di sisi admin untuk menyunting draf dalam hitungan detik sebelum disetujui.

### 6. ⏱️ SLA Copilot & Proactive Escalation Engine
- **Live Countdown Timer**: Penghitung waktu mundur toleransi penanganan tiket dengan visualisasi progress bar dinamis (*Hijau -> Kuning -> Merah*).
- **Proactive Early Warning System**: Alert otomatis ketika penanganan mencapai 75% dari batas waktu.
- **Rekomendasi Eskalasi Berjenjang**: Menganjurkan eskalasi ke tingkat Sekretaris Daerah (Sekda) atau Inspektorat Daerah jika tiket berstatus `BREACHED / STAGNANT`.

### 7. 👥 Human-in-the-Loop (HITL) Governance
- **Zero Autonomous Execution**: AI beroperasi murni sebagai *Copilot*. Tidak ada disposisi yang keluar tanpa persetujuan manual ASN.
- **One-Click Decision**: ASN dapat melakukan `[ SETUJUI & DISPOSISIKAN ]`, `[ OVERRIDE OPD ]`, `[ TAUTKAN DUPLIKAT ]`, atau `[ TOLAK / SPAM ]`.
- **Immutable Audit Trail**: Setiap aksi (rekomendasi diterima vs di-override) dicatat lengkap dengan timestamp, ID aktor, NIP ASN, dan alasan override untuk *continuous fine-tuning*.

---

## 🏛️ Arsitektur Sistem & Pipeline Agen

```
+-----------------------------------------------------------------------------------+
|                        ALUR INTELLIGENCE LAYER LAPORPAK!                          |
|                                                                                   |
|  [ Warga / Kanal Publik ]                                                         |
|            │ (Laporan Masuk: Raw Content + Citizen Identity)                      |
|            ▼                                                                      |
|  ┌─────────────────────────────────────────────────────────────────────────────┐  |
|  │  1. SECURITY & TRUST GATEWAY (Deterministic Local Engine)                   │  |
|  │     • PII Masking: Sensor NIK 16 digit, No HP, Email, Alamat Rumah          │  |
|  │     • Spam & Abuse Filter: Karantina Judol/Pinjol/Bot tanpa komputasi LLM   │  |
|  └──────────────────┬──────────────────────────────────────────┬───────────────┘  |
|                     │ Clean (Masked) Payload                   │ Encrypted PII    |
|                     ▼                                          ▼                  |
|  ┌──────────────────────────────────────────────┐    ┌─────────────────────────┐  |
|  │  2. SEMANTIC DEDUPLICATION ENGINE            │    │   ENCRYPTED DATABASE    │  |
|  │     • Vector Embedding & Cosine Similarity   │    │     (PostgreSQL 16)     │  |
|  │     • Deteksi Tiket Serupa & Klaster Insiden │    │   • AES-256 PII Vault   │  |
|  └──────────────────┬───────────────────────────┘    │   • Immutable Audit Log │  |
|                     ▼                                └─────────────────────────┘  |
|  ┌──────────────────────────────────────────────┐                 ▲               |
|  │  3. AI TRIAGE & RISK ASSESSMENT              │                 │               |
|  │     • Ekstraksi Entitas (Lokasi, Kategori)   │                 │               |
|  │     • Matriks Urgensi (CRITICAL / HIGH / MED)│                 │               |
|  └──────────────────┬───────────────────────────┘                 │               |
|                     ▼                                             │               |
|  ┌──────────────────────────────────────────────┐                 │               |
|  │  4. EXPLAINABLE SMART ROUTING (XAI AGENT)    │                 │               |
|  │     • Rekomendasi OPD + Confidence Score (%) │                 │               |
|  │     • Penalaran Logis Berbasis Tupoksi Resmi │                 │               |
|  └──────────────────┬───────────────────────────┘                 │               |
|                     ▼                                             │               |
|  ┌──────────────────────────────────────────────┐                 │               |
|  │  5. RESPONSE COPILOT & SLA MONITOR           │                 │               |
|  │     • Generator Draf Balasan Resmi Instansi  │                 │               |
|  │     • Countdown Timer & Peringatan Eskalasi  │                 │               |
|  └──────────────────┬───────────────────────────┘                 │               |
|                     ▼                                             │               |
|  ┌────────────────────────────────────────────────────────────────┴────────────┐  |
|  │  6. HUMAN-IN-THE-LOOP (HITL) ADMIN COPILOT DASHBOARD (React + TanStack)     │  |
|  │     • Verifikator ASN: [ SETUJUI ] / [ UBAH DISPOSISI ] / [ GABUNGKAN ]     │  |
|  │     • Tanda Tangan Administratif (NIP ASN) Tercatat                         │  |
|  └─────────────────────────────────────────────────────────────────────────────┘  |
+-----------------------------------------------------------------------------------+
```

---

## 🎨 Antarmuka & Pengalaman Pengguna

Sistem antarmuka LaporPak! mengadopsi standar visual modern **beUI.dev Style** yang memadukan micro-motion halus (*Framer Motion*), tipografi bersih (*Inter/Plus Jakarta Sans*), dan palet identitas merah-navy kedaulatan Indonesia.

### Halaman & Portal:
1. **Portal Publik Warga (`/`)**:
   - Form komprehensif: Klasifikasi *Pengaduan*, *Aspirasi*, atau *Permintaan Informasi*.
   - Filter anonim/rahasia, upload bukti lampiran, dan integrasi geolokasi otomatis.
   - Feed publik interaktif dengan label status penanganan transparan.
2. **Pelacakan Tiket Terpadu (`/lacak`)**:
   - Pelacakan progres tindak lanjut berbasis kode tiket unik (contoh: `LPK-20260903-0042`).
   - Visualisasi timeline status: *Diverifikasi AI -> Disetujui ASN -> Disposisi OPD -> Proses Tindak Lanjut -> Selesai*.
3. **Sistem Autentikasi (`/login`, `/register`)**:
   - Dual-role authentication: Akses Warga vs Admin Verifikator ASN (dilengkapi field NIP).
   - Pengamanan sesi berbasis JWT.
4. **Admin Copilot Triage Dashboard (`/admin`)**:
   - **Split-Screen Panel**: Panel kiri menampilkan antrean aduan realtime dan toggle *Teks Asli Terenkripsi vs Teks Tersensor PII*. Panel kanan menampilkan kartu rekomendasi XAI, kalkulator SLA, dan draf tanggapan.
   - **Tombol Keputusan 1-Klik**: Menerima saran AI dalam 1 detik dengan pencatatan audit log otomatis.
5. **Manajemen OPD & Knowledge Base (`/admin/opd`)**:
   - Direktori instansi pemerintah (DISHUB, PUPR, DLH, DINKES, DISDUKCAPIL, SATPOLPP, BBPJN KemenPUPR).
   - Konfigurasi lingkup wewenang (*scope keywords*), yurisdiksi, dan SLA standar per dinas.
6. **Dashboard Analitik & SLA Monitoring (`/admin/analytics`)**:
   - Distribusi tingkat urgensi laporan (Pie / Bar visualizer).
   - Metrik efisiensi waktu respon, kepatuhan batas waktu penanganan, dan tingkat override ASN.
7. **Pengaturan Guardrails Sistem (`/admin/settings`)**:
   - Konfigurasi ambang batas *Similarity Score* duplikasi semantik.
   - Saklar proteksi PII Masking dan aktivasi provider AI (Google Gemini / Local Rule-based Fallback).

---

## 🔌 Spesifikasi Kontrak API

### Endpoint Utama (`/api/v1`)

| Method | Endpoint | Deskripsi | Hak Akses |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Pendaftaran akun warga baru | Publik |
| `POST` | `/api/v1/auth/login` | Autentikasi pengguna & penerbitan token JWT | Publik |
| `GET` | `/api/v1/auth/me` | Memeriksa profil & peran pengguna aktif | Warga / ASN |
| `GET` | `/api/v1/complaints` | Mengambil daftar aduan (filter status, urgensi, dsb.) | Warga / ASN |
| `POST` | `/api/v1/complaints` | Ingest laporan baru (memicu otomatis PII, Spam, Dedup, Triage, Routing, Draft) | Publik / Warga |
| `POST` | `/api/v1/complaints/{id}/action` | Eksekusi keputusan HITL ASN (`APPROVE`, `OVERRIDE`, `REJECT`, `MERGE`) | Admin ASN |
| `GET` | `/api/v1/opds` | Mengambil katalog seluruh instansi dan lingkup wewenang | Warga / ASN |
| `POST` | `/api/v1/opds` | Menambah OPD baru ke dalam basis pengetahuan | Admin ASN |
| `GET` | `/api/v1/analytics` | Ringkasan metrik statistik aduan, SLA, dan efisiensi | Admin ASN |
| `GET` / `POST` | `/api/v1/settings` | Mengambil & memperbarui parameter guardrails sistem | Admin ASN |

### Contoh Ingestion & Output Agent

#### Ingestion Request (`POST /api/v1/complaints`)
```json
{
  "reporter_name": "Budi Santoso",
  "reporter_nik": "3271012345670001",
  "reporter_phone": "081298765432",
  "reporter_email": "budi.santoso@email.com",
  "raw_content": "Tolong pak lampu lalu lintas di perempatan SMPN 1 Jl. Pemuda padam dari pagi. Bahaya anak-anak hampir tertabrak motor yang ngebut.",
  "location_hint": "Kota Bogor, Jawa Barat",
  "channel": "SP4N_LAPOR_WEB"
}
```

#### Output Intelligence Layer (`apps/api`)
```json
{
  "ticket_id": "LPK-20260903-0042",
  "security_status": {
    "is_spam": false,
    "pii_detected": ["NIK_16_DIGIT", "PHONE_NUMBER"],
    "masked_content": "Tolong pak lampu lalu lintas di perempatan SMPN 1 Jl. Pemuda padam dari pagi. Bahaya anak-anak hampir tertabrak motor yang ngebut."
  },
  "deduplication": {
    "is_duplicate_suspect": false,
    "similarity_score": 0.24,
    "parent_ticket_id": null
  },
  "triage_assessment": {
    "category": "Transportasi & Lalu Lintas",
    "sub_category": "Perlengkapan Jalan & Pengaturan Lalu Lintas (APILL)",
    "urgency_level": "HIGH",
    "urgency_reason": "Gangguan fasilitas publik di area pendidikan yang berpotensi memicu kecelakaan.",
    "sla_deadline_hours": 12,
    "extracted_entities": {
      "location": "perempatan SMPN 1 Jl. Pemuda",
      "city": "Wilayah Kerja Pemerintah Daerah Terkait"
    }
  },
  "smart_routing": {
    "recommended_department": {
      "department_id": "OPD-DISHUB",
      "department_name": "Dinas Perhubungan",
      "confidence_score": 0.94,
      "reasoning": "Rule knowledge base mencocokkan: Lampu Lalu Lintas / APILL."
    }
  },
  "response_copilot": {
    "draft_title": "Tanggapan Cepat — Transportasi & Lalu Lintas",
    "draft_body": "Yth. Budi Santoso, terima kasih atas kepedulian Anda terhadap fasilitas publik. Laporan Anda mengenai \"Tolong pak lampu lalu lintas di perempatan SMPN 1 Jl. Pemuda padam...\" telah kami terima dan didisposisikan ke Dinas Perhubungan...",
    "tone": "Empathetic Urgent"
  },
  "hitl_status": "PENDING_APPROVAL"
}
```

---

## 🛠️ Tech Stack

| Lapisan Sistem | Teknologi | Deskripsi & Keunggulan |
| :--- | :--- | :--- |
| **Frontend Web** | **React 18 + Vite** | Single Page Application (SPA) ultra-cepat dan reaktif |
| **Routing & State** | **TanStack Router** | Type-safe URL routing untuk antarmuka dashboard multi-level |
| **Styling & Motion** | **Tailwind CSS + Framer Motion** | Desain modern berstandar beUI.dev dengan transisi micro-animation |
| **Backend Framework** | **Python FastAPI** | High-performance asynchronous REST API dengan auto-docs Swagger |
| **Database & ORM** | **PostgreSQL 16 + SQLAlchemy** | Basis data relasional tangguh berstandar enterprise dengan ACID compliance |
| **Database Migration** | **Alembic** | Version control skema database yang repeatable dan aman |
| **Vector DB / Store** | **PGVector / Scikit-Learn TF-IDF** | Perhitungan Cosine Similarity pencarian duplikasi laporan dalam hitungan milidetik |
| **Reasoning Engine** | **Google Gemini AI** | Model penalaran konteks bahasa Indonesia untuk ekstraksi entitas dan XAI |
| **Container & Orchestration** | **Docker & Docker Compose** | Multi-container setup terisolasi (PostgreSQL port 5435, API port 8000, Web port 5173) |
| **Monorepo Manager** | **PNPM Workspaces** | Pengelolaan dependensi terpadu lintas aplikasi dan paket bersama |

---

## 📂 Struktur Repositori Monorepo

```
cmp-laporpak/
├── apps/
│   ├── web/                          # [Frontend] React 18 + TanStack Router + Tailwind
│   │   ├── src/
│   │   │   ├── assets/               # Logo resmi LaporPak & Maskot SVG
│   │   │   ├── components/           # Komponen UI terstruktur (beUI style)
│   │   │   │   ├── layout/           # AdminLayout, Navbar, Footer
│   │   │   │   └── ui/               # Button, Badge, Modal, Input
│   │   │   ├── context/              # Auth & Session Context
│   │   │   ├── pages/                # Halaman Aplikasi
│   │   │   │   ├── CitizenPortal.tsx     # Portal Publik Warga
│   │   │   │   ├── TrackComplaint.tsx    # Pelacakan Tiket Warga (/lacak)
│   │   │   │   ├── LoginPage.tsx         # Login Warga & Admin ASN
│   │   │   │   ├── RegisterPage.tsx      # Registrasi Akun Warga
│   │   │   │   ├── TriageDashboard.tsx   # Admin Copilot Split-Screen Triage
│   │   │   │   ├── OpdManagement.tsx     # Pengaturan OPD & Wewenang
│   │   │   │   ├── AnalyticsDashboard.tsx# Visualisasi SLA & Statistik Aduan
│   │   │   │   └── SettingsPage.tsx      # Konfigurasi AI & PII Guardrails
│   │   │   ├── services/             # HTTP Client & API Integrator
│   │   │   └── router.tsx            # Definisi Pohon Rute TanStack
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── api/                          # [Backend] Python FastAPI + AI Agents
│       ├── alembic/                  # Versioning Migrasi Database
│       ├── app/
│       │   ├── agents/               # Modul AI Agentic Pipeline
│       │   │   ├── pii_shield.py     # Deterministic PII Masking Engine
│       │   │   ├── spam_filter.py    # Spam, Bot, & Illicit Content Filter
│       │   │   ├── deduplication.py  # TF-IDF & Vector Similarity Deduplicator
│       │   │   ├── triage_agent.py   # AI Triage, Entity, & Urgency Extractor
│       │   │   ├── routing_agent.py  # Explainable Smart Routing (XAI) Engine
│       │   │   └── response_agent.py # Official Bureaucratic Response Generator
│       │   ├── api/v1/               # Endpoint REST API (/complaints, /opds, dll.)
│       │   ├── db/                   # SQLAlchemy Models, Session, & Seed Init
│       │   ├── auth.py               # Enkripsi Password & JWT Helper
│       │   └── cli.py                # Command Line Tool (Pembuatan Akun Admin)
│       ├── Dockerfile
│       ├── requirements.txt
│       └── main.py                   # FastAPI Application Entrypoint
│
├── packages/
│   └── shared/                       # Shared TypeScript Interfaces & Enums
├── docker-volume/                    # Volume Persisten PostgreSQL Lokal
├── docker-compose.yml                # Multi-Service Orchestrator (DB, API, Web)
├── PRD.md                            # Product Requirements Document
├── DESIGN.md                         # Design System & Motion Specification
└── README.md
```

---

## 🚀 Panduan Instalasi & Menjalankan Sistem

### Prasyarat
- [Docker & Docker Compose](https://www.docker.com/) (Direkomendasikan)
- [Node.js 20+](https://nodejs.org/) & [PNPM 9+](https://pnpm.io/)
- [Python 3.11+](https://www.python.org/)

---

### Opsi 1: Menjalankan via Docker Compose (Paling Cepat & Direkomendasikan)

1. **Clone Repositori & Masuk ke Direktori**:
   ```bash
   git clone https://github.com/kkafi09/cmp-laporpak.git
   cd cmp-laporpak
   ```

2. **Siapkan Konfigurasi Lingkungan (`.env`)**:
   Salin file `.env.example` ke `.env`:
   ```bash
   cp .env.example .env
   ```
   *(Opsional) Masukkan `GEMINI_API_KEY` Anda pada file `.env` jika ingin mengaktifkan inferensi cloud Gemini secara langsung.*

3. **Jalankan Container**:
   ```bash
   docker compose up --build -d
   ```

4. **Inisialisasi Database (Migrasi Skema & Katalog OPD Awal)**:
   ```bash
   pnpm db:init
   ```

5. **(Opsional) Buat Akun Admin ASN Pertama**:
   ```bash
   pnpm admin:create --username admin1 --name "Budi ASN" --email admin@kotabogor.go.id --nip "198501012010011001"
   ```

6. **Akses Layanan**:
   - **Portal Warga & Dashboard Admin**: [http://localhost:5173](http://localhost:5173)
   - **Dokumentasi Interaktif API (Swagger UI)**: [http://localhost:8000/docs](http://localhost:8000/docs)
   - **Database PostgreSQL**: Port `5435`

---

### Opsi 2: Menjalankan Lokal Dev (PNPM + Local Python)

1. **Install Dependensi Monorepo**:
   ```bash
   pnpm install
   ```

2. **Jalankan Database PostgreSQL**:
   Pastikan PostgreSQL berjalan (dapat menggunakan container database saja):
   ```bash
   docker compose up postgres -d
   ```

3. **Setup & Jalankan Backend API**:
   ```bash
   cd apps/api
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # Linux/macOS:
   source .venv/bin/activate

   pip install -r requirements.txt
   alembic upgrade head
   python -m app.db.init_db

   # Jalankan Server Uvicorn
   python -m uvicorn main:app --reload --port 8000
   ```

4. **Jalankan Frontend Web**:
   Buka terminal baru di root proyek:
   ```bash
   pnpm dev:web
   ```

---

### 🗄️ Manajemen Database & Migrasi (Alembic CLI)

Monorepo LaporPak! menyediakan pintasan skrip *package manager* untuk mengelola database secara aman:

```bash
# 1. Menjalankan migrasi ke versi skema paling mutakhir
pnpm db:migrate

# 2. Membuat file revisi migrasi baru otomatis dari perubahan model SQLAlchemy
pnpm db:revision -m "nama_perubahan_skema"

# 3. Membatalkan (rollback) migrasi terakhir
pnpm db:rollback

# 4. Inisialisasi basis pengetahuan katalog OPD (aman dijalankan berulang)
pnpm db:seed

# 5. Eksekusi migrasi sekaligus inisialisasi awal
pnpm db:init
```

---

## 🔒 Tata Kelola Keamanan & Etika AI

LaporPak! dibangun berlandaskan prinsip kepatuhan hukum dan etika kecerdasan buatan untuk sektor publik:

1. **Kepatuhan Mutlak UU PDP No. 27/2022**:
   - Pemisahan ketat antara jalur data publik/AI dengan data identitas pribadi warga (*Data Pipeline Segregation*).
   - Sensor PII dilakukan secara deterministik di server lokal sebelum data meninggalkan perimeter internal.
2. **Kepatuhan SPBE (Perpres No. 95/2018)**:
   - Menggunakan format pertukaran data standar RESTful JSON yang modular dan *interoperable* dengan Pusat Data Nasional (PDN) dan arsitektur Satu Data Indonesia.
3. **Akuntabilitas & Human-in-the-Loop (HITL)**:
   - Menghindari risiko *black-box AI* dengan menyajikan kartu *Explainable AI (XAI)* yang transparan.
   - Keputusan akhir, disposisi dinas, dan pengiriman draf balasan wajib ditandatangani oleh pejabat ASN yang sah.

<p align="center">
  <em>LaporPak! — Melayani Lebih Cepat, Menghubungkan Lebih Tepat, Menjaga Privasi Rakyat.</em>
</p>

