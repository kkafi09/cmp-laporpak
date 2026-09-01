# LaporPak! Design System & Architecture Specification
## beUI-Inspired Motion Design & Monorepo Structure

---

| **Dokumen** | **Spesifikasi** |
| :--- | :--- |
| **Produk** | **LaporPak! — Agentic Intelligence Layer** |
| **Referensi UI/UX** | **beUI.dev** (Motion-Rich, shadcn-compatible, micro-interactions) |
| **Palet Warna** | Diekstrak langsung dari Brand Identity `LaporPak favicon.svg` & `LaporPak Main logo.svg` |
| **Arsitektur Repositori** | **Turborepo / NPM/PNPM Monorepo** (`apps/web`, `apps/api`, `packages/shared`) |
| **Versi Dokumen** | v1.0.0 |

---

## 1. Brand Identity & Color Palette (Berdasarkan Logo)

Berdasarkan aset resmi `LaporPak favicon.svg` dan `LaporPak Main logo.svg`, identitas visual LaporPak! memadukan warna merah kedaulatan Indonesia yang berani (*vibrant red*) dengan warna navy-slate birokrasi modern yang berwibawa (*deep slate navy*) serta sentuhan aksen maskot AI yang ramah (*friendly government copilot*).

```
+---------------------------------------------------------------------------------------------------+
|                                  LAPORPAK! CORE BRAND PALETTE                                     |
+---------------------------------------------------------------------------------------------------+
|  [ BRAND RED ]          [ SLATE NAVY ]         [ GOV BLUE ]         [ AI SPARKLE ]     [ CLEAN BG]|
|  #E5252A                #111827                #1E293B              #FF3B30            #F8FAFC    |
|  (Primary Action)       (Text / Sidebar)       (Card Dark/Border)   (AI Badge/Glow)    (Canvas)   |
+---------------------------------------------------------------------------------------------------+
```

### 1.1 Tabel Token Warna (Tailwind & CSS Variables)

```css
:root {
  /* Brand Primary (Logo Red & Accents) */
  --brand-primary: #E5252A;          /* Warna utama balon chat & kata "Pak!" */
  --brand-primary-hover: #C81E23;
  --brand-primary-light: #FEE2E2;
  --brand-primary-subtle: #FFF1F2;
  --brand-sparkle: #FF3838;          /* Bintang AI Sparkle di atas maskot */

  /* Dark Navy & Slate (Dari kata "Lapor" dan Subtitle) */
  --slate-navy-950: #0B0F19;         /* Ultra dark canvas untuk dark mode */
  --slate-navy-900: #111827;         /* Warna teks utama & sidebar solid */
  --slate-navy-800: #1E293B;         /* Surface card dark / Border tebal */
  --slate-navy-700: #334155;         /* Teks sekunder */
  --slate-navy-500: #5C6F84;         /* Subtitle "Government AI Assistant" */
  --slate-navy-400: #94A3B8;         /* Placeholder & Muted Icons */
  --slate-navy-100: #F1F5F9;         /* Card background soft */
  --slate-navy-50:  #F8FAFC;         /* Light Canvas Background */

  /* Semantic Urgency Matrix */
  --urgency-critical: #EF4444;       /* Merah Menyala - Bahaya Jiwa */
  --urgency-high:     #F97316;       /* Jingga - Dampak Luas */
  --urgency-medium:   #3B82F6;       /* Biru - Standar Operasional */
  --urgency-low:      #10B981;       /* Hijau - Informasi / Non-Darurat */

  /* Security & Trust Tokens */
  --shield-purple:    #8B5CF6;       /* PII Masking Shield */
  --shield-purple-bg: #F3E8FF;
  --spam-quarantine:  #6B7280;

  /* XAI Confidence Gauge */
  --confidence-high:  #059669;       /* > 85% Hijau Sukses */
  --confidence-mid:   #D97706;       /* 70-84% Kuning Peringatan */
  --confidence-low:   #DC2626;       /* < 70% Merah Wajib Review Manual */
}
```

---

## 2. UI/UX Design System ala beUI.dev

