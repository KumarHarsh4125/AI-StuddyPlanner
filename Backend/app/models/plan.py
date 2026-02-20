from datetime import datetime
from .. import db

class Plan(db.Model):
    __tablename__ = 'plans'
    id = db.Column(db.Integer, primary_key=True)
    goal_id = db.Column(db.Integer, db.ForeignKey('study_goals.id'), nullable=False)
    version = db.Column(db.Integer, nullable=False, default=1)
    content_json = db.Column(db.JSON, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
