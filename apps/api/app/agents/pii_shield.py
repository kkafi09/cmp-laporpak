import re
from typing import Dict, List, Tuple

class PIIShieldAgent:
    """
    Deterministic PII Masking Engine complying with UU PDP No. 27/2022.
    Strips citizen sensitive data locally before payload is processed by Generative LLMs.
    """
    
    # Regex patterns for Indonesian PII
    NIK_PATTERN = re.compile(r'\b[1-9][0-9]{15}\b')  # 16-digit NIK
    PHONE_PATTERN = re.compile(r'(\+62|62|08)[0-9]{8,12}\b') # Indo Phone numbers
    EMAIL_PATTERN = re.compile(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+')
    
    def mask_text(self, text: str) -> Tuple[str, List[str]]:
        detected_types: List[str] = []
        masked_text = text
        
        if self.NIK_PATTERN.search(masked_text):
            detected_types.append("NIK_16_DIGIT")
            masked_text = self.NIK_PATTERN.sub("[TERMASKING: NIK]", masked_text)
            
        if self.PHONE_PATTERN.search(masked_text):
            detected_types.append("PHONE_NUMBER")
            masked_text = self.PHONE_PATTERN.sub("[TERMASKING: NO_TELP]", masked_text)
            
        if self.EMAIL_PATTERN.search(masked_text):
            detected_types.append("EMAIL_ADDRESS")
            masked_text = self.EMAIL_PATTERN.sub("[TERMASKING: EMAIL]", masked_text)
            
        return masked_text, detected_types
