import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Correct imports from react-router-dom
import './../Pages/CSS/ResetPassword.css';
import { Player } from '@lottiefiles/react-lottie-player';
import Loading from '../Components/assets/pro-library-loading.json';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false); // State for loading spinner
  const location = useLocation();
  const navigate = useNavigate(); // Use useNavigate for redirecting

  // Extract the token from the URL
  const token = new URLSearchParams(location.search).get('token');

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true); // Show loading spinner during the API request

    try {
      const response = await fetch(`${BACKEND_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword, confirmPassword }),
      });

      const data = await response.json();
      console.log('Response Data:', data); // Log the response data for debugging

      if (response.ok) {
        setSuccess("Password successfully reset");
        setError(''); // Clear any previous errors
        setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2 seconds
      } else {
        setError(data.message || "Failed to reset password");
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false); // Hide loading spinner after API call
    }
  };

  return (
    <div className="reset-password-container">
      <h1>Reset Your Password</h1>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      
      {loading ? (
        // Display loading spinner while the API call is in progress
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
      ) : (
        // Display form when not loading
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Reset Password</button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
