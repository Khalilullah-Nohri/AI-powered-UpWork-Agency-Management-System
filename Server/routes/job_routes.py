# routes/job_routes.py
# Route to trigger scraping via POST

from flask import Blueprint, jsonify, request
from utils.scraper import scrape_upwork_jobs
from models.user import User
from models.job import Job
import jwt
from functools import wraps
from flask import current_app
from utils.gemini_helper import generate_bid_proposal
from models import db
from utils.auth_wrappers import admin_required,admin_or_manager_required   # Helper: Admin role checker using JWT token
from utils.mail_utils import send_job_summary_email
import os
import tempfile
import pdfplumber
from utils.resume_matcher import calculate_match_score

job_bp = Blueprint('job', __name__, url_prefix='/api/jobs')


# Route: POST /api/jobs/scrape
@job_bp.route('/scrape', methods=['POST','OPTIONS'], strict_slashes=False)
@admin_required
def scrape_jobs(current_user):
    scrape_upwork_jobs()
    return jsonify({'message': 'Job scraping complete'}), 200

# Route: GET /api/jobs with optional filters
@job_bp.route('/', methods=['GET', 'OPTIONS'], strict_slashes=False)
@admin_or_manager_required
def get_jobs(current_user):
    query = Job.query

    # Filters
    feasible_param = request.args.get('feasible')
    if feasible_param == 'true':
        query = query.filter_by(is_feasible=True)
    elif feasible_param == 'false':
        query = query.filter_by(is_feasible=False)

    min_score = request.args.get('min_score')
    if min_score and min_score.isdigit():
        query = query.filter(Job.match_score >= int(min_score))

    skill = request.args.get('skills')
    if skill:
        query = query.filter(Job.skills.ilike(f"%{skill}%"))

    budget_type = request.args.get('budget_type')
    if budget_type:
        query = query.filter(Job.budget.ilike(f"%{budget_type}%"))

    # Pagination
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 10))
    total_jobs = query.count()

    jobs = (
        query.order_by(Job.id.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    job_list = [
        {
            "id": job.id,
            "title": job.title,
            "description": job.description,
            "category": job.category,
            "budget": job.budget,
            "skills": job.skills,
            "is_feasible": job.is_feasible,
            "match_score": job.match_score,
        }
        for job in jobs
    ]

    return jsonify({
        'jobs': job_list,
        'total': total_jobs,
        'page': page,
        'limit': limit
    }), 200


@job_bp.route('/upload_resume', methods=['POST'], strict_slashes=False)
@admin_required
def upload_resume(current_user):
    if 'resume' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    resume_file = request.files['resume']
    if resume_file.filename == '':
        return jsonify({'error': 'Empty filename'}), 400

    if not resume_file.filename.endswith('.pdf'):
        return jsonify({'error': 'Only PDF files allowed'}), 400

    # Save temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp:
        resume_file.save(tmp.name)

    # Extract text from PDF
    try:
        text = ''
        with pdfplumber.open(tmp.name) as pdf:
            for page in pdf.pages:
                text += page.extract_text() + '\n'
    except Exception as e:
        return jsonify({'error': 'Failed to read PDF'}), 500
    finally:
        os.remove(tmp.name)

    # Use extracted text for match scoring or saving
    # Example return — send extracted content back (or save in DB)
    return jsonify({'message': 'Resume uploaded successfully', 'content': text}), 200

@job_bp.route('/<int:job_id>/generate-proposal', methods=['POST','Options'],strict_slashes=False)
@admin_required
def generate_proposal(current_user, job_id):
    job = Job.query.get(job_id)
    if not job:
        # return jsonify({'error': 'Job not found'}), 404
        return jsonify([]), 200


    if not job.is_feasible or job.match_score < 40:
        return jsonify({'error': 'Job is not feasible for bidding'}), 400

    # You must pass resume text in POST body
    data = request.get_json()
    resume_text = data.get('resume')

    if not resume_text:
        return jsonify({'error': 'Resume text is required'}), 400

    # Call Gemini and generate proposal
    try:
        proposal = generate_bid_proposal(job.description, resume_text)
        job.proposal_text = proposal
        db.session.commit()
        return jsonify({'message': 'Proposal generated successfully', 'proposal': proposal}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route: POST /api/jobs/<id>/send-email
@job_bp.route('/<int:job_id>/send-email', methods=['POST'])
@admin_required
def email_job_summary(current_user, job_id):
    job = Job.query.get(job_id)

    if not job:
        return jsonify({"error": "Job not found"}), 404

    if not job.proposal_text:
        return jsonify({"error": "No proposal found for this job"}), 400

    # Email content
    subject = f"📝 Proposal for Job: {job.title}"
    body = f"""
Job Title: {job.title}
Description: {job.description}
Category: {job.category}
Budget: {job.budget}
Skills: {job.skills}
Feasibility: {"Yes" if job.is_feasible else "No"}
Match Score: {job.match_score}%

--- PROPOSAL ---
{job.proposal_text}

This email was auto-generated by UpWork Agency System.
    """.strip()

    admin_email = os.getenv("EMAIL_USERNAME")
    success = send_job_summary_email(to_email=admin_email, subject=subject, body=body)

    if success:
        return jsonify({"message": f"Proposal sent to {admin_email}"}), 200
    else:
        return jsonify({"error": "Failed to send email"}), 500

# 2. --- Add Evaluation Endpoint ---
@job_bp.route('/<int:job_id>/evaluate', methods=['POST', 'OPTIONS'], strict_slashes=False)
@admin_required
def evaluate_job(current_user, job_id):
    job = Job.query.get(job_id)
    if not job:
        return jsonify({'error': 'Job not found'}), 404

    data = request.get_json()
    resume_text = data.get('resume')
    if not resume_text:
        return jsonify({'error': 'Resume text is required'}), 400

    try:
        match_score, is_feasible = calculate_match_score(job.description, resume_text)
        job.match_score = match_score
        job.is_feasible = is_feasible
        db.session.commit()

        return jsonify({
            'match_score': match_score,
            'is_feasible': is_feasible
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500