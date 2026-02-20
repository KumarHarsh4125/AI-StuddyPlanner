from ..models.study_goal import StudyGoal
from ..schemas.plan_schema import StudyGoalCreate
from .. import db

class GoalService:
    @staticmethod
    def create_goal(data: dict):
        # Validation is already done via StudyGoalCreate schema in the route, 
        # but the service layer handles the DB orchestration.
        goal_data = StudyGoalCreate(**data)
        
        new_goal = StudyGoal(
            user_id=goal_data.user_id,
            subject=goal_data.subject,
            deadline=goal_data.deadline,
            hours_per_day=goal_data.hours_per_day
        )
        db.session.add(new_goal)
        db.session.commit()
        return new_goal

    @staticmethod
    def get_goal(goal_id: int):
        return StudyGoal.query.get_or_404(goal_id)

    @staticmethod
    def get_user_goals(user_id: int):
        return StudyGoal.query.filter_by(user_id=user_id).order_by(StudyGoal.created_at.desc()).all()

    @staticmethod
    def delete_goal(goal_id: int):
        from ..models.plan import Plan
        # Delete associated plans first
        Plan.query.filter_by(goal_id=goal_id).delete()
        
        goal = StudyGoal.query.get_or_404(goal_id)
        db.session.delete(goal)
        db.session.commit()
        return True
