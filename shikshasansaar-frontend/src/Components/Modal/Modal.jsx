import React from 'react';
import './Modal.css';

const Modal = ({ text, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{text}</p>
        <button onClick={onClose}>Okay</button>
      </div>
    </div>
  );
};

export default Modal;
