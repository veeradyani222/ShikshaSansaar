import React, { useState } from 'react';

const AddEmployees = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [features, setFeatures] = useState({});

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // List of available features for the checklist
  const featureOptions = [
    "Add Product", "View Product List", "Add Product Images", "View Product Images List",
    "Add Slider Image", "Edit Slider List", "Add Content", "Edit Content",
    "Add Blog", "Blogs List", "Add Faculty", "View Faculty List", 
    "Add FAQ", "View FAQ List", "Add Greeting Message", 
    "View All Orders", "View Reviews List", "All Users", 
    "Send Emails to Subscribers", "View Analytics", "Add Employee" , "Users BuyData" , "Users WishlistData" , "Users CartData" , "All Quoted Prices"
  ];

  // Handle checkbox toggle for features
  const handleFeatureChange = (feature) => {
    setFeatures((prevFeatures) => ({
      ...prevFeatures,
      [feature]: !prevFeatures[feature]
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedFeatures = Object.fromEntries(
      Object.entries(features).filter(([_, isSelected]) => isSelected)
    );

    const newEmployee = { name, username, password, role, features: selectedFeatures };

    try {
      const response = await fetch(`${BACKEND_URL}/add_employee`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEmployee),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
      } else {
        throw new Error('Failed to add employee');
      }
    } catch (error) {
      alert('Error adding employee: ' + error.message);
    }
  };

  return (
    <div className="employee-form-container">
      <h2 className="employee-form-heading">Add New Employee</h2>
      <form className="employee-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Name:</label>
          <input
            type="text"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Username:</label>
          <input
            type="text"
            className="form-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password:</label>
          <input
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Role:</label>
          <input
            type="text"
            className="form-input"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />
        </div>

        <div className="form-fieldset">
          <legend className="fieldset-legend">Features</legend>
          <div className="features-grid">
            {featureOptions.map((feature, index) => (
              <label key={index} className="feature-option">
                <input
                  type="checkbox"
                  checked={features[feature] || false}
                  onChange={() => handleFeatureChange(feature)}
                  className="feature-checkbox"
                />
                {feature}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="form-submit-button">Add Employee</button>
      </form>
    </div>
  );
};

export default AddEmployees;
