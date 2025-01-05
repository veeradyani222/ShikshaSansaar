import React, { useState } from 'react';
import './AddProductImages.css';
import upload_image from '../assets/upload_image.png';

const AddProductImages = () => {
  const [image, setImage] = useState(null);
  const [productimage, setProductImage] = useState({
    image: "",
    image_code: "",
  });


  const imageHandler = (e) => {
    setImage(e.target.files[0]);
    setProductImage({ ...productimage, image: e.target.files[0] });
  };

  const changeHandler = (e) => {
    setProductImage({ ...productimage, [e.target.name]: e.target.value });
  };

  const addProductImage = async (e) => {
    e.preventDefault();
    console.log(productimage);

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    let productImageData = { ...productimage };
    let responseData;
    let formData = new FormData();
    formData.append('image', image);

    // Update this URL to use BACKEND_URL
    await fetch(`${BACKEND_URL}/upload-faculty`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: formData,
    })
    .then((resp) => resp.json())
    .then((data) => { responseData = data });

    if (responseData.success) {
      productImageData.image = responseData.image_url;
    }

    console.log(productImageData);
    
    // Update this URL to use BACKEND_URL
    await fetch(`${BACKEND_URL}/addProductImage`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(productImageData),
    })
    .then((resp) => resp.json())
    .then((data) => {
      data.success ? alert("Product Image Added!") : alert("Failed!");
    });
  };

  return (
    <div className="add-product-container">
      <h1 className="heading">Fill the Below Fields</h1>
      <form className="add-product-form" onSubmit={addProductImage}>
        <input
          type="text"
          name="image_code"
          placeholder="Enter Image code"
          className="input-field"
          value={productimage.image_code}
          onChange={changeHandler}
        />
        <label htmlFor="product-image" className="custom-file-upload">
          <img src={image ? URL.createObjectURL(image) : upload_image} alt="please upload an image for the product" />
        </label>
        <input
          type="file"
          id="product-image"
          accept="image/*"
          className="input-field file-input"
          name="image"
          onChange={imageHandler}
        />
        <button type="submit" className="submit-button">Add Product Image</button>
      </form>
    </div>
  );
};

export default AddProductImages;
