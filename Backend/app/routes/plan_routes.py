from flask import Blueprint, request, jsonify
from ..services.plan_service import PlanService

plan_bp = Blueprint('plans', __name__)
plan_service = PlanService()

@plan_bp.route('/goal/<int:goal_id>', methods=['POST'])
def create_plan(goal_id):
    try:
        plan = plan_service.generate_plan(goal_id)
        return jsonify({
            "plan_id": plan.id,
            "version": plan.version,
            "content": plan.content_json,
            "message": "Plan generated successfully"
        }), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@plan_bp.route('/<int:plan_id>', methods=['GET'])
def get_plan(plan_id):
    from ..models.plan import Plan
    plan = Plan.query.get_or_404(plan_id)
    return jsonify({
        "id": plan.id,
        "goal_id": plan.goal_id,
        "version": plan.version,
        "content": plan.content_json,
        "created_at": plan.created_at.isoformat()
    })

@plan_bp.route('/goal/<int:goal_id>/latest', methods=['GET'])
def get_latest_plan(goal_id):
    plan = plan_service.get_latest_plan_for_goal(goal_id)
    if not plan:
        return jsonify({"error": "No plan found for this goal"}), 404
    return jsonify({
        "id": plan.id,
        "goal_id": plan.goal_id,
        "version": plan.version,
        "content": plan.content_json,
        "created_at": plan.created_at.isoformat()
    })
