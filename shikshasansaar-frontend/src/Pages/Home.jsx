import React, { useState, useEffect } from 'react';
import './CSS/Home.css';
import Faculties from '../Components/Faculties/Faculties';
import Reviews from '../Components/Reviews/Reviews';
import Offers from '../Components/Offers/Offers';
import MotivationalQuote from '../Components/MotivationalQuote/MotivationalQuote';
import Counter from '../Components/Counter/Counter';
import FirstHello from '../Components/FirstHello/FirstHello';
import BlogsHome from '../Components/BlogsHome/BlogsHome';

import { Player } from '@lottiefiles/react-lottie-player';
import Loading from '../Components/assets/pro-library-loading.json';
import features from '../Components/assets/features.png';

const Home = () => {

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const [loading, setLoading] = useState(true);
  const [Profile, setProfile] = useState(true);

  useEffect(() => {
      const fetchProfile = async () => {
        const token = localStorage.getItem('auth-token');
        if (!token) {
          // Redirect to login if no token exists
          window.location.href = '/login';
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
          console.error(err.message || 'Failed to fetch user details');
          // Redirect to login if fetching profile fails
          window.location.href = '/login';
        }
      };
    
      fetchProfile();
    }, []);
  

  useEffect(() => {
    // Simulate loading time for the component
    const timer = setTimeout(() => setLoading(false), 1000); // Adjust time as needed
    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

  if (loading) {
    return (
      <div className="loading-main-whole-page">
        <h1></h1>
        <div className="loading">
          <Player
            autoplay
            loop
            src={Loading} // Path to your animation JSON file
            style={{
              height: '100px',
              width: '100px',
              margin: '0 auto',
            }} // Adjust size as needed
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <FirstHello />
      <div className="features-img"><img src={features} alt="features" className='features-image' /></div>
      <Counter targetStudents={8950} targetSuccessRate={93.5} />
      <Faculties />
      <MotivationalQuote />
      <BlogsHome />
      <Offers />
      <Reviews />
    </div>
  );
};

export default Home;
