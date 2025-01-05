import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill's styles
import './AddBlog.css';
import upload_image from '../assets/upload_image.png';

const AddBlog = () => {
  const [image, setImage] = useState(null);
  const [blog, setBlog] = useState({
    image: "",
    title: "",
    description: "",
    tags: [""], // Change from a single string to an array of tags
    date: "",
  });

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
    setBlog({ ...blog, image: e.target.files[0] });
  };

  // Handle changes for Quill inputs (title and description)
  const handleQuillChange = (value, field) => {
    setBlog({ ...blog, [field]: value });
  };

  // Handle changes for input fields like date
  const changeHandler = (e) => {
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

  // Handle changes for the tags input fields
  const handleTagChange = (e, index) => {
    const updatedTags = [...blog.tags];
    updatedTags[index] = e.target.value;
    setBlog({ ...blog, tags: updatedTags });
  };

  // Add more tag input fields
  const addMoreTags = () => {
    setBlog({ ...blog, tags: [...blog.tags, ""] });
  };

  const addBlog = async (e) => {
    e.preventDefault();
    console.log(blog);

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    let blogData = { ...blog };
    let responseData;
    let formData = new FormData();
    formData.append('image', image);

    // Upload image first
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
      blogData.image = responseData.image_url;
    }

    // Add blog with the image URL
    console.log(blogData);
    await fetch(`${BACKEND_URL}/addBlog`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(blogData)
    })
    .then((resp) => resp.json())
    .then((data) => {
      data.success ? alert("Blog Added!") : alert("Failed to add blog!");
    });
  };

  return (
    <div className="add-blog-container">
      <h1 className="heading">Fill the Below Fields to Add a Blog</h1>
      <form className="add-blog-form" onSubmit={addBlog}>
        
        {/* Blog Title with ReactQuill */}
        <div className="form-group">
          <label>Blog Title</label>
          <ReactQuill
            value={blog.title}
            onChange={(value) => handleQuillChange(value, 'title')}
            placeholder="Enter blog title"
            className="quill-input"
          />
        </div>

        {/* Blog Description with ReactQuill */}
        <div className="form-group">
          <label>Blog Description</label>
          <ReactQuill
            value={blog.description}
            onChange={(value) => handleQuillChange(value, 'description')}
            placeholder="Enter blog description"
            className="quill-input"
          />
        </div>

        {/* Tags Input */}
        <div className="form-group">
          <label>Tags</label>
          {blog.tags.map((tag, index) => (
            <div key={index} className="input-wrapper">
              <input
                type="text"
                value={tag}
                placeholder="Enter a tag"
                onChange={(e) => handleTagChange(e, index)}
                className="text-input"
              />
            </div>
          ))}
          <button type="button" onClick={addMoreTags} className="add-more-btn">Add More Tags</button>
        </div>

        {/* Date */}
        <div className="form-group">
          <input
            type="date"
            name="date"
            className="input-field"
            value={blog.date}
            onChange={changeHandler}
          />
        </div>

        {/* Image Upload */}
        <label htmlFor="blog-image" className="custom-file-upload">
          <img src={image ? URL.createObjectURL(image) : upload_image} alt="Upload blog image" />
        </label>
        <input
          type="file"
          id="blog-image"
          accept="image/*"
          className="input-field file-input"
          name="image"
          onChange={imageHandler}
        />

        {/* Submit Button */}
        <button type="submit" className="submit-button">Add Blog</button>
      </form>
    </div>
  );
};

export default AddBlog;
