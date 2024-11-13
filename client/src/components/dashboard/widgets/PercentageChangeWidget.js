import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function PercentageChangeWidget({ data }) {
    const chartData = {
        labels: ['Total Invested', 'Current Market Value'],
        datasets: [
            {
                data: [data.totalInvestedAmount, data.currentMarketValue],
                backgroundColor: ['#4e73df', '#1cc88a'],
            },
        ],
    };

    const options = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
            },
        },
    };

    return (
        <div className="card p-3 text-center" style={{ width: '100%', height: '100%' }}>
            <h4>Current Change</h4>
            <p className="display-6 text-primary">{data.percentageChange}%</p>
            <div style={{ height: '70%' }}>
                <Doughnut data={chartData} options={options} />
            </div>
        </div>
    );
}

export default PercentageChangeWidget;
