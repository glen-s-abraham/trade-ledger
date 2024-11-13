import React, { useState } from 'react';
import './Sidebar.css';

function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
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
                <li className="mb-3">
                    <i className="bi bi-plus-circle-fill me-2"></i>
                    <span className={isCollapsed ? 'd-none' : ''}>Add Trade</span>
                </li>
                <li className="mb-3">
                    <i className="bi bi-speedometer2 me-2"></i>
                    <span className={isCollapsed ? 'd-none' : ''}>Dashboard</span>
                </li>
                <li className="mb-3">
                    <i className="bi bi-graph-up-arrow me-2"></i>
                    <span className={isCollapsed ? 'd-none' : ''}>Trades</span>
                </li>
                <li className="mb-3">
                    <i className="bi bi-bar-chart-fill me-2"></i>
                    <span className={isCollapsed ? 'd-none' : ''}>Reports</span>
                </li>
                <li className="mb-3">
                    <i className="bi bi-lightbulb-fill me-2"></i>
                    <span className={isCollapsed ? 'd-none' : ''}>Insights</span>
                </li>
                <li className="mb-3">
                    <i className="bi bi-clock-history me-2"></i>
                    <span className={isCollapsed ? 'd-none' : ''}>Historical Data</span>
                </li>
                <li className="mt-4">
                    <i className="bi bi-gear-fill me-2"></i>
                    <span className={isCollapsed ? 'd-none' : ''}>Settings</span>
                </li>
                <li className="mt-3">
                    <i className="bi bi-box-arrow-right me-2"></i>
                    <span className={isCollapsed ? 'd-none' : ''}>Logout</span>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;
