import React, { useContext } from 'react';
import { ShopContext } from '../../Context/ShopContext';
import './OrderDisplay.css';

const OrderDisplay = (props) => {
  const { order } = props;
  const { all_products } = useContext(ShopContext);

  if (!order) {
    return <p className="no-order">No order details available.</p>;
  }

  // Calculate subtotal by summing the total price for all items
  const calculateTotal = () =>
    order.items.reduce((total, item) => {
      const itemTotal = item.quantity * (item.newPrice || 0);
      return total + itemTotal;
    }, 0);

  const subtotal = calculateTotal();
  const discount = order.discount ? `${(order.discount * 100).toFixed(0)}%` : "0%";

  const findProductDetails = (productId) => {
    return all_products.find(product => product.id === productId) || {};
  };

  // Calculate discount amount based on subtotal
  const discountAmount = subtotal * (order.discount || 0);
  const finalTotal = subtotal - discountAmount; // Subtotal minus discount

  // Calculate total product offers (both percentage and flat offers)
  const calculateTotalProductOffers = () => {
    return order.items.reduce((total, item) => {
      const product = findProductDetails(item.productId);
      const productOffer = product.offer || 0;

      if (typeof productOffer === 'string' && productOffer.includes('%')) {
        const offerValue = (item.quantity * item.newPrice * (parseFloat(productOffer) / 100));
        return total + offerValue;
      } else if (typeof productOffer === 'number') {
        return total + (item.quantity * productOffer);
      }

      return total;
    }, 0);
  };

  const totalProductOffers = calculateTotalProductOffers();

  return (
    <div className="order-display-container">
      <div className="order-details">
        <h1>Order Details</h1>
        <p className="order-id"><strong>Order ID:</strong> {order.orderId}</p>
        <p className="order-id"><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
        <p className="order-id"><strong>Order Status:</strong> {order.status}</p>
      </div>

      <div className="table-wrapper">
        <table className="order-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Mode</th>
              <th>Views</th>
              <th>Validity</th>
              <th>Booktype</th>
              <th>Attempt</th>
              <th>Language</th>
              <th>Recording</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Offer</th>
              <th>Coupon Discount</th>
              <th>Total Price</th>
              <th>Your Link</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => {
              const product = findProductDetails(item.productId);
              const price = item.newPrice || 0;
              let offerDiscount = 0;
              let finalPrice = price;

              // Calculate offer discount if available
              if (product.offer) {
                if (typeof product.offer === 'string' && product.offer.includes('%')) {
                  const discountPercent = parseFloat(product.offer.replace('%', ''));
                  offerDiscount = (price * discountPercent) / 100;
                  finalPrice = price - offerDiscount;
                } else if (!isNaN(product.offer)) {
                  // Flat amount offer
                  offerDiscount = parseFloat(product.offer);
                  finalPrice = price - offerDiscount;
                }
              }

              // Calculate total price for this item (finalPrice * quantity)
              const displayPrice = price+ offerDiscount
              const totalPrice = finalPrice * item.quantity;

              return (
                <tr key={index}>
                  <td>{product.name || 'Unknown'}</td>
                  <td>{item.mode}</td>
                  <td>{item.views}</td>
                  <td>{item.validity}</td>
                  <td>{item.bookType || 'N/A'}</td>
                  <td>{item.attempt || 'N/A'}</td>
                  <td>{item.language || 'N/A'}</td>
                  <td>{item.recording || 'N/A'}</td>
                  <td>₹{displayPrice.toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td>
                  ₹{offerDiscount}
                  </td>
                  <td>{discount}</td>
                  <td>₹{(price * item.quantity).toFixed(2)}</td>

                  <td>
                    {item.link ? (
                      <a
                        href={item.link.startsWith('http') ? item.link : `https://${item.link}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit Link
                      </a>
                    ) : (
                      'No links'
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="order-summary">
        <h2>Order Summary</h2>
        <p><strong>Subtotal:</strong> ₹{finalTotal.toFixed(2)}</p>
        {/* <p><strong>Coupon Discount:</strong> ₹{(subtotal * (order.discount || 0)).toFixed(2)}</p>
        <p><strong>Additional Offers:</strong> ₹{totalProductOffers.toFixed(2)}</p>
        <p><strong>Final Total:</strong> ₹{(finalTotal + totalProductOffers).toFixed(2)}</p> */}
      </div>
    </div>
  );
};

export default OrderDisplay;
