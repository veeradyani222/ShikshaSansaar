import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CartItems.css';
import logo from '../assets/logo.png';
import { ShopContext } from '../../Context/ShopContext';
import confetti from 'canvas-confetti';
import cartsound from './../assets/cartsound.mp3'

const CartItems = () => {
    const { all_products, all_Content, cartItems, setCartItems, removeFromCart, decreaseQuantity, increaseQuantity,getImageSrcByCode } = useContext(ShopContext);
    const [coupon, setCoupon] = useState('');
    const [discount, setDiscount] = useState(0);
    const [loading, setLoading] = useState(true); // New loading state
    const [buttonText, setButtonText] = useState('Apply Coupon');
    const navigate = useNavigate();
    const successSound = new Audio(cartsound);

    const key_id = process.env.REACT_APP_key_id;

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

 
  const handleViewCoursesClick = () => {
    navigate('/Courses');
  };

    useEffect(() => {
        const storedCart = localStorage.getItem('cartItems');
        if (storedCart) {
            setCartItems(JSON.parse(storedCart)); // Load from localStorage if available
        }
    }, []);

    useEffect(() => {
        const initializeData = async () => {
            try {
                // Load cart items from localStorage
                const storedCart = localStorage.getItem('cartItems');
                if (storedCart) {
                    setCartItems(JSON.parse(storedCart));
                }

                // Simulate delay (e.g., fetching additional data)
                await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate a delay of 1.5 seconds
            } catch (error) {
                console.error("Error during initialization:", error);
            } finally {
                setLoading(false); // Stop loading after initialization
            }
        };

        initializeData();
    }, [setCartItems]);



    const handleApplyCoupon = () => {
        const foundCoupon = all_Content.find(content => content.promo_code === coupon);
        if (foundCoupon) {
            const discountPercent = foundCoupon.offer_percentage;
            const discountPercentage = discountPercent / 100;
            setDiscount(discountPercentage);
            setButtonText(`Congratulations! You got ${discountPercent}% discount`);
            triggerConfetti();

            // Play success sound
            successSound.play();  // This will play the sound on successful coupon application
        } else {
            alert('Invalid coupon code');
            setDiscount(0);
            setButtonText('Apply Coupon');
        }
    };

    const triggerConfetti = () => {
        confetti({
            particleCount: 550,
            spread: 1000,
            origin: { y: 0.5 },
            scalar: 5,
            colors: ['#FFC107', '#FF5722', '#03A9F4', '#8BC34A'],
        });
    };

    const calculateTotal = () => {
    return Object.entries(cartItems).reduce((total, [compositeKey, { quantity, newPrice, productId }]) => {
        // Find the product using productId
        const product = all_products.find(p => p.id === productId);

        if (product) {
            const selectedPrice = newPrice || product.new_price;

            // Add the newPrice to the total (multiply by quantity)
            return total + (selectedPrice * quantity);
        }

        return total;
    }, 0);
};



    const handleImageClick = (id) => {
        navigate(`/product/${id}`);
    };

    const handleCheckout = () => {
        navigate('/CheckOut'); // This will navigate to the checkout page
      };
    

     // If cart is empty, show message
     if (!cartItems || Object.keys(cartItems).length === 0) {
        return (
            <div className="empty-cart-message-main">
            <div className="empty-cart-message">
              <h2>Your cart is empty</h2>
              <p>You have no items in your cart.</p>
              <p className='view-courses' onClick={handleViewCoursesClick} >
                View courses
              </p>
            </div>
          </div>
        );
    }
    
    return (
     <div className="cart-items">
    <div className="cartitems-container">
        {Object.keys(cartItems).map((compositeKey) => {
            const cartItem = cartItems[compositeKey];
            const { productId, mode, views, validity, oldPrice, newPrice, quantity, language, attempt, recording, bookType } = cartItem;

            // Find the product using productId
            const product = all_products.find(p => p.id === productId);

            if (product) {
                const selectedPrice = newPrice || product.new_price;

                // Remove offer logic since offers are no longer needed
                const discountedPrice = selectedPrice;

                return (
                    <div key={compositeKey} className="cartitem-wrapper">
                        <div className="cartitem-content">
                            <div className="cartitem-left">
                                <img
                                   src={getImageSrcByCode(product.image_code)}
                                    alt={product.name}
                                    className="cartitem-product-icon"
                                    onClick={() => handleImageClick(product.id)}
                                />
                            </div>
                            <div className="cartitem-right">
                                <p className="cartitem-name">{product.name}</p>

                                {/* Remove offer-related content */}
                                {/* <p className="cartitem-offer-applied">{offerAppliedText}</p> */}

                                <p className="cartitem-details">
                                    <table className="cartitem-table">
                                        <tbody>
                                            <tr>
                                                <td className="cartitem-table-header">Mode:</td>
                                                <td>{mode}</td>
                                            </tr>
                                            <tr>
                                                <td className="cartitem-table-header">Validity:</td>
                                                <td>{validity}</td>
                                            </tr>
                                            <tr>
                                                <td className="cartitem-table-header">Views:</td>
                                                <td>{views}</td>
                                            </tr>
                                            <tr>
                                                <td className="cartitem-table-header">Language:</td>
                                                <td>{language}</td>
                                            </tr>
                                            <tr>
                                                <td className="cartitem-table-header">Attempt:</td>
                                                <td>{attempt}</td>
                                            </tr>
                                            <tr>
                                                <td className="cartitem-table-header">Book Type:</td>
                                                <td>{bookType}</td>
                                            </tr>
                                            <tr>
                                                <td className="cartitem-table-header">Recording:</td>
                                                <td>{recording}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </p>

                             <div className="end-area-cart">
                             <p className="cartitem-finalprice">
                                  ₹{(discountedPrice * quantity).toFixed(2)}
                                </p>

                                <div className="cartitem-quantity">
                                  
                                    <div
                                        className="quantity-button"
                                        onClick={() =>
                                            decreaseQuantity(
                                                productId,
                                                mode,
                                                views,
                                                validity,
                                                attempt,
                                                language,
                                                recording,
                                                bookType,
                                                oldPrice,
                                                newPrice,
                                                quantity
                                            )
                                        }
                                        disabled={quantity <= 1}
                                    >
                                        -
                                    </div>
                                    <span className="cartitem-quantity-display">{quantity}</span>
                                    <div
                                        className="quantity-button"
                                        onClick={() =>
                                            increaseQuantity(
                                                productId,
                                                mode,
                                                views,
                                                validity,
                                                attempt,
                                                language,
                                                recording,
                                                bookType,
                                                oldPrice,
                                                newPrice,
                                                quantity
                                            )
                                        }
                                    >
                                        +
                                    </div>
                                </div>

                                <button
                                    className="cartitem-remove"
                                    onClick={() => removeFromCart(
                                        productId,
                                        mode,
                                        views,
                                        validity,
                                        attempt,
                                        language,
                                        recording,
                                        bookType,
                                        oldPrice,
                                        newPrice,
                                    )}
                                >
                                    Remove from cart
                                </button>
                             </div>
                            </div>
                        </div>
                    </div>
                );
            }
            return null;
        })}
 
               




               <div className="buy-btn-cart"> <button className="buy-button" onClick={handleCheckout}>Proceed To checkout</button></div>
            </div>
        </div>

    );
};

export default CartItems;
