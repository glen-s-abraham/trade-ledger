import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth(); // Use the login function from AuthContext
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(username, password); // Use login from context
      navigate('/dashboard'); // Redirect to dashboard after successful login
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: '#f9fafb' }}>
      <div className="card p-4" style={{ width: '360px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        <h3 className="text-center mb-4" style={{ color: '#1E1E61' }}>Welcome Back</h3>
        <p className="text-center text-muted">Please log in to your account</p>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-person"></i></span>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-lock"></i></span>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            style={{
              backgroundColor: '#1E1E61',
              borderColor: '#1E1E61',
              borderRadius: '8px',
            }}
          >
            <i className="bi bi-box-arrow-in-right me-2"></i>Login
          </button>
        </form>

        <div className="text-center mt-3">
          <small className="text-muted">Forgot your password? <a href="#" style={{ color: '#7373C5' }}>Reset it here</a></small>
        </div>

        <div className="text-center mt-2">
          <small className="text-muted">
            Don’t have an account? <Link to="/register" style={{ color: '#1E1E61', fontWeight: '500' }}>Register here</Link>
          </small>
        </div>
      </div>
    </div>
  );
}

export default Login;
