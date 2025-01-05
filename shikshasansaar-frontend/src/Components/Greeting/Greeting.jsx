import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faHeart } from '@fortawesome/free-regular-svg-icons';
import { faSun as solidSun, faCloudSun } from '@fortawesome/free-solid-svg-icons';
import './Greeting.css';

const Greeting = () => {
    const [profile, setProfile] = useState(null);
    const [greetingMessage, setGreetingMessage] = useState("");
    const [error, setError] = useState(null);

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('auth-token');
            if (!token) {
                setError("Please log in to perform this action.");
                return;
            }

            try {
                const response = await fetch(`${BACKEND_URL}/profile`, {
                    method: 'GET',
                    headers: { 'auth-token': token }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user details');
                }

                const data = await response.json();
                setProfile(data);
            } catch (err) {
                setError(err.message || 'Failed to fetch user details');
            }
        };

        const fetchGreetingMessage = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/allGreetingMessage`);
                if (!response.ok) {
                    throw new Error('Failed to fetch greeting message');
                }

                const messages = await response.json();
                if (messages.length > 0) {
                    setGreetingMessage(messages[0].greeting_message); // Assuming the first message is the latest
                }
            } catch (err) {
                setError(err.message || 'Failed to fetch greeting message');
            }
        };

        fetchProfile();
        fetchGreetingMessage();
    }, []);

    const getTimeOfDayGreeting = () => {
        const hours = new Date().getHours();
        if (hours < 12) {
            return <><FontAwesomeIcon icon={solidSun} /> &nbsp; Good Morning</>;
        } else if (hours < 18) {
            return <><FontAwesomeIcon icon={faCloudSun} />  &nbsp; Good Afternoon</>;
        } else {
            return <><FontAwesomeIcon icon={faMoon} />  &nbsp; Good Evening</>;
        }
    };

    // If there's an error or no profile, show a default greeting
    const greeting = getTimeOfDayGreeting();
    const defaultFirstName = "Guest"; // In case we don't have the user's name
    const firstName = profile ? (
        <>
            {profile.first_name} &nbsp; <FontAwesomeIcon icon={faHeart} />
        </>
    ) : defaultFirstName;
    

    return (
        <div className="greeting-container">
            {error ? (
                <h1>{greeting} {firstName}, {greetingMessage || "Good Morning!"}</h1> // Show fallback greeting and message in case of error
            ) : (
                <h1>{greeting} {firstName}, {greetingMessage || "Welcome to our site!"}</h1>
            )}
        </div>
    );
};

export default Greeting;
