import React, { useState } from 'react';
import './SubscriberEmail.css'

const SubscriberEmail = () => {
    const [message, setMessage] = useState(''); // To hold the admin's message
    const [responseMessage, setResponseMessage] = useState(''); // To show success or error messages

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload

        if (message.trim() === '') {
            setResponseMessage('Message cannot be empty.');
            return;
        }

        try {
            const response = await fetch(`${BACKEND_URL}/sendmessages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }), // Send message in the body
            });

            const result = await response.json();

            if (result.success) {
                setResponseMessage('Message sent successfully!');
                setMessage(''); // Clear the input field
            } else {
                setResponseMessage('Failed to send message. Please try again.');
            }
        } catch (error) {
            console.error("Error:", error);
            setResponseMessage('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="admin-panel">
            <h2>Send Message to All Subscribers</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)} // Update message state
                    rows="5"
                    className="admin-message-textarea"
                />
                <button type="submit" className="admin-submit-button">Send Message</button>
            </form>
            {responseMessage && <p className="response-message">{responseMessage}</p>} {/* Display the response message */}
        </div>
    );
};

export default SubscriberEmail;
