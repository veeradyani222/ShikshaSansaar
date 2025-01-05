import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../../Context/ShopContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesLeft, faAnglesRight } from '@fortawesome/free-solid-svg-icons';
import './Sliders.css';

const Sliders = () => {
  const { all_sliders } = useContext(ShopContext);
  const [currentIndex, setCurrentIndex] = useState(0);


  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % all_sliders.length);
    }, 10000);

    return () => clearInterval(intervalId);
  }, [all_sliders]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + all_sliders.length) % all_sliders.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % all_sliders.length);
  };

  if (all_sliders.length === 0) {
    return <div className='loading'></div>;
  }

  return (
    <div className="slider-main-container">
      <FontAwesomeIcon className='icon-back' icon={faAnglesLeft} onClick={goToPrevious} />
      <div className="slider-container">
        <div className="slider-wrapper" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {all_sliders.map((slide, index) => (
            <img
              key={index}
              src={slide.image}
              alt={`Slider ${index}`}
              className="slider-image"
            />
          ))}
        </div>
        <div className="slider-controls">
          {all_sliders.map((_, index) => (
            <span
              key={index}
              className={`slider-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            ></span>
          ))}
        </div>
      </div>
      <FontAwesomeIcon className='icon-next' icon={faAnglesRight} onClick={goToNext} />
    </div>
  );
};

export default Sliders;
