from datetime import date
from ..models.study_goal import StudyGoal
from ..models.plan import Plan
from ..ai.ai_adapter import AIAdapter
from ..schemas.plan_schema import DailyPlan
from .. import db
import logging

logger = logging.getLogger(__name__)

class PlanService:
    def __init__(self):
        self.ai = AIAdapter()

    def generate_plan(self, goal_id: int):
        goal = StudyGoal.query.get_or_404(goal_id)
        
        # Calculate days to deadline
        days_to_deadline = (goal.deadline - date.today()).days
        if days_to_deadline <= 0:
            raise ValueError("Deadline is today or in the past. Cannot generate plan.")

        # Trigger AI
        ai_raw_output = self.ai.generate_study_plan(
            subject=goal.subject,
            days_to_deadline=days_to_deadline,
            hours_per_day=goal.hours_per_day
        )

        # Validate structure with Pydantic
        # The schema handles duplicate topics and basic field validation
        request_id = ai_raw_output.get('_request_id', 'Unknown')
        try:
            validated_plan = DailyPlan(goal_id=goal_id, **ai_raw_output)
        except Exception as e:
            logger.error(f"[{request_id}] AI Output Validation Error: {str(e)}")
            raise ValueError(f"AI generated malformed plan [{request_id}]: {str(e)}")

        # Enforce business rules
        # 1. Hours per day not exceeded
        for item in validated_plan.items:
            if item.duration_hours > goal.hours_per_day:
                raise ValueError(f"Day {item.day} exceeds study hours allowance.")

        # 2. Deadline respected
        if len(validated_plan.items) > days_to_deadline:
             raise ValueError("Plan duration exceeds days remaining until deadline.")

        # Versioning
        latest_plan = Plan.query.filter_by(goal_id=goal_id).order_by(Plan.version.desc()).first()
        new_version = (latest_plan.version + 1) if latest_plan else 1

        # Save to DB
        new_plan = Plan(
            goal_id=goal_id,
            version=new_version,
            content_json=validated_plan.model_dump()
        )
        db.session.add(new_plan)
        db.session.commit()

        return new_plan

    def get_latest_plan_for_goal(self, goal_id: int):
        return Plan.query.filter_by(goal_id=goal_id).order_by(Plan.version.desc()).first()
