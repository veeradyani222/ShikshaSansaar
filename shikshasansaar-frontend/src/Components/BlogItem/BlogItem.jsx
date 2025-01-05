import React from 'react';
import './BlogItem.css';
import { Link } from 'react-router-dom'; // Importing only what you need

const BlogItem = (props) => {
  return (
    <div className="blog">
      <Link to={`/blog/${props.id}`}>
        <div className="blog-above">
          <img src={props.image} alt={props.title} />
          <div className="blog-details">
            <p className="blog-title-1">{props.title}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BlogItem;
