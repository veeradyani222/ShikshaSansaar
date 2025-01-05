import React from 'react';
import './ReviewItem.css';

const ReviewItem = (props) => {


  return (
    <div className='ReviewItem-container'>
      <div className="rv-main-container">
      <div className="ReviewItem-name">{props.name}</div>
      <div className="ReviewItem-review">{props.review}</div>
      {/* Format the date before displaying */}
      <div className="ReviewItem-date">
  {new Date(props.date).toLocaleString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true 
  })}
</div>

      </div>
    </div>
  );
}

export default ReviewItem;
