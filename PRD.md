# Product Requirements Document (PRD)
# LaporPak! — Agentic Intelligence Layer for Public Complaint Management

---

| **Informasi Dokumen** | **Detail** |
| :--- | :--- |
| **Nama Produk** | **LaporPak!** |
| **Subjudul** | *Agentic Intelligence Layer for Public Complaint Management* |
| **Versi Dokumen** | v1.0.0 |
| **Status** | Approved / Ready for Implementation |
| **Target Event** | BISA AI National AI Agent Challenge 2026 |
| **Klasifikasi Proyek** | GovTech / Public Service AI Copilot |
| **Kepatuhan Regulasi** | UU PDP No. 27/2022 & Perpres SPBE No. 95/2018 |

---

## 1. Executive Summary & Problem Statement

### 1.1 Latar Belakang & Konteks Permasalahan
Pengelolaan pengaduan publik skala nasional seperti **SP4N-LAPOR!** merupakan kanal krusial dalam menjamin hak masyarakat atas pelayanan publik yang prima. Sistem nasional saat ini terhubung ke lebih dari **679 instansi pemerintah** (Kementerian, Lembaga, dan Pemerintah Daerah) dan memproses lebih dari **151.500 laporan aduan per tahun**.

Namun, lonjakan volume aduan masyarakat memicu **hambatan operasional (*bottleneck*) yang berat** pada birokrasi penanganan aduan:
1. **Beban Verifikasi Manual**: Petugas/ASN harus membaca, memvalidasi identitas, membersihkan data sensitif, dan memilah aduan secara manual.
2. **Keterlambatan & Salah Disposisi (*Wrong Disposition*)**: Sekitar **30,2% laporan pengaduan mengalami keterlambatan atau salah lempar instansi/OPD**, memperpanjang waktu tunggu penyelesaian dari hitungan hari menjadi minggu.
3. **Redundansi Laporan (Duplikasi Aduan)**: Kejadian publik yang viral (misal: jalan berlubang atau lampu lalu lintas mati) kerap dilaporkan berulang kali oleh puluhan warga berbeda, membebani antrean verifikasi aparatur negara.
4. **Polusi Spam & Bot**: Banyaknya laporan palsu (*hoax*), promosi spam, atau ujaran kebencian yang tidak dapat ditindaklanjuti namun menyita waktu telaah admin.
5. **Bahasa Tidak Terstruktur**: Laporan warga menggunakan bahasa informal, dialek/slang daerah, typo, atau narasi emosional tanpa menyebut lokasi/kategori secara eksplisit.
6. **Risiko Kebocoran Privasi (UU PDP)**: Data pribadi sensitif seperti NIK, nomor telepon, dan alamat rumah seringkali tercantum langsung dalam teks aduan tanpa perlindungan redaksi/masking otomatis sebelum didistribusikan.

### 1.2 Ringkasan Solusi
**LaporPak!** hadir sebagai **Agentic Intelligence Layer** berbasis **Arsitektur Hibrida (*Hybrid Architecture*)**. Sistem ini beroperasi di belakang layar (*backend intelligence middleware*) sebagai **"Copilot / Asisten Virtual Admin"** tanpa perlu merombak aplikasi eksisting masyarakat. 

LaporPak! mengotomatisasi rantai pemrosesan awal (Triage, PII Masking, Deduplikasi, Smart Routing XAI, dan Auto-Drafting) sembari mempertahankan prinsip ketat **Human-in-the-Loop (HITL)** di mana persetujuan (*approval*) dan tindakan hukum/kebijakan tetap 100% di bawah kendali ASN/Admin.

