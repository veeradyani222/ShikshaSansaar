import React from 'react';
import './BlogDisplay.css';
import { FaWhatsapp, FaTwitter, FaLinkedin } from 'react-icons/fa';

const BlogDisplay = (props) => {
  const { blog } = props;

  return (
    <div className="blog-display">
      {/* Blog Title */}
      <h1 className="blog-title" dangerouslySetInnerHTML={{ __html: blog.title }} />

      {/* Blog Image */}
      <div className="blog-image">
        <img src={blog.image} alt={blog.title} className="blog-main-image" />
      </div>

      <div className="blog-content-container">
        {/* Left Section */}
        <div className="left-section">
          <div className="blog-content">
            {/* Render HTML content safely */}
            <div dangerouslySetInnerHTML={{ __html: blog.description }} />
          </div>

          <p className="blog-date">
            {new Date(blog.date).toLocaleDateString()} {/* Format the date */}
          </p>
        </div>

        {/* Right Section */}
        <div className="right-section">
          <div className="social-icons">
           <div>Share this blog on-</div>
            <div className='icons'><a
              href={`https://wa.me/?text=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp className="social-icon" />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter className="social-icon" />
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin className="social-icon" />
            </a></div>
          </div>

          <div className="tags-section">
            {blog.tags && blog.tags.map((tag, index) => (
              <span key={index} className="blog-tag">{tag}</span>
            ))}
          </div>

          <p className="pro-library">Pro-Library</p>
        </div>
      </div>
    </div>
  );
};

export default BlogDisplay;
