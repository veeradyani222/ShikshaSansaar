import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';
import './OrderItem.css';

const OrderItem = (props) => {
  const { all_products, buyItems } = useContext(ShopContext);

  const orders = buyItems?.orders || [];
  const order = orders.find(item => item.orderId === props.id);

  // Helper function to find product details based on string productId
  const getProductDetails = (productId) => {
    return all_products.find(product => product.id === productId) || null;
  };

  return (
    <div className="user-order">
      {order ? (
        <div className="order-summary">
          <div className="order-header">
            <div className="order-header-1">
              <p className='user-order-date'>{new Date(order.orderDate).toLocaleDateString()}</p>
              <p className='user-order-status'>{order.status}</p>
              <p className='user-order-amount'>Paid: ₹{order.totalAmount}</p>
            </div>
          </div>

          <div className="products-list">
            {order.items.length > 0 ? (
              order.items.map((item, index) => {
                const productDetails = getProductDetails(item.productId);
                if (!productDetails) {
                  console.error(`Unknown product with ID: ${item.productId}`);
                  return (
                    <div key={index} className="product-details">
                      <p>Unknown Product</p>
                    </div>
                  );
                }
                return (
                  <div key={index} className="product-details">
                    <img 
                      src={productDetails.image} 
                      alt={productDetails.name} 
                      className="product-image" 
                    />
                    <div className="product-info">
                      <p>{productDetails.name}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No products in this order.</p>
            )}

            {order.items.length > 1 && (
              <div className="more-products">
                <p>{order.items.length - 1} more products...</p>
              </div>
            )}
          </div>

          <Link to={`/order/${order.orderId}`}>
            <button className="view-order-button">View Complete Order</button>
          </Link>
        </div>
      ) : (
        <p>Order not found.</p>
      )}
    </div>
  );
};

export default OrderItem;
