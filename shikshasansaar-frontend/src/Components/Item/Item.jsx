import React, { useContext, useEffect, useState } from 'react';
import './Item.css';
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';
import heart_gray from './../assets/heart_gray.svg';
import heart_red from './../assets/heart_red.svg';
import whatsapp from './../assets/whatsapp.svg';
import heart_animation from './../assets/lottie_heart.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import ReactStars from 'react-rating-stars-component';
import Lottie from 'lottie-react';

const Item = (props) => {
  const { all_Content } = useContext(ShopContext);
  const content = all_Content[0];
  const { addToWishlist, removeFromWishlist, currentUser } = useContext(ShopContext);
  const [isHeartClicked, setIsHeartClicked] = useState(false);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const navigate = useNavigate();

  const whatsappNumber = content.contact_numbers[0];
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}`;

  useEffect(() => {
    const userWishlistState = localStorage.getItem(`wishlist_${currentUser?.id}`);
    const parsedWishlist = userWishlistState ? JSON.parse(userWishlistState) : {};
    if (parsedWishlist[props.id]) {
      setIsHeartClicked(true);
    }
  }, [props.id, currentUser]);

  const handleHeartClick = () => {
    if (!localStorage.getItem('auth-token')) {
      navigate('/login');
      return;
    }
    const userWishlistState = localStorage.getItem(`wishlist_${currentUser?.id}`);
    let parsedWishlist = userWishlistState ? JSON.parse(userWishlistState) : {};
    if (isHeartClicked) {
      removeFromWishlist(props.id);
      setIsHeartClicked(false);
      delete parsedWishlist[props.id];
    } else {
      addToWishlist(props.id);
      setIsHeartClicked(true);
      parsedWishlist[props.id] = true;
      setShowHeartAnimation(true);
      setTimeout(() => setShowHeartAnimation(false), 2000); // Animation duration
    }
    localStorage.setItem(`wishlist_${currentUser?.id}`, JSON.stringify(parsedWishlist));
  };

  const formatToIndianCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const reviewCount = props.reviews?.length || 0;
  const mainReview = props.main_review || 0;

  const getAverageLectureDuration = (lectureDuration) => {
    // Helper function to calculate average of large numbers
    const calculateAverageDuration = (durationString) => {
      const numbers = durationString.match(/\d+/g); // Extract all numbers from the string
      if (!numbers) return "0"; // If no numbers, return 0

      // Convert to numbers and filter out small values (e.g., less than 10)
      const largeNumbers = numbers.map(Number).filter(num => num >= 10);

      if (largeNumbers.length === 0) return "0"; // If no large numbers, return 0

      // Calculate average
      const sum = largeNumbers.reduce((acc, curr) => acc + curr, 0);
      const average = Math.round(sum / largeNumbers.length);

      return average;
    };

    // Check if lecture_duration is a simple number or a string with complex data
    if (typeof lectureDuration === 'number') {
      return `${lectureDuration} hours`;
    } else if (typeof lectureDuration === 'string') {
      const avgDuration = calculateAverageDuration(lectureDuration);
      return `${avgDuration} hours`;
    } else {
      return "Invalid duration";
    }
  };

  return (
    <div className="item" style={{ display: props.hide ? 'none' : 'block' }}>
      <div className="item-tag">
  {props.tag &&
    props.tag.split('/').map((tag, index, arr) => {
      // Determine the maximum number of tags to display
      const maxTags = window.innerWidth > 480 ? 4 : 3;

      if (index < maxTags) {
        return <span key={index} className="tag-item">{tag.trim()}</span>;
      } else if (index === maxTags && arr.length > maxTags) {
        // Add ellipsis if there are more tags than the limit
        return <span key={index} className="tag-item">...</span>;
      }
      return null;
    })
  }
</div>


      <Link to={`/product/${props.id}`}>
        <div className="item-above">
          <img src={props.image} alt="product_image" />
          <div className="item-details">
            <p className="item_name">
              {props.name.length > (window.innerWidth <= 480 ? 40 : 60) ? `${props.name.slice(0, window.innerWidth <= 480 ? 40 : 60)}..` : props.name}
            </p>

            <div className="imp-details">
              <div className="duration">
                <FontAwesomeIcon icon={faClock} />
                <p>{getAverageLectureDuration(props.lecture_duration)}</p>
              </div>
              <div className="review-section-main-item">
                <p>{reviewCount > 0 ? `${reviewCount} Reviews` : '0 Reviews'}</p>
                <ReactStars
                  count={5}
                  value={mainReview}
                  size={window.innerWidth <= 480 ? 15 : 24}
                  activeColor="#FF4500"
                  emptyColor="#e4e5e9"
                  isHalf={true}
                  edit={false}
                />
              </div>
            </div>
          </div>
        </div>
      </Link>

      <div className="other_details_items">
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="whatsapp-button">
          <img src={whatsapp} alt="" className="whatsapp-icon" />
        </a>
        <div className="item_prices">
          <div className="new_price">{formatToIndianCurrency(props.new_price)}</div>
          <div className="old_price">{formatToIndianCurrency(props.old_price)}</div>
        </div>

        <div className="heart-button" onClick={handleHeartClick}>
          <img src={isHeartClicked ? heart_red : heart_gray} alt="heart" className="heart-icon" />
          {showHeartAnimation && (
            <Lottie animationData={heart_animation} className="heart-animation" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Item;
