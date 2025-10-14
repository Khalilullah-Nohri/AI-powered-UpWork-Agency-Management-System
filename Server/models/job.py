# models/job.py
# Job model to store scraped UpWork job listings

from models import db
import datetime

class Job(db.Model):
    __tablename__ = 'jobs'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False, index=True)
    description = db.Column(db.Text, nullable=False)

    category = db.Column(db.String(100))
    is_feasible = db.Column(db.Boolean, default=None)  
    source = db.Column(db.String(50), default='UpWork')  
    post_time = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    status = db.Column(db.String(50), default='new', index=True)  
    budget = db.Column(db.String(50))  
    skills = db.Column(db.Text)        

    match_score = db.Column(db.Float, default=0.0)  

    proposal_text = db.Column(db.Text)

    # NOTE: Full-text indexes (title, description, skills) cannot be declared here.
    # You’ll add them via a custom Alembic migration.

    def __repr__(self):
        return f'<Job {self.title}>'
