import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import studyApi from '../api/studyApi';
import PlanDisplay from '../components/PlanDisplay';
import { ArrowLeft, Loader2 } from 'lucide-react';

const PlanDetail = () => {
    const { goalId } = useParams();
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPlan = async () => {
            try {
                const response = await studyApi.getLatestPlan(goalId);
                setPlan(response.data);
            } catch (err) {
                setError(err.response?.status === 404
                    ? "No study plan has been generated for this goal yet."
                    : "Failed to load the study plan.");
            } finally {
                setLoading(false);
            }
        };

        fetchPlan();
    }, [goalId]);

    if (loading) return (
        <div className="app-container" style={{ display: 'flex', justifyContent: 'center', paddingTop: '100px' }}>
            <Loader2 className="animate-spin" size={40} color="var(--primary)" />
        </div>
    );

    return (
        <div className="app-container">
            <Link to="/" className="back-btn">
                <ArrowLeft size={18} />
                Back to Dashboard
            </Link>

            {error ? (
                <div className="error-msg">{error}</div>
            ) : (
                <PlanDisplay plan={plan} />
            )}
        </div>
    );
};

export default PlanDetail;
