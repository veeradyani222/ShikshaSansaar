import React, { useState, useEffect } from 'react';
import './ViewProductImagesList.css';
import cross_icon from '../assets/cart_cross_icon.png';

const ViewProductImagesList = () => {
  const [allProductImages, setAllProductImages] = useState([]);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchInfo = async () => {
    await fetch(`${BACKEND_URL}/allProductImages`)
      .then((res) => res.json())
      .then((data) => {
        setAllProductImages(data);
      });
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const handleRemove = async (id) => {
    await fetch(`${BACKEND_URL}/removeProductImage`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id }),
    });
    await fetchInfo();
  };

  return (
    <div className='product-image-list'>
      <div className="product-image-list-head">
        <p>Sr No.</p>
        <p>Image</p>
        <p>Image Code</p>
        <p>Remove</p>
      </div>
      <div className="product-image-list-main">
        <hr />
        {allProductImages.map((productimage, index) => {
          return (
            <div key={index} className="product-image-item">
              <p>{index + 1}</p>
              <img src={productimage.image} alt="Product" />
              <p>{productimage.image_code}</p>
              <button onClick={() => handleRemove(productimage.id)}>
                <img src={cross_icon} alt="Remove" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ViewProductImagesList;
