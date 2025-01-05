import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/ThankYouPage.css'; // Importing CSS for styling

const ThankYouPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect directly to the orders section and reload the page after the redirection
        const timer = setTimeout(() => {
            navigate('/profile', { state: { view: 'orders' } });
            window.location.reload(); // Reload the page after redirection
        }, 3000); // Redirect after 3 seconds

        return () => clearTimeout(timer); // Clean up the timer on unmount
    }, [navigate]);

    return (
        <div className="thank-you-container">
            <h1>Thank You for Your Purchase!</h1>
            <p>You are being redirected to your orders. Please View the complete order for your links and status.</p>
            <p>All The Best!</p>
        </div>
    );
};

export default ThankYouPage;
