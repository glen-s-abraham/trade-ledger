import React from 'react';

function InvestedValueWidget({ totalInvested }) {
    return (
        <div className="card text-center p-3" style={{ width: '100%', height: '100%' }}>
            <h4>Current Invested Value</h4>
            <p
                className="text-primary mt-5 display-4 display-md-3 display-lg-2" // Responsive font size using Bootstrap display classes
                style={{ fontWeight: 'bold' }}
            >
                ₹{totalInvested !== undefined ? totalInvested.toFixed(2) : "0.00"}
            </p>
        </div>
    );
}

export default InvestedValueWidget;
