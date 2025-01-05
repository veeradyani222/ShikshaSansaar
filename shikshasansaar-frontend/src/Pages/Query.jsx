import React, { useState, useEffect, useContext } from 'react';
import './CSS/Query.css';
import { ShopContext } from '../Context/ShopContext';

const Query = () => {
  const [image, setImage] = useState(null);
  const [orderDetails, setOrderDetails] = useState({
    name: "",
    email: "",
    mobile: "",
    orderid:"",
    issue:"",
    image: "", // For Cloudinary image URL
  });

  // State to track loading status
  const [loading, setLoading] = useState(false);

  
  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const changeHandler = (e) => {
    setOrderDetails({ ...orderDetails, [e.target.name]: e.target.value });
  };

  const addOrder = async (e) => {
    e.preventDefault();

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    let responseData;

    // Step 1: Upload image first to Cloudinary
    if (image) {
      let formData = new FormData();
      formData.append('order', image);

      await fetch(`${BACKEND_URL}/upload-order`, {
        method: 'POST',
        headers: {
          Accept: 'application/json'
        },
        body: formData,
      }).then((resp) => resp.json()).then((data) => { responseData = data });

      if (responseData.success) {
        setOrderDetails({ ...orderDetails, image: responseData.image_url });
      } else {
        alert("Image upload failed!");
        return;
      }
    }

    // Step 2: Submit order details with image URL
    await fetch(`${BACKEND_URL}/addquery`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(orderDetails)
    }).then((resp) => resp.json()).then((data) => {
      data.success ? alert("Order Added!") : alert("Failed!")
    });
  };

  

  if (loading) {
    return <div>Loading...</div>; // Show loading text while faculties are being fetched
  }

  return (
    <div className="offline-order-container">
      <h1 className="offline-order-heading">How can we help you?</h1>
      <form className="offline-order-form" onSubmit={addOrder}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          className="offline-order-input"
          value={orderDetails.name}
          onChange={changeHandler}
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          className="offline-order-input"
          value={orderDetails.email}
          onChange={changeHandler}
        />
        <input
          type="text"
          name="mobile"
          placeholder="Your Mobile No (only 10 Digit)"
          className="offline-order-input"
          value={orderDetails.mobile}
          onChange={changeHandler}
        />
        <input
          type="text"
          name="orderid"
          placeholder="Order Id"
          className="offline-order-input"
          value={orderDetails.orderid}
          onChange={changeHandler}
        />
        <input
          type="text"
          name="issue"
          placeholder="Your Issue"
          className="offline-order-input"
          value={orderDetails.postal_address}
          onChange={changeHandler}
        />
        <label htmlFor="">Upload File</label>
        <input
          type="file"
          name="image"
          id="image"
          className="offline-order-file-input"
          accept="image/*"
          onChange={imageHandler}
        />
     
        <button className="offline-order-submit-btn" type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Query;
