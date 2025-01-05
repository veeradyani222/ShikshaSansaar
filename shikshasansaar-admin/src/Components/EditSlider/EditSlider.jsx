import React, { useState } from 'react';
import upload_image from '../assets/upload_image.png';  // Make sure to use the correct path for your placeholder image

const EditSlider = () => {
  const [image, setImage] = useState(null);
  const [sliderDetails, setSliderDetails] = useState({
    image: "",  // Initialize with empty string or any default value
  });

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
    setSliderDetails({ ...sliderDetails, image: e.target.files[0] });
  };

  const addImage = async (e) => {
    e.preventDefault();

    if (!image) {
      alert('Please select an image.');
      return;
    }

    let responseData;
    let formData = new FormData();
    formData.append('image', image);

    try {
      // Upload image to the server
      const uploadResponse = await fetch(`${BACKEND_URL}/addSliderImages`, {
        method: 'POST',
        body: formData,
      });

      responseData = await uploadResponse.json();

      if (responseData.success) {
        console.log('Image URL:', responseData.image);
        alert('Image uploaded successfully!');

        // Update slider details with the uploaded image URL
        setSliderDetails({
          ...sliderDetails,
          image: responseData.image,
        });
      } else {
        alert('Failed to upload image.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image.');
    }
  };

  return (
    <div className="edit-slider">
      <label htmlFor="slider-image" className="custom-file-upload">
        <img src={image ? URL.createObjectURL(image) : upload_image} alt="please upload image for the slider" />
      </label>
      <input
        type="file"
        id="slider-image"
        accept="image/*"
        className="input-field file-input"
        name="image"
        onChange={imageHandler}
      />
      <button onClick={addImage}>Upload Image</button>
    </div>
  );
};

export default EditSlider;
