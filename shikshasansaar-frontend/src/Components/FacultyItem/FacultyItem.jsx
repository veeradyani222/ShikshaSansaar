import React from 'react';
import './FacultyItem.css';
import { Link } from 'react-router-dom';

// Helper function to normalize the lecturers' names
const normalizeLecturerName = (lecturer) => {
  return lecturer
    .split(' / ') // Split by " / " if multiple lecturers exist
    .map(name => name.trim().replace(/\s+/g, '')) // Remove spaces from each name
    .join('-'); // Join normalized names with hyphens
};

const FacultyItem = (props) => {
  const normalizedLecturer = normalizeLecturerName(props.lecturer);

  return (
    <div>
      <div className="facultyitem">
        <Link to={`/Faculties/${normalizedLecturer}`}>
          <img className="faculty-img" src={props.image} alt={normalizedLecturer} />
        </Link>
      </div>
    </div>
  );
};

export default FacultyItem;
