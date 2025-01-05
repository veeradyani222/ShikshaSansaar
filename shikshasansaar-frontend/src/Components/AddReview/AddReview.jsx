import React, { useState } from 'react';
import './AddReview.css';

const AddReview = () => {
  const [review, setReview] = useState({
    name: "",
    review: ""
  });

  const changeHandler = (e) => {
    setReview({ ...review, [e.target.name]: e.target.value });
  };

  const addReview = async (e) => {
    e.preventDefault();
    console.log(review);

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;


    await fetch(`${BACKEND_URL}/addReview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(review),
    })
    .then((resp) => resp.json())
    .then((data) => {
      data.success ? alert("Review Added!") : alert("Failed to add review!");
    });
  };

  return (
    <div className="review-form-container">
      <h1 className="review-heading">Thank you! Please write an honest review. It helps us improve and shows our credibility</h1>
      <form className="review-form" onSubmit={addReview}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          className="review-input"
          value={review.name}
          onChange={changeHandler}
        />
        <textarea
          name="review"
          placeholder="Your Review"
          className="review-textarea"
          value={review.review}
          onChange={changeHandler}
        />
        <button type="submit" className="review-submit-button">Submit Review</button>
      </form>

    
    </div>
  );
};

export default AddReview;