```
+-----------------------------------------------------------------------------------+
|                        ALUR INTELLIGENCE LAYER LAPORPAK!                          |
|                                                                                   |
|  [ Warga / SP4N-LAPOR! ]                                                          |
|            │                                                                      |
|            ▼                                                                      |
|  ┌─────────────────────────────────────────────────────────────────────────────┐  |
|  │  1. SECURITY & TRUST GATEWAY (Regex + SpaCy NER + Spam Classifier)          │  |
|  │     - PII Masking: Sensor NIK, No. Telp, Alamat (Sesuai UU PDP)            │  |
|  │     - Spam/Bot Filtering (Deterministic + Fast Text Classifier)             │  |
|  └──────────────────────────────────────┬──────────────────────────────────────┘  |
|                                         ▼                                         |
|  ┌─────────────────────────────────────────────────────────────────────────────┐  |
|  │  2. SEMANTIC DEDUPLICATION (Vector DB + Cosine Similarity)                  │  |
|  │     - Deteksi laporan berulang secara semantik & klasterisasi insiden       │  |
|  └──────────────────────────────────────┬──────────────────────────────────────┘  |
|                                         ▼                                         |
|  ┌─────────────────────────────────────────────────────────────────────────────┐  |
|  │  3. AI TRIAGE & RISK ASSESSMENT (LLM Reasoning Engine - Gemini)             │  |
|  │     - Ekstraksi Entitas (Lokasi, Dampak, Kategori Isu)                      │  |
|  │     - Penilaian Tingkat Urgensi (LOW / MEDIUM / HIGH / CRITICAL)            │  |
|  └──────────────────────────────────────┬──────────────────────────────────────┘  |
|                                         ▼                                         |
|  ┌─────────────────────────────────────────────────────────────────────────────┐  |
|  │  4. EXPLAINABLE SMART ROUTING (XAI OPD Recommendation)                      │  |
|  │     - Rekomendasi Instansi/OPD Tujuan + Confidence Score (%)                │  |
|  │     - Reasoning Logis Berdasarkan Tupoksi Regulasi                          │  |
|  └──────────────────────────────────────┬──────────────────────────────────────┘  |
|                                         ▼                                         |
|  ┌─────────────────────────────────────────────────────────────────────────────┐  |
|  │  5. RESPONSE COPILOT & SLA MONITOR (RAG + Knowledge Base)                   │  |
|  │     - Draf balasan resmi instansi otomatis siap edit                        │  |
|  │     - Monitoring SLA & Rekomendasi Eskalasi jika penanganan stagnan         │  |
|  └──────────────────────────────────────┬──────────────────────────────────────┘  |
|                                         ▼                                         |
|  ┌─────────────────────────────────────────────────────────────────────────────┐  |
|  │  6. HUMAN-IN-THE-LOOP (HITL) ADMIN COPILOT DASHBOARD                        │  |
|  │     - ASN/Admin: [ APPROVE ] / [ EDIT ] / [ OVERRIDE DISPOSISI ]            │  |
|  └─────────────────────────────────────────────────────────────────────────────┘  |
+-----------------------------------------------------------------------------------+
```

---

## 2. Product Vision, Target Persona, & Scope

### 2.1 Visi Produk
> *"Mewujudkan tata kelola pengaduan publik yang bebas hambatan birokrasi melalui kecerdasan buatan terpercaya, mengimplementasikan prinsip No Wrong Door Policy secara presisi, serta menjamin privasi warga negara dan akuntabilitas aparatur sipil negara."*

### 2.2 User Personas

| Persona | Deskripsi & Peran | Kebutuhan Utama (*Pain Points*) | Peran LaporPak! bagi Persona |
| :--- | :--- | :--- | :--- |
| **Admin Verifikator Instansi / Pemda (ASN Grade I/II)** | Petugas garda depan yang memilah ratusan tiket laporan harian masuk dari kanal publik. | Capek membaca manual narasi panjang, sering bingung membedakan tupoksi dinas terkait, takut salah disposisi. | Menyediakan ringkasan aduan, confidence score OPD tujuan, serta draf disposisi siap verifikasi sekali klik. |
| **Admin Koordinator / Kepala Bagian Pelayanan Publik** | Pimpinan yang mengawasi kepatuhan SLA antar-OPD dan memantau status penyelesaian aduan. | Susah melacak laporan yang mangkrak antar-dinas, data laporan duplikat membengkakkan statistik. | Memberikan alert SLA otomatis, rekomendasi eskalasi berjenjang, dan klasterisasi duplikasi insiden. |
| **ASN Petugas Teknis Tindak Lanjut (OPD Pelaksana)** | Tim di lapangan/dinas operasional (misal: Dinas Bina Marga, Dinas Kesehatan, Dinas Perhubungan). | Butuh rincian teknis masalah (lokasi pasti, urgensi bahaya) tanpa kebocoran data sensitif warga. | Menerima tiket yang sudah ber-PII masked, kategori jelas, tingkat keparahan terpetakan, dan rekomendasi respons. |
| **Masyarakat / Warga Pelapor (Indirect Stakeholder)** | Warga yang menyampaikan keluhan/aspirasi fasilitas umum dan pelayanan birokrasi. | Aduan lama ditanggapi, dilempar-lempar antar-instansi, cemas data pribadi bocor/disalahgunakan. | Mendapatkan waktu respons jauh lebih cepat, penanganan ke instansi yang tepat sejak hari pertama, serta proteksi NIK. |

### 2.3 Lingkup Proyek (Scope)

