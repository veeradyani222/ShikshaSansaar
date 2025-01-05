import React, { useContext } from 'react';
import './CSS/Product.css';
import { ShopContext } from '../Context/ShopContext';
import { useParams } from 'react-router-dom';
import ProductDisplay from '../Components/ProductDispay/ProductDisplay';
import { Player } from '@lottiefiles/react-lottie-player';
import Loading from '../Components/assets/pro-library-loading.json';

const Product = () => {
  const { all_products } = useContext(ShopContext);
  const { productId } = useParams();

  // Find the product based on the productId
  const product = all_products.find((e) => e.id === productId);

  return (
    <div>
      <h1></h1>
      {product ? (
        <>
          <ProductDisplay product={product} />
        </>
      ) : (
        <div className="loading-main-whole-page">
          <div className="loading">
            <Player
              autoplay
              loop
              src={Loading} // Path to your animation JSON file
              style={{
                height: '100px',
                width: '100px',
                margin: '0 auto',
              }} // Adjust size as needed
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;

