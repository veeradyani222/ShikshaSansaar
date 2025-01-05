import React, { useContext, useEffect, useState } from 'react';
import './CSS/FacultyResult.css';
import { ShopContext } from '../Context/ShopContext';
import { useParams } from 'react-router-dom';
import Item from '../Components/Item/Item';
import { Player } from '@lottiefiles/react-lottie-player';
import Loading from '../Components/assets/pro-library-loading.json';

// Helper function to normalize lecturer names
const normalizeLecturerName = (lecturer) => {
  return lecturer
    .trim() // Remove spaces at the start and end
    .replace(/\s+/g, '') // Remove all spaces
    .toLowerCase(); // Convert to lowercase
};

const FacultyResult = () => {
  const { all_faculties, all_products, getImageSrcByCode } = useContext(ShopContext);
  const { lecturer } = useParams(); // Lecturer name from the URL
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    // Function to check screen size
    const updateScreenSize = () => {
      setIsSmallScreen(window.matchMedia('(max-width: 480px)').matches);
    };

    updateScreenSize(); // Initial check
    window.addEventListener('resize', updateScreenSize);

    return () => {
      window.removeEventListener('resize', updateScreenSize);
    };
  }, []);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Scroll to the about section on mount
  useEffect(() => {
    const aboutSection = document.getElementById('about-section');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Normalize the lecturer name from the URL
  const normalizedLecturerFromURL = normalizeLecturerName(lecturer);

  // Find the matching faculty
  const faculty = all_faculties.find(
    (f) => normalizeLecturerName(f.lecturer) === normalizedLecturerFromURL
    
  );



  if (loading) {
    return (
      <div className="loading-main-whole-page">
        <div className="loading">
          <Player
            autoplay
            loop
            src={Loading}
            style={{
              height: '100px',
              width: '100px',
              margin: '0 auto',
            }}
          />
        </div>
      </div>
    );
  }

  if (!faculty) {
    return <div>Faculty not found</div>;
  }

      // Split text into words
      const words = faculty.about_faculty.split(' ');

      const truncatedText = words.slice(0, 20).join(' ');
  
  return (
    <div>
      <h1></h1>
      <div className="facultyabout" id="about-section">
<div className="faculti-about-1">        <h1>{faculty.lecturer}</h1>
<img src={faculty.image} alt={faculty.lecturer} /></div>
<p>
  {isSmallScreen && !isExpanded ? `${truncatedText}...` : faculty.about_faculty}
</p>
{isSmallScreen && words.length > 100 && (
  <button 
  onClick={() => setIsExpanded(!isExpanded)} 
  style={{ color: 'orange', border: 'none', background: 'transparent', cursor: 'pointer' }}
>
  {isExpanded ? 'Show Less' : 'Show More'}
</button>

)}

      </div>
      <div className="heads">
        <h1>View Courses by {faculty.lecturer}</h1>
      </div>
      <div className="facultyproducts">
        {all_products
          .filter((item) => {
            // Split item lecturers and normalize each name
            const productLecturers = item.lecturer
              .split(/\/|,/g) // Split by "/" or ","
              .map((name) => normalizeLecturerName(name)); // Normalize each lecturer name

            // Compare with normalized lecturer from URL
            return productLecturers.includes(normalizedLecturerFromURL);
          })
          .map((item) => (
            <Item
              key={item.id}
              id={item.id}
              name={item.name}
              image={getImageSrcByCode(item.image_code)}
              category={item.category}
              sub_category={item.sub_category}
              lecturer={item.lecturer}
              new_price={item.new_price}
              old_price={item.old_price}
              tag={item.tag}
              hide={item.hide}
              lecture_duration={item.lecture_duration}
            />
          ))}
      </div>
    </div>
  );
};

export default FacultyResult;
