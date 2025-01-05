import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CSS/LoginSignup.css';

const LoginSignup = () => {
  const [state, setState] = useState("Sign up");
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    password: "",
    email: "",
    mobile_number: "+91" // Prefilled country code for India
  });

  const [otp, setOtp] = useState(""); // State for OTP
  const [otpSent, setOtpSent] = useState(false); // State to track if OTP was sent
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [otpVerified, setOtpVerified] = useState(false); // State for OTP verification status
  const navigate = useNavigate(); // To navigate after successful verification
  const [resendTimer, setResendTimer] = useState(0); // Timer for resend OTP

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const changeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };



useEffect(() => {
  let timerInterval;
  if (resendTimer > 0) {
    timerInterval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
  }
  return () => clearInterval(timerInterval);
}, [resendTimer]);


  const validateInputs = () => {
    const { first_name, last_name, password, email, mobile_number } = formData;
    if (state === "Sign up" && !first_name) {
        setMessage("Please enter your complete name.");
        setMessageType("error");
        return false;
    }
    if (state === "Sign up" && !last_name) {
      setMessage("Please enter your complete name.");
      setMessageType("error");
      return false;
    }
    if (!email || !password || (state === "Sign up" && !mobile_number)) {
        setMessage("Please fill in all fields.");
        setMessageType("error");
        return false;
    }
    return true;
  };

  const signup = async () => {
    if (!validateInputs()) return;

    try {
        const response = await fetch(`${BACKEND_URL}/signup`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const responseData = await response.json();

        if (responseData.success) {
          setMessage("OTP sent successfully to your mobile.");
          setMessageType("success");
          setOtpSent(true); // Set OTP sent state
          setResendTimer(900); // Start 15-minute countdown
        
        } else {
            setMessage(responseData.errors);
            setMessageType("error");
        }
    } catch (error) {
        console.error("An error occurred during signup: ", error);
        setMessage("An unexpected error occurred. Please try again.");
        setMessageType("error");
    }
  };

  const login = async () => {
    if (!validateInputs()) return;

    let responseData;
    try {
      const response = await fetch(`${BACKEND_URL}/login`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      responseData = await response.json();

      if (responseData.success) {
        localStorage.setItem('auth-token', responseData.token);
        window.location.replace("/");
      } else {
        setMessage(responseData.errors);
        setMessageType("error");
      }
    } catch (error) {
      console.error("An error occurred during login: ", error);
      setMessage("An unexpected error occurred. Please try again.");
      setMessageType("error");
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      setMessage("Please enter the OTP.");
      setMessageType("error");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/verify-otp`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile_number: formData.mobile_number, otp }),
      });

      const responseData = await response.json();

      if (responseData.success) {
        setOtpVerified(true);
        setMessage("OTP verified successfully. Now click on continue to complete signup.");
        setMessageType("success");
      } else {
        setMessage(responseData.errors);
        setMessageType("error");
      }
    } catch (error) {
      console.error("An error occurred during OTP verification: ", error);
      setMessage("An unexpected error occurred. Please try again.");
      setMessageType("error");
    }
  };

  const handleContinue = () => {
    if (otpVerified) {
      setState("Login"); // Switch to the Login state
      setMessage("Please log in to continue."); // Show a message prompting the user to log in
      setMessageType("success");
    }
  };

  // Scroll to the LoginSignup container when the component is mounted
  useEffect(() => {
    const loginSignupElement = document.querySelector('.LoginSignup');
    if (loginSignupElement) {
      loginSignupElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className='LoginSignup'>
      <center>
        <div className="LoginSignupContainer">
          <h1>{state}</h1>
          <div className="LoginSignupFields">
            {state === "Sign up" ? (
              <>
                <input
                  name='first_name'
                  value={formData.first_name}
                  onChange={changeHandler}
                  type="text"
                  placeholder='Your First Name'
                />
                <input
                  name='last_name'
                  value={formData.last_name}
                  onChange={changeHandler}
                  type="text"
                  placeholder='Your Last Name'
                />
                <input
                  name='mobile_number'
                  value={formData.mobile_number}
                  onChange={changeHandler}
                  type="tel"
                  placeholder='Mobile Number'
                />
              </>
            ) : null}
            <input
              name='email'
              value={formData.email}
              onChange={changeHandler}
              type="email"
              placeholder='Email Address'
            />
            <input
              name='password'
              value={formData.password}
              onChange={changeHandler}
              type="password"
              placeholder='Your Password'
            />
          </div>
          <br />
          
          {/* Conditional rendering of the message paragraph */}
          {message && (
            <p className={`updates ${messageType === "error" ? 'error' : 'success'}`}>
              {message}
            </p>
          )}
  
          {otpSent && state === "Sign up" && (
            <div className="otp-box">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                maxLength="4"
                className="otp-input"
              />
              <button onClick={verifyOtp} className="otp-button">Verify OTP</button>
            </div>
          )}
          
          {otpSent && state === "Sign up" && !otpVerified && (
            <div className="resend-otp">
              <button
                onClick={signup} // Resend OTP functionality
                className="resend-button"
                disabled={resendTimer > 0} // Disable button during countdown
              >
                {resendTimer > 0 ? `Resend OTP in ${resendTimer} sec` : "Resend OTP"}
              </button>
            </div>
          )}
  
          <div className="LoginSignup_Agreement">
            <p className='updates'>By continuing, you agree with the &nbsp;
            <Link to="/Terms" className='update'>terms of use</Link>.</p> &nbsp; and the &nbsp; <Link to="/PrivacyPolicy" className='update'>privacy policy</Link>
          </div>
          
          <button 
            onClick={() => { 
              if (otpVerified && state === "Sign up") {
                handleContinue(); // Switch to login after OTP verification
              } else {
                state === "Sign up" ? signup() : login();
              }
            }} 
            className="continue-button"
          >
            {otpVerified && state === "Sign up" ? "Continue" : state === "Sign up" ? "Send OTP" : "Continue"}
          </button>
          
          {state === "Sign up" ? (
            <p className='LoginSignup_Login'>Already have an Account? &nbsp;
              <span className='updates' onClick={() => { setState("Login") }}>Login Here</span>
            </p>
          ) : (
            <p className='LoginSignup_Login'>Want to Create an Account?  &nbsp;
              <span className='updates' onClick={() => { setState("Sign up") }}>Click Here</span>
            </p>
          )}
          <p><Link to="/ForgotPassword" style={{ fontSize: '14px', fontWeight: '700', color: '#FF4500' }}>Forgot Password?</Link></p>

  
        </div>
      </center>
    </div>
  );
};

export default LoginSignup;
