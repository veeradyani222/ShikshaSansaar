import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      try {
        // Decode JWT payload
        const parsedToken = JSON.parse(atob(token.split('.')[1]));
        setEmployeeName(parsedToken.name);
        setRole(parsedToken.role);
      } catch (error) {
        console.error("Failed to decode token", error);
      }
    }
  }, []);

  const handleLoginRedirect = () => {
    navigate('/login');
    
    // Set a slight delay to allow navigation to complete before refreshing
    setTimeout(() => {
        window.location.reload();
    }, 50); // Adjust the delay if needed
};

  return (
    <div className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Logo" />
      </div>
      {employeeName ? (
        <>
          <h3>Hello {employeeName}, have a good day at work!</h3>
          <div className="heading">
            <h1>{role} Panel</h1>
          </div>
        </>
      ) : (
        <div>
          <button className='navbarbutton' onClick={handleLoginRedirect} style={{ padding: '10px 20px', fontSize: '16px' }}>
            Go to Login
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
