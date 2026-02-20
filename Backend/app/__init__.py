from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import logging
import os
from .utils.config import Config

db = SQLAlchemy()

def create_app(config_class=Config):
    app = Flask(__name__)
    CORS(app) # Enable CORS for all routes
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)

    # Setup Logging
    logging.basicConfig(level=app.config['LOG_LEVEL'])
    logger = logging.getLogger(__name__)
    logger.info("Starting AI Study Planner API")

    # Register blueprints (routes)
    from .routes.goal_routes import goal_bp
    from .routes.plan_routes import plan_bp
    from .routes.user_routes import user_bp

    app.register_blueprint(goal_bp, url_prefix='/api/goals')
    app.register_blueprint(plan_bp, url_prefix='/api/plans')
    app.register_blueprint(user_bp, url_prefix='/api/users')

    with app.app_context():
        db.create_all()

    return app
