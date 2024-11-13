import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { format } from 'date-fns';

function HistoricalData() {
    const [timeFrame, setTimeFrame] = useState('monthly');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [data, setData] = useState([]);

    // Dummy data based on time frame
    const dummyData = {
        monthly: [
            { totalProfitOrLoss: 1888.05, date: '2023-07' },
            { totalProfitOrLoss: 1889.40, date: '2023-08' },
            { totalProfitOrLoss: 6020.12, date: '2023-10' },
        ],
        weekly: [
            { totalProfitOrLoss: 1249.85, date: '2023-27' },
            { totalProfitOrLoss: -10.12, date: '2023-28' },
            { totalProfitOrLoss: 648.32, date: '2023-30' },
            { totalProfitOrLoss: 586.80, date: '2023-31' },
            { totalProfitOrLoss: 1302.60, date: '2023-35' },
            { totalProfitOrLoss: 6020.12, date: '2023-40' },
        ],
        daily: [
            { totalProfitOrLoss: 570.00, date: '2023-07-02' },
            { totalProfitOrLoss: 420.00, date: '2023-07-04' },
            { totalProfitOrLoss: 260.00, date: '2023-07-06' },
            { totalProfitOrLoss: -10.12, date: '2023-07-12' },
            { totalProfitOrLoss: 648.32, date: '2023-07-28' },
            { totalProfitOrLoss: 586.80, date: '2023-08-02' },
            { totalProfitOrLoss: 1302.60, date: '2023-08-29' },
            { totalProfitOrLoss: 6020.12, date: '2023-10-02' },
        ]
    };

    // Update data based on time frame
    useEffect(() => {
        setData(dummyData[timeFrame]);
    }, [timeFrame]);

    // Generate chart data for the line graph
    const chartData = {
        labels: data.map(item => item.date),
        datasets: [
            {
                label: 'Total Profit/Loss',
                data: data.map(item => item.totalProfitOrLoss),
                fill: false,
                borderColor: 'rgba(30,30,97,1)', // primary color
                backgroundColor: 'rgba(115,115,197,0.5)', // secondary color
                tension: 0.1,
                pointBackgroundColor: 'rgba(30,30,97,1)',
                pointHoverBackgroundColor: 'rgba(115,115,197,1)',
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `₹${context.raw.toFixed(2)}`;
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Date',
                    color: 'rgba(30,30,97,1)',
                    font: {
                        weight: 'bold',
                        size: 14
                    }
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Total Profit/Loss',
                    color: 'rgba(30,30,97,1)',
                    font: {
                        weight: 'bold',
                        size: 14
                    }
                }
            }
        }
    };

    const handleTimeFrameChange = (e) => setTimeFrame(e.target.value);
    const handleStartDateChange = (e) => setStartDate(e.target.value);
    const handleEndDateChange = (e) => setEndDate(e.target.value);

    return (
        <div className="historical-data-section p-4">
            <h2>Historical Data</h2>
            <div className="row mb-3">
                <div className="col-md-3">
                    <label className="form-label">Time Frame</label>
                    <select className="form-select" value={timeFrame} onChange={handleTimeFrameChange}>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>
                <div className="col-md-3">
                    <label className="form-label">Start Date</label>
                    <input
                        type="date"
                        className="form-control"
                        value={startDate}
                        onChange={handleStartDateChange}
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label">End Date</label>
                    <input
                        type="date"
                        className="form-control"
                        value={endDate}
                        onChange={handleEndDateChange}
                    />
                </div>
                <div className="col-md-3 d-flex align-items-end">
                    <button className="btn btn-primary w-100">
                        <i className="bi bi-filter"></i> Apply Filters
                    </button>
                </div>
            </div>
            <div className="card p-3" style={{ height: '75vh', padding: '20px' }}>
                <Line data={chartData} options={chartOptions} />
            </div>
        </div>
    );
}

export default HistoricalData;
