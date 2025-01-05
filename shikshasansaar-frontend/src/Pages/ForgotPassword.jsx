import React, { useState } from 'react';
import '../Pages/CSS/ForgotPassword.css';  // Make sure the CSS is adjusted accordingly

const ForgotPassword = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Remove any leading or trailing spaces and concatenate the country code
    const fullMobileNumber = `+91${mobileNumber.trim()}`;

    try {
      const response = await fetch(`${BACKEND_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile_number: fullMobileNumber }),
      });

      const data = await response.json();
      console.log('Response Data:', data); // Log the response data for debugging

      if (response.ok) {
        // Hide part of the email address for privacy
        const email = data.email;
        const hiddenEmail = email.replace(
          /(.{2})(.*)(?=@)/,
          (_, start, middle) => `${start}${'*'.repeat(middle.length)}`
        );

        setMessage(`Check your email at ${hiddenEmail} for the reset link.`);
      } else {
        setError(data.message || 'Failed to send reset link');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
    }
  };


  return (
    <div className="forgot-password-container">
      <h1>Forgot Password</h1>
      {error && <p className="error">{error}</p>}
      {message ? (
        <p className="message">{message}</p>
      ) : (
        <form onSubmit={handleSubmit} className="forgot-password-form">
          <div className="form-group">

            <div className="mobile-input-container">
              <span className="country-code">+91</span>
              <input
                type="text"
                id="mobileNumber"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value.replace(/\s+/g, ''))} // Remove spaces as user types
                required
                maxLength="13"
                pattern="\d*"
                placeholder="Enter your number"
              />

            </div>
          </div>
          <button type="submit" className="send-reset-link-btn">
            Send Reset Link
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
