import React, { useState, useEffect } from 'react';

function TradeForm({ trade, onSubmit, mode, onCancel }) {
    const [formData, setFormData] = useState({
        stockSymbol: '',
        transactionType: 'Buy',
        quantity: '',
        price: '',
        tradeDate: '',
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (trade) {
            setFormData({
                stockSymbol: trade.stockSymbol,
                transactionType: trade.transactionType,
                quantity: trade.quantity,
                price: trade.price,
                tradeDate: trade.tradeDate.slice(0, 10),
            });
        } else {
            resetForm();
        }
    }, [trade]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!formData.stockSymbol || !formData.quantity || !formData.price || !formData.tradeDate) {
            setError('Please fill in all required fields.');
            return;
        }
        
        onSubmit(formData);
        resetForm(); // Clear the form after successful submission if in 'create' mode
        setError(''); // Reset any errors
    };

    const resetForm = () => {
        setFormData({
            stockSymbol: '',
            transactionType: 'Buy',
            quantity: '',
            price: '',
            tradeDate: '',
        });
    };

    return (
        <form onSubmit={handleSubmit} className="p-2 border rounded bg-light mb-3">
            <div className="row g-2">
                {error && <div className="col-12 text-danger mb-2">{error}</div>}
                
                <div className="col-md-3">
                    <label htmlFor="stockSymbol" className="form-label">Stock Symbol</label>
                    <input
                        type="text"
                        id="stockSymbol"
                        name="stockSymbol"
                        className="form-control form-control-sm"
                        value={formData.stockSymbol}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="col-md-3">
                    <label htmlFor="transactionType" className="form-label">Transaction Type</label>
                    <select
                        id="transactionType"
                        name="transactionType"
                        className="form-control form-control-sm"
                        value={formData.transactionType}
                        onChange={handleChange}
                    >
                        <option value="Buy">Buy</option>
                        <option value="Sell">Sell</option>
                    </select>
                </div>
                <div className="col-md-2">
                    <label htmlFor="quantity" className="form-label">Quantity</label>
                    <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        className="form-control form-control-sm"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="col-md-2">
                    <label htmlFor="price" className="form-label">Price</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        className="form-control form-control-sm"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="col-md-2">
                    <label htmlFor="tradeDate" className="form-label">Trade Date</label>
                    <input
                        type="date"
                        id="tradeDate"
                        name="tradeDate"
                        className="form-control form-control-sm"
                        value={formData.tradeDate}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="col-md-2 d-flex align-items-end">
                    <button type="submit" className="btn btn-primary btn-sm me-2">
                        <i className={`bi ${mode === 'create' ? 'bi-plus-circle' : 'bi-pencil-square'}`}></i>
                        {mode === 'create' ? ' Add Trade' : ' Update Trade'}
                    </button>
                    {mode === 'update' && (
                        <button type="button" className="btn btn-secondary btn-sm" onClick={onCancel}>
                            <i className="bi bi-x-circle"></i> Cancel
                        </button>
                    )}
                </div>
            </div>
        </form>
    );
}

export default TradeForm;
