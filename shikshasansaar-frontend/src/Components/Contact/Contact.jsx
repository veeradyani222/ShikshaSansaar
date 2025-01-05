import React, { useContext, useState } from 'react';
import { ShopContext } from '../../Context/ShopContext';
import './Contact.css';

const Contact = () => {
  const { all_Content } = useContext(ShopContext);
  const contactNumbers = Array.isArray(all_Content[0]?.contact_numbers) ? all_Content[0].contact_numbers : [];
  const [isVisible, setIsVisible] = useState(true); // State to control visibility

  const handleClose = () => {
    setIsVisible(false); // Hide the component when cross icon is clicked
  };

  if (!isVisible) {
    return null; // Return null if the component should be hidden
  }

  return (
    <div className="scrolling-box-horizontal">
      <div className="scrolling-content-horizontal">
        <div className="contact-header">Helpline: &nbsp; {contactNumbers.map((number, index) => (
            <a key={index} href={`tel:${number}`} className="contact-number-link">
              {number}
              {index < contactNumbers.length - 1 && ', '}
            </a>
          ))}</div>
      </div>
      <span className="close-icon" onClick={handleClose} style={{ cursor: 'pointer', marginLeft: '10px' }}>
        ✖ &nbsp; &nbsp; &nbsp;{/* Cross icon */}
      </span>
    </div>
  );
};

export default Contact;
