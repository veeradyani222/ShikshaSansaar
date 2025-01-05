import React, { useContext } from 'react';
import { ShopContext } from '../../Context/ShopContext';
import BlogItem from '../BlogItem/BlogItem';
import { Link } from 'react-router-dom';
import './BlogsHome.css';

const BlogsHome = () => {
  const { all_blogs } = useContext(ShopContext);
  const blogsToShow = all_blogs.slice(0, 6);

  const sanitizeTitle = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    // Assuming the title is wrapped in <p> tags, get the inner text without tags
    return div.innerText || div.textContent; // Fallback to textContent
  };
  

  return (
    <div className='main-blog-home'>
      <div className="blogs-home1">
        {blogsToShow.length > 0 ? (
          blogsToShow.map((blog) => (
            <BlogItem
              key={blog.id}
              id={blog.id}
              title={sanitizeTitle(blog.title)} // Sanitize and pass blog title
              image={blog.image} // Pass blog image
            />
          ))
        ) : (
          <p className="loading">No blogs available</p>
        )}
      </div>
      <div className="see-all-button">
        <Link to="/blog">See All Blogs</Link>
      </div>
    </div>
  );
};

export default BlogsHome;
