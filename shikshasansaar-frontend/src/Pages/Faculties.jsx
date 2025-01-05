import React, { useContext, useState, useEffect } from 'react';
import './CSS/Faculties.css'; // Ensure this path is correct
import { ShopContext } from './../Context/ShopContext';
import FacultyItem from './../Components/FacultyItem/FacultyItem'; // Ensure this path is correct
import { Player } from '@lottiefiles/react-lottie-player';
import Loading from '../Components/assets/pro-library-loading.json';

const Faculties = () => {
  // Fetch all faculties from ShopContext
  const { all_faculties } = useContext(ShopContext);

  // State for search input
  const [searchQuery, setSearchQuery] = useState('');

  // State for loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a delay to show the loading animation
    const timer = setTimeout(() => setLoading(false), 1000); // Adjust the delay as needed
    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

  // Ensure all_faculties is defined to prevent runtime errors
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

  if (!all_faculties || all_faculties.length === 0) {
    return <div>No faculties available at the moment.</div>;
  }

  // Filter faculties based on the search query
  const filteredFaculties = all_faculties.filter((faculty) =>
    faculty.lecturer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="faculties-page">
      <h1></h1>
      {/* Search Bar */}
      <div className="search-bar-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Search for a faculty by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Faculties List */}
      <div className="faculties-container">
        {filteredFaculties.length > 0 ? (
          filteredFaculties.map((faculty) => (
            <div key={faculty._id} className="faculty-item-wrapper">
              <FacultyItem 
                id={faculty.id} 
                lecturer={faculty.lecturer} 
                image={faculty.image} 
              />
            </div>
          ))
        ) : (
          <div className="no-results">No faculties found.</div>
        )}
      </div>
    </div>
  );
};

export default Faculties;