#### In-Scope (MVP & Prototipe Utama)
- **Security & Privacy Guard**: Redaksi PII otomatis deterministik berbasis Regex + SpaCy NER lokal (NIK, Telp, Email, Alamat spesifik) dan filter spam.
- **Semantic Deduplication**: Pencarian kemiripan makna menggunakan Vector Embeddings & Cosine Similarity dengan threshold adaptif.
- **AI Triage & Urgency Assessment**: Ekstraksi entitas kunci (kategori masalah, lokasi, dampak keselamatan) & penentuan tingkat urgensi (Low, Medium, High, Critical).
- **Explainable Smart Routing**: Rekomendasi 3 OPD teratas dengan Confidence Score (%) dan argumen penalaran (*chain-of-thought reason*).
- **Response Copilot**: Generator draf balasan resmi standar birokrasi berdasarkan SOP dan konteks aduan.
- **SLA Copilot & Escalation Alert**: Penghitung waktu mundur SLA dan notifikasi rekomendasi eskalasi ke atasan jika tiket stagnan.
- **Admin Copilot UI**: Antarmuka interaktif modern (Vite + React) untuk review ASN dengan mode *Approve / Edit / Override*.
- **RESTful API Backend**: Endpoint asynchronous bertenaga Python FastAPI terintegrasi PostgreSQL & Vector Store.

#### Out-of-Scope (Fase Pasca-MVP)
- Otomasi eksekusi tanpa persetujuan ASN (*Autonomous disposition without human sign-off is strictly prohibited*).
- Pembuatan aplikasi mobile warga baru (LaporPak! bertindak murni sebagai middleware intelligence layer).
- Integrasi fisik CCTV / sensor IoT real-time (dijadwalkan pada roadmap masa depan).

---

## 3. Fitur Utama & Kebutuhan Fungsional (Functional Requirements)

### 3.1 Modul 1: Security & Trust Gateway (Spam/Bot Classifier & PII Masking)
*Tujuan: Menjamin kepatuhan penuh terhadap UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP) dan menyaring noise sebelum membebani LLM.*

* **FR-SEC-01 (Deterministic PII Detection & Redaction)**:
  - Sistem **wajib** mendeteksi pola data pribadi secara lokal sebelum payload dikirim ke API LLM publik/cloud.
  - Pola yang wajib disensor (*masked*):
    - Nomor Induk Kependudukan (NIK 16 digit).
    - Nomor Kartu Keluarga (KK 16 digit).
    - Nomor Handphone / Telepon Indonesia (+62 / 08xx).
    - Alamat Email.
    - Nomor Rekening Bank / Kartu Kredit.
    - Alamat rumah spesifik (nomor rumah, RT/RW).
  - Format Redaksi: `[TERMASKING: NIK]`, `[TERMASKING: NO_TELP]`, `[TERMASKING: EMAIL]`, dsb.
* **FR-SEC-02 (Spam & Bot Filtering)**:
  - Mengklasifikasikan tiket sebagai `VALID`, `SPAM_PROMOTION`, `BOT_GENERATED`, atau `NONSENSE_ABUSE`.
  - Tiket yang terdeteksi spam otomatis masuk ke tab *Spam Quarantine* tanpa memicu alur inferensi LLM lebih lanjut (menghemat token & komputasi).
* **FR-SEC-03 (Audit Log Dekripsi Terbatas)**:
  - Data asli PII hanya disimpan dalam database terenkripsi (AES-256) dan hanya dapat dibuka oleh ASN berwenang dengan hak akses khusus (*role-based access control*).

---

### 3.2 Modul 2: Semantic Deduplication Engine
*Tujuan: Mengidentifikasi laporan berulang dengan substansi yang sama namun disampaikan dengan gaya bahasa atau kosakata berbeda.*

* **FR-DEDUP-01 (Vector Embedding Generation)**:
  - Mengonversi teks laporan yang telah dibersihkan menjadi representasi vektor numerik berdimensi tinggi.
* **FR-DEDUP-02 (Semantic Similarity Matching)**:
  - Menghitung Cosine Similarity antara laporan baru dengan laporan-laporan aktif dalam rentang waktu tertentu (misal: 14 hari terakhir) pada geolokasi/wilayah yang berdekatan.
  - Nilai Similarity Score $\ge 0.85$: Ditandai sebagai `DUPLICATE_SUSPECT` dan ditautkan ke ID Tiket Induk (*Parent Master Ticket*).
  - Nilai Similarity Score $0.70 - 0.84$: Ditandai sebagai `RELATED_INCIDENT`.
* **FR-DEDUP-03 (Parent-Child Ticket Aggregation)**:
  - Memberikan opsi kepada Admin untuk menggabungkan laporan duplikat (*Merge Tickets*) sehingga saat insiden utama selesai diperbaiki, seluruh pelapor terkait menerima notifikasi serentak.

---

### 3.3 Modul 3: AI Triage & Risk Assessment Agent
*Tujuan: Mengekstrak metadata terstruktur dari teks bebas dan menilai tingkat keparahan/urgensi secara objektif.*

