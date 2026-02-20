from datetime import date, timedelta
from app.models.user import User
from app.models.study_goal import StudyGoal

def test_new_user(init_database):
    user = User()
    init_database.session.add(user)
    init_database.session.commit()
    assert user.id is not None

def test_new_goal(init_database):
    user = User()
    init_database.session.add(user)
    init_database.session.commit()

    goal = StudyGoal(
        user_id=user.id,
        subject="Python Testing",
        deadline=date.today() + timedelta(days=7),
        hours_per_day=2.0
    )
    init_database.session.add(goal)
    init_database.session.commit()
    assert goal.id is not None
    assert goal.subject == "Python Testing"
