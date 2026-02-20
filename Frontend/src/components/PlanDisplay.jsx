import React from 'react';
import { CheckCircle, BookOpen, Clock } from 'lucide-react';

const PlanDisplay = ({ plan }) => {
    if (!plan) return null;

    return (
        <div className="plan-container">
            <div className="plan-header">
                <CheckCircle className="featured" size={32} />
                <div className="header-text">
                    <h2>Your Study Plan</h2>
                    <p>Subject: <strong>{plan.content.subject}</strong> (Version {plan.version})</p>
                </div>
            </div>

            <div className="days-grid">
                {plan.content.items.map((item) => (
                    <div key={item.day} className="day-card">
                        <div className="day-badge">Day {item.day}</div>
                        <div className="day-content">
                            <div className="topic-list">
                                {item.topics.map((topic, i) => (
                                    <div key={i} className="topic-item">
                                        <BookOpen size={16} />
                                        <span>{topic}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="day-footer">
                                <Clock size={14} />
                                <span>{item.duration_hours} hours</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlanDisplay;
