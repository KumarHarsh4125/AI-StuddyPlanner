from flask import Blueprint, request, jsonify
from ..services.goal_service import GoalService
from ..schemas.plan_schema import StudyGoalCreate

goal_bp = Blueprint('goals', __name__)

@goal_bp.route('', methods=['POST'])
def create_goal():
    data = request.json
    try:
        # Schema still used for early validation
        StudyGoalCreate(**data)
        goal = GoalService.create_goal(data)
        return jsonify({"goal_id": goal.id, "message": "Goal created"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@goal_bp.route('/<int:goal_id>', methods=['GET'])
def get_goal(goal_id):
    goal = GoalService.get_goal(goal_id)
    return jsonify({
        "id": goal.id,
        "subject": goal.subject,
        "deadline": str(goal.deadline),
        "hours_per_day": goal.hours_per_day
    })

@goal_bp.route('/user/<int:user_id>', methods=['GET'])
def get_user_goals(user_id):
    goals = GoalService.get_user_goals(user_id)
    return jsonify([{
        "id": g.id,
        "subject": g.subject,
        "deadline": str(g.deadline),
        "hours_per_day": g.hours_per_day,
        "created_at": g.created_at.isoformat()
    } for g in goals])

@goal_bp.route('/<int:goal_id>', methods=['DELETE'])
def delete_goal(goal_id):
    try:
        GoalService.delete_goal(goal_id)
        return jsonify({"message": "Goal and associated plans deleted"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
