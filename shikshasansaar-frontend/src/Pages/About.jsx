import React, { useContext } from 'react';
import { ShopContext } from '../Context/ShopContext';
import './CSS/About.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHourglass, faLink, faStar, faGraduationCap } from '@fortawesome/free-solid-svg-icons';

const About = () => {
  const { all_Content } = useContext(ShopContext);

  const aboutContent = all_Content?.find(content => content.about_sections);

  return (
    <div className='about'>
      <h1></h1>
      <div className="decorations">
        <FontAwesomeIcon icon={faHourglass} />
        <FontAwesomeIcon icon={faLink} />
        <FontAwesomeIcon icon={faStar} />
        <FontAwesomeIcon icon={faGraduationCap} />
      </div>
      <div className="about-containers">
        {aboutContent && aboutContent.about_sections.length > 0 ? (
          aboutContent.about_sections.map((section, index) => (
            <div key={index} className={`about-section-paragraph`}>
              {/* Render the HTML content safely */}
              <div dangerouslySetInnerHTML={{ __html: section }} />

              
            </div>
          ))
        ) : (
          <p className='loading'>Loading..</p>
        )}
      </div>
    </div>
  );
};

export default About;
