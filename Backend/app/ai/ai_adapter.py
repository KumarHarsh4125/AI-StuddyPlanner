import google.generativeai as genai
import json
import logging
import uuid
from ..utils.config import Config

logger = logging.getLogger(__name__)

class AIAdapter:
    def __init__(self):
        if not Config.GEMINI_API_KEY:
            logger.warning("GEMINI_API_KEY not set. AI features will fail.")
        genai.configure(api_key=Config.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-2.5-flash')

    def generate_study_plan(self, subject: str, days_to_deadline: int, hours_per_day: float) -> dict:
        request_id = str(uuid.uuid4())[:8]
        prompt = f"""
        You are a highly efficient study planning assistant.
        Create a detailed study plan for the subject: "{subject}".
        The student has {days_to_deadline} days until the deadline and can study {hours_per_day} hours per day.
        
        REQUIREMENTS:
        1. The plan must cover exactly {days_to_deadline} days or fewer if the subject is simple.
        2. Each day must not exceed {hours_per_day} hours of study.
        3. Do not repeat topics across different days.
        4. Output MUST be in raw JSON format.
        
        JSON SCHEMA:
        {{
            "subject": "{subject}",
            "items": [
                {{
                    "day": 1,
                    "topics": ["topic1", "topic2"],
                    "duration_hours": 2.0
                }},
                ...
            ]
        }}
        
        Strictly return ONLY JSON. No markdown formatting, no code blocks.
        """
        
        logger.info(f"[{request_id}] AI Request Initiated - Subject: {subject}")
        logger.debug(f"[{request_id}] Prompt: {prompt}")

        try:
            response = self.model.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            
            # Log Token Usage
            usage = response.usage_metadata
            logger.info(f"[{request_id}] AI Response Received. Tokens: {usage.total_token_count} (Prompt: {usage.prompt_token_count}, Output: {usage.candidates_token_count})")

            text = response.text.strip()
            # Basic sanitization
            if text.startswith("```json"):
                text = text[7:]
            if text.endswith("```"):
                text = text[:-3]
            
            plan_data = json.loads(text.strip())
            # Inject request_id for the service layer to use
            plan_data['_request_id'] = request_id
            return plan_data
        except Exception as e:
            error_msg = str(e)
            logger.error(f"[{request_id}] AI generation failed: {error_msg}")
            raise ValueError(f"AI service error [{request_id}]: {error_msg}")
