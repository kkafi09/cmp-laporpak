import re
from typing import Tuple

class SpamFilterAgent:
    """
    Spam, bot, and illicit advertising classifier for incoming public complaints.
    Equipped with multi-layer Anti-Evasion (Leetspeak decoding, separator stripping, character collapse).
    """

    # Kamus substitusi angka / simbol ke huruf (Anti-Leetspeak)
    LEET_MAP = {
        '0': 'o',
        '1': 'i',
        '!': 'i',
        '|': 'i',
        '3': 'e',
        '4': 'a',
        '@': 'a',
        '5': 's',
        '$': 's',
        '7': 't',
        '+': 't',
        '8': 'b',
        '9': 'g',
    }

    # Kata kunci spam inti untuk pencocokan stripped
    CORE_SPAM_WORDS = [
        "slot", "gacor", "judol", "judi", "casino", "sbobet", "pragmatic", "maxwin",
        "joker", "togel", "poker", "jackpot", "zeus", "olympus", "depo", "wd",
        "scatter", "rollingan", "freebet", "rtp", "bandar", "taruhan", "mahjong",
        "pgsoft", "habanero", "sensational", "jackpot88", "slot88", "joker888",
        "pinjol", "danakilat", "caircepat", "tanpajaminan",
        "obatkuat", "pembesar", "viagra", "dewasa18", "openbo", "vcs"
    ]

    SPAM_PATTERNS = [
        re.compile(r'\b(slot|gacor|judol|judi|casino|sbobet|pragmatic|maxwin|joker|togel|poker|jackpot|zeus|olympus|depo|wd|scatter|rollingan|freebet|rtp|bandar|taruhan|mahjong|pgsoft)\b', re.IGNORECASE),
        re.compile(r'\b(pinjol|dana kilat|bunga 0%|cair cepat|pinjaman online tanpa jaminan)\b', re.IGNORECASE),
        re.compile(r'\b(obat kuat|pembesar|viagra|dewasa 18\+|open bo|vcs)\b', re.IGNORECASE),
        re.compile(r'(modal\s+\d+.*jadi\s+\d+|pasti\s+(untung|menang|cuan|jp)|garansi\s+jp|ayo+\s+main\s+di|bonus\s+new\s+member|daftar\s+sekarang|klik\s+link)', re.IGNORECASE),
        re.compile(r'https?://(?:bit\.ly|t\.co|tinyurl|wa\.me|chat\.whatsapp|t\.me|linktr\.ee)/[^\s]+', re.IGNORECASE),
        re.compile(r'(wa|whatsapp|hubungi|kontak)\s*[:\-]?\s*(?:08|\+62)\d{2}[\s\.\-]?\d{3,4}[\s\.\-]?\d{3,4}', re.IGNORECASE),
        re.compile(r'(?:wa|bit|linktr|t)\s*\(dot\)\s*(?:me|ly|ee)', re.IGNORECASE)
    ]

    def _normalize_leetspeak(self, text: str) -> str:
        """Mengonversi kombinasi angka/simbol (5l0t, j0k3r, g4c0r) menjadi huruf biasa."""
        text_lower = text.lower()
        normalized_chars = [self.LEET_MAP.get(c, c) for c in text_lower]
        normalized = "".join(normalized_chars)
        # Runtuhkan pengulangan huruf (slooooot -> slot, gacooor -> gacor)
        collapsed = re.sub(r'([a-z])\1{2,}', r'\1', normalized)
        return collapsed

    def _strip_separators(self, text: str) -> str:
        """Menghapus pemisah/spasi antar karakter (s.l.o.t, s-l-o-t, s l o t -> slot)."""
        return re.sub(r'[^a-zA-Z0-9]', '', text).lower()

    def classify(self, text: str) -> Tuple[bool, float, str]:
        # Layer 1: Cek teks asli
        for pattern in self.SPAM_PATTERNS:
            if pattern.search(text):
                return True, 0.99, "Terdeteksi pola promosi komersial terlarang / link spam / bot iklan."

        # Layer 2: Anti-Leetspeak (contoh: 5l0t, j0k3r, m4xw1n, p1nj0l, jud1)
        leet_normalized = self._normalize_leetspeak(text)
        for pattern in self.SPAM_PATTERNS:
            if pattern.search(leet_normalized):
                return True, 0.98, "Terdeteksi pola spam terselubung menggunakan kombinasi angka/simbol (Anti-Leetspeak)."

        # Layer 3: Anti-Punctuation Separator (contoh: s.l.o.t, s-l-o-t, s l o t, j.o.k.e.r, 5.l.0.t)
        clean_stripped = self._strip_separators(leet_normalized)
        for keyword in self.CORE_SPAM_WORDS:
            if keyword in clean_stripped:
                return True, 0.98, f"Terdeteksi kata kunci spam terfragmentasi/disamarkan ('{keyword}')."

        # Layer 4: Heuristik huruf kapital berlebihan
        if len(text) > 30 and sum(1 for c in text if c.isupper()) / len(text) > 0.75:
            return True, 0.85, "Terdeteksi teks huruf kapital dominan tidak beraturan (noise/abuse)."

        return False, 0.02, ""
