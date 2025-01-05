import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './WishlistItems.css';
import { ShopContext } from '../../Context/ShopContext';
import Item from '../Item/Item';

const WishlistItems = () => {
  const { all_products, wishlistItems , getImageSrcByCode } = useContext(ShopContext);

  const navigate = useNavigate();
    const handleViewCoursesClick = () => {
      navigate('/Courses');
    };
    
  if (!wishlistItems  || Object.keys(wishlistItems ).length === 0) {
    return (
        <div className="empty-cart-message-main">
        <div className="empty-cart-message">
          <h2>Your Wishlist is empty</h2>
          <p>You have no items in your Wishlist.</p>
          <p className='view-courses' onClick={handleViewCoursesClick} >
            View courses
          </p>
        </div>
      </div>
    );
}

  return (
    <div className="wishlist-items">
      {all_products.map((item) => {
        // Check if the item is in the wishlist
        if (wishlistItems[item.id] > 0) {
          return (
            <Item
              key={item.id}
              id={item.id}
              name={item.name}
              image={getImageSrcByCode(item.image_code)}
              category={item.category}
              sub_category={item.sub_category}
              lecturer={item.lecturer}
              new_price={item.new_price}
              old_price={item.old_price}
              tag={item.tag}
              lecture_duration={item.lecture_duration}
            />
          );
        }
        return null; // If item is not in the wishlist, return null
      })}
      
    </div>
  );
};

export default WishlistItems;
