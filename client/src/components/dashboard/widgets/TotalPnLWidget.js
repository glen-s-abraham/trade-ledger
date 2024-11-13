import React from 'react';

function TotalPnLWidget({ totalPnL }) {
    const isProfit = totalPnL >= 0;
    const color = isProfit ? 'text-success' : 'text-danger'; // Bootstrap color classes

    return (
        <div className="card text-center p-3" style={{ width: '100%', height: '100%' }}>
            <h4>Current P&L</h4>
            <p
                className={`display-1 ${color} mt-5`} // Adjust 'mt-5' for more or less vertical spacing
                style={{ fontWeight: 'bold' }}
            >
                ₹{totalPnL !== undefined ? totalPnL.toFixed(2) : "0.00"}
            </p>
        </div>
    );
}

export default TotalPnLWidget;
