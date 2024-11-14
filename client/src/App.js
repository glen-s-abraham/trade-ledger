import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import Sidebar from './components/sidebar/Sidebar';
import Dashboard from './components/dashboard/Dashboard';
import Trades from './components/trades/Trades';
import HistoricalData from './components/historicalData/HistoricalData';
import Reports from './components/report/Reports';
import Login from './components/login/Login'; // assuming you have a login component
import { AuthProvider, useAuth } from './contexts/AuthContext';
import RegistrationForm from './components/registration/Registration';

const PrivateRoute = ({ children }) => {
  const { authToken } = useAuth();
  return authToken ? children : <Navigate to="/login" />;
};

function App() {
  const location = useLocation(); // Use location here within the component function
  const isLoginPage = location.pathname === '/login' || location.pathname === '/register';
  return (

    <AuthProvider> {/* AuthProvider should be inside Router */}
      <div className="d-flex">
        {!isLoginPage && <Sidebar />}
        <div className="flex-grow-1">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/trades"
              element={
                <PrivateRoute>
                  <Trades />
                </PrivateRoute>
              }
            />
            <Route
              path="/historical-data"
              element={
                <PrivateRoute>
                  <HistoricalData />
                </PrivateRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <PrivateRoute>
                  <Reports />
                </PrivateRoute>
              }
            />
            {/* Redirect root to Dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </div>
    </AuthProvider>

  );
}

export default App;
