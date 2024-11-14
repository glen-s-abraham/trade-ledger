import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';

// Create a context for auth
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || null);
    const navigate = useNavigate();

    useEffect(() => {
        if (authToken) {
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
            // Optionally fetch user data here if required
        }
    }, [authToken]);

    const login = async (username, password) => {
        try {
            const response = await axiosInstance.post('/api/auth/login', { email:username, password });
            const { token, user } = response.data;

            setAuthToken(token);
            setUser(user);
            localStorage.setItem('authToken', token);
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            navigate('/dashboard'); // Navigate to a protected route on successful login
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const logout = () => {
        setAuthToken(null);
        setUser(null);
        localStorage.removeItem('authToken');
        delete axiosInstance.defaults.headers.common['Authorization'];
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, authToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
