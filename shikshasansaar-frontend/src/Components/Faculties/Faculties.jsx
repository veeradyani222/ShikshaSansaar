import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import './Faculties.css'; // Custom CSS for styling
import { ShopContext } from '../../Context/ShopContext';
import FacultyItem from '../FacultyItem/FacultyItem';

const Faculties = () => {
  // Fetch all faculties from ShopContext
  const { all_faculties } = useContext(ShopContext);

  // React Router's navigation hook
  const navigate = useNavigate();

  // State to manage the number of faculties to display
  const [maxItems, setMaxItems] = useState(10);

  // Function to check and update maxItems based on screen width
  const updateMaxItems = () => {
    if (window.innerWidth < 480) {
      setMaxItems(6); // Show 9 items for small screens
    } else {
      setMaxItems(10); // Show 10 items for larger screens
    }
  };

  // useEffect to add and clean up the resize event listener
  useEffect(() => {
    updateMaxItems(); // Set initial value
    window.addEventListener('resize', updateMaxItems); // Update on resize

    return () => {
      window.removeEventListener('resize', updateMaxItems); // Cleanup listener
    };
  }, []);

  // Limit the displayed faculties based on maxItems
  const displayedFaculties = all_faculties.slice(0, maxItems);

  return (
    <div className='main-fac'>
      <div className="faculties-container">
        {displayedFaculties.map((faculty) => (
          <div key={faculty._id} className="faculty-item-wrapper">
            <FacultyItem 
              id={faculty.id} 
              lecturer={faculty.lecturer} 
              image={faculty.image} 
            />
          </div>
        ))}
      </div>
      <div className="show-all-button-container">
        <button 
          className="show-all-button-1" 
          onClick={() => navigate('/faculties')}
        >
          Show All Faculties
        </button>
      </div>
    </div>
  );
};

export default Faculties;