LaporPak! mengadopsi prinsip desain dari **[beUI.dev](https://beui.dev/)**:
1. **Motion-Rich Interface**: Interaksi mikro yang halus berbasis `framer-motion` (Motion) yang membuat aplikasi terasa responsif, hidup, dan modern.
2. **Glassmorphism & Crisp Borders**: Lapisan kartu semi-transparan dengan *subtle 1px border* (`border-slate-200 / border-slate-800`) dan *soft dynamic shadows*.
3. **Mascot Presence**: Maskot LaporPak! (balon chat putih ramah dengan bintang kilau merah) hadir sebagai representasi visual AI Agent yang aktif menganalisis tiket secara *real-time*.
4. **Copy-Paste & Hackable Component Architecture**: Komponen UI yang modular, kompatibel dengan ekosistem `shadcn/ui`, Tailwind CSS v3/v4, dan Lucide Icons.

### 2.1 Animasi & Micro-Interactions (beUI Standard)

```typescript
// Motion Configuration Standard (beUI Style)
export const beUITransitions = {
  springSmooth: { type: "spring", stiffness: 300, damping: 30 },
  springBouncy: { type: "spring", stiffness: 400, damping: 25 },
  fadeSlide: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] }
  },
  pulseGlow: {
    animate: {
      boxShadow: [
        "0 0 0 0 rgba(229, 37, 42, 0.4)",
        "0 0 0 10px rgba(229, 37, 42, 0)",
        "0 0 0 0 rgba(229, 37, 42, 0)"
      ]
    },
    transition: { duration: 2, repeat: Infinity }
  }
};
```

---

## 3. Komponen Utama Dashboard Admin Copilot

```
+-------------------------------------------------------------------------------------------------------------------------+
| [LOGO LAPORPAK!]  LaporPak! Copilot   [ Search Tiket / NIK / OPD... (⌘K) ]         [ Maskot AI: 🟢 Online ]  [ Admin ASN ] |
+-------------------------------------------------------------------------------------------------------------------------+
|  STATISTIK CEPAT                                                                                                        |
|  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐                     |
|  │ Total Aduan Aktif   │  │ Butuh Verifikasi    │  │ Potensi Duplikat    │  │ Peringatan SLA      │                     |
|  │ 1,428 Tiket (+12%)  │  │ 18 Tiket AI Ready   │  │ 42 Tiket Terklaster │  │ 3 Tiket Menuju Batas│                     |
|  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘                     |
+-------------------------------------------------------------------------------------------------------------------------+
|  DAFTAR TIKET ADUAN (Realtime Feed)        │  AI AGENT TRIAGE & VERIFICATION PANEL (Split View)                          |
|                                            │                                                                             |
|  [⚡ Filter: Semua | Kritis | Duplikat ]   │  ID Tiket: #LPK-20260820-0042  │ Status: 🟡 MENUNGGU PERSETUJUAN ASN        |
|  ┌───────────────────────────────────────┐ │ ─────────────────────────────────────────────────────────────────────────  |
|  │ 🔴 #LPK-0042 • HIGH (Lampu Mati)      │ │ 🛡️ SECURITY & PII MASKING (UU PDP No. 27/2022)                              |
|  │    Jl. Pemuda depan SMPN 1 • 2m lalu  │ │ [ Teks Asli (Terenkripsi) ] ⇄ [ Teks Tersensor AI (Masked) ] (Toggle)       |
|  │    Confidence: 94% -> DISHUB          │ │ ------------------------------------------------------------------------- |
|  ├───────────────────────────────────────┤ │ "Tolong pak lampu lalu lintas di perempatan lampu merah depan SMPN 1       |
|  │ 🟠 #LPK-0041 • MEDIUM (Jalan Rusak)   │ │  Jl. Pemuda padam... Pelapor: [TERMASKING: NIK] / [TERMASKING: NO_TELP]"   |
|  │    Jl. Sudirman No 12 • 15m lalu      │ │ ─────────────────────────────────────────────────────────────────────────  |
|  ├───────────────────────────────────────┤ │ 🧬 SEMANTIC DEDUPLICATION ENGINE                                           |
|  │ 🟣 #LPK-0040 • DUPLIKAT (Jalan Rusak) │ │ ⚠️ Terdeteksi 3 laporan serupa (Kemiripan 89%). [ Tautkan ke Tiket Induk ] |
|  │    Terkait #LPK-0038 • 25m lalu       │ │ ─────────────────────────────────────────────────────────────────────────  |
|  └───────────────────────────────────────┘ │ 🧭 EXPLAINABLE SMART ROUTING (XAI)                                         |
|                                            │ Rekomendasi: 🏢 DINAS PERHUBUNGAN KOTA BOGOR                              |
|                                            │ Keyakinan: [ ████████████████░░ ] 94% (High Confidence)                     |
|                                            │ 💡 Alasan: Kewenangan pemeliharaan APILL di jalan perkotaan.                |
|                                            │ ─────────────────────────────────────────────────────────────────────────  |
|                                            │ ✍️ RESPONSE COPILOT (Draf Resmi Siap Kirim)                                 |
|                                            │ ┌────────────────────────────────────────────────────────────────────────┐ │
|                                            │ │ "Yth. Warga Pelapor, laporan mengenai lampu lalu lintas padam di depan │ │
|                                            │ │  SMPN 1 Jl. Pemuda telah diteruskan ke Dinas Perhubungan..."           │ │
|                                            │ └────────────────────────────────────────────────────────────────────────┘ │
|                                            │ [ ✨ Buat Ulang Draf ]   [ 📝 Edit Manual ]                                |
|                                            │ ─────────────────────────────────────────────────────────────────────────  |
|                                            │ 🎯 KEPUTUSAN AKHIR ASN (Human-in-the-Loop):                                 |
|                                            │ [  SETUJUI & DISPOSISIKAN (Enter) ]  [ 🔄 UBAH OPD ]  [ 🚫 TOLAK/SPAM ]    |
+-------------------------------------------------------------------------------------------------------------------------+
```

---

## 4. Struktur Monorepo (Monorepo Architecture)

Untuk mendukung skalabilitas, modularitas, dan pemisahan yang bersih antara frontend modern, backend intelligence agentik, serta shared libraries, LaporPak! disusun dalam format **Monorepo**.

```
laporpak/
├── package.json                   # Root workspace manifest (pnpm / npm workspaces)
├── pnpm-workspace.yaml            # Konfigurasi workspace
├── turbo.json                     # Turborepo build & dev pipeline configuration
├── README.md                      # Dokumentasi komprehensif monorepo
├── PRD.md                         # Product Requirements Document
├── DESIGN.md                      # Design System & UI Architecture (Dokumen Ini)
│
├── apps/
│   ├── web/                       # [FRONTEND] Admin Copilot Dashboard
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   ├── tailwind.config.js     # Tailwind setup dengan Brand Palette LaporPak
│   │   ├── index.html
│   │   └── src/
│   │       ├── assets/            # Logo & Mascot SVGs/Images
│   │       ├── components/        # Komponen beUI / shadcn Style
│   │       │   ├── ui/            # Buttons, Badges, Modals, Sliders, Cards
│   │       │   ├── motion/        # beUI Animated Wrappers & Glow Effects
│   │       │   ├── layout/        # Navbar, Sidebar, SplitView Frame
│   │       │   ├── triage/        # TriageCard, UrgencyBadge, PIIToggle
│   │       │   ├── routing/       # XAIRoutingCard, ConfidenceGauge
│   │       │   ├── response/      # ResponseCopilotEditor, ToneSelector
│   │       │   └── sla/           # SLACountdownBar, EscalationBanner
│   │       ├── hooks/             # Custom React Hooks (useTickets, useAgentState)
│   │       ├── services/          # API Client (Axios / Fetch ke apps/api)
│   │       ├── types/             # Frontend Types & View Models
│   │       └── App.tsx
│   │
│   └── api/                       # [BACKEND] Agentic Intelligence Layer (Python FastAPI)
│       ├── pyproject.toml / reqs  # Poetry / pip requirements
│       ├── main.py                # FastAPI Entrypoint
│       └── app/
│           ├── core/              # Config, Security, Environment (Gemini API Key)
│           ├── agents/            # Modul Agentic AI
│           │   ├── pii_shield.py      # Regex + Local SpaCy NER PII Masker
│           │   ├── spam_filter.py     # Spam/Bot Detector
│           │   ├── deduplication.py   # Vector Similarity & Incident Clustering
│           │   ├── triage_agent.py    # Urgency & Entity Extraction (Gemini)
│           │   ├── routing_agent.py   # XAI Smart Routing & Reasoning (Gemini)
│           │   ├── response_agent.py  # Response Copilot Draf Generator
│           │   └── sla_monitor.py     # SLA Tracker & Escalation Logic
│           ├── db/                # PostgreSQL Models & Vector DB Connectors
│           ├── api/v1/            # API Endpoints (/complaints, /triage, /actions)
│           └── schemas/           # Pydantic Ingestion & Output Contracts
│
└── packages/
    ├── shared/                    # Shared Types, Enums & Constants
    │   ├── package.json
    │   ├── src/
    │   │   ├── constants.ts       # OPD Definitions, Urgency Enums, SLA Targets
    │   │   └── types.ts           # Kontrak data lintas frontend/backend
    │   └── tsconfig.json
    │
    └── config/                    # Shared ESLint, Prettier, Tailwind Configs
        ├── eslint-preset.js
        └── tailwind-preset.js
```

---

## 5. Rencana Eksekusi Skrip Monorepo

| Skrip | Perintah | Deskripsi |
| :--- | :--- | :--- |
| `dev` | `npm run dev` / `pnpm dev` | Menjalankan frontend (`apps/web` di port `5173`) dan backend (`apps/api` di port `8000`) secara bersamaan. |
| `build` | `npm run build` | Mengompilasi seluruh aplikasi untuk produksi. |
| `lint` | `npm run lint` | Menjalankan linter di semua workspace. |

---

## 6. Checklist Implementasi UI Komponen (beUI Style)

- [x] **Brand Color Tokens**: Variabel CSS Merah `#E5252A`, Navy `#111827`, Sparkle `#FF3838`, & Slate `#1E293B`.
- [ ] **Mascot Header Element**: Komponen Avatar maskot interaktif yang bereaksi terhadap status AI (*Idle, Thinking, Verified*).
- [ ] **Animated Triage Queue**: List tiket dengan transisi `framer-motion` saat difilter atau disetujui.
- [ ] **PII Shield Masking View**: Transisi mulus antara mode teks tersensor dan teks asli dengan badge UU PDP.
- [ ] **Deduplication Cluster Card**: Visualisasi hubungan antar tiket duplikat dengan skor cosine similarity.
- [ ] **Explainable AI Routing Card**: Visualisasi *Gauge Confidence Score* (%) interaktif dan kotak penalaran logis dinas.
- [ ] **Response Copilot Studio**: Editor teks draf respons dengan tombol *copy*, *regenerate*, dan *one-click approval*.
- [ ] **Live SLA Countdown Bar**: Indikator warna dinamis (*Hijau -> Kuning -> Merah*) yang menghitung sisa waktu penanganan.
