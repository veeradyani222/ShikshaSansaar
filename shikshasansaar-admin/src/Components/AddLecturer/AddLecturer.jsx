import React, { useState } from 'react';
import './AddLecturer.css';
import upload_image from '../assets/upload_image.png';

const AddLecturer = () => {
  const [image, setImage] = useState(null);
  const [faculty, setFaculty] = useState({
    image: "",
    lecturer: "",
    about_faculty: "",
  });

  

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
    setFaculty({ ...faculty, image: e.target.files[0] });
  };

  const changeHandler = (e) => {
    setFaculty({ ...faculty, [e.target.name]: e.target.value });
  };

  const addFaculty = async (e) => {
    e.preventDefault();
    console.log(faculty);

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    let facultyData = { ...faculty };
    let responseData;
    let formData = new FormData();
    formData.append('image', image);

    await fetch(`${BACKEND_URL}/upload-faculty`, {
      method: 'POST',
      headers: {
        Accept: 'application/json'
      },
      body: formData,
    })
    .then((resp) => resp.json())
    .then((data) => { responseData = data });

    if (responseData.success) {
      facultyData.image = responseData.image_url;
    }

    console.log(facultyData);
    await fetch(`${BACKEND_URL}/addFaculty`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(facultyData)
    })
    .then((resp) => resp.json())
    .then((data) => {
      data.success ? alert("Faculty Added!") : alert("Failed!");
    });
  };

  return (
    <div className="add-product-container">
      <h1 className="heading">Fill the Below Fields</h1>
      <form className="add-product-form" onSubmit={addFaculty}>
        <input
          type="text"
          name="lecturer"
          placeholder="Lecturer's Name"
          className="input-field"
          value={faculty.lecturer}
          onChange={changeHandler}
        />
        <input
          type="text"
          name="about_faculty"
          placeholder="About Lecturer"
          className="input-field"
          value={faculty.about_faculty}
          onChange={changeHandler}
        />
        <label htmlFor="faculty-image" className="custom-file-upload">
          <img src={image ? URL.createObjectURL(image) : upload_image} alt="please upload image for the lecturer" />
        </label>
        <input
          type="file"
          id="faculty-image"
          accept="image/*"
          className="input-field file-input"
          name="image"
          onChange={imageHandler}
        />
        <button type="submit" className="submit-button">Add Faculty</button>
      </form>
    </div>
  );
};

export default AddLecturer;
