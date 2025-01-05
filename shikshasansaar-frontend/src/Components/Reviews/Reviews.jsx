import React, { useContext } from 'react';
import './Reviews.css';
import { ShopContext } from '../../Context/ShopContext';
import ReviewItem from '../ReviewItem/ReviewItem';

const Reviews = () => {
  const { all_reviews } = useContext(ShopContext);

  return (
    <div className="reviews-main-container">
      <div className="courses-container1" id="reviews-container">
        <div className="courses-wrapper">
          {all_reviews && all_reviews.length > 0 ? (
            all_reviews.map((review) => (
              <ReviewItem
                key={review.id}
                id={review.id}
                name={review.name}
                review={review.review}
                date={review.date}
              />
            ))
          ) : (
            <p>No reviews available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
