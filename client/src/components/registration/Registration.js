// RegistrationForm.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
function RegistrationForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        try {
            const response = await axiosInstance.post('/api/auth/register', {
                email,
                password,
            });

            if (response.status === 201) {
                setSuccess('User registered successfully!');
                setTimeout(() => navigate('/login'), 1500); // Redirect to login after 1.5 seconds
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setError('Email already exists');
            } else {
                setError('Error registering user');
            }
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: '#f9fafb' }}>
            <div className="card p-4" style={{ maxWidth: '400px', width: '100%', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                <h3 className="text-center mb-4" style={{ color: '#1E1E61' }}>Create an Account</h3>
                <p className="text-center text-muted">Please fill in the details to register</p>
                
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                placeholder="Create a password"
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
                        <i className="bi bi-person-plus me-2"></i>Register
                    </button>
                </form>
                
                <div className="text-center mt-3">
                    <small className="text-muted">Already have an account? <Link to="/login" style={{ color: '#1E1E61', fontWeight: '500' }}>Login here</Link></small>
                </div>
            </div>
        </div>
    );
}

export default RegistrationForm;
