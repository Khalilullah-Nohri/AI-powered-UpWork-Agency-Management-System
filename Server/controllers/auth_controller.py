# controllers/auth_controller.py
# Contains logic for user registration and login

from flask import request, jsonify
from models.user import User
from models import db
from utils.jwt_utils import generate_jwt_token
from sqlalchemy.exc import IntegrityError

def register_user():
    """
    Registers a new user with name, email, password, and role.
    Password is securely hashed before saving.
    """
    data = request.get_json()

    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    if not all([name, email, password, role]):
        return jsonify({'error': 'Missing required fields'}), 400

    user = User(name=name, email=email, role=role)
    user.set_password(password)

    try:
        db.session.add(user)
        db.session.commit()
        return jsonify({'message': 'User registered successfully'}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': 'Email already exists'}), 409

def login_user():
    """
    Authenticates user using email and password.
    Returns a JWT token on success.
    """
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({'error': 'Missing email or password'}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid credentials'}), 401

    # Generate JWT token
    token = generate_jwt_token(user.id, user.role)

    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'role': user.role
        }
    }), 200
