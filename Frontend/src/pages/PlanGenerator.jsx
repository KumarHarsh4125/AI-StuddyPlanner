import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import studyApi from '../api/studyApi';
import GoalForm from '../components/GoalForm';
import PlanDisplay from '../components/PlanDisplay';

const PlanGenerator = ({ userId }) => {
    const [currentPlan, setCurrentPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleGeneratePlan = async (goalData) => {
        setLoading(true);
        setError(null);
        try {
            const goalResponse = await studyApi.createGoal({
                ...goalData,
                user_id: userId
            });
            const goalId = goalResponse.data.goal_id;

            const planResponse = await studyApi.generatePlan(goalId);
            setCurrentPlan(planResponse.data);

            // Optional: auto-redirect to detail view after generation? 
            // For now, show it here so user sees immediate feedback.
        } catch (err) {
            const rawError = err.response?.data?.error || err.message || "Something went wrong";
            let cleanError = rawError;

            if (rawError.includes('429') || rawError.includes('quota')) {
                cleanError = "AI Plan generation is temporarily limited due to high demand. Please try again in 1-2 minutes.";
            } else if (rawError.includes('404')) {
                cleanError = "AI service configuration issue. Please check your API key.";
            }

            setError(cleanError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-container">
            <header>
                <h1>Generate Study Plan</h1>
                <p>Tell us your goal, and our AI will handle the scheduling.</p>
            </header>

            <main>
                {error && <div className="error-msg">{error}</div>}

                <GoalForm onSubmit={handleGeneratePlan} isLoading={loading} />

                {currentPlan && <PlanDisplay plan={currentPlan} />}
            </main>
        </div>
    );
};

export default PlanGenerator;
