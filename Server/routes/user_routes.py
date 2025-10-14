# routes/user_routes.py

from flask import Blueprint, jsonify, request
from models.user import User
from utils.auth_wrappers import role_required

user_bp = Blueprint('user', __name__, url_prefix='/api/users')


# Route: List users, optionally filtered by role
@user_bp.route('/', methods=['GET','OPTIONS'], strict_slashes=False)
@role_required(['Admin', 'Manager'])
def list_users(current_user):
    role_filter = request.args.get('role')

    query = User.query
    if role_filter:
        query = query.filter_by(role=role_filter)  # ✅ filter by role=Member

    users = query.all()
    user_list = [{
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'role': user.role
    } for user in users]

    return jsonify(user_list), 200
