import React, { useState, useEffect } from 'react';
import cross_icon from '../assets/cart_cross_icon.png'
import './SliderList.css'

const SliderList = () => {
  const [allImages, setAllImages] = useState([]);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchInfo = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/allsliderImages`);
      const data = await response.json();
      setAllImages(data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const handleRemove = async (id) => {
    await fetch(`${BACKEND_URL}/removeslider`,{
      method: 'POST',
      headers:{
        Accept:'application/json',
        'Content-type': 'application/json',
      },
      body:JSON.stringify({id:id})
    })
    await fetchInfo();}

  return (
    <div>
      <div className='slider'>
        <div className="slider-head">
          <p>Image</p>
          <p>Remove</p>
        </div>
        <div className="slider-main">
          <hr />
          {allImages.map((image, index) => (
            <div key={index} className="slider-format-main slider-product-format">
              <img src={image.image} alt="Slider" />
              <button onClick={() => handleRemove(image.id)}>
                <img src={cross_icon} alt="Remove" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SliderList;
