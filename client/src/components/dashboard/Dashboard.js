import React from 'react';

function Dashboard() {
    return (
        <div className="p-4">
            <div className="d-flex justify-content-between align-items-center">
                <h2>Dashboard</h2>
                {/* Date Range Filter and other top-right controls */}
            </div>
            <div className="row mt-4">
                <div className="col-md-6 mb-4">
                    <div className="card p-3 text-center">
                        <h4>Net P&L</h4>
                        <p className="display-4 text-primary">$7,032.50</p>
                    </div>
                </div>
                <div className="col-md-6 mb-4">
                    <div className="card p-3 text-center">
                        <h4>Profit Factor</h4>
                        <p className="display-4 text-secondary">2.10</p>
                    </div>
                </div>
            </div>
            {/* Add Calendar or Weekly Stats view */}
        </div>
    );
}

export default Dashboard;
