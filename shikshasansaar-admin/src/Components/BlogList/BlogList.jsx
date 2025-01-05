import { React, useState, useEffect } from 'react';
import './BlogList.css';
import cross_icon from '../assets/cart_cross_icon.png';

const BlogList = () => {
  const [allBlogs, setAllBlogs] = useState([]);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchInfo = async () => {
    await fetch(`${BACKEND_URL}/allBlogs`)
      .then((res) => res.json())
      .then((data) => {
        setAllBlogs(data);
      });
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const handleRemove = async (id) => {
    await fetch(`${BACKEND_URL}/removeBlog`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    await fetchInfo();
  };

  return (
    <div className="blog-container">
      <div className="blog-header">
        <p>Title</p>
        <p>ID</p>
        <p>Image</p>
        <p>Tags</p>
        <p>Date</p>
        <p>Remove</p>
      </div>
      <div className="blog-main">
        <hr />
        {allBlogs.map((blog, index) => {
          return (
            <div key={index} className="blog-item">
              <p>{blog.title}</p>
              <p>{blog.id}</p>
              <img src={blog.image} alt="Not Found" />
              <p>{blog.tags}</p>
              <p>{blog.date}</p>
              <button onClick={() => handleRemove(blog.id)}>
                <img src={cross_icon} alt="Remove" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BlogList;
