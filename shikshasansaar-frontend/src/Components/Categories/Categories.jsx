import React from 'react'
import './Categories.css'
import { Link } from 'react-router-dom'; 
import ca_final from '../assets/CA FINAL.png';
import ca_inter from '../assets/CA INTER.png';
import cma_courses from '../assets/CMA COURSES.png';
import cs_courses from '../assets/CS COURSES.png';
const Categories = () => {
  return (
    <div className='categories-main'>
      <div className="categories">
      <Link to="/Categories/CA-Final"><li><img src={ca_final} alt="" /></li></Link> 
      <Link to="/Categories/CA-Inter"><li><img src={ca_inter} alt="" /></li></Link> 
      <Link to="/Categories/CMA-Courses"> <li><img src={cma_courses} alt="" /></li></Link> 
      <Link to="/Categories/CS-Courses">     <li><img src={cs_courses} alt="" /></li></Link> 
      </div>
    </div>
  )
}

export default Categories
