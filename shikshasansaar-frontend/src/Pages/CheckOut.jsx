import React, { useState , useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/CheckOut.css';
import logo from './../Components/assets/logo.png'
import { ShopContext } from './../Context/ShopContext';
import confetti from 'canvas-confetti';
import cartsound from './../Components/assets/cartsound.mp3'

const CheckoutPage = () => {
    const { all_products, all_Content ,  cartItems } = useContext(ShopContext);
    const [coupon, setCoupon] = useState('');
    const [discount, setDiscount] = useState(0);
    const [loading, setLoading] = useState(true); // New loading state
    const [buttonText, setButtonText] = useState('Apply');

     const navigate = useNavigate();
        const successSound = new Audio(cartsound);
    
        const key_id = process.env.REACT_APP_key_id;
    
        const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    

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
    
        const handlePayment = async () => {
            // Calculate final total including only coupon discount (ignoring product offers)
            const calculateFinalTotal = () => {
                const baseTotal = calculateTotal(); // Base cart total (sum of final prices)
                const discountAmount = baseTotal * (discount || 0); // Apply coupon discount
        
                // Final total after applying coupon discount
                return baseTotal - discountAmount;
            };
        
            const finalTotal = calculateFinalTotal().toFixed(2); // Ensures consistency in precision
            console.log("Final Total Amount Calculated:", finalTotal);
        
            if (!finalTotal || isNaN(finalTotal) || finalTotal <= 0) {
                console.error("Invalid final total amount:", finalTotal);
                alert("There was an issue calculating the total amount.");
                return;
            }
        
            // Prepare cart items array for backend
            const cartItemsArray = Object.values(cartItems);
            if (cartItemsArray.length === 0) {
                console.error("Cart is empty.");
                alert("Your cart is empty.");
                return;
            }
        
            // Mapping cart items to cartData
            const cartData = cartItemsArray.map(cartItem => ({
                productId: cartItem.productId,
                link: cartItem.link,
                quantity: cartItem.quantity,
                mode: cartItem.mode,
                views: cartItem.views,
                validity: cartItem.validity,
                newPrice: cartItem.newPrice,
                oldPrice: cartItem.oldPrice,
                attempt: cartItem.attempt || null,
                language: cartItem.language || null,
                bookType: cartItem.bookType || null,
                recording: cartItem.recording || null,
            }));
        
            console.log("Cart Data:", cartData);
        
            const token = localStorage.getItem('auth-token');
            if (!token) {
                console.error("User is not logged in. Missing auth-token.");
                alert("Please log in to make a payment.");
                return;
            }
        
            let userData;
            try {
                const response = await fetch(`${BACKEND_URL}/profile`, {
                    method: 'GET',
                    headers: { 'auth-token': token },
                });
                if (!response.ok) throw new Error("Failed to fetch user data");
                userData = await response.json();
                console.log("User Data Retrieved:", userData);
            } catch (error) {
                console.error("Error fetching user data:", error);
                alert("Error fetching user data. Please try again.");
                return;
            }
        
            const { first_name, last_name, email, mobile_number, _id: userId } = userData;
        
            console.log("User Data: ", { first_name, last_name, email, mobile_number, userId });
        
            const options = {
                key: key_id,
                amount: finalTotal * 100, // Convert to paise
                currency: "INR",
                name: "Pro-Library",
                description: "Test Transaction",
                image: logo,
                handler: async function (response) {
                    const paymentId = response.razorpay_payment_id;
                    if (!paymentId) {
                        console.error("Payment ID is missing.");
                        alert("Payment failed. Please try again.");
                        return;
                    }
        
                    console.log("Received Payment ID:", paymentId);
        
                    try {
                        const updateRes = await fetch(`${BACKEND_URL}/capture-payment`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'auth-token': token },
                            body: JSON.stringify({
                                paymentId,
                                amount: finalTotal,
                                userId,
                                cartData, // Send complete cart details
                                discount: discount || 0, // Pass applied discount for backend validation
                                offers: {}, // No product-specific offers, just coupon discount
                            }),
                        });
        
                        const result = await updateRes.json();
                        console.log("Payment Capture Response:", result);
        
                        if (!result.success) {
                            console.error("Error during payment capture:", result.message);
                            alert("Payment capture failed. Please try again.");
                            return;
                        }
        
                        console.log("Navigating to Thank You Page with Cart Data:", cartData);
                        navigate("/thank-you", { state: { cartData } });
                    } catch (error) {
                        console.error("Error while capturing payment:", error);
                        alert("An error occurred while capturing the payment. Please try again.");
                    }
                },
                prefill: { name: `${first_name} ${last_name}`, email, contact: mobile_number },
                notes: { address: "Customer's Address" },
                theme: { color: "#F37254" },
            };
        
            try {
                console.log("Opening Razorpay payment gateway...");
                const rzp1 = new window.Razorpay(options);
                rzp1.open();
            } catch (error) {
                console.error("Error opening Razorpay payment gateway:", error);
                alert("There was an error opening the Razorpay payment gateway. Please try again.");
            }
        };
        

    return (
        <div className="checkout-container">
            {/* Subtotal Header */}
            <center>
                <h1>Checkout</h1>
            </center>

            {/* Cart Items Table */}
            <div className="cart-wrapper">
                <div className="cart-table-container">
                    <table className="cart-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Mode</th>
                                <th>Views</th>
                                <th>Validity</th>
                                <th>Language</th>
                                <th>Attempt</th>
                                <th>Book Type</th>
                                <th>Recording</th>
                                <th>Quantity</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(cartItems).map(
                                ([compositeKey, { productId, mode, views, validity, language, attempt, bookType, recording, quantity, newPrice }]) => {
                                    const product = all_products.find((p) => p.id === productId);

                                    if (product) {
                                        const finalPrice = parseFloat(newPrice) * quantity;
                                        return (
                                            <tr key={compositeKey}>
                                                <td>{product.name}</td>
                                                <td>{mode}</td>
                                                <td>{views}</td>
                                                <td>{validity}</td>
                                                <td>{language}</td>
                                                <td>{attempt}</td>
                                                <td>{bookType}</td>
                                                <td>{recording}</td>
                                                <td>{quantity}</td>
                                                <td>₹{finalPrice.toFixed(2)}</td>
                                            </tr>
                                        );
                                    }
                                    return null;
                                }
                            )}
                        </tbody>

                        <tfoot>
                            {/* Coupon Discount */}
                            {discount > 0 && (
                                <tr>
                                    <td colSpan="9" className="cart-summary-label">
                                        Coupon Discount:
                                    </td>
                                    <td>₹{(calculateTotal() * discount).toFixed(2)}</td>
                                </tr>
                            )}

                            {/* Total Price (After Discount) */}
                            <tr>
                                <td colSpan="9" className="cart-summary-label">
                                    Total:
                                </td>
                                <td>
                                    ₹
                                    {(
                                        calculateTotal() -
                                        calculateTotal() * discount
                                    ).toFixed(2)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* Coupon Section */}
            <hr />
            <div className="coupon-section">
                <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="coupon-input"
                />
                <button
                    onClick={() => {
                        handleApplyCoupon(coupon);
                        setButtonText('Applied!');
                    }}
                    className="apply-coupon-button"
                >
                    {buttonText}
                </button>
            </div>

            {/* Buy Button */}
            <div className="buy-btn-cart">
                <button className="buy-button" onClick={handlePayment}>
                    Buy Now
                </button>
            </div>
        </div>
    );
};

export default CheckoutPage;
