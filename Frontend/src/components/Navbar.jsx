import React from 'react';
import { NavLink } from 'react-router-dom';
import { GraduationCap, LayoutDashboard, PlusCircle, User, RefreshCcw } from 'lucide-react';

const Navbar = ({ userId, onSwitchUser }) => {
    return (
        <nav className="navbar">
            <div className="nav-content">
                <div className="nav-left">
                    <NavLink to="/" className="logo">
                        <GraduationCap size={28} />
                        <span>StudyFlow</span>
                    </NavLink>

                    <div className="nav-links">
                        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <LayoutDashboard size={18} />
                                <span>Dashboard</span>
                            </div>
                        </NavLink>
                        <NavLink to="/generate" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <PlusCircle size={18} />
                                <span>Generate Plan</span>
                            </div>
                        </NavLink>
                    </div>
                </div>

                <div className="nav-right">
                    <button
                        onClick={onSwitchUser}
                        className="user-badge clickable"
                        title="Click to switch User ID"
                    >
                        <User size={14} />
                        <span>ID: {userId}</span>
                        <RefreshCcw size={12} style={{ marginLeft: '4px', opacity: 0.6 }} />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
