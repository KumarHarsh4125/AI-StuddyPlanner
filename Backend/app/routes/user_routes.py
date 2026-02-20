from flask import Blueprint, jsonify
from ..services.user_service import UserService

user_bp = Blueprint('users', __name__)

@user_bp.route('', methods=['POST'])
def create_user():
    user = UserService.create_user()
    return jsonify({"user_id": user.id, "message": "User created"}), 201
