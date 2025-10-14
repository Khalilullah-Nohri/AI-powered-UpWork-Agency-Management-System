# app.py
# Entry point of the Flask app.
# Works for both local development and production deployments.

from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from flask_migrate import Migrate   # For database migrations
from config import Config           # External config class
from models import db
from routes import register_routes
import os

# Load environment variables from .env
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Load configuration (Config class in config.py)
app.config.from_object(Config)

# Initialize SQLAlchemy with the Flask app
db.init_app(app)

# Initialize Flask-Migrate (Alembic migrations)
migrate = Migrate(app, db)

# Enable CORS (so frontend like React can talk to backend)
CORS(app, supports_credentials=True)

# Register all blueprints from routes/
register_routes(app)


@app.route("/")
def index():
    return {"message": "UpWork Agency Management Backend is running 🚀"}


# ---------------------------
# Local Dev vs Production Mode
# ---------------------------
# - In LOCAL DEV → run with "python app.py"
#   It will auto-create tables if not already present (for convenience).
#   You can still use flask db migrate/upgrade for schema changes.
#
# - In PRODUCTION → run with "gunicorn -w 4 app:app"
#   It will NOT auto-create tables (only migrations should be used).
#
# This way, you don't need to change code between dev & prod.
# ---------------------------
if __name__ == "__main__":
    with app.app_context():
        if app.config.get("ENV") == "development":
            # Local Dev Only: create tables if not exist
            db.create_all()

    # Start Flask’s built-in server (not for production)
    app.run(
        host="0.0.0.0", 
        port=int(os.environ.get("PORT", 5000)),
        debug=app.config.get("DEBUG", False)
    )
