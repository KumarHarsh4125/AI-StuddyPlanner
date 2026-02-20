from ..models.user import User
from .. import db

class UserService:
    @staticmethod
    def create_user():
        user = User()
        db.session.add(user)
        db.session.commit()
        return user
