# routes/auth_routes.py
# Blueprint for authentication endpoints

from flask import Blueprint
from controllers.auth_controller import register_user, login_user

# Create a Blueprint for auth routes
auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

# Register route for user registration
auth_bp.route('/register', methods=['POST'])(register_user)

# Register route for user login
auth_bp.route('/login', methods=['POST'])(login_user)

