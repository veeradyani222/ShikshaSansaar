import React, { useState, useEffect } from 'react';
import './UserPurchasedata.css';

const UserPurchaseData = () => {
    const [allUsers, setAllUsers] = useState([]); 
    const [all_products, setall_products] = useState([]); // State to store user data
    const [editingStatus, setEditingStatus] = useState(null); // State for editing status
    const [newStatus, setNewStatus] = useState(""); // New status input value
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; // Environment variable for backend URL

    const fetchInfo = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/allusers`);
            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }
            const data = await response.json();
            setAllUsers(data); // Set the fetched user data to state
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        fetch(`${BACKEND_URL}/allproducts`)
            .then((response) => response.json())
            .then((data) => setall_products(data))
            .catch((error) => console.error('Error fetching all products:', error));
    }, []);



    useEffect(() => {
        fetchInfo(); // Fetch user data when the component mounts
    }, []);

    const handleStatusClick = (orderId, currentStatus) => {
        setEditingStatus(orderId); // Set the order being edited
        setNewStatus(currentStatus); // Set the current status as the value in the input
    };

    const handleStatusChange = (e) => {
        setNewStatus(e.target.value); // Update the status input value
    };

    const handleStatusSave = async (orderId) => {
        console.log('Saving order with ID:', orderId, 'and new status:', newStatus); // Log status before request
        try {
            const response = await fetch(`${BACKEND_URL}/update-order-status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderId,
                    newStatus,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update order status');
            }

            // After successful update, reset editing state
            console.log('Status updated successfully');
            setEditingStatus(null);
            setNewStatus('');
            fetchInfo(); // Refetch data to reflect changes
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    const handleKeyPress = (e, orderId) => {
        console.log("Key pressed: ", e.key);  // Log every keypress
        if (e.key === 'Enter') {
            console.log('Enter key pressed. Saving...');
            handleStatusSave(orderId); // Save status when Enter is pressed
        }
    };





    return (
        <div className="user-purchase-list">
            {/* Header Section */}
            <div className="user-list-header">
                <p>Name</p>
                <p>Email</p>
                <p>Purchase Data</p>
            </div>

            {/* Body Section */}
            <div className="user-list-body">
                <hr />
                {allUsers.length > 0 ? (
                    allUsers.map((user) => {
                        const { _id, first_name, last_name, email, buyData } = user;

                        return (
                            <div key={_id} className="user-item">
                                <p className="user-entries">{`${first_name} ${last_name}`}</p>
                                <p className="user-entries">{email}</p>

                                {/* Purchase Data */}
                                <div className="user-purchase-data">
                                    {buyData && Array.isArray(buyData) && buyData.length > 0 ? (
                                        buyData.map((order, index) => (
                                            <div key={order.orderId} className="purchase-order">
                                               <div className="purchase-data-1">
                                               <h3>Order #{index + 1}</h3>
                                                <p><strong>Order ID:</strong> {order.orderId}</p>
                                                <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                                                <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
                                                <p><strong>Discount:</strong> {order.discount * 100}%</p>

                                                {/* Editable Status */}
                                                <p>
                                                    <strong>Status:</strong>{' '}
                                                    {editingStatus === order.orderId ? (
                                                        <input
                                                            type="text"
                                                            value={newStatus}
                                                            onChange={handleStatusChange}
                                                            onKeyDown={(e) => handleKeyPress(e, order.orderId)}
                                                            autoFocus
                                                        />

                                                    ) : (
                                                        <span onClick={() => handleStatusClick(order.orderId, order.status)}>
                                                            {order.status}
                                                        </span>
                                                    )}
                                                </p>
                                               </div>

                                                {/* Purchase Items */}
                                                {order.items && Array.isArray(order.items) && order.items.length > 0 ? (
                                                    <div className="purchase-items">
                                                        {/* Table Header */}
                                                        <div className="purchase-items-header">
                                                            <div>Product ID</div>
                                                            <div>Product Name</div>
                                                            <div>Mode</div>
                                                            <div>Views</div>
                                                            <div>Validity</div>
                                                            <div>Attempt</div>
                                                            <div>Language</div>
                                                            <div>Recording</div>
                                                            <div>BookType</div>
                                                            <div>Old Price</div>
                                                            <div>New Price</div>
                                                            <div>Link</div>
                                                            <div>Quantity</div>
                                                            <div>Payment ID</div>
                                                        </div>
                                                        {/* Table Rows */}
                                                        {order.items.map((item, idx) => {
                                                            // Find the product in all_products using the `id` field
                                                            const product = all_products.find(
                                                                (product) => (product.id) === (item.productId)
                                                            );

                                                            // Get the product name or fallback to "Unknown Product"
                                                            const productName = product ? product.name : "Unknown Product";

                                                            return (
                                                                <div key={idx} className="purchase-item-row">
                                                                    <div>{item.productId}</div>
                                                                    <div>{productName}</div> {/* Display product name */}
                                                                    <div>{item.mode}</div>
                                                                    <div>{item.views}</div>
                                                                    <div>{item.validity}</div>
                                                                    <div>{item.attempt}</div>
                                                                    <div>{item.language}</div>
                                                                    <div>{item.recording}</div>
                                                                    <div>{item.bookType}</div>
                                                                    <div>{item.oldPrice}</div>
                                                                    <div>{item.newPrice}</div>
                                                                    <div>
                                                                        <a href={item.link} target="_blank" rel="noopener noreferrer">
                                                                            {item.link}
                                                                        </a>
                                                                    </div>
                                                                    <div>{item.quantity}</div>
                                                                    <div>{item.paymentId}</div>
                                                                </div>
                                                            );
                                                        })}

                                                    </div>
                                                ) : (
                                                    <p>No items found in this order</p>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p>No purchase data available</p>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="no-data">No user data available</p>
                )}
            </div>
        </div>
    );
};

export default UserPurchaseData;
