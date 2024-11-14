import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosConfig';
import TradeForm from './subComponents/TradeForm';
import TradeTable from './subComponents/TradeTable';

function Trades() {
    const [trades, setTrades] = useState([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [symbol, setSymbol] = useState('');
    const [selectedTrade, setSelectedTrade] = useState(null);
    const [mode, setMode] = useState('create');

    // Fetch trades with pagination and filters
    const fetchTrades = async () => {
        try {
            const params = {
                page,
                limit,
                startDate: startDate || undefined,
                endDate: endDate || undefined,
                symbol: symbol || undefined,
            };
            const response = await axiosInstance.get('/api/trades', { params });
            setTrades(response.data.trades);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching trades:', error);
        }
    };

    useEffect(() => {
        fetchTrades();
    }, [page, startDate, endDate, symbol]);

    const handleFormSubmit = async (trade) => {
        try {
            if (mode === 'create') {
                await axiosInstance.post('/api/trades', trade);
            } else {
                await axiosInstance.put(`/api/trades/${selectedTrade._id}`, trade);
                setMode('create');
                setSelectedTrade(null);
            }
            fetchTrades(); // Refresh data after create/update
        } catch (error) {
            console.error('Error submitting trade:', error);
        }
    };

    const handleEdit = (trade) => {
        setSelectedTrade(trade);
        setMode('update');
    };

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/api/trades/${id}`);
            fetchTrades(); // Refresh data after delete
        } catch (error) {
            console.error('Error deleting trade:', error);
        }
    };

    const handleCancel = () => {
        setSelectedTrade(null);
        setMode('create');
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        fetchTrades();
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    return (
        <div className="trades-section p-4">
            <h2>Trades</h2>
            <TradeForm
                trade={selectedTrade}
                onSubmit={handleFormSubmit}
                mode={mode}
                onCancel={handleCancel}
            />
            
            {/* Filter Form */}
            <div className="card p-3 mt-5">
                <form className="row mb-3" onSubmit={handleFilterSubmit}>
                    <div className="col-md-3">
                        <label className="form-label">Start Date</label>
                        <input
                            type="date"
                            className="form-control form-control-sm"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">End Date</label>
                        <input
                            type="date"
                            className="form-control form-control-sm"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">Symbol</label>
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Stock Symbol"
                            value={symbol}
                            onChange={(e) => setSymbol(e.target.value)}
                        />
                    </div>
                    <div className="col-md-3 d-flex align-items-end">
                        <button type="submit" className="btn btn-primary btn-sm w-100">Apply Filters</button>
                    </div>
                </form>

                {/* Trade Table */}
                <TradeTable
                    trades={trades}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

                {/* Pagination Controls */}
                <div className="d-flex justify-content-between mt-3">
                    <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                    >
                        Previous
                    </button>
                    <span>Page {page} of {totalPages}</span>
                    <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Trades;
