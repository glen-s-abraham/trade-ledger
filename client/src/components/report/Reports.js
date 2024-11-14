import React, { useState } from 'react';

function Reports() {
    const [reportType, setReportType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleGenerateReport = () => {
        // Fetching and downloading logic here
    };

    return (
        <div className="reports-section container p-4">
            <h2 className="mb-4">Reports</h2>
            <div className="card shadow-sm p-4 mb-4" style={{ minHeight: '250px' }}>
                <p className="text-muted mb-4">
                    Generate CSV reports for cumulative P&L, symbol-wise P&L, and trade history, filtered by date.
                </p>
                <div className="row g-3 mb-4 align-items-end">
                    <div className="col-md-4">
                        <label className="form-label">
                            <i className="bi bi-file-earmark-bar-graph-fill me-2"></i>Report Type
                        </label>
                        <select
                            className="form-select"
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                        >
                            <option value="">-- Select Report Type --</option>
                            <option value="cumulative-pnl">Cumulative P&L</option>
                            <option value="symbol-wise-pnl">Symbol-wise P&L</option>
                            <option value="trade-history">Trade History</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">
                            <i className="bi bi-calendar3 me-2"></i>Start Date
                        </label>
                        <input
                            type="date"
                            className="form-control"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">
                            <i className="bi bi-calendar3 me-2"></i>End Date
                        </label>
                        <input
                            type="date"
                            className="form-control"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <div className="col-md-2">
                        <button className="btn btn-primary w-100" onClick={handleGenerateReport}>
                            <i className="bi bi-download me-2"></i> Generate Report
                        </button>
                    </div>
                </div>
            </div>
           
        </div>
    );
}

export default Reports;
