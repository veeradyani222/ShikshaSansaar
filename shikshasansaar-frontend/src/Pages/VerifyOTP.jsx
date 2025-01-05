import React, { useState } from 'react';

const VerifyOTP = ({ email }) => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL; 

  const verifyOTP = async () => {
    const response = await fetch(`${BACKEND_URL}/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });
    const data = await response.json();
    setMessage(data.message || data.errors);
  };

  return (
    <div>
      <h1></h1>
      <h2>Enter OTP sent to {email}</h2>
      <input 
        type="text" 
        value={otp} 
        onChange={(e) => setOtp(e.target.value)} 
        placeholder="Enter OTP" 
      />
      <button onClick={verifyOTP}>Verify OTP</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default VerifyOTP;
