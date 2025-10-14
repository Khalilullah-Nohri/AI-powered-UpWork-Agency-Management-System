# utils/resume_matcher.py
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# Load ONCE globally
model = SentenceTransformer('all-MiniLM-L6-v2')

# def calculate_match_score(job_text: str, resume_text: str) -> float:
#     """
#     Compares job text with resume text using embeddings and cosine similarity.
#     """
#     if not job_text.strip() or not resume_text.strip():
#         return 0.0

#     job_vec = model.encode(job_text)
#     resume_vec = model.encode(resume_text)

#     score = cosine_similarity([resume_vec], [job_vec])[0][0]
#     return round(float(score), 4)

def calculate_match_score(job_text: str, resume_text: str) -> tuple:
    """
    Compares job text with resume text using embeddings and cosine similarity.
    Returns: (score: float, is_feasible: bool)
    """
    if not job_text.strip() or not resume_text.strip():
        return 0.0, False

    job_vec = model.encode(job_text)
    resume_vec = model.encode(resume_text)

    score = cosine_similarity([resume_vec], [job_vec])[0][0]
    match_score = round(float(score) * 100, 2)
    is_feasible = match_score >= 30  # for example
    return match_score, is_feasible