* **FR-TRG-01 (Entity & Keyword Extraction)**:
  - Ekstraksi otomatis:
    - **Kategori Masalah**: Infrastruktur Jalan, Fasilitas Kesehatan, Pelayanan Kependudukan, Pendidikan, Kebersihan Lingkungan, Keamanan/Ketertiban, Transportasi.
    - **Entitas Lokasi**: Nama jalan, tengara (*landmark*), kecamatan/kelurahan, kota/kabupaten.
    - **Subjek Terlapor**: Aparatur tertentu, fasilitas spesifik, instansi dinas.
* **FR-TRG-02 (Urgency & Risk Matrix Scoring)**:
  - Menentukan tingkat urgensi berdasarkan analisis dampak publik dan potensi bahaya:
    - `CRITICAL`: Mengancam nyawa, bencana aktif, kegagalan sistem vital (misal: jembatan putus, ledakan gas publik). SLA Target: $< 2$ Jam.
    - `HIGH`: Mengancam keselamatan publik atau mengganggu aktivitas massal (misal: lampu merah perempatan jalan protokol padam, kebocoran pipa air utama). SLA Target: $< 12$ Jam.
    - `MEDIUM`: Kerusakan fasilitas publik non-darurat, pungli non-kekerasan, keterlambatan dokumen administrasi. SLA Target: $< 48$ Jam.
    - `LOW`: Saran, apresiasi, pertanyaan informasi umum, keluhan estetika taman kota. SLA Target: $< 5$ Hari.
* **FR-TRG-03 (Sentiment & Toxicity Analysis)**:
  - Menganalisis tingkat kemarahan/kekecewaan warga untuk memprioritaskan antrean mediasi komunikasi.

---

### 3.4 Modul 4: Explainable Smart Routing Agent (XAI)
*Tujuan: Menentukan instansi atau Organisasi Perangkat Daerah (OPD) tujuan secara presisi dengan alasan logis yang dapat dipertanggungjawabkan.*

* **FR-ROUT-01 (OPD Recommendation & Scoring)**:
  - Menghasilkan daftar rekomendasi instansi/OPD penerima disposisi dengan format:
    - **Pilihan 1 (Top Recommendation)**: Nama Instansi/OPD + Confidence Score (%) + Alasan Rekomendasi (*Reasoning*).
    - **Pilihan 2 (Alternative 1)**: Nama Instansi/OPD + Confidence Score (%).
    - **Pilihan 3 (Alternative 2)**: Nama Instansi/OPD + Confidence Score (%).
* **FR-ROUT-02 (Explainability / XAI Rationale)**:
  - Menyajikan narasi penalaran singkat (1-2 kalimat) yang merujuk pada relevansi tugas pokok dan fungsi (Tupoksi) instansi bersangkutan.
  - *Contoh output XAI*: *"Direkomendasikan ke Dinas Bina Marga (Keyakinan: 94%) karena laporan mengindikasikan kerusakan struktur perkerasan jalan berlubang di jalan berstatus jalan kota."*
* **FR-ROUT-03 (Jurisdiction Disambiguation)**:
  - Agen mampu membedakan kewenangan jalan nasional (KemenPUPR/BBPJN), jalan provinsi (Dinas Bina Marga Provinsi), dan jalan kabupaten/kota (Dinas PUPR Daerah) berdasarkan entitas nama jalan dan basis data pemetaan.

---

### 3.5 Modul 5: Response Copilot (AI Draft Writer)
*Tujuan: Mempercepat pengetikan balasan resmi yang santun, normatif, dan sesuai standar birokrasi pelayanan publik.*

* **FR-RSP-01 (Context-Aware Draft Generation)**:
  - Menyusun draf respons resmi berdasarkan:
    - Nama instansi penangan.
    - Konteks spesifik laporan warga (yang sudah ber-PII masked).
    - Tindakan awal yang akan dilakukan oleh OPD.
    - Estimasi waktu tindak lanjut sesuai standar SLA.
* **FR-RSP-02 (Tone & Bureaucratic Style Alignment)**:
  - Menggunakan gaya bahasa formal, empatik, jelas, dan menjunjung standar pelayanan publik Indonesia (KepmenpanRB).
* **FR-RSP-03 (Interactive Inline Editing)**:
  - Memberikan antarmuka bagi Admin untuk mengedit draf, mengganti variabel template, atau menulis ulang sebelum tiket dikirimkan kepada pelapor.

---

### 3.6 Modul 6: SLA Copilot & Escalation Engine (Auto-Monev)
*Tujuan: Mencegah terjadinya aduan mangkrak atau terabaikan di meja birokrasi.*

