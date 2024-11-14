import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Sidebar.css';

function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const menuItems = [
        { name: 'Dashboard', icon: 'bi-speedometer2', route: '/dashboard' },
        { name: 'Trades', icon: 'bi-graph-up-arrow', route: '/trades' },
        { name: 'Reports', icon: 'bi-bar-chart-fill', route: '/reports' },
        { name: 'Historical Data', icon: 'bi-clock-history', route: '/historical-data' },
        { name: 'Settings', icon: 'bi-gear-fill', route: '/settings' },
    ];

    const handleNavigation = (route) => {
        navigate(route);
    };

    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''} bg-primary text-white vh-100 d-flex flex-column`}>
            {/* Sidebar Header */}
            <div className={`d-flex align-items-center px-2 ${isCollapsed ? 'justify-content-center' : ''}`}>
                <button onClick={toggleSidebar} className="toggle-btn">
                    <i className={`bi ${isCollapsed ? 'bi-chevron-bar-right' : 'bi-chevron-bar-left'}`}></i>
                </button>
                {!isCollapsed && <h3 className="sidebar-title ms-2 m-0">TradeJournal</h3>}
            </div>

            {/* Sidebar Menu Items */}
            <ul className="list-unstyled mt-4 flex-grow-1">
                {menuItems.map((item) => (
                    <li
                        key={item.name}
                        className={`mb-3 d-flex align-items-center ${location.pathname === item.route ? 'active' : ''}`}
                        onClick={() => handleNavigation(item.route)}
                        style={{ cursor: 'pointer' }}
                    >
                        <i className={`bi ${item.icon} me-2`}></i>
                        <span className={isCollapsed ? 'd-none' : ''}>{item.name}</span>
                    </li>
                ))}
                <li
                    className="mt-3 d-flex align-items-center"
                    onClick={logout}
                    style={{ cursor: 'pointer' }}
                >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    <span className={isCollapsed ? 'd-none' : ''}>Logout</span>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;
