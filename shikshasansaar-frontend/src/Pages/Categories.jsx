import React from 'react';
import { Link } from 'react-router-dom';
import './CSS/Categories.css';

const Categories = () => {

  return (
    <div className="categories-container">
      <h1></h1>
      <div className="category">
 <Link to="/Categories/CA-Final" className='category-heading'>CA Final</Link> 
      
        <ul>
          <li><Link to="/CAFinal/AFM">AFM</Link></li>
          <li><Link to="/CAFinal/Audit">Audit</Link></li>
          <li><Link to="/CAFinal/DirectTax">Direct Tax (DT)</Link></li>
          <li><Link to="/CAFinal/FR">FR</Link></li>
          <li><Link to="/CAFinal/IndirectTax">Indirect Tax (IDT)</Link></li>
          <li><Link to="/CAFinal/LAW">LAW</Link></li>
          <li><Link to="/CAFinal/SCMPE">SCMPE</Link></li>
        </ul>
      </div>

      <div className="category">
      <Link to="/Categories/CA-Inter" className='category-heading'>CA Inter</Link> 
        
        <ul>
          <li><Link to="/CAInter/Accounts">Accounts</Link></li>
          <li><Link to="/CAInter/Audit">Audit</Link></li>
          <li><Link to="/CAInter/DirectTax">Direct Tax (DT)</Link></li>
          <li><Link to="/CAInter/LAW">LAW</Link></li>
          <li><Link to="/CAInter/Taxation">Taxation</Link></li>
        </ul>
      </div>

      <div className="category">
      <Link to="/Categories/CMA-Courses" className='category-heading'>  CMA Courses</Link> 
      
        <ul>
          <li><Link to="/CMACourses/Final">CMA Final</Link></li>
          <li><Link to="/CMACourses/Foundation">CMA Foundation</Link></li>
          <li><Link to="/CMACourses/Inter">CMA Inter</Link></li>
          <li><Link to="/CMACourses/DirectTax">Direct Tax (DT)</Link></li>
        </ul>
      </div>

      <div className="category">
      <Link  to="/Categories/CS-Courses" className='category-heading'> CS Courses </Link> 
        
        <ul>
          <li><Link to="/CSCourses/Executive">CS Executive</Link></li>
          <li><Link to="/CSCourses/Professional">CS Professional</Link></li>
          <li><Link to="/CSCourses/CSEET">CSEET</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default Categories;