* **FR-SLA-01 (Real-time SLA Countdown Timer)**:
  - Menghitung waktu mundur (*countdown*) sisa toleransi penanganan sejak tiket diverifikasi.
* **FR-SLA-02 (Proactive SLA Warning & Notifications)**:
  - Status `NORMAL`: Waktu $< 50\%$ dari batas SLA.
  - Status `WARNING`: Waktu mencapai $75\%$ dari batas SLA belum ada respons OPD pelaksana.
  - Status `BREACHED / STAGNANT`: Waktu melewati $100\%$ batas SLA.
* **FR-SLA-03 (Recommended Escalation Workflow)**:
  - Jika tiket berstatus `BREACHED`, agen merekomendasikan opsi eskalasi berjenjang (misal: Notifikasi ke Inspektorat Daerah / Sekda / Kepala Dinas).
  - Eskalasi memerlukan tombol konfirmasi persetujuan dari Admin/Pimpinan (*Human Approval*).

---

### 3.7 Modul 7: Human-in-the-Loop (HITL) Admin Copilot Interface
*Tujuan: Menyediakan antarmuka dashboard terpadu bagi ASN untuk mengambil keputusan dalam hitungan detik.*

* **FR-UI-01 (Split-Screen Review Panel)**:
  - **Panel Kiri**: Teks laporan asli warga vs Teks tersensor PII, riwayat pelapor, serta status duplikasi semantik.
  - **Panel Kanan**: AI Agent Insights:
    - Badges Urgensi & Kategori.
    - Rekomendasi Smart Routing + Confidence Score + XAI Reasoning.
    - Editor Draf Respons Copilot.
* **FR-UI-02 (One-Click Action Controls)**:
  - Tombol aksi cepat:
    - `[ SETUJUI & DISPOSISIKAN ]`: Menerima rekomendasi AI secara instan.
    - `[ UBAH DISPOSISI ]`: Mengganti OPD tujuan secara manual melalui dropdown search jika ASN memiliki diskresi lain.
    - `[ GABUNGKAN DUPLIKAT ]`: Menautkan laporan ke tiket utama.
    - `[ TOLAK / SPAM ]`: Mengarsipkan tiket yang tidak valid.
* **FR-UI-03 (Audit Trail & Feedback Loop)**:
  - Setiap tindakan ASN (menerima atau meng-override saran AI) dicatat dalam log audit.
  - Data koreksi manusia (*human override*) disimpan untuk keperluan *continuous fine-tuning* dan evaluasi akurasi model AI.

---

## 4. Arsitektur Teknis & Spesifikasi Sistem

### 4.1 Diagram Arsitektur Hibrida

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                                   LAPORPAK! ARCHITECTURE                                 │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│  [ CLIENT / SP4N-LAPOR! INTEGRATION ]                                                    │
│        │ REST API (JSON / HTTPS)                                                         │
│        ▼                                                                                 │
│  ┌────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                    API GATEWAY & SECURITY LAYER (FastAPI Middleware)               │  │
│  │  • Rate Limiter & Token Auth                                                       │  │
│  │  • Deterministic PII Masking Engine (Regex + Local SpaCy NER)                      │  │
│  │  • Spam & Anomaly Classifier                                                       │  │
│  └──────────────────┬─────────────────────────────────────────────────┬───────────────┘  │
│                     │ Clean (Masked) Payload                          │ Raw PII Data     │
│                     ▼                                                 ▼                  │
│  ┌──────────────────────────────────────────────┐    ┌────────────────────────────────┐  │
│  │       ORCHESTRATION & AGENTIC WORKFLOW       │    │     ENCRYPTED DATABASE         │  │
│  │             (FastAPI / Python)               │    │       (PostgreSQL 16)          │  │
│  │  • Vector Embedding Generator               │    │  • Encrypted Citizens PII      │  │
│  │  • Semantic Deduplication Comparator        │    │  • Audit Logs & Action Trails  │  │
│  │  • Triage & Urgency Evaluator               │    │  • Ticket Records & History    │  │
│  │  • XAI Routing & Reasoning Resolver         │    └────────────────────────────────┘  │
│  │  • Response Copilot RAG Pipeline            │                     ▲                  │
│  └──────────────────┬───────────────────────────┘                     │                  │
│                     │                                                 │                  │
│        ┌────────────┴────────────┐                                    │                  │
│        ▼                         ▼                                    │                  │
│  ┌───────────────────────┐  ┌───────────────────────┐                 │                  │
│  │  PRIMARY REASONING    │  │  VECTOR STORE DB      │                 │                  │
│  │  (Gemini LLM API)     │  │  (PGVector / Chroma)  │                 │                  │
│  │  • Structured Outputs │  │  • Incident Embeddings│                 │                  │
│  │  • Indonesian Nuances │  │  • Cosine Similarity  │                 │                  │
│  │  • Zero-Shot Routing  │  │  • Fast Deduplication │                 │                  │
│  └───────────────────────┘  └───────────────────────┘                 │                  │
│                     │                                                 │                  │
│                     ▼                                                 │                  │
│  ┌────────────────────────────────────────────────────────────────────┴───────────────┐  │
│  │               ADMIN COPILOT WEB APPLICATION (Vite 8 + React + Tailwind)            │  │
│  │  • Live Ticket Feed & Status Badges                                                │  │
│  │  • Split-Screen HITL Decision Panel                                                │  │
│  │  • Explainable AI Confidence Gauge & Rationale Box                                 │  │
│  │  • Interactive Response Drafting Studio & SLA Countdown Timers                     │  │
│  └────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                          │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Tech Stack

