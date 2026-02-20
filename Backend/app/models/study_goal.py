from datetime import datetime
from .. import db

class StudyGoal(db.Model):
    __tablename__ = 'study_goals'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    subject = db.Column(db.String(100), nullable=False)
    deadline = db.Column(db.Date, nullable=False)
    hours_per_day = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    plans = db.relationship('Plan', backref='goal', lazy=True)
