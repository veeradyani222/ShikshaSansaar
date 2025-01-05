import React, { useState, useEffect } from 'react';
import './CSS/Wishlist.css';
import WishlistItems from '../Components/WishlistItems/WishlistItems';
import { Player } from '@lottiefiles/react-lottie-player';
import Loading from '../Components/assets/pro-library-loading.json';

const Wishlist = () => {
  // State for loading
  const [loading, setLoading] = useState(true);

  // Simulate a delay for loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000); // Adjust the delay as needed
    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  if (loading) {
    return (
      <div className="loading-main-whole-page">
        <h1></h1>
        <div className="loading">
          <Player
            autoplay
            loop
            src={Loading}
            style={{
              height: '100px',
              width: '100px',
              margin: '0 auto',
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <WishlistItems />
    </div>
  );
};

export default Wishlist;
