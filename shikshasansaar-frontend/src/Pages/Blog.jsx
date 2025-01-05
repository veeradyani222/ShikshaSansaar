import React, { useContext } from 'react';
import { ShopContext } from '../Context/ShopContext';
import { useParams } from 'react-router-dom';
import BlogDisplay from '../Components/BlogDisplay/BlogDisplay';
import { Player } from '@lottiefiles/react-lottie-player';
import Loading from '../Components/assets/pro-library-loading.json'; 

const Blog = () => {
  const { all_blogs } = useContext(ShopContext);
  const { blogId } = useParams();
  const blog = all_blogs.find((e) => e.id === Number(blogId));

  return (
    <div>
      <h1></h1>
      {blog ? <BlogDisplay blog={blog} /> :    <div className="loading-main-whole-page">
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
              </div>}
    </div>
  );
};

export default Blog;
