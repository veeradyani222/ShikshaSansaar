import React, { useState, useEffect } from "react";
import "./UserWishlistData.css";

const UserWishlistData = () => {
  const [allUsers, setAllUsers] = useState([]); // State to store user data
  const [all_products, setall_products] = useState([]); // State to store all products
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; // Environment variable for backend URL

  // Fetch user data
  const fetchInfo = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/allusers`);
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      setAllUsers(data); // Set the fetched user data
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Fetch product data
  useEffect(() => {
    fetchInfo(); // Fetch user data when the component mounts
  }, []);

  useEffect(() => {
    fetch(`${BACKEND_URL}/allproducts`)
      .then((response) => response.json())
      .then((data) => setall_products(data))
      .catch((error) => console.error("Error fetching all products:", error));
  }, []);

  return (
    <div className="user-list">
      {/* Header Section */}
      <div className="user-list-header">
        <p>Name</p>
        <p>Email</p>
        <p>Wishlist Data</p>
      </div>

      {/* Body Section */}
      <div className="user-list-body">
        <hr />
        {allUsers.length > 0 ? (
          allUsers.map((user) => {
            const { _id, first_name, last_name, email, wishlistData } = user;

            return (
              <div key={_id} className="user-item">
                <p className="user-entries">{`${first_name} ${last_name}`}</p>
                <p className="user-entries">{email}</p>

                {/* Wishlist Data */}
                <div className="user-wishlist-data">
                  {wishlistData && typeof wishlistData === "object" ? (
                    <table className="wishlist-data-table">
                      <thead>
                        <tr>
                          <th>Product ID</th>
                          <th>Product Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(wishlistData).map(([productId, quantity]) => {
                          // Find the product in all_products using the `id` field
                          const product = all_products.find(
                            (product) => String(product.id) === String(productId)
                          );

                          // Get the product name or fallback to "Unknown Product"
                          const productName = product ? product.name : "Unknown Product";

                          return (
                      
                              <tr key={productId}>
                              <td>{productId}</td>
                              <td>{productName}</td> {/* Display product name */}
                            </tr>
                       
                          );
                        })}
                      </tbody>
                    </table>
                  ) : (
                    <p>No wishlist data available</p>
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

export default UserWishlistData;
