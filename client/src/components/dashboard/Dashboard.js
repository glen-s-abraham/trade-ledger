import React, { useState, useEffect } from 'react';
import TotalPnLWidget from './widgets/TotalPnLWidget';
import PercentageChangeWidget from './widgets/PercentageChangeWidget';
import HoldingsTable from './widgets/HoldingsTable';
import InvestedValueWidget from './widgets/InvestedValueWidget.js';


function Dashboard() {
    const [holdings, setHoldings] = useState([]);
    const [percentageChange, setPercentageChange] = useState({});
    const [totalPnL, setTotalPnL] = useState({});
    const [totalInvested, setTotalInvested] = useState({});

    useEffect(() => {
        setHoldings([
            { totalQuantity: 2, stockSymbol: "prestige.ns", averagePrice: 571.5 },
            { totalQuantity: 2, stockSymbol: "FEDERALBNK.NS", averagePrice: 127.2 },
            { totalQuantity: 4, stockSymbol: "zomato.ns", averagePrice: 85.24 },
            { totalQuantity: 2, stockSymbol: "petronet.ns", averagePrice: 231.33 },
            { totalQuantity: 3, stockSymbol: "coalindia.ns", averagePrice: 230.7 },
            { totalQuantity: 1, stockSymbol: "infy.ns", averagePrice: 1330 },
        ]);

        setPercentageChange({
            totalInvestedAmount: 5000,
            currentMarketValue: 10000,
            percentageChange: 100
        });

        setTotalPnL({ totalPnL: -10000 });

        setTotalInvested({ totalInvested: 5000 });
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

