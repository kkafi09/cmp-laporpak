# LaporPak! - Agentic Intelligence Layer for Public Complaint Management

LaporPak! adalah **Agentic Intelligence Layer** berbasis **Arsitektur Hibrida (*Hybrid Architecture*)** yang bertindak sebagai *Copilot / Asisten Virtual Admin* di belakang layar sistem pengaduan nasional (seperti **SP4N-LAPOR!**).

Sistem ini merampingkan rantai birokrasi verifikasi awal, sensor PII (UU PDP No. 27/2022), deteksi duplikasi semantik, rekomendasi rute instansi cerdas (Explainable AI / XAI), serta draf respons otomatis dengan kendali penuh **Human-in-the-Loop (HITL)** oleh ASN.

---

## 🎨 Antarmuka & Visual Identity (beUI.dev Style)

1. **Portal Publik Warga (`/`)**: Meniru antarmuka resmi SP4N-LAPOR! (`prod.lapor.go.id`) dengan tab Pengaduan/Aspirasi/Permintaan Informasi, pelacakan tiket aduan (`/lacak`), statistik nasional, dan feed publik terproteksi.
2. **Sistem Autentikasi (`/login`, `/register`)**: Login berbasis Username/Password & NIK dengan role switcher (Warga vs Admin ASN).
3. **Admin Panel Copilot (`/admin`)**: Dashboard terstruktur menggunakan **TanStack Router** untuk verifikasi triage HITL, manajemen OPD, analitik SLA, dan konfigurasi guardrails.

---

## 📦 Struktur Monorepo

```
laporpak/
├── apps/
│   ├── web/               # [Frontend] React 18 + TanStack Router + Tailwind + Framer Motion
│   └── api/               # [Backend] Python FastAPI + SQLAlchemy + Alembic + Gemini AI
│       ├── alembic/       # Migrasi Database (Alembic Versioning)
│       └── app/           # Agent Modules (PII Shield, Spam, Dedup, Triage, Routing, Response)
├── packages/
│   └── shared/            # [Shared] TypeScript Types & Constants
├── docker-volume/         # Volume persisten lokal untuk PostgreSQL & Logs
├── docker-compose.yml     # Konfigurasi container (PostgreSQL port 5435, API, Web)
├── PRD.md                 # Product Requirements Document
├── DESIGN.md              # Design System & UI Architecture
└── README.md
```

---

## 🗄️ Manajemen Database & Migrasi (Alembic)

LaporPak! menggunakan **Alembic** untuk version control skema database relasional (kompatibel dengan SQLite dan PostgreSQL 16 + pgvector).

### Perintah Migrasi (Root Monorepo / PNPM):

```bash
# 1. Menjalankan migrasi database ke versi terbaru
pnpm db:migrate

# 2. Membuat file revisi migrasi baru secara otomatis
pnpm db:revision -m "tambah_kolom_baru"

# 3. Rollback migrasi terakhir
pnpm db:rollback

# 4. Inisialisasi & Seeding data awal
pnpm db:seed
```

*Catatan: Saat menggunakan Docker Compose, migrasi `alembic upgrade head` akan dieksekusi secara otomatis saat container backend (`api`) dinyalakan.*

---

## 🚀 Panduan Menjalankan Project

### Opsi 1: Menjalankan via Docker Compose (Recommended)
```bash
docker compose up --build -d
```
- **Portal Warga & Admin**: `http://localhost:5173`
- **Backend API & Swagger Docs**: `http://localhost:8000/docs`
- **PostgreSQL Port**: `5435` *(Volume di `./docker-volume/postgres_data`)*

### Opsi 2: Menjalankan Lokal Dev (PNPM)

```bash
# 1. Install dependensi monorepo
pnpm install

# 2. Menjalankan Frontend Web
pnpm dev:web

# 3. Menjalankan Backend API
pnpm dev:api
```
