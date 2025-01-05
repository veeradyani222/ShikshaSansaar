import React, { useContext } from 'react';
import { ShopContext } from '../../Context/ShopContext';
import whatsapp from '../assets/whatsapp copy.png';
import mail from '../assets/email.png';
import call from '../assets/call.png';
import query from '../assets/query.png';
import './BottomNav.css';

const BottomNav = () => {
  // Static data as per your requirement
  const firstContactNumber = '+917828587424'; // Ensure it's in the correct format
  const firstEmailId = 'veeradyani2@gmail.com';

  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/${firstContactNumber}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCallClick = () => {
    window.location.href = `tel:${firstContactNumber}`;
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${firstEmailId}`;
  };

  const handleQueryClick = () => {
    window.location.href = '/query';
  };

  return (
    <div className="bottom-nav">
      <button className="bottom-nav-btn" onClick={handleWhatsAppClick}>
        <img src={whatsapp} alt="WhatsApp" />
      </button>
      <button className="bottom-nav-btn" onClick={handleCallClick}>
        <img src={call} alt="Call" />
      </button>
      <button className="bottom-nav-btn" onClick={handleEmailClick}>
        <img src={mail} alt="Email" />
      </button>
      <button className="bottom-nav-btn" onClick={handleQueryClick}>
        <img src={query} alt="Query" />
      </button>
    </div>
  );
};

export default BottomNav;
