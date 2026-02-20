# AI Prompt Guidance & Constraints

This document defines the rules for the AI model (Gemini) when generating study plans.

## Prompt Strategy
The system uses a highly structured prompt to enforce JSON output and logical consistency.

### Rules
1. **Format**: Must return strictly RAW JSON. No markdown, no "here is your plan".
2. **Consistency**: The `subject` in the JSON must match the input subject.
3. **Daily Allowance**: The sum of `duration_hours` for all topics on a given `day` must not exceed the specified `hours_per_day`.
4. **Uniqueness**: Each topic must be unique across the entire plan.
5. **Timeline**: The number of days in the plan must be less than or equal to the days remaining until the deadline.

### Expected JSON Schema
```json
{
    "subject": "string",
    "items": [
        {
            "day": number,
            "topics": ["string"],
            "duration_hours": number
        }
    ]
}
```

### Constraints Enforcement
If the AI output violates these rules, the Backend Service Layer (`plan_service.py`) will reject the response and return an error to the user.
