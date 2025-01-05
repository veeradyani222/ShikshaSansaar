import React, { useState , useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Sidebar from './Components/Sidebar/Sidebar';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import AddEmployees from './Components/AddEmployees/AddEmployees';
import AddProduct from './Components/AddProduct/AddProduct';
import AddProductImages from './Components/AddProductImages/AddProductImages';
import ViewProductImagesList from './Components/ViewProductImagesList/ViewProductImagesList';
import ListProduct from './Components/ListProduct/ListProduct';
import EditSlider from './Components/EditSlider/EditSlider';
import AddContent from './Components/EditWebsite/AddContent';
import EditContent from './Components/EditContent/EditContent';
import AddBlog from './Components/AddBlog/AddBlog';
import BlogList from './Components/BlogList/BlogList';
import AddLecturer from './Components/AddLecturer/AddLecturer';
import LecturerList from './Components/LecturerList/LecturerList';
import SliderList from './Components/SliderList/SliderList';
import OrderList from './Components/OrderList/OrderList';
import ReviewList from './Components/ReviewList/ReviewList';
import AddFAQ from './Components/AddFAQ/AddFAQ';
import FAQList from './Components/FAQList/FAQList';
import GreetingMessage from './Components/GreetingMessage/GreetingMessage';
import Users from './Components/Users/Users';
import SubscriberEmail from './Components/SubscriberEmail/SubscriberEmail';
import ViewAnalytics from './Components/ViewAnalytics/ViewAnalytics';
import LoginEmployee from './Components/LoginEmployee/LoginEmployee';
import UserCartdata from './Components/UserCartdata/UserCartdata';
import UserPurchaseData from './Components/UserPurchasedata/UserPurchasedata';
import UserWishlistData from './Components/UserWishlistData/UserWishlistData';
import AllQuotes from './Components/AllQuotes/AllQuotes';

const App = () => {

  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));

  useEffect(() => {
      // Check authToken in localStorage on component mount or any change
      const token = localStorage.getItem('authToken');
      setAuthToken(token);
  }, []);

    return (
      <div
      className="main-app-admin-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden' // Prevents outer scrolling to keep it tidy
      }}
    >
      {/* Navbar fixed at the top */}
      <div
        className="navbar"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          backgroundColor:'#fff',
          zIndex: 1000
        }}
      >
        <Navbar />
      </div>

      {/* Content container */}
      <div
        className="content-container"
        style={{
          display: 'flex',
          height: '100%', // Full height for main content
          marginTop: '10vh', // Offset by navbar height
          overflow: 'hidden' // Ensures only one scrollbar for main content
        }}
      >
        {/* Sidebar fixed to the left */}
        <div
          className="sidebar"
          style={{
            position: 'fixed',
            top: '20vh', // Start below the navbar
            bottom: 0,
            overflowY: 'auto', // Scroll only if sidebar content overflows
            zIndex: 999 // Keep it above main content if needed
          }}
        >
          <Sidebar />
        </div>

        {/* Main content scrollable */}
        <div
          className="main-content"
          style={{
            marginLeft: '20vw', // Leave space for the fixed sidebar
            width: 'calc(100% - 250px)', // Adjust width to fill remaining space
            overflowY: 'auto', // Enable single vertical scrolling
            padding: '1vw 2vw',
            boxSizing: 'border-box',
            marginTop:'10vh'
          }}
        >
      <Routes>
        {/* Login Route */}
        <Route path="/login" element={<LoginEmployee setAuthToken={setAuthToken} />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute authToken={authToken} />}>
          <Route path="/addemployee" element={<AddEmployees />} />
          <Route path="/addproduct" element={<AddProduct />} />
          <Route path="/addproductimages" element={<AddProductImages />} />
          <Route path="/viewProductImagesList" element={<ViewProductImagesList />} />
          <Route path="/listproduct" element={<ListProduct />} />
          <Route path="/editSlider" element={<EditSlider />} />
          <Route path="/addContent" element={<AddContent />} />
          <Route path="/editContent" element={<EditContent />} />
          <Route path="/addBlog" element={<AddBlog />} />
          <Route path="/blogList" element={<BlogList />} />
          <Route path="/addLecturer" element={<AddLecturer />} />
          <Route path="/viewLecturerList" element={<LecturerList />} />
          <Route path="/SliderList" element={<SliderList />} />
          <Route path="/OrderList" element={<OrderList />} />
          <Route path="/ReviewList" element={<ReviewList />} />
          <Route path="/AddFAQ" element={<AddFAQ />} />
          <Route path="/FAQList" element={<FAQList />} />
          <Route path="/Users-Cartdata" element={<UserCartdata />} />
          <Route path="/Users-Purchasedata" element={<UserPurchaseData/>} />
          <Route path="/GreetingMessage" element={<GreetingMessage />} />
          <Route path="/Users" element={<Users />} />
          <Route path="/SubscriberEmail" element={<SubscriberEmail />} />
          <Route path="/viewAnalytics" element={<ViewAnalytics />} />
          <Route path="/Users-Wishlistdata" element={<UserWishlistData />} />
          <Route path="/AllQuotes" element={<AllQuotes />} />
        </Route>
      </Routes>
    </div>
  </div>
</div>

  
    );
};

export default App;
