import {React,useEffect,useState} from 'react';
import { Link } from 'react-router-dom';
import './ProductItemProductDisplay.css';

const ProductDisplayProductItem = (props) => {
  const { onClick, id, image, name, lecturer, category, sub_category } = props;
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);


  const handleClick = () => {
    if (onClick) {
      onClick();  // Only call onClick if it's provided
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="product-display-item" style={{ display: props.hide ? 'none' : 'block' }} onClick={handleClick}>
      {/* Link to the product details page */}
      <Link to={`/product/${id}`}>
        <div className="product-item-above">
          {/* Product image */}
          <img src={image} alt={name} />

          {/* Product details */}
          <div className="product-item-details">
          <div className="product-lecturer">
        {screenWidth <= 480 ? 
          (lecturer.length > 10 ? `${lecturer.slice(0, 10)}...` : lecturer) : 
          lecturer
        }
      </div>
      <p className="product-name-item">
        {screenWidth <= 480 ? 
          (name.length > 15 ? `${name.slice(0, 15)}...` : name) : 
          name
        }
      </p>
  
            <div className="product-category">
              {category} - {sub_category}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductDisplayProductItem;
