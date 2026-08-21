import re
from typing import Tuple

class SpamFilterAgent:
    """
    Spam, bot, and illicit advertising classifier for incoming public complaints.
    """
    SPAM_PATTERNS = [
        re.compile(r'\b(slot|gacor|judol|judi|casino|sbobet|pragmatic|maxwin)\b', re.IGNORECASE),
        re.compile(r'\b(pinjol|dana kilat|bunga 0%|cair cepat|pinjaman online tanpa jaminan)\b', re.IGNORECASE),
        re.compile(r'\b(obat kuat|pembesar|viagra|dewasa 18\+)\b', re.IGNORECASE),
        re.compile(r'https?://(?:bit\.ly|t\.co|tinyurl|wa\.me|chat\.whatsapp)/[^\s]+', re.IGNORECASE)
    ]
    
    def classify(self, text: str) -> Tuple[bool, float, str]:
        for pattern in self.SPAM_PATTERNS:
            if pattern.search(text):
                return True, 0.98, "Terdeteksi pola promosi komersial terlarang / link spam / bot iklan."
                
        # Check excessive caps or gibberish
        if len(text) > 30 and sum(1 for c in text if c.isupper()) / len(text) > 0.75:
            return True, 0.85, "Terdeteksi teks huruf kapital dominan tidak beraturan (noise/abuse)."
            
        return False, 0.02, ""
