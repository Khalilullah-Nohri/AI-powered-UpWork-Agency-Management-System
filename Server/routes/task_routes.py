# routes/task_routes.py
# Manages task creation, assignment, and status update

from flask import Blueprint, jsonify, request
from models.task import Task
from models.user import User
from models.job import Job
from models import db
import jwt
from functools import wraps
from flask import current_app
from utils.auth_wrappers import role_required
from datetime import datetime

# Blueprint
task_bp = Blueprint("task", __name__, url_prefix="/api/tasks")


# --- Create Task (Admin/Manager) ---
@task_bp.route("/", methods=["POST", "OPTIONS"], strict_slashes=False)
@role_required(["Admin", "Manager"])
def create_task(current_user):
    data = request.get_json()
    title = data.get("title")
    description = data.get("description")
    job_id = data.get("job_id")
    priority = data.get("priority", "Medium")
    # deadline = data.get('deadline')  # ISO format string expected
    deadline_str = data.get("deadline")
    deadline = None

    if deadline_str:
        try:
            deadline = datetime.fromisoformat(deadline_str)
        except ValueError:
            return jsonify({"error": "Invalid deadline format"}), 400

    if not title or not job_id:
        return jsonify({"error": "Title and job_id are required"}), 400

    task = Task(
        title=title,
        description=description,
        job_id=job_id,
        priority=priority,
        deadline=deadline,
    )
    db.session.add(task)
    db.session.commit()
    return jsonify({"message": "Task created successfully", "task_id": task.id}), 201


# --- Assign Task (Admin/Manager) ---
@task_bp.route(
    "/<int:task_id>/assign", methods=["PUT", "OPTIONS"], strict_slashes=False
)
@role_required(["Admin", "Manager"])
def assign_task(current_user, task_id):
    data = request.get_json()
    user_id = data.get("assigned_to")

    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Task not found"}), 404

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Assigned user not found"}), 404

    task.assigned_to = user_id
    db.session.commit()
    return jsonify({"message": "Task assigned successfully"}), 200


# --- Update Task Status (Manager/Member) ---
@task_bp.route(
    "/<int:task_id>/status", methods=["PUT", "OPTIONS"], strict_slashes=False
)
@role_required(["Manager", "Member"])
def update_task_status(current_user, task_id):
    data = request.get_json()
    new_status = data.get("status")

    if new_status not in ["To Do", "In Progress", "Review", "Completed"]:
        return jsonify({"error": "Invalid status value"}), 400

    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Task not found"}), 404

    # Optional: Restrict status update only to assigned user
    task.status = new_status
    db.session.commit()
    return jsonify({"message": f"Status updated to {new_status}"}), 200


# --- Get Tasks (All roles; filters optional) ---
@task_bp.route("/", methods=["GET", "OPTIONS"], strict_slashes=False)
@role_required(["Admin", "Manager", "Member"])
def list_tasks(current_user):
    role = current_user["role"]
    user_id = current_user["id"]

    query = Task.query

    if role == "Member":
        query = query.filter_by(assigned_to=user_id)
    elif request.args.get("assigned_to"):
        query = query.filter_by(assigned_to=request.args.get("assigned_to"))

    if request.args.get("status"):
        query = query.filter_by(status=request.args.get("status"))

    tasks = query.order_by(Task.created_at.desc()).all()

    if not tasks:
        return jsonify({"message": "No tasks found"}), 200

    result = []


    for task in tasks:
        result.append(
            {
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "status": task.status,
                "priority": task.priority,
                "deadline": task.deadline,
                "job_id": task.job_id,
                "job_title": task.job.title if task.job else None,  # ✅ New
                "job_description": task.job.description if task.job else None,  # ✅ New
                "assigned_to": task.assigned_to,
                "assignee_name": (
                    task.assignee.name if task.assignee else None
                ),  # ✅ Show name not just ID
                "created_at": task.created_at,
            }
        )

    return jsonify(result), 200
