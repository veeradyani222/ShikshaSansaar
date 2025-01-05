import React from 'react';
import './FacultyFooter.css';
import { Link } from 'react-router-dom';

const FacultyFooter = (props) => {
  const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Smooth scrolling
    });
};
  return (
    <div>
      <div className="facultyitem">
        <Link to={`/Faculties/${props.id}/${props.lecturer}`} onClick={scrollToTop}>
        <div className="facultylecturer">{props.lecturer}</div>
        </Link>
       
      </div>
    </div>
  );
};

export default FacultyFooter;