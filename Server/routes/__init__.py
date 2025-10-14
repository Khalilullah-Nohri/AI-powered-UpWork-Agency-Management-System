# routes/__init__.py
# Registers all modular Flask blueprints

from routes.auth_routes import auth_bp
from routes.job_routes import job_bp
from routes.task_routes import task_bp
from routes.match_routes import match_bp
# from routes.user_routes import user_bp
from routes.user_routes import user_bp

def register_routes(app):
    """
    Registers all route blueprints to the Flask app.
    Called from app.py to keep structure modular.
    """
    app.register_blueprint(auth_bp)
    app.register_blueprint(job_bp)
    app.register_blueprint(task_bp)
    app.register_blueprint(match_bp)
    app.register_blueprint(user_bp)
