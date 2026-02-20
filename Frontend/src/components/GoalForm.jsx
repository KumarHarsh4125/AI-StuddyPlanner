import React, { useState } from 'react';
import { Calendar, Target, Clock, Send } from 'lucide-react';

const GoalForm = ({ onSubmit, isLoading }) => {
    const [formData, setFormData] = useState({
        subject: '',
        deadline: '',
        hours_per_day: 2
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form className="goal-form" onSubmit={handleSubmit}>
            <div className="form-title">
                <Target size={24} />
                <h2>Set Study Goal</h2>
            </div>

            <div className="input-group">
                <label>Subject</label>
                <div className="input-wrapper">
                    <input
                        type="text"
                        name="subject"
                        placeholder="e.g. Advanced Mathematics"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="input-group">
                    <label>Deadline</label>
                    <div className="input-wrapper">
                        <Calendar size={18} />
                        <input
                            type="date"
                            name="deadline"
                            value={formData.deadline}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="input-group">
                    <label>Hours per Day</label>
                    <div className="input-wrapper">
                        <Clock size={18} />
                        <input
                            type="number"
                            name="hours_per_day"
                            min="0.5"
                            step="0.5"
                            max="24"
                            value={formData.hours_per_day}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
            </div>

            <button type="submit" disabled={isLoading} className="submit-btn">
                {isLoading ? 'Generating Plan...' : (
                    <>
                        <Send size={18} />
                        Generate Daily Plan
                    </>
                )}
            </button>
        </form>
    );
};

export default GoalForm;
