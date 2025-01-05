import React, { useEffect, useState, useContext } from 'react';
import './CSS/Profile.css'; // Ensure your CSS path is correct
import { ShopContext } from '../Context/ShopContext';
import OrderItem from '../Components/OrderItem/OrderItem';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Player } from '@lottiefiles/react-lottie-player';
import Loading from '../Components/assets/pro-library-loading.json';



const Profile = () => {
    const [profile, setProfile] = useState({
        first_name: '',
        last_name: '',
        email: '',
        mobile_number: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [view, setView] = useState('details');
    const [updateDetails, setUpdateDetails] = useState({ first_name: '', last_name: '', email: '', mobile_number: '' });
    const [newPassword, setNewPassword] = useState({ currentPassword: '', newPassword: '' });
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation(); // Get navigation state

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        const fetchProfile = async () => {
          const token = localStorage.getItem('auth-token');
          if (!token) {
            setError('Please log in to view your profile.');
            setLoading(false); // Stop loading if no token is found
            return;
          }
    
          try {
            const response = await fetch(`${BACKEND_URL}/profile`, {
              method: 'GET',
              headers: { 'auth-token': token },
            });
    
            if (!response.ok) {
              throw new Error('Failed to fetch profile');
            }
    
            const data = await response.json();
            setProfile({
              first_name: data.first_name || '',
              last_name: data.last_name || '',
              email: data.email || '',
              mobile_number: data.mobile_number || '',
            });
            setUpdateDetails({
              first_name: data.first_name || '',
              last_name: data.last_name || '',
              email: data.email || '',
              mobile_number: data.mobile_number || '',
            });
            setLoading(false); // Stop loading after fetching data
          } catch (err) {
            setError(err.message || 'Failed to fetch profile');
            setLoading(false); // Stop loading if there's an error
          }
        };
    
        fetchProfile();
      }, []);
    useEffect(() => {
        if (location.state?.view) {
            setView(location.state.view); // Update view based on passed state
        }
    }, [location.state]);

    const handleViewDetails = () => setView('details');
    const handleUpdateDetails = () => setView('update');
    const handleUpdatePassword = () => setView('password');
    const handleMyOrders = () => setView('orders');

    const handleUpdateDetailsSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('auth-token');

        try {
            const response = await fetch(`${BACKEND_URL}/update-user`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token,
                },
                body: JSON.stringify(updateDetails),
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            const updatedProfile = await response.json();
            setProfile(updatedProfile);
            setSuccessMessage('Profile updated successfully!');
            setError('');
            setView('details');
        } catch (err) {
            setError(err.message || 'Failed to update profile');
        }
    };

    const handleUpdatePasswordSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('auth-token');

        try {
            const response = await fetch(`${BACKEND_URL}/update-password`, {
                method: 'PUT',
                headers: {
                    'auth-token': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentPassword: newPassword.currentPassword,
                    newPassword: newPassword.newPassword,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Failed to update password');
                return;
            }

            setSuccessMessage('Password updated successfully');
            setNewPassword({ currentPassword: '', newPassword: '' });
            setError('');
        } catch (error) {
            setError('Error updating password');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('auth-token');
        setIsLogoutModalOpen(false);
        navigate('/');
    };

    //SETUP FOR USER ORDERS SECTION

    const { buyItems } = useContext(ShopContext);
    if (loading) {
        // Render loading animation while data is being fetched
        return (
          <div className="loading-main-whole-page">
            <div className="loading">
              <Player
                autoplay
                loop
                src={Loading} // Path to your animation JSON file
                style={{
                  height: '100px',
                  width: '100px',
                  margin: '0 auto',
                }}
              />
            </div>
          </div>
        );
      }

    return (
        <div className="profile-page">
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
            <div className="profile-nav">
                <button
                    className={`profile-nav-btn ${view === 'details' ? 'black-bg-profile-btn' : ''}`}
                    onClick={handleViewDetails}
                >
                    View Your Details
                </button>
                <button
                    className={`profile-nav-btn ${view === 'update' ? 'black-bg-profile-btn' : ''}`}
                    onClick={handleUpdateDetails}
                >
                    Update Your Details
                </button>
                <button
                    className={`profile-nav-btn ${view === 'password' ? 'black-bg-profile-btn' : ''}`}
                    onClick={handleUpdatePassword}
                >
                    Update Password
                </button>
                <button
                    className={`profile-nav-btn ${view === 'orders' ? 'black-bg-profile-btn' : ''}`}
                    onClick={handleMyOrders}
                >
                    My Orders
                </button>

                {localStorage.getItem('auth-token') ? (
                    <button className="profile-nav-btn" onClick={() => setIsLogoutModalOpen(true)}>Logout</button>
                ) : (
                    <Link to="/login">
                        <button className="profile-nav-btn">Login</button>
                    </Link>
                )}
            </div>

            <div className="profile-content-box">
                {error && <div className="profile-message error">{error}</div>}
                {successMessage && <div className="profile-message success">{successMessage}</div>}

                {view === 'details' && (
                    <div className="profile-details">
                        <h1 className="profile-title">User Details</h1>
                        <p><strong>First Name:</strong> {profile.first_name}</p>
                        <p><strong>Last Name:</strong> {profile.last_name}</p>
                        <p><strong>Email:</strong> {profile.email}</p>
                        <p><strong>Mobile Number:</strong> {profile.mobile_number}</p>
                    </div>
                )}

                {view === 'update' && (
                    <div className="profile-update-details">
                        <h1 className="profile-title">Update Details</h1>
                        <form onSubmit={handleUpdateDetailsSubmit}>
                            <label className="profile-label">
                                First Name:
                                <input
                                    type="text"
                                    value={updateDetails.first_name}
                                    onChange={(e) => setUpdateDetails({ ...updateDetails, first_name: e.target.value })}
                                    className="profile-input"
                                />
                            </label>
                            <label className="profile-label">
                                Last Name:
                                <input
                                    type="text"
                                    value={updateDetails.last_name}
                                    onChange={(e) => setUpdateDetails({ ...updateDetails, last_name: e.target.value })}
                                    className="profile-input"
                                />
                            </label>
                            <label className="profile-label">
                                Your Email:
                                <input
                                    type="email"
                                    value={updateDetails.email}
                                    onChange={(e) => setUpdateDetails({ ...updateDetails, email: e.target.value })}
                                    className="profile-input"
                                />
                            </label>
                            <label className="profile-label">
                                Mobile Number:
                                <input
                                    type="text"
                                    value={updateDetails.mobile_number}
                                    onChange={(e) => setUpdateDetails({ ...updateDetails, mobile_number: e.target.value })}
                                    className="profile-input"
                                />
                            </label>
                            <button className="profile-submit-btn" type="submit">Update Details</button>
                        </form>
                    </div>
                )}

                {view === 'password' && (
                    <div className="profile-update-password">
                        <h1 className="profile-update-password-title">Update Password</h1>
                        <form onSubmit={handleUpdatePasswordSubmit}>
                            <label className="profile-password-label">
                                Current Password:
                                <input
                                    className="profile-input-field"
                                    type="password"
                                    value={newPassword.currentPassword}
                                    onChange={(e) => setNewPassword({ ...newPassword, currentPassword: e.target.value })}
                                />
                            </label>
                            <label className="profile-password-label">
                                New Password:
                                <input
                                    className="profile-input-field"
                                    type="password"
                                    value={newPassword.newPassword}
                                    onChange={(e) => setNewPassword({ ...newPassword, newPassword: e.target.value })}
                                />
                            </label>
                            <button className="profile-submit-button" type="submit">Update Password</button>
                        </form>
                        <p style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Link to="/ForgotPassword" style={{ fontSize: '14px', fontWeight: '700', color: '#FF4500' }}>
                                Forgot Password?
                            </Link>
                        </p>

                    </div>
                )}

                {view === 'orders' && (
                    <div className="users-orders">
                        {buyItems.orders && buyItems.orders.length > 0 ? ( // Access `orders` inside `buyItems`
                            buyItems.orders.map((order) => {
                                return <OrderItem key={order.orderId} id={order.orderId} />;
                            })
                        ) : (
                            <p>You have no orders yet.</p>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default Profile;
