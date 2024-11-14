import React from 'react';

function TradeTable({ trades, onEdit, onDelete }) {
    return (
        <div className="table-responsive" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
            <table className="table table-hover table-striped align-middle">
                <thead>
                    <tr>
                        <th>Stock Symbol</th>
                        <th>Transaction Type</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Trade Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {trades.length > 0 ? (
                        trades.map((trade) => (
                            <tr key={trade._id}>
                                <td>{trade.stockSymbol}</td>
                                <td>{trade.transactionType}</td>
                                <td>{trade.quantity}</td>
                                <td>₹{trade.price.toFixed(2)}</td>
                                <td>{new Date(trade.tradeDate).toLocaleDateString()}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-primary me-2"
                                        onClick={() => onEdit(trade)}
                                        title="Edit"
                                    >
                                        <i className="bi bi-pencil-square"></i>
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => onDelete(trade._id)}
                                        title="Delete"
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">
                                No trades found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default TradeTable;
