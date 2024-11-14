// axiosConfig.js
import axios from 'axios';

// Create an Axios instance with the base URL
const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the authorization token
axiosInstance.interceptors.request.use(
    (config) => {
        // Get the token from localStorage or any secure storage
        const token = localStorage.getItem('authToken');
        if (token) {
            // Set the Authorization header
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Optionally handle logout or token refresh here
            console.log("Unauthorized, redirecting to login...");
            // You may want to clear the token and redirect the user to login
            localStorage.removeItem('authToken');
            window.location.href = '/login'; // Redirect to login page
        }
        // Handle errors globally
        console.error('API error:', error.response || error.message);
        return Promise.reject(error);
    }
);

export default axiosInstance;
