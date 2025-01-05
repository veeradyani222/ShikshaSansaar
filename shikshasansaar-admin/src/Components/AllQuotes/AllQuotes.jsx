import React, { useState, useEffect } from 'react';
import './AllQuotes.css'; // Reusing the same CSS file for consistency

const AllQuotes = () => {
  const [quotedPrices, setQuotedPrices] = useState([]); // State to store all quoted prices
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; // Backend URL environment variable

  // Fetch data from the allQuoteYourPricesEndpoint
  const fetchQuotedPrices = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/allQuotes`);
      if (!response.ok) {
        throw new Error('Failed to fetch quoted prices');
      }
      const data = await response.json();
      setQuotedPrices(data); // Set fetched data to state
    } catch (error) {
      console.error('Error fetching quoted prices:', error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchQuotedPrices();
  }, []);

  // Function to handle the deletion of a quote
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${BACKEND_URL}/removeQuote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }), // Send the quote's id (as a number) in the request body
      });
  
      const data = await response.json();
  
      // If deletion was successful, remove the quote from the UI
      if (data.success) {
        setQuotedPrices(quotedPrices.filter((quote) => quote.id !== id)); // Remove quote from the list
      } else {
        console.error('Failed to delete the quote');
      }
    } catch (error) {
      console.error('Error deleting quote:', error);
    }
  };

  return (
    <div className="quote-list">
      {/* Header Section */}
      <div className="quote-list-header">
        <p>Name</p>
        <p>Email</p>
        <p>Mobile Number</p>
        <p>Seller</p>
        <p>Quoted Price</p>
        <p>Shared Image</p>
        <p>Product Name</p>
        <p>Product ID</p>
        <p>Date</p>
        <p>Actions</p> {/* Add column for delete button */}
      </div>

      {/* Body Section */}
      <div className="quote-list-body">
        <hr />
        {quotedPrices.length > 0 ? (
          quotedPrices.map((quote) => {
            const {
              _id,
              name,
              email,
              mobile_number,
              seller,
              quotedprice,
              productname,
              productid,
              date,
              image,
            } = quote;

            return (
              <div key={_id} className="quote-item">
                <p className="quote-entries">{name}</p>
                <p className="quote-entries">{email}</p>
                <p className="quote-entries">{mobile_number}</p>
                <p className="quote-entries">{seller}</p>
                <p className="quote-entries">{quotedprice}</p>
                <img className="quote-image" src={image} alt="Product" />
                <p className="quote-entries">{productname}</p>
                <p className="quote-entries">{productid}</p>
                <p className="quote-entries">
                  {new Date(date).toLocaleDateString()} {/* Format date */}
                </p>
                {/* Delete Button */}
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(quote.id)} // Trigger delete on click with the quote's id
                >
                  Delete
                </button>
              </div>
            );
          })
        ) : (
          <p className="no-data">No quoted prices available</p> // Fallback for empty data
        )}
      </div>
    </div>
  );
};

export default AllQuotes;
