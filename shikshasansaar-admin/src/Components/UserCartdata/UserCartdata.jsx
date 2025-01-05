import React, { useState, useEffect } from 'react';
import './UserCartdata.css';

const UserCartdata = () => {
  const [allUsers, setAllUsers] = useState([]); // State to store user data
  const [all_products, setall_products] = useState([])
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; // Environment variable for backend URL

  const fetchInfo = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/allusers`);
      if (!response.ok) {
        throw new Error('Failed to fetch user data'); // Handle non-200 HTTP responses
      }
      const data = await response.json();
      setAllUsers(data); // Set the fetched user data to state
    } catch (error) {
      console.error('Error fetching user data:', error); // Log errors to the console
    }
  };

  useEffect(() => {
    fetchInfo(); // Fetch user data when the component mounts
  }, []);

  useEffect(() => {
    fetch(`${BACKEND_URL}/allproducts`)
      .then((response) => response.json())
      .then((data) => setall_products(data))
      .catch((error) => console.error('Error fetching all products:', error));
  }, []);

  return (
    <div className="user-list">
      {/* Header Section */}
      <div className="user-list-header">
        <p>Name</p>
        <p>Email</p>
        <p>Cart Data</p>
      </div>

      {/* Body Section */}
      <div className="user-list-body">
        <hr />
        {allUsers.length > 0 ? (
          allUsers.map((user) => {
            const { _id, first_name, last_name, email, cartData } = user;

            return (
              <div key={_id} className="user-item">
                <p className="user-entries">{`${first_name} ${last_name}`}</p>
                <p className="user-entries">{email}</p>

                {/* Cart Data */}
                <div className="user-cart-data">
                  {cartData && typeof cartData === 'object' ? (
                    <table className="cart-data-table">
                      <thead>
                        <tr>
                          <th>Product ID</th>
                          <th>Name</th>
                          <th>Mode</th>
                          <th>Views</th>
                          <th>Validity</th>
                          <th>Attempt</th>
                          <th>Language</th>
                          <th>Recording</th>
                          <th>Book Type</th>
                          <th>Old Price</th>
                          <th>New Price</th>
                          <th>Link</th>
                          <th>Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(cartData).map(([key, value]) => {
                          // Find the product in all_products using the `id` field
                          const product = all_products.find(
                            (product) => String(product.id) === String(value.productId)
                          );

                          // Get the product name or fallback to "Unknown Product"
                          const productName = product ? product.name : "Unknown Product";

                          return (
                            <tr key={key}>
                              <td>{value.productId}</td>
                              <td>{productName}</td> {/* Display product name */}
                              <td>{value.mode}</td>
                              <td>{value.views}</td>
                              <td>{value.validity}</td>
                              <td>{value.atempt}</td>
                              <td>{value.language}</td>
                              <td>{value.recording}</td>
                              <td>{value.bookType}</td>
                              <td>{value.oldPrice}</td>
                              <td>{value.newPrice}</td>
                              <td>
                                <a href={value.link} target="_blank" rel="noopener noreferrer">
                                  {value.link}
                                </a>
                              </td>
                              <td>{value.quantity}</td>
                            </tr>
                          );
                        })}



                      </tbody>
                    </table>
                  ) : (
                    <p>No cart data available</p>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="no-data">No user data available</p> // Message for empty data
        )}
      </div>
    </div>
  );
};

export default UserCartdata;
