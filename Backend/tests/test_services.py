from unittest.mock import patch, MagicMock
from app.services.plan_service import PlanService
from app.models.user import User
from app.models.study_goal import StudyGoal
from datetime import date, timedelta

def test_generate_plan_success(init_database):
    # Setup
    user = User()
    init_database.session.add(user)
    init_database.session.commit()

    goal = StudyGoal(
        user_id=user.id,
        subject="Math",
        deadline=date.today() + timedelta(days=5),
        hours_per_day=3.0
    )
    init_database.session.add(goal)
    init_database.session.commit()

    # Mock AI response
    mock_ai_output = {
        "subject": "Math",
        "items": [
            {"day": 1, "topics": ["Calculus"], "duration_hours": 2.0},
            {"day": 2, "topics": ["Algebra"], "duration_hours": 2.0}
        ]
    }

    with patch('app.services.plan_service.AIAdapter') as MockAI:
        instance = MockAI.return_value
        instance.generate_study_plan.return_value = mock_ai_output
        
        service = PlanService()
        plan = service.generate_plan(goal.id)

        assert plan.version == 1
        assert plan.content_json["subject"] == "Math"
        assert len(plan.content_json["items"]) == 2

def test_generate_plan_invalid_hours(init_database):
    user = User()
    init_database.session.add(user)
    init_database.session.commit()

    goal = StudyGoal(
        user_id=user.id,
        subject="Math",
        deadline=date.today() + timedelta(days=5),
        hours_per_day=1.0 # Only 1 hour allowed
    )
    init_database.session.add(goal)
    init_database.session.commit()

    # Mock AI response with 2 hours (violates business rule)
    mock_ai_output = {
        "subject": "Math",
        "items": [
            {"day": 1, "topics": ["Calculus"], "duration_hours": 2.0}
        ]
    }

    with patch('app.services.plan_service.AIAdapter') as MockAI:
        instance = MockAI.return_value
        instance.generate_study_plan.return_value = mock_ai_output
        
        service = PlanService()
        import pytest
        with pytest.raises(ValueError, match="exceeds study hours allowance"):
            service.generate_plan(goal.id)