| Lapisan / Komponen | Teknologi Terpilih | Alasan & Justifikasi Teknis |
| :--- | :--- | :--- |
| **Reasoning Engine (LLM)** | **Google Gemini LLM** | Pemahaman konteks bahasa Indonesia yang sangat kuat, mendukung structured JSON output, inferensi cepat dengan latensi rendah. |
| **Security & PII Masking** | **Regex Engine + Local SpaCy (Indonesian Model)** | Eksekusi deterministik lokal di server sendiri tanpa mengirim data mentah PII ke pihak ketiga, memenuhi amanat UU PDP No. 27/2022. |
| **Vector Database** | **PostgreSQL (PGVector) / ChromaDB** | Penyimpanan vektor efisien untuk *Cosine Similarity search* pencarian duplikasi laporan dalam hitungan milidetik. |
| **Backend REST API** | **Python (FastAPI)** | Asynchronous high-throughput framework, native integration dengan ekosistem AI/ML Python, auto-generated OpenAPI documentation. |
| **Relational Database** | **PostgreSQL 16** | Standar enterprise untuk integritas relasional, ACID compliance, dan enkripsi data *at-rest* & *in-transit*. |
| **Frontend Framework** | **Vite 8 + React + Modern CSS/Tailwind** | Antarmuka single-page application (SPA) yang sangat cepat, interaktif, modular, dan siap diintegrasikan ke dashboard ASN eksisting. |
| **Standard Arsitektur** | **SPBE (Perpres No. 95 Tahun 2018)** | Desain RESTful API yang interoperabel, modular (*microservice-ready*), dan *plug-and-play* ke sistem SP4N-LAPOR!. |

---

## 5. Spesifikasi Payload API & Kontrak Data

### 5.1 Endpoint Ingestion: `POST /api/v1/complaints/ingest-and-triage`

#### Request Payload (Dari Sistem Pengaduan Eksternal):
```json
{
  "external_ticket_id": "LAPOR-2026-08821",
  "reporter_name": "Budi Santoso",
  "reporter_nik": "3271012345670001",
  "reporter_phone": "081298765432",
  "reporter_email": "budi.santoso@email.com",
  "raw_content": "Tolong pak lampu lalu lintas di perempatan lampu merah depan SMPN 1 Jl. Pemuda padam dari pagi. Bahaya banget anak-anak sekolah mau menyeberang hampir tertabrak motor yang ngebut. Tolong segera diperbaiki dinas terkait.",
  "channel": "SP4N_LAPOR_WEB",
  "reported_at": "2026-08-20T08:15:00Z",
  "location_hint": "Kota Bogor, Jawa Barat"
}
```

#### Processed & Masked Content (Internal Safe Payload):
```
"Tolong pak lampu lalu lintas di perempatan lampu merah depan SMPN 1 Jl. Pemuda padam dari pagi. Bahaya banget anak-anak sekolah mau menyeberang hampir tertabrak motor yang ngebut. Tolong segera diperbaiki dinas terkait."
(Metadata PII Pelapor: NIK [MASKED], Telp [MASKED] disterilisasi sebelum dikirim ke Reasoning Engine)
```

