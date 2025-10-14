# routes/match_routes.py
from flask import Blueprint, request, jsonify
from models.job import Job
from utils.resume_matcher import calculate_match_score
# from routes.auth_routes import admin_required  
from utils.auth_wrappers import admin_required # reuse your token validator

match_bp = Blueprint('matcher', __name__, url_prefix='/api/jobs')

@match_bp.route('/match', methods=['POST'])
@admin_required
def match_jobs(current_user):
    """
    Receives resume text, calculates match scores against all jobs,
    and returns sorted job list.
    """
    data = request.get_json()
    resume_text = data.get('resume_text')

    if not resume_text:
        return jsonify({'error': 'Resume text is required'}), 400

    all_jobs = Job.query.all()
    matched_jobs = []

    for job in all_jobs:
        job_text = f"{job.title} {job.description}"
        score = calculate_match_score(job_text, resume_text)

        matched_jobs.append({
            'id': job.id,
            'title': job.title,
            'description': job.description,
            'category': job.category,
            'match_score': score
        })

    # Sort jobs by score descending
    matched_jobs.sort(key=lambda x: x['match_score'], reverse=True)

    return jsonify(matched_jobs), 200
