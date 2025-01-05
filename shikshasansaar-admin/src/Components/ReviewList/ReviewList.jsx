import React, { useEffect, useState } from 'react';
import './ReviewList.css';
import cross_icon from '../assets/cart_cross_icon.png';

const ReviewList = () => {
  const [allReviews, setAllReviews] = useState([]); // Corrected the state name

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchInfo = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/allReviews`);
      const data = await response.json();
      setAllReviews(data); // Corrected function name
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const handleRemove = async (id) => {
    try {
      await fetch(`${BACKEND_URL}/removeReview`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ id })
      });
      fetchInfo(); // No need to await here; just call it
    } catch (error) {
      console.error("Error removing review:", error);
    }
  };

  return (
    <div className='review-product'>
      <div className="review-product-head">
        <p>ID</p>   
        <p>Name</p>
        <p>Review</p>
        <p>Date</p>
        <p>Remove</p>
      </div>
      <div className="review-product-main">
        <hr />
        {allReviews.map((review, index) => ( // Use allReviews instead of allproducts
          <div key={index} className="review-product-format-main review-product-format">
            <p>{review.id}</p> {/* Display ID */}
            <p>{review.name}</p> {/* Display Name */}
            <p>{review.review}</p> {/* Display Review Content */}
            <p>
  {new Date(review.date).toLocaleString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })}
</p>

            <button onClick={() => handleRemove(review.id)}>
              <img src={cross_icon} alt="Remove" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewList;
