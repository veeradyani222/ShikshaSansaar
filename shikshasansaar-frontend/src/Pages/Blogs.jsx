import React, { useContext, useState } from 'react';
import './CSS/Blogs.css';
import BlogItem from '../Components/BlogItem/BlogItem'; // Use BlogItem component to display blog data
import { ShopContext } from '../Context/ShopContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Player } from '@lottiefiles/react-lottie-player';
import Loading from '../Components/assets/pro-library-loading.json'; 

const Blogs = () => {
  const { all_blogs } = useContext(ShopContext);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const blogsPerPage = 5; // Number of blogs to display per page

  // Function to sanitize the title and remove unwanted HTML tags
  const sanitizeTitle = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.innerText || div.textContent; // Fallback to textContent
  };

  // Calculate the indices for slicing the blogs array
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = all_blogs.slice(indexOfFirstBlog, indexOfLastBlog); // Get blogs for the current page

  // Calculate total number of pages
  const totalPages = Math.ceil(all_blogs.length / blogsPerPage);

  // Handle page change
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <div className="blog-heading">
        View the blogs at Pro-library
      </div>
      <h1></h1>

      <div className="blogs-container">
        {/* Conditional Rendering for loading or displaying blogs */}
        {!all_blogs.length ? (
        <div className="loading-main-whole-page">
        <div className="loading">
          <Player
            autoplay
            loop
            src={Loading} // Path to your animation JSON file
            style={{
              height: '100px',
              width: '100px',
              margin: '0 auto',
            }} // Adjust size as needed
          />
        </div>
        </div>
        ) : (
          currentBlogs.map((blog) => (
            <BlogItem
              key={blog.id}
              id={blog.id}
              title={sanitizeTitle(blog.title)} // Apply sanitizeTitle to the title
              image={blog.image}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          className={`page-button prev ${currentPage === 1 ? 'disabled' : ''}`}
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Prev
        </button>

        <button
          className={`page-button next ${currentPage === totalPages ? 'disabled' : ''}`}
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
    </div>
  );
};

export default Blogs;
