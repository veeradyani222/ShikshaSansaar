import './App.css';
import Navbar from './Components/navbar/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ShopCategory from './Pages/ShopCategory.jsx';
import ShopSubCategory from './Pages/ShopSubCategory.jsx';
import Cart from './Pages/Cart.jsx';
import Product from './Pages/Product.jsx';
import Home from './Pages/Home.jsx';
import LoginSignup from './Pages/LoginSignup.jsx';
import About from './Pages/About.jsx';
import Categories from './Pages/Categories.jsx';
import ContactUs from './Pages/ContactUs.jsx';
import Courses from './Pages/Courses.jsx';
import FAQ from './Pages/FAQ.jsx';
import Terms from './Pages/Terms.jsx';
import Wishlist from './Pages/Wishlist.jsx';
import FacultyResult from './Pages/FacultyResult.jsx';
import AddReview from './Components/AddReview/AddReview.jsx';
import AddOfflineOrder from './Pages/AddOfflineOrder.jsx';
import Footer from './Components/Footer/Footer.jsx';
import Contact from './Components/Contact/Contact.jsx';
import Profile from './Pages/Profile.jsx';
import ThankYouPage from './Pages/ThankYouPage.jsx';
import React, { useEffect  } from 'react';
import { useLocation } from 'react-router-dom';
import Blogs from './Pages/Blogs.jsx';
import Blog from './Pages/Blog.jsx';
import PrivacyPolicy from './Pages/PrivacyPolicy.jsx';
import FirstNavbar from './Components/FirstNavbar/FirstNavbar.jsx';
import ResetPassword from './Pages/ResetPassword.jsx';
import ForgotPassword from './Pages/ForgotPassword.jsx';
import Order from './Pages/Order.jsx';
import Faculties from './Pages/Faculties.jsx';
import Promotion from './Components/Promotion/Promotion.jsx';
import BottomNav from './Components/BottomNav/BottomNav.jsx';
import CheckoutPage from './Pages/CheckOut.jsx';
import Query from './Pages/Query.jsx';
import ExchangePolicy from './Pages/ExchangePolicy.jsx';
import RefundPolicy from './Pages/RefundPolicy.jsx';


// Function to scroll to top
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// Scroll-to-top when route changes
const ScrollToTopOnRouteChange = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return null;
};

function App() {

  useEffect(() => {
    // Select all button elements in the app
    const buttons = document.querySelectorAll('button');

    // Attach scrollToTop function to each button's click event
    buttons.forEach(button => {
      button.addEventListener('click', scrollToTop);
    });

    // Cleanup the event listener on component unmount
    return () => {
      buttons.forEach(button => {
        button.removeEventListener('click', scrollToTop);
      });
    };
  }, []); // Empty dependency array ensures it runs once when the app loads

  return (
    <div>
      <BrowserRouter>
        {/* Scroll to top on route change */}
        <ScrollToTopOnRouteChange />
        <div className="header-container">
  <Contact className="contact-component" />
  <FirstNavbar className="first-navbar" />
  <Navbar className="navbar" />
</div>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/Categories/CA-Final" element={<ShopCategory  category="CA Final" />} />
          <Route path="/Categories/CA-Inter" element={<ShopCategory  category="CA Inter" />} />
          <Route path="/Categories/CMA-Courses" element={<ShopCategory  category="CMA Courses" />} />
          <Route path="/Categories/CS-Courses" element={<ShopCategory  category="CS Courses" />} />
          <Route path="/About" element={<About/>} />
          <Route path="/Categories" element={<Categories/>} />
          <Route path="/ContactUs" element={<ContactUs/>} />
          <Route path="/Courses" element={<Courses/>} />
          <Route path="/FAQ" element={<FAQ/>} />
          <Route path="/Terms" element={<Terms/>} />
          <Route path="/ExchangePolicy" element={<ExchangePolicy/>} />
          <Route path="/RefundPolicy" element={<RefundPolicy/>} />
          <Route path="/PrivacyPolicy" element={<PrivacyPolicy/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/OfflineOrders" element={<AddOfflineOrder/>} />
          <Route path="/GiveAReview" element={<AddReview/>} />
          <Route path="/blog" element={<Blogs/>} />
          <Route path="/ForgotPassword" element={<ForgotPassword/>} />
          <Route path="/ResetPassword" element={<ResetPassword/>} />
          <Route path="/thank-you" element={<ThankYouPage/>} />
          <Route path="/CheckOut" element={<CheckoutPage />} />
          <Route path="/query" element={<Query/>} />
          <Route path="/product/:productId" element={<Product/>} />
          <Route path="/order/:orderId" element={<Order />} />

          <Route path="/blog/:blogId" element={<Blog/>} />
          <Route path="/faculties" element={<Faculties/>} />
          <Route path="/Faculties/:lecturer" element={<FacultyResult/>} />
  
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />

          {/* CA Final Routes */}
          <Route path="/CAFinal/AFM" element={<ShopSubCategory category="CA Final" sub_category="AFM" />} />
          <Route path="/CAFinal/Audit" element={<ShopSubCategory category="CA Final" sub_category="Audit" />} />
          <Route path="/CAFinal/DirectTax" element={<ShopSubCategory category="CA Final" sub_category="DT" />} />
          <Route path="/CAFinal/FR" element={<ShopSubCategory category="CA Final" sub_category="FR" />} />
          <Route path="/CAFinal/IndirectTax" element={<ShopSubCategory category="CA Final" sub_category="IDT" />} />
          <Route path="/CAFinal/LAW" element={<ShopSubCategory category="CA Final" sub_category="LAW" />} />
          <Route path="/CAFinal/SCMPE" element={<ShopSubCategory category="CA Final" sub_category="SCMPE" />} />

          {/* CA Inter Routes */}
          <Route path="/CAInter/Accounts" element={<ShopSubCategory category="CA Inter" sub_category="Accounts" />} />
          <Route path="/CAInter/Audit" element={<ShopSubCategory category="CA Inter" sub_category="Audit" />} />
          <Route path="/CAInter/DirectTax" element={<ShopSubCategory category="CA Inter" sub_category="Direct Tax (DT)" />} />
          <Route path="/CAInter/LAW" element={<ShopSubCategory category="CA Inter" sub_category="LAW" />} />
          <Route path="/CAInter/Taxation" element={<ShopSubCategory category="CA Inter" sub_category="Taxation" />} />

          {/* CMA Courses Routes */}
          <Route path="/CMACourses/CMAFinal" element={<ShopSubCategory category="CMA Courses" sub_category="CMA Final" />} />
          <Route path="/CMACourses/CMAFoundation" element={<ShopSubCategory category="CMA Courses" sub_category="CMA Foundation" />} />
          <Route path="/CMACourses/CMAInter" element={<ShopSubCategory category="CMA Courses" sub_category="CMA Inter" />} />
          <Route path="/CMACourses/DirectTax" element={<ShopSubCategory category="CMA Courses" sub_category="Direct Tax (DT)" />} />

          {/* CS Courses Routes */}
          <Route path="/CSCourses/CSExecutive" element={<ShopSubCategory category="CS Courses" sub_category="CS Executive" />} />
          <Route path="/CSCourses/CSProfessional" element={<ShopSubCategory category="CS Courses" sub_category="CS Professional" />} />
          <Route path="/CSCourses/CSEET" element={<ShopSubCategory category="CS Courses" sub_category="CSEET" />} />
        </Routes>
        <Footer/>
        <Promotion/>
        <BottomNav/>
      </BrowserRouter>
    </div>
  );
}

export default App;
