import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ChevronRight, Trash2 } from 'lucide-react';

const GoalCard = ({ goal, onDelete }) => {
    const handleDelete = (e) => {
        e.preventDefault(); // Prevent navigating to detail view
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to delete the plan for "${goal.subject}"?`)) {
            onDelete(goal.id);
        }
    };

    return (
        <div className="goal-card-wrapper" style={{ position: 'relative' }}>
            <Link to={`/plan/${goal.id}`} className="goal-card">
                <div className="goal-card-header">
                    <h3>{goal.subject}</h3>
                </div>

                <div className="goal-card-meta">
                    <div className="meta-item">
                        <Calendar size={14} />
                        <span>Deadline: {new Date(goal.deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="meta-item">
                        <Clock size={14} />
                        <span>Allowance: {goal.hours_per_day}h/day</span>
                    </div>
                    <div className="meta-item" style={{ marginTop: '8px', color: 'var(--primary)', fontWeight: '600' }}>
                        <span>View Plan</span>
                        <ChevronRight size={14} />
                    </div>
                </div>
            </Link>

            <button
                onClick={handleDelete}
                className="delete-card-btn"
                title="Delete Goal"
            >
                <Trash2 size={16} />
            </button>
        </div>
    );
};

export default GoalCard;