#### Response Payload (LaporPak! AI Agent Output):
```json
{
  "ticket_id": "LPK-20260820-0042",
  "external_ticket_id": "LAPOR-2026-08821",
  "security_status": {
    "is_spam": false,
    "pii_detected": ["NIK", "PHONE_NUMBER", "EMAIL"],
    "masked_content": "Tolong pak lampu lalu lintas di perempatan lampu merah depan SMPN 1 Jl. Pemuda padam..."
  },
  "deduplication": {
    "is_duplicate_suspect": true,
    "similarity_score": 0.89,
    "parent_ticket_id": "LPK-20260820-0012",
    "cluster_incident_name": "Lampu Merah Padam Jl. Pemuda (SMPN 1)"
  },
  "triage_assessment": {
    "category": "Transportasi & Lalu Lintas",
    "sub_category": "Fasilitas Perlengkapan Jalan (APILL)",
    "urgency_level": "HIGH",
    "urgency_reason": "Potensi bahaya keselamatan jiwa murid sekolah dan potensi kecelakaan lalu lintas.",
    "extracted_entities": {
      "location": "Perempatan Jl. Pemuda depan SMPN 1",
      "city": "Kota Bogor",
      "issue": "Lampu lalu lintas / traffic light padam"
    },
    "sla_deadline_hours": 12
  },
  "smart_routing": {
    "recommended_department": {
      "department_id": "OPD-DISHUB-BGR",
      "department_name": "Dinas Perhubungan Kota Bogor",
      "confidence_score": 0.94,
      "reasoning": "Pengelolaan, perawatan, dan operasional Lampu APILL (Alat Pemberi Isyarat Lalu Lintas) pada jalan kota berada di bawah wewenang bidang Sarana & Prasarana Dinas Perhubungan."
    },
    "alternative_departments": [
      {
        "department_id": "OPD-SATPOLPP-BGR",
        "department_name": "Satuan Polisi Pamong Praja Kota Bogor",
        "confidence_score": 0.35,
        "reasoning": "Penjagaan ketertiban lalu lintas sementara sebelum perbaikan teknis Dishub."
      }
    ]
  },
  "response_copilot": {
    "draft_title": "Tanggapan Laporan Lampu Lalu Lintas Padam Jl. Pemuda",
    "draft_body": "Yth. Warga Pelapor, terima kasih atas kepedulian Anda terhadap keselamatan publik. Laporan Anda mengenai traffic light padam di depan SMPN 1 Jl. Pemuda telah kami terima dan diteruskan ke Tim Teknis Dinas Perhubungan Kota Bogor untuk perbaikan mendesak hari ini. Petugas lapangan sedang diberangkatkan ke lokasi. Mohon warga tetap berhati-hati saat melintas.",
    "tone": "Empathetic & Responsive Official"
  },
  "human_in_the_loop_status": {
    "status": "PENDING_APPROVAL",
    "requires_manual_override": false
  }
}
```

---

## 6. Kepatuhan Tata Kelola, Keamanan & Guardrails

### 6.1 Prinsip Mutlak: Human-in-the-Loop (HITL)
1. **Tidak Ada Disposisi Otonom Penuh**: AI Agent bertindak murni sebagai *Decision Support System* (Copilot).
2. **Kewenangan Final di Tangan ASN**: ASN memiliki hak penuh untuk:
   - **Approve**: Mengonfirmasi disposisi dan respons AI dalam 1 klik.
   - **Edit**: Mengubah draf balasan atau menambahkan catatan teknis.
   - **Override**: Mengganti OPD tujuan apabila ada pertimbangan diskresi lapangan.
3. **Akuntabilitas Hukum**: Setiap disposisi resmi yang tercatat di SP4N-LAPOR! mencantumkan NIP dan nama ASN penyetuju sebagai penanggung jawab administratif.

### 6.2 Kepatuhan UU PDP (UU No. 27 Tahun 2022)
1. **Pemisahan Jalur Data (*Data Pipeline Segregation*)**:
   - Jalur Identitas Pribadi (NIK, No HP, Alamat) diisolasi di lingkungan database privat terenkripsi.
   - Jalur Pemrosesan AI hanya menerima data yang telah melalui proses *Anonymization / PII Masking*.
2. **Kedaulatan Data**: Data pengaduan tidak digunakan untuk melatih (*train*) model publik pihak ketiga tanpa persetujuan instansi (*Zero Data Retention agreement*).

### 6.3 Penyelarasan Standar SPBE (Perpres No. 95 Tahun 2018)
1. **Interoperabilitas Terbuka**: Format pertukaran data menggunakan standar JSON RESTful API yang kompatibel dengan arsitektur Satu Data Indonesia dan Pusat Data Nasional (PDN).
2. **Arsitektur Modular / Plug-and-Play**: Dapat dipasang di atas sistem eksisting tanpa mematikan (*zero downtime*) layanan pengaduan yang sedang berjalan.

---

## 7. Target Metrik & Key Performance Indicators (KPIs)

