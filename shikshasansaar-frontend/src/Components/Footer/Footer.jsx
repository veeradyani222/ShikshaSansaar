import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import logo from '../assets/logo.png';
import { ShopContext } from '../../Context/ShopContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faGithub, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
import FacultyFooter from '../FacultyFooter/FacultyFooter';

const Footer = () => {
    const { all_Content, all_faculties } = useContext(ShopContext);
    const content = all_Content[0]; // Assuming there's only one entry

    const [email, setEmail] = useState(''); // State to hold the email
    const [name, setname] = useState(''); // State to hold the email
    const [message, setMessage] = useState(''); // To show success or error messages

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

    // Add a check to ensure content is defined
    if (!content) {
        return <footer className="footer"><p className="loading-text">Loading...</p></footer>;
    }

    // Function to scroll to top
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Smooth scrolling
        });
    };

    const handleSubscribe = async (e) => {
        e.preventDefault(); // Prevent page reload

        // Validate inputs
        if (name.trim() === '') {
            setMessage('Please enter your name.');
            return;
        }
        if (email.trim() === '') {
            setMessage('Please enter a valid email.');
            return;
        }

        try {
            const response = await fetch(`${BACKEND_URL}/addsubscribers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email }), // Send name and email in the body
            });

            const result = await response.json();

            if (result.success) {
                setMessage('Subscribed successfully!');
                setEmail(''); // Clear email input field
                setname('');  // Clear name input field
            } else {
                setMessage(result.message || 'Failed to subscribe. Please try again.');
            }
        } catch (error) {
            console.error("Error:", error);
            setMessage('An error occurred. Please try again later.');
        }
    };


    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="contact-info">
                    <h3 className="contact-heading">Contact Us</h3>
                    <p className="contact-item">
                        <FontAwesomeIcon icon={faPhone} />{' '}
                        {content.contact_numbers.map((number, index) => (
                            <span key={index}>
                                <a href={`tel:${number}`} className="contact-link">{number}</a>
                                {index < content.contact_numbers.length - 1 ? ', ' : ''}
                            </span>
                        ))}
                    </p>
                    <p className="contact-item">
                        <FontAwesomeIcon icon={faEnvelope} />{' '}
                        {content.email_ids.map((email, index) => (
                            <span key={index}>
                                <a href={`mailto:${email}`} className="contact-link">{email}</a>
                                {index < content.email_ids.length - 1 ? ', ' : ''}
                            </span>
                        ))}
                    </p>
                    <p className="contact-item">
                        <FontAwesomeIcon icon={faMapMarkerAlt} /> {content.addresses.join(', ')}
                    </p>
                </div>

                <div className="othercontent">
                    <div className="routes-nav">
                        <ul>
                            <li className='footer-headings'>Links</li>
                            <li><Link to="/" onClick={scrollToTop}>Home</Link></li>
                            <li><Link to="/About" onClick={scrollToTop}>About Us</Link></li>
                            <li><Link to="/Courses" onClick={scrollToTop}>Courses</Link></li>
                            <li><Link to="/Categories" onClick={scrollToTop}>Categories</Link></li>
                            <li><Link to="/Terms" onClick={scrollToTop}>Terms of Use</Link></li>
                            <li><Link to="/RefundPolicy" onClick={scrollToTop}>Refund Policy</Link></li>
                            <li><Link to="/PrivacyPolicy" onClick={scrollToTop}>Privacy Policy</Link></li>
                            <li><Link to="/ExchangePolicy" onClick={scrollToTop}>Exchange Policy</Link></li>
                            <li><Link to="/query" onClick={scrollToTop}>Support</Link></li>
                            <li><Link to="/FAQ" onClick={scrollToTop}>FAQ</Link></li>
                            <li><Link to="/ContactUs" onClick={scrollToTop}>Contact Us</Link></li>
                            <li><Link to="/GiveAReview" onClick={scrollToTop}>Give A Review</Link></li>
                            <li><Link to="/OfflineOrders" onClick={scrollToTop}>Offline Orders</Link></li>
                            <li><Link to="/Faculties" onClick={scrollToTop}>Faculties</Link></li>
                        </ul>
                    </div>
                    <div className="routes-categories">

                        <div className="routes-categories">

                        </div>
                        {/* Newsletter Section */}
                        <div className="newsletter">
                            <form className='footer-form' onSubmit={handleSubscribe}>
                                <li className='footer-headings'>Subscribe to our newsletter for regular updates and news</li>
                                <input
                                    type="name"
                                    placeholder="Enter your name"
                                    className="newsletter-input newsletter-name"
                                    value={name}
                                    onChange={(e) => setname(e.target.value)} // Update email state
                                />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="newsletter-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)} // Update email state
                                />
                                <button type="submit" className="newsletter-submit">Subscribe</button>
                            </form>
                            {message && <p className="newsletter-message">{message}</p>} {/* Display messages */}
                        </div>

                    </div>
                    <div className="routes-faculty">
                        <li className='footer-headings'>SHOP</li>
                        <div className="routes-categories">
                            <Link to="/Categories/CA-Final" onClick={scrollToTop}><li>CA FINAL</li></Link>
                            <Link to="/Categories/CA-Inter" onClick={scrollToTop}><li>CA INTER</li></Link>
                            <Link to="/Categories/CMA-Courses" onClick={scrollToTop}><li>CMA COURSES</li></Link>
                            <Link to="/Categories/CS-Courses" onClick={scrollToTop}><li>CS COURSES</li></Link>
                        </div>
                    </div>
                </div>

                {/* Social Media Section */}
                <div className="social-media">
                    <h3 className="social-heading">Follow Us</h3>
                    <div
                        className="social-icons"
                        style={{ display: 'flex', flexDirection: 'row' }}
                    >
                        <a href={content.instagram} target="_blank" rel="noopener noreferrer" className="social-link">
                            <FontAwesomeIcon icon={faInstagram} />
                        </a>
                        <a href={content.github} target="_blank" rel="noopener noreferrer" className="social-link">
                            <FontAwesomeIcon icon={faGithub} />
                        </a>
                        <a href={content.facebook} target="_blank" rel="noopener noreferrer" className="social-link">
                            <FontAwesomeIcon icon={faFacebook} />
                        </a>
                        <a href={content.twitter} target="_blank" rel="noopener noreferrer" className="social-link">
                            <FontAwesomeIcon icon={faTwitter} />
                        </a>
                    </div>
                </div>
            </div>
            <div className="logo-section">
            <Link to="/" onClick={scrollToTop}><img src={logo} alt="Pro Library" /></Link>
            </div>
            {/* Footer Bottom Section */}
            <div className="footer-bottom">
                <p className="footer-text">&copy; {new Date().getFullYear()} PRO-Library. All Rights Reserved.</p>
            </div>
            <div>
                Himanshu
            </div>
        </footer>
    );
};

export default Footer;
