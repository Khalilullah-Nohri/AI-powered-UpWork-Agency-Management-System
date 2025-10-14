# utils/auth_wrappers.py
# Contains role-based route decorators like admin_required

from functools import wraps
from flask import request, jsonify, current_app
import jwt
from utils.jwt_utils import decode_jwt

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if request.method == 'OPTIONS':
            return '', 200  # Allow preflight

        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'Missing token'}), 401

        try:
            token = auth_header.split(" ")[1]
            payload = decode_jwt(token)
            if payload.get('role') != 'Admin':
                return jsonify({'error': 'Unauthorized'}), 403
        except Exception:
            return jsonify({'error': 'Invalid token'}), 401

        return f(payload, *args, **kwargs)

    return decorated_function

def admin_or_manager_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if request.method == 'OPTIONS':
            return '', 200  # Preflight OK

        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'Missing token'}), 401

        try:
            token = auth_header.split(" ")[1]
            payload = decode_jwt(token)
            if payload.get('role') not in ['Admin', 'Manager']:
                return jsonify({'error': 'Unauthorized'}), 403
        except Exception:
            return jsonify({'error': 'Invalid token'}), 401

        return f(payload, *args, **kwargs)

    return decorated_function



# --- Role-Based Decorator ---
def role_required(allowed_roles):
    def wrapper(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if request.method == 'OPTIONS':
                return '', 200  # Allow preflight
            token = request.headers.get('Authorization')
            if not token:
                return jsonify({'error': 'Missing token'}), 401
            try:
                token = token.split(" ")[1] if " " in token else token
                # payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
                payload= decode_jwt(token)
                if payload['role'] not in allowed_roles:
                    return jsonify({'error': 'Access denied'}), 403
            except jwt.ExpiredSignatureError:
                return jsonify({'error': 'Token expired'}), 401
            except jwt.InvalidTokenError:
                return jsonify({'error': 'Invalid token'}), 401
            return f(payload, *args, **kwargs)
        return decorated_function
    return wrapper
