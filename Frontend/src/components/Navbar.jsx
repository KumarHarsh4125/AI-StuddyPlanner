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
                    <div className="user-badge" title="Your unique ID. Share this to show your plans!">
                        <User size={14} />
                        <span>ID: {userId}</span>
                    </div>
                    <button onClick={onSwitchUser} className="switch-user-btn" title="Switch to another User ID">
                        <RefreshCcw size={14} />
                        <span>Switch</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
