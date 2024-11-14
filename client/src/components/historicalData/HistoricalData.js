import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosConfig';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

function HistoricalData() {
    const [timeFrame, setTimeFrame] = useState('monthly');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [data, setData] = useState([]);

    // Fetch historical data based on filters
    const fetchHistoricalData = async () => {
        try {
            const response = await axiosInstance.get('/api/profitloss/historical', {
                params: {
                    interval: timeFrame,
                    startDate: startDate || undefined,
                    endDate: endDate || undefined,
                },
            });
            setData(response.data);
        } catch (error) {
            console.error('Error fetching historical data:', error);
        }
    };

    useEffect(() => {
        fetchHistoricalData(); // Fetch data on initial load or whenever filters change
    }, [timeFrame, startDate, endDate]);

    // Generate chart data for the line graph
    const chartData = {
        labels: data.map(item => item.date),
        datasets: [
            {
                label: 'Total Profit/Loss',
                data: data.map(item => item.totalProfitOrLoss),
                fill: false,
                borderColor: 'rgba(30,30,97,1)',
                backgroundColor: 'rgba(115,115,197,0.5)',
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

    return (
        <div className="historical-data-section p-4">
            <h2>Historical Data</h2>
            <div className="row mb-3">
                <div className="col-md-3">
                    <label className="form-label">Time Frame</label>
                    <select
                        className="form-select"
                        value={timeFrame}
                        onChange={(e) => setTimeFrame(e.target.value)}
                    >
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
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label">End Date</label>
                    <input
                        type="date"
                        className="form-control"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <div className="col-md-3 d-flex align-items-end">
                    <button
                        className="btn btn-primary w-100"
                        onClick={fetchHistoricalData}
                    >
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
