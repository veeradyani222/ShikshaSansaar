import React, { useState, useEffect } from 'react';
import './FirstHello.css';
import BottomLine from './../BottomLine/index'
import Categories from '../Categories/Categories';

const FirstHello = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL; // Ensure BACKEND_URL is set in .env

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        setError('Please log in to perform this action.');
        return;
      }
      
      try {
        const response = await fetch(`${BACKEND_URL}/profile`, {
          method: 'GET',
          headers: { 'auth-token': token },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(true); // Set error state to true
      }
    };

    fetchProfile();
  }, [BACKEND_URL]);

  return (
    <div className="FirstHello">
      {error || !profile ? (
        <>
          <h1 className="greeting">Hello User! What are you looking for?</h1>

          <BottomLine />
          <Categories />
        </>
      ) : (
        <>
          <h1 className="greeting">Hello {profile.first_name}! What are you looking for?</h1>
          <BottomLine />
          <div className="search-container">
            <Categories />
          </div>
        </>
      )}
    </div>
  );
};

export default FirstHello;