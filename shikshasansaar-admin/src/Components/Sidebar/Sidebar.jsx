import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './Sidebar.css';

const Sidebar = () => {
  const [features, setFeatures] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (token) {
        const parsedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
        setFeatures(parsedToken.features);
        console.log("Features:", parsedToken.features); // Log the features
    }
}, []);

  return (
    <div className="sidebar-main">
      <center>
        {features["Add Employee"] && (
          <Link to="/addemployee" style={{ textDecoration: "none" }}>
            <div className="sidebar-button">Add Employee</div>
          </Link>
        )}
        {features["Add Product"] && (
          <Link to="/addproduct" style={{ textDecoration: "none" }}>
            <div className="sidebar-button">Add Product</div>
          </Link>
        )}
        {features["View Product List"] && (
          <Link to="/listproduct" style={{ textDecoration: "none" }}>
            <div className="sidebar-button">View Product List</div>
          </Link>
        )}
        {features["Add Product Images"] && (
          <Link to="/addproductimages" style={{ textDecoration: "none" }}>
            <div className="sidebar-button">Add Product Images</div>
          </Link>
        )}
        {features["View Product Images List"] && (
          <Link to="/viewProductImagesList" style={{ textDecoration: "none" }}>
            <div className="sidebar-button">View Product Images List</div>
          </Link>
        )}
        {features["Add Slider Image"] && (
          <Link to="/editSlider" style={{ textDecoration: "none" }}>
            <div className="sidebar-button">Add Slider Image</div>
          </Link>
        )}
        {features["Edit Slider List"] && (
          <Link to="/SliderList" style={{ textDecoration: "none" }}>
            <div className="sidebar-button">Edit Slider List</div>
          </Link>
        )}
        {features["Add Content"] && (
          <Link to="/addContent" style={{ textDecoration: "none" }}>
            <div className="sidebar-button">Add Content</div>
          </Link>
        )}
        {features["Edit Content"] && (
          <Link to="/editContent" style={{ textDecoration: "none" }}>
            <div className="sidebar-button">Edit Content</div>
          </Link>
        )}
        {features["Add Blog"] && (
          <Link to="/addBlog" style={{ textDecoration: "none" }}>
            <div className="sidebar-button">Add Blog</div>
          </Link>
        )}
        {features["Blogs List"] && (
          <Link to="/blogList" style={{ textDecoration: "none" }}>
            <div className="sidebar-button">Blogs List</div>
          </Link>
        )}
        {features["Add Faculty"] && (
          <Link to="/addLecturer" style={{ textDecoration: "none" }}>
            <div className="sidebar-button">Add Faculty</div>
          </Link>
        )}
        {features["View Faculty List"] && (
          <Link to="/viewLecturerList" style={{ textDecoration: "none" }}>
            <div className="sidebar-button">View Faculty List</div>
          </Link>
        )}
        {features["Add FAQ"] && (
          <Link to="/AddFAQ" style={{ textDecoration: "none" }}>
            <div className="sidebar-button">Add FAQ</div>
          </Link>
        )}
        {features["View FAQ List"] && (
          <Link to="/FAQList" style={{ textDecoration: "none" }}>
            <div className="sidebar-button">View FAQ List</div>
          </Link>
        )}
        {features["Add Greeting Message"] && (
          <Link to="/GreetingMessage" style={{ textDecoration: "none" }}>
            <div className="sidebar-button">Add Greeting Message</div>
          </Link>
        )}
        {features["View All Orders"] && (
          <Link to="/OrderList" style={{ textDecoration: "none" }}>
            <div className="sidebar-button">View All Orders</div>
          </Link>
        )}
        {features["View Reviews List"] && (
          <Link to="/ReviewList" style={{ textDecoration: "none" }}>
            <div className="sidebar-button">View Reviews List</div>
          </Link>
        )}
        {features["All Users"] && (
          <Link to="/Users" style={{ textDecoration: "none" }}>
            <div className="sidebar-button">All Users</div>
          </Link>
        )}

{features["Users CartData"] && (
           <Link to="/Users-Cartdata" style={{ textDecoration: "none" }}>
            <div className="sidebar-button">Users CartData</div>
          </Link>
          )}
{features["Users WishlistData"] && (
          <Link to="/Users-Wishlistdata" style={{ textDecoration: "none" }}>
            <div className="sidebar-button">Users WishlistData</div>
          </Link>
           )}
{features["Users BuyData"] && (
          <Link to="/Users-Purchasedata" style={{ textDecoration: "none" }}>
            <div className="sidebar-button">Users Purchase Data</div>
          </Link>
          )}
{features["All Quoted Prices"] && (
          <Link to="/AllQuotes" style={{ textDecoration: "none" }}>
            <div className="sidebar-button">All Quoted Prices</div>
          </Link>
)}

  {features["Send Emails to Subscribers"] && (
    <Link to="/SubscriberEmail" style={{ textDecoration: "none" }}>
        <div className="sidebar-button">Send Emails to Subscribers</div>
    </Link>
)}

        {features["View Analytics"] && (
          <Link to="/viewAnalytics" style={{ textDecoration: "none" }}>
            <div className="sidebar-button">View Analytics</div>
          </Link>
        )}
      </center>
    </div>
  );
};

export default Sidebar;