| Kategori Metrik | Indikator Kunci (KPI) | Kondisi Eksisting (Baseline Manual) | Target Capaian LaporPak! |
| :--- | :--- | :--- | :--- |
| **Efisiensi Waktu** | Durasi Verifikasi Awal & Triage per Tiket | 30 menit – 4 jam / tiket | **$< 10$ Detik** (Penyajian Rekomendasi Instan) |
| **Akurasi Disposisi** | Tingkat Disposisi Pertama Tepat (*First-Time Routing Accuracy*) | $\sim 69.8\%$ (30.2% salah/terlambat) | **$\ge 92.5\%$** Akurasi Disposisi ke OPD Tepat |
| **Pengurangan Redundansi**| F1-Score Deteksi Laporan Duplikat Semantik | Manual / Sulit Terdeteksi | **F1-Score $\ge 0.88$** |
| **Keamanan Privasi** | Tingkat Keberhasilan PII Masking Sebelum Kirim LLM | 0% (Manual screening rawan lolos) | **$100\%$ Data Sensitif TERSENSOR** |
| **Penyusunan Balasan** | Waktu Pembuatan Draf Tanggapan Resmi | 15 – 45 menit | **$< 3$ Detik** (Tersedia draf siap edit) |
| **Mitigasi Aduan Mangkrak**| Penurunan Persentase Pelanggaran SLA | $\sim 25\%$ Tiket Melewati SLA | **Penurunan $> 60\%$** berkat Auto-Warning |

---

## 8. Rencana Implementasi & Roadmap Pengembangan

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│                             ROADMAP PENGEMBANGAN LAPORPAK!                                 │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                            │
│  [ FASE 1: PROTOTYPE & HACKATHON MVP (Saat ini) ]                                          │
│  ├── Engine PII Masking Deterministik + Spam Classifier                                    │
│  ├── Triage & Urgency Extractor dengan Gemini LLM                                          │
│  ├── Explainable Smart Routing OPD dengan Confidence Score                                 │
│  ├── Semantic Deduplication Vector Store (Cosine Similarity)                               │
│  ├── Response Copilot & SLA Countdown Simulator                                            │
│  └── Dashboard HITL Admin Copilot (Vite + React)                                           │
│                                                                                            │
│  [ FASE 2: PILOT PROJECT & INTEGRASI SP4N-LAPOR! ]                                         │
│  ├── Integrasi Middleware API dengan SP4N-LAPOR! / Pemda Sandbox                           │
│  ├── Custom OPD Knowledge Base untuk seluruh Kota/Kabupaten di Indonesia                   │
│  ├── Continuous Fine-Tuning berbasis Feedback Data Log Override ASN                        │
│  └── Multi-role Admin & Permission Hierarchy (KemenpanRB, Pemprov, Pemkab/Pemkot)          │
│                                                                                            │
│  [ FASE 3: ADVANCED PREDICTIVE & MULTI-MODAL INTELLIGENCE ]                                │
│  ├── Predictive Analytics Engine: Prediksi titik rawan kerusakan & perencanaan APBD        │
│  ├── Multi-Modal IoT & CCTV Validation: Verifikasi fisik otomatis laporan genangan/jalan   │
│  └── Voice-to-Text & Inclusive Interface: Aksesibilitas bagi kelompok lansia & disabilitas │
│                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. Analisis Risiko & Mitigasi

| Risiko Potensial | Dampak | Probabilitas | Rencana Mitigasi |
| :--- | :--- | :--- | :--- |
| **Halusinasi LLM pada Disposisi Instansi** | Tinggi | Sedang | Menerapkan *Constrained Output Schema (JSON Schema Enforcement)* dan *Rule-based Lookup* daftar OPD resmi Pemda. |
| **Data Pribadi Baru / Non-Standar Lolos Masking** | Tinggi | Rendah | Mengombinasikan Regex ketat, Named Entity Recognition (NER) kontekstual bahasa Indonesia, dan fallback sanitasi string. |
| **Over-reliance Admin (Rubber-Stamping)** | Sedang | Sedang | Menampilkan *XAI Reasoning Card* dan *Confidence Indicator* berwarna (Hijau $>85\%$, Kuning $70-84\%$, Merah $<70\%$) yang mewajibkan review manual jika keyakinan rendah. |
| **Downtime Layanan Cloud AI Eksternal** | Sedang | Rendah | Mekanisme *Graceful Degradation*: sistem beralih otomatis ke *Rule-Based Classification Fallback* lokal jika API LLM timeout. |

---

## 10. Kesimpulan & Penutup
**LaporPak!** bukan sekadar otomasi berbasis kecerdasan buatan, melainkan **fondasi transformasi tata kelola pengaduan publik yang akuntabel, aman, dan manusiawi**. 

Dengan memadukan ketangguhan **Arsitektur Hibrida**, kepatuhan **UU PDP & SPBE**, serta transparansi **Explainable AI (XAI)** berprinsip **Human-in-the-Loop**, LaporPak! siap menjadi terobosan GovTech dalam ajang **BISA AI National AI Agent Challenge 2026** untuk mengurai hambatan birokrasi dan melayani masyarakat Indonesia secara cepat, tepat, dan terpercaya.
