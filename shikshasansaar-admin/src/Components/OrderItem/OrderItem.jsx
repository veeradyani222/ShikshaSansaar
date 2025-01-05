import React from 'react';
import './OrderItem.css'; // Import your CSS file for styling

const OrderItem = ({ order, onRemove }) => {
  return (
    <div className="order-item">
      <div className="order-details">
        <p><strong>ID:</strong> {order.id}</p>
        <p><strong>Name:</strong> {order.name}</p>
        <p><strong>Email:</strong> {order.email}</p>
        <p><strong>Mobile:</strong> {order.mobile}</p>
        <p><strong>Subject:</strong> {order.subject}</p>
        <p><strong>Postal Address:</strong> {order.postal_address}</p>
        <p><strong>State:</strong> {order.state}</p>
        <p><strong>City:</strong> {order.city}</p>
        <p><strong>Pin Code:</strong> {order.pin_code}</p>
        <p><strong>Faculty:</strong> {order.faculty}</p>
        <p><strong>Course Level:</strong> {order.course_level}</p>
        <p><strong>Course Type:</strong> {order.course_type}</p>
        <p><strong>Mode of Lectures:</strong> {order.mode_of_lectures}</p>
        <p><strong>Exam Attempt Month:</strong> {order.exam_attempt_month}</p>
        <p><strong>Exam Attempt Year:</strong> {order.exam_attempt_year}</p>
        <p><strong>Product MRP:</strong> ₹{order.product_mrp}</p>
        <p><strong>Amount Paid:</strong> ₹{order.amount_paid}</p>
        <p><strong>Amount Due:</strong> ₹{order.amount_due}</p>
        <p><strong>Mode of Payment:</strong> {order.mode_of_payment}</p>
        <p><strong>UPI Merchant Name:</strong> {order.upi_merchant_name}</p>
        <p><strong>Paid To:</strong> {order.paid_to}</p>
        <img 
          src={order.image} 
          alt="Payment Screenshot" 
          className="payment-screenshot"
          onClick={() => window.open(order.image, '_blank')} // Open image in a new tab
        />
      </div>
      <button className="remove-button" onClick={() => onRemove(order.id)}>
        Remove
      </button>
    </div>
  );
};

export default OrderItem;
