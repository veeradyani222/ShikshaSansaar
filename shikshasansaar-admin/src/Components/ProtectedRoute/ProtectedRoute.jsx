import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const ProtectedRoute = () => {
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        setAuthToken(token);
        
        if (!token) {
            navigate('/login', { replace: true });
        }
    }, [authToken, navigate]); // Rerun this effect whenever authToken or navigate changes

    return authToken ? <Outlet /> : null; // Render null to avoid flicker during redirect
};

export default ProtectedRoute;
