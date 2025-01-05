import React, { useContext, useState, useEffect } from 'react';
import './FirstNavbar.css';
import { Link, useNavigate } from 'react-router-dom';
import cart_icon from '../assets/cart_icon.png';
import heart_icon from '../assets/heart_icon.png';
import user_icon from '../assets/profile-new.png';
import logo from '../assets/logo.png';
import { ShopContext } from '../../Context/ShopContext';
import ProductItemProductDisplay from './../ProductItemProductDisplay/ProductItemProductDisplay';

const FirstNavbar = () => {
    const { getTotalCartCount, getTotalWishlistCount } = useContext(ShopContext);
    const totalCartItems = getTotalCartCount();
    const totalWishlistItems = getTotalWishlistCount();
    const navigate = useNavigate();

    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

    // Fetch all products when the component mounts
    useEffect(() => {
        fetch(`${BACKEND_URL}/allproducts`)
            .then((res) => res.json())
            .then((data) => setAllProducts(data))
            .catch((error) => console.error('Error fetching products:', error));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('auth-token');
        setIsLogoutModalOpen(false);
        navigate('/');
    };

    const checkAuthentication = (route) => {
        if (!localStorage.getItem('auth-token')) {
            navigate('/login');
        } else {
            navigate(route);
        }
    };

    // Handle search input changes
    const handleSearch = (e) => {
        const value = e.target.value.trim().replace(/\s+/g, ''); // Remove all spaces from the search term
        setSearchTerm(value);
    
        if (value) {
            const results = allProducts.filter((product) => {
                const nameMatch = product.name?.replace(/\s+/g, '').includes(value); // Remove spaces from name
                const categoryMatch = product.category?.replace(/\s+/g, '').includes(value); // Remove spaces from category
                const subcategoryMatch = product.subcategory?.replace(/\s+/g, '').includes(value); // Remove spaces from subcategory
                const lecturerMatch = product.lecturer?.replace(/\s+/g, '').includes(value); // Remove spaces from lecturer
                const facultyMatch = product.faculty?.replace(/\s+/g, '').includes(value); // Remove spaces from faculty
                const subjectSetMatch = product.subjectSet?.replace(/\s+/g, '').includes(value); // Remove spaces from subject set
    
                // Normalize tag field
                const tagMatch = product.tag
                    ?.toLowerCase()
                    .split('/')
                    .map(tag => tag.trim().replace(/\s+/g, '')) // Remove spaces from each tag
                    .some(tag => tag.includes(value)); // Check if any normalized tag matches the search term
    
                return nameMatch || categoryMatch || subcategoryMatch || lecturerMatch || facultyMatch || subjectSetMatch || tagMatch;
            });
            setFilteredProducts(results);
            setIsSearchVisible(true); // Show search results when typing
        } else {
            setFilteredProducts([]);
            setIsSearchVisible(false); // Hide results if search is empty
        }
    };
    
    const handleProductClick = () => {
        setSearchTerm('');  // Clear search input
        setFilteredProducts([]);  // Clear filtered results
        setIsSearchVisible(false);  // Hide search results box
    };
    
    return (
        <div className='firstnav'>
            <nav>
                {/* Logo */}
                <div className="logo" onClick={() => navigate('/')}>
                    <img className='logo-img' src={logo} alt="Logo" />
                </div>

                {/* Search Input */}
                <div className="search-bar-first">
                    <input
                        type="text"
                        placeholder="Search products by name, subject, faculty..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="search-input-first"
                    />
                </div>

                {/* Profile, Wishlist, and Cart Icons */}
                <div className="login-profile">
                    {localStorage.getItem('auth-token') ? (
                        <li className='login' onClick={() => setIsLogoutModalOpen(true)}>Logout</li>
                    ) : (
                        <Link to="/login">
                            <li className='login'>Login</li>
                        </Link>
                    )}
                    <div className="cart profile" onClick={() => checkAuthentication('/profile')}>
                        <li className='profile'>
                            <img src={user_icon} alt="Profile" />
                        </li>
                    </div>
                    <div className="cart" onClick={() => checkAuthentication('/wishlist')}>
                        <div className="cart-wishlist-number">{totalWishlistItems}</div>
                        <li className='wishlist'>
                            <img src={heart_icon} alt="Wishlist" />
                        </li>
                    </div>
                    <div className="cart shopcart" onClick={() => checkAuthentication('/cart')}>
                        <div className="cart-cart-number">{totalCartItems}</div>
                        <li className='cart shopcart'>
                            <img src={cart_icon} alt="Cart" />
                        </li>
                    </div>
                </div>
            </nav>

            {/* Search Results Box Below Navbar */}
            {isSearchVisible && searchTerm && (
                <div className="search-results-container">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <ProductItemProductDisplay
                                key={product.id}
                                id={product.id}
                                image={product.image}
                                name={product.name}
                                category={product.category}
                                sub_category={product.sub_category}
                                lecturer={product.lecturer}
                                onClick={handleProductClick} // Call handleProductClick to clear the search results
                            />
                        ))
                    ) : (
                        <p className="no-results">No products found.</p>
                    )}
                </div>
            )}

            {/* Logout Confirmation Modal */}
            {isLogoutModalOpen && (
                <div className="logout-modal">
                    <div className="logout-modal-content">
                        <h3>Are you sure you want to log out?</h3>
                        <button onClick={handleLogout}>Yes, Log Out</button>
                        <button onClick={() => setIsLogoutModalOpen(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FirstNavbar;
