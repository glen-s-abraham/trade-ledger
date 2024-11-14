import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosConfig';
import TotalPnLWidget from './widgets/TotalPnLWidget';
import PercentageChangeWidget from './widgets/PercentageChangeWidget';
import HoldingsTable from './widgets/HoldingsTable';
import InvestedValueWidget from './widgets/InvestedValueWidget.js';

function Dashboard() {
    const [holdings, setHoldings] = useState([]);
    const [percentageChange, setPercentageChange] = useState({ percentageChange: 0 });
    const [totalPnL, setTotalPnL] = useState({ totalPnL: 0 });
    const [totalInvested, setTotalInvested] = useState({ totalInvested: 0 });

    // Fetch Holdings data
    useEffect(() => {
        const fetchHoldings = async () => {
            try {
                const response = await axiosInstance.get('/api/trades/current/holdings');
                setHoldings(response.data);
            } catch (error) {
                console.error('Error fetching holdings:', error);
            }
        };
        fetchHoldings();
    }, []);

    // Fetch Percentage Change and Invested Amount data
    useEffect(() => {
        const fetchPercentageChange = async () => {
            try {
                const response = await axiosInstance.get('/api/trades/current/total-percentage-change');
                setPercentageChange(response.data);
                const { totalInvestedAmount } = response.data;
                setTotalInvested({ totalInvested: totalInvestedAmount });
            } catch (error) {
                console.error('Error fetching percentage change data:', error);
            }
        };
        fetchPercentageChange();
    }, []);

    // Fetch Total PnL data
    useEffect(() => {
        const fetchTotalPnL = async () => {
            try {
                const response = await axiosInstance.get('/api/trades/current/total-pnl');
                setTotalPnL({ totalPnL: response.data.totalPnL });
            } catch (error) {
                console.error('Error fetching total PnL data:', error);
            }
        };
        fetchTotalPnL();
    }, []);

    return (
        <div className="dashboard p-4" style={{ height: '100vh', overflowY: 'auto' }}>
            <h2>Dashboard</h2>
            {/* Top Row (30% of the height) */}
            <div className="row mt-4 d-flex align-items-stretch">
                <div className="col-lg-4 col-md-12 mb-4 d-flex">
                    <InvestedValueWidget totalInvested={totalInvested.totalInvested} />
                </div>
                <div className="col-lg-4 col-md-12 mb-4 d-flex">
                    <TotalPnLWidget totalPnL={totalPnL.totalPnL} />
                </div>
                <div className="col-lg-4 col-md-12 mb-4 d-flex">
                    <PercentageChangeWidget data={percentageChange} />
                </div>
            </div>

            {/* Bottom Row (70% of the height) */}
            <div className="row d-flex align-items-stretch">
                <div className="col-12">
                    <HoldingsTable holdings={holdings} />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
