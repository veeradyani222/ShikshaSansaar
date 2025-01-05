import React, { useState, useEffect } from 'react';
import CartItems from '../Components/CartItems/CartItems';
import { Player } from '@lottiefiles/react-lottie-player';
import Loading from '../Components/assets/pro-library-loading.json';

const Cart = () => {
  // State for loading
  const [loading, setLoading] = useState(true);

  // Handle page reload on first visit
  useEffect(() => {
    const hasReloaded = localStorage.getItem('hasReloaded');
    if (!hasReloaded) {
      localStorage.setItem('hasReloaded', 'true'); // Set the flag
      window.location.reload(); // Reload the page
    }
  }, []);

  // Simulate a delay for loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000); // Adjust the delay as needed
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
    <div className="cart-page">
      <center><h1 style={{ color: 'black' , marginTop:'3vh'}}>My Cart</h1>
      </center>
      <CartItems />
    </div>
  );
};

export default Cart;
