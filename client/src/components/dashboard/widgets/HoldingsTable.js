import React from 'react';

function HoldingsTable({ holdings }) {
    console.log(holdings)
    return (
        <div className="card p-3" style={{ width: '100%', height: '100%' }}>
            <h4>Current Holdings</h4>
            <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Stock Symbol</th>
                            <th>Total Quantity</th>
                            <th>Average Price</th>
                            <th>Total Invested</th>
                        </tr>
                    </thead>
                    <tbody>
                        {holdings.filter((holding) => holding.totalQuantity > 0).map((holding, index) => (
                            <tr key={index}>
                                <td>{holding.stockSymbol}</td>
                                <td>{holding.totalQuantity}</td>
                                <td>₹{holding.averagePrice.toFixed(2)}</td>
                                <td>₹{(holding.averagePrice*holding.totalQuantity).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default HoldingsTable;
