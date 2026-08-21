from typing import List, Dict, Any, Tuple, Optional
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class SemanticDeduplicationAgent:
    """
    Semantic Deduplication Engine using TF-IDF Vector Space & Cosine Similarity
    to cluster related citizen complaints.
    """
    
    def __init__(self, similarity_threshold: float = 0.65):
        self.threshold = similarity_threshold

    def find_duplicate(
        self, new_text: str, existing_complaints: List[Dict[str, Any]]
    ) -> Tuple[bool, float, Optional[str], Optional[str]]:
        if not existing_complaints or not new_text.strip():
            return False, 0.0, None, None

        corpus = [c["masked_content"] for c in existing_complaints]
        all_texts = corpus + [new_text]

        try:
            vectorizer = TfidfVectorizer(ngram_range=(1, 2), min_df=1)
            tfidf_matrix = vectorizer.fit_transform(all_texts)
            
            # Compare the last vector (new_text) against all previous
            cosine_sims = cosine_similarity(tfidf_matrix[-1], tfidf_matrix[:-1])[0]
            
            best_idx = int(cosine_sims.argmax())
            best_score = float(cosine_sims[best_idx])

            if best_score >= self.threshold:
                parent = existing_complaints[best_idx]
                parent_id = parent["id"]
                cluster_name = parent.get("cluster_incident_name") or f"Aduan Serupa: {parent.get('category', 'Insiden Fasilitas')}"
                return True, round(best_score, 2), parent_id, cluster_name

            return False, round(best_score, 2), None, None
        except Exception:
            return False, 0.0, None, None
