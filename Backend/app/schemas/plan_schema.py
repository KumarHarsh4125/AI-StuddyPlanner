from pydantic import BaseModel, Field, validator
from datetime import date, datetime
from typing import List, Optional

class UserSchema(BaseModel):
    id: Optional[int]
    created_at: Optional[datetime]

    class Config:
        from_attributes = True

class StudyGoalCreate(BaseModel):
    user_id: int
    subject: str = Field(..., min_length=1, max_length=100)
    deadline: date
    hours_per_day: float = Field(..., gt=0, le=24)

    @validator('deadline')
    def deadline_must_be_future(cls, v):
        if v < date.today():
            raise ValueError('Deadline must be in the future')
        return v

class StudyGoalSchema(StudyGoalCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class PlanItem(BaseModel):
    day: int
    topics: List[str]
    duration_hours: float

class DailyPlan(BaseModel):
    goal_id: int
    subject: str
    items: List[PlanItem]

    @validator('items')
    def validate_plan_logic(cls, items, values):
        # We'll do more complex business logic validation in the service layer
        # but basic structure is enforced here.
        if not items:
            raise ValueError('Plan must contain at least one day')
        
        all_topics = []
        for item in items:
            all_topics.extend(item.topics)
        
        if len(all_topics) != len(set(all_topics)):
            raise ValueError('Plan contains duplicate topics')
            
        return items

class PlanSchema(BaseModel):
    id: int
    goal_id: int
    version: int
    content_json: DailyPlan
    created_at: datetime

    class Config:
        from_attributes = True
