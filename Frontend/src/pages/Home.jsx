import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import studyApi from '../api/studyApi';
import GoalCard from '../components/GoalCard';
import { Plus, BookOpen } from 'lucide-react';

const Home = ({ userId }) => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) return;

        const fetchGoals = async () => {
            try {
                const response = await studyApi.getUserGoals(userId);
                setGoals(response.data);
            } catch (err) {
                setError("Failed to load your study goals.");
            } finally {
                setLoading(false);
            }
        };

        fetchGoals();
    }, [userId]);

    const handleDeleteGoal = async (goalId) => {
        try {
            await studyApi.deleteGoal(goalId);
            setGoals(prev => prev.filter(g => g.id !== goalId));
        } catch (err) {
            alert("Failed to delete goal. Please try again.");
        }
    };

    if (loading) return <div className="app-container"><p>Loading your dashboard...</p></div>;

    return (
        <div className="app-container">
            <div className="dashboard-header">
                <div>
                    <h1>My Study Plans</h1>
                    <p>Track your academic progress and daily schedules.</p>
                </div>
                <Link to="/generate" className="create-link">
                    <Plus size={18} />
                    New Goal
                </Link>
            </div>

            {error && <div className="error-msg">{error}</div>}

            {goals.length === 0 ? (
                <div className="empty-state">
                    <BookOpen size={64} opacity={0.2} style={{ marginBottom: '20px' }} />
                    <h2>No study goals yet</h2>
                    <p>Create your first study goal to generate an AI-powered plan.</p>
                    <Link to="/generate" className="create-link" style={{ display: 'inline-flex', marginTop: '20px' }}>
                        Get Started
                    </Link>
                </div>
            ) : (
                <div className="goals-grid">
                    {goals.map(goal => (
                        <GoalCard key={goal.id} goal={goal} onDelete={handleDeleteGoal} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
