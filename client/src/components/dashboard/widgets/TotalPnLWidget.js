import React from 'react';

function TotalPnLWidget({ totalPnL }) {
    const isProfit = totalPnL >= 0;
    const color = isProfit ? 'text-success' : 'text-danger';

    return (
        <div className="card text-center p-3" style={{ width: '100%', height: '100%' }}>
            <h4>Current P&L</h4>
            <p
                className={`mt-5 ${color} display-4 display-md-3 display-lg-2`} // Use display-* classes for responsive font sizes
                style={{ fontWeight: 'bold' }}
            >
                ₹{totalPnL !== undefined ? totalPnL.toFixed(2) : "0.00"}
            </p>
        </div>
    );
}

export default TotalPnLWidget;
