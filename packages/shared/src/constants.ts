export const OPD_LIST = [
  {
    id: 'OPD-DISHUB',
    name: 'Dinas Perhubungan',
    code: 'DISHUB',
    jurisdiction: 'KOTA_KABUPATEN',
    scope: ['Lampu Lalu Lintas / APILL', 'Rambu Jalan', 'Marka Jalan', 'Angkutan Kota', 'Terminal', 'Kemacetan Lalu Lintas', 'Parkir Liar']
  },
  {
    id: 'OPD-PUPR-BINAMARGA',
    name: 'Dinas Pekerjaan Umum & Penataan Ruang (Bina Marga)',
    code: 'PUPR_BINAMARGA',
    jurisdiction: 'KOTA_KABUPATEN',
    scope: ['Jalan Berlubang / Rusak', 'Jembatan Rusak', 'Trotoar Amblas', 'Drainase / Saluran Air Tersumbat', 'Banjir Genangan']
  },
  {
    id: 'OPD-DLH',
    name: 'Dinas Lingkungan Hidup',
    code: 'DLH',
    jurisdiction: 'KOTA_KABUPATEN',
    scope: ['Tumpukan Sampah Liar', 'Pencemaran Limbah', 'Pohon Tumbang / Rawan Roboh', 'Polusi Bau', 'Kebersihan Taman Kota']
  },
  {
    id: 'OPD-DINKES',
    name: 'Dinas Kesehatan',
    code: 'DINKES',
    jurisdiction: 'KOTA_KABUPATEN',
    scope: ['Pelayanan Puskesmas', 'RSUD', 'Wabah Penyakit / DBD', 'Antrean BPJS Kesehatan', 'Kelayakan Obat & Makanan']
  },
  {
    id: 'OPD-DISDUKCAPIL',
    name: 'Dinas Kependudukan & Pencatatan Sipil',
    code: 'DISDUKCAPIL',
    jurisdiction: 'KOTA_KABUPATEN',
    scope: ['KTP Elektronik', 'Kartu Keluarga', 'Akta Kelahiran', 'Pungli Administrasi Kependudukan', 'Antrean Layanan Kependudukan']
  },
  {
    id: 'OPD-SATPOLPP',
    name: 'Satuan Polisi Pamong Praja',
    code: 'SATPOLPP',
    jurisdiction: 'KOTA_KABUPATEN',
    scope: ['Ketertiban Umum', 'Penertiban PKL Ilegal', 'Kebisingan Malam Hari', 'Pelanggaran Perda', 'Pengemis / PMKS']
  },
  {
    id: 'OPD-DISDIK',
    name: 'Dinas Pendidikan',
    code: 'DISDIK',
    jurisdiction: 'KOTA_KABUPATEN',
    scope: ['Gedung Sekolah Rusak', 'Pungutan Liar Sekolah', 'Zonasi PPDB', 'Kekerasan / Bullying di Sekolah']
  },
  {
    id: 'BBPJN-KEMENPUPR',
    name: 'Balai Besar Pelaksanaan Jalan Nasional (Kementerian PUPR)',
    code: 'BBPJN_KEMENPUPR',
    jurisdiction: 'NASIONAL_KEMENTERIAN',
    scope: ['Jalan Nasional', 'Jembatan Nasional / Flyover Antar Kota', 'Jalan Tol']
  }
] as const;

export const BRAND_COLORS = {
  primary: '#E5252A',
  primaryHover: '#C81E23',
  primaryLight: '#FEE2E2',
  sparkle: '#FF3838',
  slateNavy950: '#0B0F19',
  slateNavy900: '#111827',
  slateNavy800: '#1E293B',
  slateNavy500: '#5C6F84',
  canvasBg: '#F8FAFC'
} as const;

export const URGENCY_CONFIG = {
  CRITICAL: {
    label: 'Kritis',
    color: '#EF4444',
    bg: '#FEF2F2',
    border: '#FCA5A5',
    slaHours: 2
  },
  HIGH: {
    label: 'Tinggi',
    color: '#F97316',
    bg: '#FFF7ED',
    border: '#FDBA74',
    slaHours: 12
  },
  MEDIUM: {
    label: 'Sedang',
    color: '#3B82F6',
    bg: '#EFF6FF',
    border: '#93C5FD',
    slaHours: 48
  },
  LOW: {
    label: 'Rendah',
    color: '#10B981',
    bg: '#ECFDF5',
    border: '#6EE7B7',
    slaHours: 120
  }
} as const;
