from typing import Dict, Any
from sqlalchemy.orm import Session
from app.db.models import OPD

class SmartRoutingAgent:
    """Routes using the active OPD knowledge stored in the database."""

    def route(self, category: str, raw_text: str, db: Session) -> Dict[str, Any]:
        text = f"{category} {raw_text}".lower()
        candidates = []
        for opd in db.query(OPD).filter(OPD.is_active == True).all():
            matches = [scope for scope in (opd.scope or []) if any(token in text for token in scope.lower().split(" / ")) or scope.lower() in text]
            if matches:
                score = min(0.99, 0.55 + (0.08 * len(matches)))
                candidates.append((score, opd, matches))
        candidates.sort(key=lambda item: item[0], reverse=True)
        if not candidates:
            return {"recommended_department": None, "alternative_departments": []}
        score, opd, matches = candidates[0]
        recommended = {"department_id": opd.id, "department_name": opd.name, "confidence_score": score, "reasoning": f"Rule knowledge base mencocokkan: {', '.join(matches)}.", "jurisdiction_level": opd.jurisdiction}
        alternatives = [{"department_id": other.id, "department_name": other.name, "confidence_score": other_score, "reasoning": f"Kecocokan alternatif pada: {', '.join(other_matches)}.", "jurisdiction_level": other.jurisdiction} for other_score, other, other_matches in candidates[1:3]]
        return {"recommended_department": recommended, "alternative_departments": alternatives}
