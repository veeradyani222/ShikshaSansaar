import React, { useState, useEffect, useContext, useRef } from 'react';
import './Search.css';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';
import ProductItemProductDisplay from './../ProductItemProductDisplay/ProductItemProductDisplay'; // Import ProductItemProductDisplay

const SearchComponent = () => {
    const { getImageSrcByCode } = useContext(ShopContext);
    const [allProducts, setAllProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isVisible, setIsVisible] = useState(false);

    const navigate = useNavigate();
    const searchRef = useRef(null);
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

    // Fetch all products on component mount
    useEffect(() => {
        fetch(`${BACKEND_URL}/allproducts`)
            .then((res) => res.json())
            .then((data) => setAllProducts(data))
            .catch((error) => console.error('Error fetching products:', error));
    }, []);

    // Handle input and filter results
    const handleSearch = (e) => {
        const value = e.target.value.trim().replace(/\s+/g, '').toLowerCase(); // Remove spaces and convert to lowercase
        setSearchTerm(value);
    
        if (value) {
            setFilteredProducts(
                allProducts.filter((product) => {
                    // Normalize and check tags
                    const normalizedTags = product.tag
                        ? product.tag
                              .split('/')
                              .map((tag) => tag.trim().replace(/\s+/g, '').toLowerCase()) // Remove spaces from tags
                        : [];
    
                    // Check all fields, including normalized tags (with spaces removed)
                    return (
                        product.name.replace(/\s+/g, '').toLowerCase().includes(value) || // Remove spaces from name
                        product.category.replace(/\s+/g, '').toLowerCase().includes(value) || // Remove spaces from category
                        product.subcategory?.replace(/\s+/g, '').toLowerCase().includes(value) || // Remove spaces from subcategory
                        product.lecturer?.replace(/\s+/g, '').toLowerCase().includes(value) || // Remove spaces from lecturer
                        product.faculty?.replace(/\s+/g, '').toLowerCase().includes(value) || // Remove spaces from faculty
                        product.subjectSet?.replace(/\s+/g, '').toLowerCase().includes(value) || // Remove spaces from subject set
                        normalizedTags.some((tag) => tag.includes(value)) // Check if any normalized tag matches
                    );
                })
            );
            setIsVisible(true);
        } else {
            setIsVisible(false);
            setFilteredProducts([]);
        }
    };
    
    // Navigate to the product page when a product is clicked
    const handleProductClick = (id) => {
        navigate(`/product/${id}`);
        setIsVisible(false);
        setSearchTerm('');
    };

    // Close search results when clicking outside
    const handleClickOutside = (e) => {
        if (searchRef.current && !searchRef.current.contains(e.target)) {
            setIsVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="search-container" ref={searchRef}>
            <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
            />

            {/* Search Results Dropdown */}
            {isVisible && searchTerm && (
                <div className="search-results">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <ProductItemProductDisplay
                                key={product.id}
                                id={product.id}
                                image={getImageSrcByCode(product.image_code)}
                                name={product.name}
                                category={product.category}
                                sub_category={product.sub_category}
                                lecturer={product.lecturer}
                                onClick={() => handleProductClick(product.id)} // Trigger handleProductClick on product click
                            />
                        ))
                    ) : (
                        <p className="no-results">No products found.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchComponent;
