from typing import Dict, Any
from sqlalchemy.orm import Session
from app.db.models import OPD

class SmartRoutingAgent:
    """Routes using the active OPD knowledge stored in the database."""

    def route(self, category: str, raw_text: str, db: Session) -> Dict[str, Any]:
        text = f"{category} {raw_text}".lower()
        candidates = []
        for opd in db.query(OPD).filter(OPD.is_active == True).all():
            matches = []
            for scope in (opd.scope or []):
                scope_lower = scope.lower()
                tokens = [t.strip() for t in scope_lower.replace(" / ", "/").split("/") if t.strip()]
                if scope_lower in text or any(token in text for token in tokens):
                    matches.append(scope)

            # Cek jika nama atau singkatan dinas disebut langsung oleh pelapor
            explicit_mention = (opd.code.lower() in text) or (opd.name.lower() in text)
            if explicit_mention and not matches:
                matches.append(f"Identifikasi instansi tujuan ({opd.name})")

            if matches or explicit_mention:
                # Base score dinaikkan dari 0.55 menjadi 0.82 (82%)
                base_score = 0.88 if explicit_mention else 0.82
                score = min(0.99, round(base_score + (0.05 * len(matches)), 2))
                candidates.append((score, opd, matches))

        candidates.sort(key=lambda item: item[0], reverse=True)
        if not candidates:
            return {"recommended_department": None, "alternative_departments": []}

        score, opd, matches = candidates[0]
        recommended = {
            "department_id": opd.id,
            "department_name": opd.name,
            "confidence_score": score,
            "reasoning": f"Rule knowledge base mencocokkan: {', '.join(matches)}.",
            "jurisdiction_level": opd.jurisdiction
        }
        alternatives = [
            {
                "department_id": other.id,
                "department_name": other.name,
                "confidence_score": other_score,
                "reasoning": f"Kecocokan alternatif pada: {', '.join(other_matches)}.",
                "jurisdiction_level": other.jurisdiction
            }
            for other_score, other, other_matches in candidates[1:3]
        ]
        return {"recommended_department": recommended, "alternative_departments": alternatives}
