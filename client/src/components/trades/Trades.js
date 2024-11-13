import React, { useState } from 'react';
import TradeForm from './subComponents/TradeForm';
import TradeTable from './subComponents/TradeTable';

function Trades() {
    const dummyTrades = [
        {
            "_id": "67331ce3bfa2a3c315d248c1",
            "user": "67331c75bfa2a3c315d248b9",
            "stockSymbol": "infy.ns",
            "transactionType": "Buy",
            "quantity": 2,
            "price": 1330,
            "tradeDate": "2023-07-03T00:00:00.000Z",
            "status": "Open",
            "__v": 0
        },
        {
            "_id": "67331d83bfa2a3c315d248c5",
            "user": "67331c75bfa2a3c315d248b9",
            "stockSymbol": "infy.ns",
            "transactionType": "Sell",
            "quantity": 2,
            "price": 1453.85,
            "tradeDate": "2023-07-04T00:00:00.000Z",
            "status": "Open",
            "__v": 0
        },
        {
            "_id": "67331f30bfa2a3c315d248dd",
            "user": "67331c75bfa2a3c315d248b9",
            "stockSymbol": "gail.ns",
            "transactionType": "Buy",
            "quantity": 23,
            "price": 106.2,
            "tradeDate": "2023-07-04T00:00:00.000Z",
            "status": "Open",
            "__v": 0
        },
        {
            "_id": "67331f57bfa2a3c315d248e2",
            "user": "67331c75bfa2a3c315d248b9",
            "stockSymbol": "gail.ns",
            "transactionType": "Sell",
            "quantity": 23,
            "price": 117.5,
            "tradeDate": "2023-07-06T00:00:00.000Z",
            "status": "Open",
            "__v": 0
        },
        {
            "_id": "67331fdabfa2a3c315d248ef",
            "user": "67331c75bfa2a3c315d248b9",
            "stockSymbol": "suzlon.ns",
            "transactionType": "Buy",
            "quantity": 65,
            "price": 15.75,
            "tradeDate": "2023-07-03T00:00:00.000Z",
            "status": "Open",
            "__v": 0
        },
        {
            "_id": "67331ff3bfa2a3c315d248f3",
            "user": "67331c75bfa2a3c315d248b9",
            "stockSymbol": "suzlon.ns",
            "transactionType": "Sell",
            "quantity": 65,
            "price": 18.4,
            "tradeDate": "2023-07-04T00:00:00.000Z",
            "status": "Open",
            "__v": 0
        },
        {
            "_id": "67332031bfa2a3c315d248fa",
            "user": "67331c75bfa2a3c315d248b9",
            "stockSymbol": "petronet.ns",
            "transactionType": "Buy",
            "quantity": 4,
            "price": 231.33,
            "tradeDate": "2023-07-11T00:00:00.000Z",
            "status": "Open",
            "__v": 0
        },
        {
            "_id": "6733204abfa2a3c315d248fe",
            "user": "67331c75bfa2a3c315d248b9",
            "stockSymbol": "petronet.ns",
            "transactionType": "Sell",
            "quantity": 4,
            "price": 228.8,
            "tradeDate": "2023-07-12T00:00:00.000Z",
            "status": "Open",
            "__v": 0
        },
        {
            "_id": "6733216cbfa2a3c315d24910",
            "user": "67331c75bfa2a3c315d248b9",
            "stockSymbol": "prestige.ns",
            "transactionType": "Buy",
            "quantity": 12,
            "price": 571.5,
            "tradeDate": "2023-08-29T00:00:00.000Z",
            "status": "Open",
            "__v": 0
        },
        {
            "_id": "67332185bfa2a3c315d24914",
            "user": "67331c75bfa2a3c315d248b9",
            "stockSymbol": "prestige.ns",
            "transactionType": "Sell",
            "quantity": 12,
            "price": 680.05,
            "tradeDate": "2023-08-29T00:00:00.000Z",
            "status": "Open",
            "__v": 0
        }
    ];

    const [trades, setTrades] = useState(dummyTrades);
    const [selectedTrade, setSelectedTrade] = useState(null);
    const [mode, setMode] = useState('create');

    const handleFormSubmit = (trade) => {
        if (mode === 'create') {
            const newTrade = { ...trade, _id: (trades.length + 1).toString(), status: "Open" };
            setTrades([...trades, newTrade]);
        } else {
            setTrades(trades.map(t => (t._id === selectedTrade._id ? trade : t)));
            setMode('create');
            setSelectedTrade(null);
        }
    };

    const handleEdit = (trade) => {
        setSelectedTrade(trade);
        setMode('update');
    };

    const handleDelete = (id) => {
        setTrades(trades.filter(trade => trade._id !== id));
    };

    const handleCancel = () => {
        setSelectedTrade(null);
        setMode('create');
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
            <TradeTable
                trades={trades}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
}

export default Trades;
