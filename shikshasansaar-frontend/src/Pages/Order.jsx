import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';
import OrderDisplay from './../Components/OrderDisplay/OrderDisplay';
import { Player } from '@lottiefiles/react-lottie-player';
import Loading from '../Components/assets/pro-library-loading.json';

const Order = () => {
  const { all_products, buyItems } = useContext(ShopContext); // Access context
  const { orderId } = useParams(); // Get orderId from URL params

  const [loading, setLoading] = useState(true); // Loading state
  const [order, setOrder] = useState(null); // State to store matched order

  useEffect(() => {
    // Simulate a data-fetching delay and process the order data
    const timeout = setTimeout(() => {
      const orders = buyItems?.orders || []; // Safely access the orders array
      const matchedOrder = orders.find((e) => String(e.orderId) === String(orderId)); // Match order by orderId
      setOrder(matchedOrder || null); // Update the state with the matched order
      setLoading(false); // Turn off the loading spinner
    }, 1000); // Adjust delay as needed

    return () => clearTimeout(timeout); // Cleanup timeout
  }, [buyItems, orderId]); // Dependency array

  if (loading) {
    // Show the loading spinner while loading is true
    return (
      <div className="loading-container">
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
    );
  }

  return (
    <div>
      <h1></h1>
      {order ? (
        <OrderDisplay order={order} />
      ) : (
        <p>Order not found or invalid order ID.</p>
      )}
    </div>
  );
};

export default Order;
