# models/task.py
# Defines the Task model for Task Assignment & Workflow

from models import db
from datetime import datetime

class Task(db.Model):
    __tablename__ = 'tasks'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)

    # Link to scraped job
    job_id = db.Column(
        db.Integer,
        db.ForeignKey('jobs.id', ondelete="SET NULL"),
        index=True
    )
    job = db.relationship('Job', backref='tasks')

    # Who this task is assigned to
    assigned_to = db.Column(
        db.Integer,
        db.ForeignKey('users.id', ondelete="SET NULL"),
        index=True
    )
    assignee = db.relationship('User', backref='tasks')

    # Task status & priority with indexes
    status = db.Column(db.String(50), default="To Do", index=True)
    priority = db.Column(db.String(20), default="Medium", index=True)

    deadline = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Task {self.title} - Status: {self.status}>"
