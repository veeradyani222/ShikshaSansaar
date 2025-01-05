import React, { useState, useEffect } from 'react';
import './LoginEmployee.css'
import { Navigate } from 'react-router-dom';

const LoginEmployee = ({ setAuthToken }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');
    const [redirectToDashboard, setRedirectToDashboard] = useState(false);

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setRedirectToDashboard(true);
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${BACKEND_URL}/login-employee`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, role }),
            });

            if (!response.ok) {
                throw new Error("Login failed. Check your credentials.");
            }

            const data = await response.json();
            const { token, features } = data;

            // Store token and features in local storage
            localStorage.setItem('authToken', token);
            localStorage.setItem('features', JSON.stringify(features)); // Store features as a JSON string
            setAuthToken(token);

            setRedirectToDashboard(true);
        } catch (error) {
            setError(error.message);
        }
    };

    if (redirectToDashboard) {
        return <Navigate to="/admin-dashboard" />;
    }

    return (
        <div className="fullscreen-wrapper">
        <div className='login-employee-container'>
            <h2>Employee Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                />
                <button type="submit" disabled={!username || !password || !role}>Login</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    </div>
    );
};

export default LoginEmployee;
