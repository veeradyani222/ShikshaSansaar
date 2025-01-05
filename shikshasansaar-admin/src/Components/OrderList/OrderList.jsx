import React, { useEffect, useState } from 'react';
import './OrderList.css';
import OrderItem from '../OrderItem/OrderItem'; // Import the OrderItem component

const OrderList = () => {
  const [allOrders, setAllOrders] = useState([]);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchInfo = async () => {
    await fetch(`${BACKEND_URL}/allorders`)
      .then((res) => res.json())
      .then((data) => {
        setAllOrders(data);
      });
  }

  useEffect(() => {
    fetchInfo();
  }, []);

  const handleRemove = async (id) => {
    await fetch(`${BACKEND_URL}/removeorder`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ id })
    });
    await fetchInfo();
  }

  return (
    <div className='order-list-container'>
      {allOrders.map((order) => (
        <OrderItem key={order.id} order={order} onRemove={handleRemove} />
      ))}
    </div>
  );
}

export default OrderList;
