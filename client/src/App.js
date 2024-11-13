import logo from './logo.svg';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import Sidebar from './components/sidebar/Sidebar';
import Dashboard from './components/dashboard/Dashboard';
import Trades from './components/trades/Trades';
import HistoricalData from './components/historicalData/HistoricalData';

function App() {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        {/* <Dashboard /> */}
        {/* <Trades/> */}
        <HistoricalData />
      </div>
    </div>
  );
}

export default App;
