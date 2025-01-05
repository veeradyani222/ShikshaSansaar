import React, { useState, useEffect, useContext } from 'react';
import './CSS/AddOfflineOrder.css';
import { ShopContext } from '../Context/ShopContext';

const AddOfflineOrder = () => {
  const { all_faculties } = useContext(ShopContext);
  const [faculties, setFaculties] = useState([]);
  const [image, setImage] = useState(null);
  const [orderDetails, setOrderDetails] = useState({
    name: "",
    email: "",
    mobile: "",
    subject: "",
    postal_address: "",
    state: "",
    city: "",
    pin_code: "",
    faculty: "",
    course_level: "",
    course_type: "",
    mode_of_lectures: "",
    exam_attempt_month: "",
    exam_attempt_year: "",
    product_mrp: "",
    amount_paid: "",
    amount_due: "",
    mode_of_payment: "",
    upi_merchant_name: "",
    paid_to: "",
    image: "", // For Cloudinary image URL
  });

  // State to track loading status
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (all_faculties) {
      const facultyList = all_faculties.map(faculty => faculty.lecturer);
      setFaculties(facultyList);
      setLoading(false); // Data is loaded, stop loading
    }
  }, [all_faculties]);

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const changeHandler = (e) => {
    setOrderDetails({ ...orderDetails, [e.target.name]: e.target.value });
  };

  const addOrder = async (e) => {
    e.preventDefault();

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    let responseData;

    // Step 1: Upload image first to Cloudinary
    if (image) {
      let formData = new FormData();
      formData.append('order', image);

      await fetch(`${BACKEND_URL}/upload-order`, {
        method: 'POST',
        headers: {
          Accept: 'application/json'
        },
        body: formData,
      }).then((resp) => resp.json()).then((data) => { responseData = data });

      if (responseData.success) {
        setOrderDetails({ ...orderDetails, image: responseData.image_url });
      } else {
        alert("Image upload failed!");
        return;
      }
    }

    // Step 2: Submit order details with image URL
    await fetch(`${BACKEND_URL}/addorder`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(orderDetails)
    }).then((resp) => resp.json()).then((data) => {
      data.success ? alert("Order Added!") : alert("Failed!")
    });
  };

  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
    'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
    'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
    'West Bengal'
  ];

  const years = [2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  if (loading) {
    return <div>Loading...</div>; // Show loading text while faculties are being fetched
  }

  return (
    <div className="offline-order-container">
      <h1 className="offline-order-heading">Fill the Below Fields</h1>
      <form className="offline-order-form" onSubmit={addOrder}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          className="offline-order-input"
          value={orderDetails.name}
          onChange={changeHandler}
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          className="offline-order-input"
          value={orderDetails.email}
          onChange={changeHandler}
        />
        <input
          type="text"
          name="mobile"
          placeholder="Your Mobile No (only 10 Digit)"
          className="offline-order-input"
          value={orderDetails.mobile}
          onChange={changeHandler}
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          className="offline-order-input"
          value={orderDetails.subject}
          onChange={changeHandler}
        />
        <input
          type="text"
          name="postal_address"
          placeholder="Postal Address"
          className="offline-order-input"
          value={orderDetails.postal_address}
          onChange={changeHandler}
        />
        <select
          name="state"
          className="offline-order-input"
          value={orderDetails.state}
          onChange={changeHandler}
        >
          <option value="">Select State</option>
          {states.map((state, index) => (
            <option key={index} value={state}>{state}</option>
          ))}
        </select>
        <input
          type="text"
          name="city"
          placeholder="City"
          className="offline-order-input"
          value={orderDetails.city}
          onChange={changeHandler}
        />
        <input
          type="text"
          name="pin_code"
          placeholder="Pin Code (only 6 Digit)"
          className="offline-order-input"
          value={orderDetails.pin_code}
          onChange={changeHandler}
        />
        <div className="offline-order-form-group">
          <select
            name="faculty"
            id="faculty"
            className="offline-order-input"
            value={orderDetails.faculty}
            onChange={changeHandler}
          >
            <option value="">Select Faculty</option>
            {faculties.map((faculty, index) => (
              <option key={index} value={faculty}>
                {faculty}
              </option>
            ))}
          </select>
        </div>
        <select
          name="course_level"
          className="offline-order-input"
          value={orderDetails.course_level}
          onChange={changeHandler}
        >
          <option value="">Select Course Level</option>
          <option value="CA Final">CA Final</option>
          <option value="CA Inter">CA Inter</option>
          <option value="CMA Courses">CMA Courses</option>
          <option value="CS Courses">CS Courses</option>
        </select>
        <select
          name="course_type"
          className="offline-order-input"
          value={orderDetails.course_type}
          onChange={changeHandler}
        >
          <option value="">Select Course Type</option>
          <option value="Regular">Regular</option>
          <option value="Fast Track">Fast Track</option>
          <option value="Exam-Oriented">Exam-Oriented</option>
          <option value="Others">Others</option>
        </select>
        <select
          name="mode_of_lectures"
          className="offline-order-input"
          value={orderDetails.mode_of_lectures}
          onChange={changeHandler}
        >
          <option value="">Select Mode of Lectures</option>
          <option value="Google Drive plus Hard Copy">Google Drive + Hard Copy</option>
          <option value="Google Drive plus Soft Copy/E-Book">Google Drive + Soft Copy/E-Book</option>
          <option value="Android plus Hard Copy">Android + Hard Copy</option>
          <option value="Android plus Soft Copy/E-Book">Android + Soft Copy/E-Book</option>
          <option value="Pen Drive plus Hard Copy">Pen Drive + Hard Copy</option>
          <option value="Live plus Hard Copy">Live + Hard Copy</option>
          <option value="NA">NA</option>
        </select>
        <select
          name="exam_attempt_month"
          className="offline-order-input"
          value={orderDetails.exam_attempt_month}
          onChange={changeHandler}
        >
          <option value="">Select Exam Attempt Month</option>
          {months.map((month, index) => (
            <option key={index} value={month}>{month}</option>
          ))}
        </select>
        <select
          name="exam_attempt_year"
          className="offline-order-input"
          value={orderDetails.exam_attempt_year}
          onChange={changeHandler}
        >
          <option value="">Select Exam Attempt Year</option>
          {years.map((year, index) => (
            <option key={index} value={year}>{year}</option>
          ))}
        </select>
        <input
          type="number"
          name="product_mrp"
          placeholder="Product MRP"
          className="offline-order-input"
          value={orderDetails.product_mrp}
          onChange={changeHandler}
        />
        <input
          type="number"
          name="amount_paid"
          placeholder="Amount Paid"
          className="offline-order-input"
          value={orderDetails.amount_paid}
          onChange={changeHandler}
        />
        <input
          type="number"
          name="amount_due"
          placeholder="Amount Due"
          className="offline-order-input"
          value={orderDetails.amount_due}
          onChange={changeHandler}
        />
        <select
          name="mode_of_payment"
          className="offline-order-input"
          value={orderDetails.mode_of_payment}
          onChange={changeHandler}
        >
          <option value="">Select Mode of Payment</option>
          <option value="Cash">Cash</option>
          <option value="Cheque">Cheque</option>
          <option value="Demand Draft">Demand Draft</option>
          <option value="Google Pay">Google Pay</option>
          <option value="Phone Pay">Phone Pay</option>
          <option value="PayTM">PayTM</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Others">Others</option>
        </select>
        <input
          type="text"
          name="upi_merchant_name"
          placeholder="UPI Merchant Name"
          className="offline-order-input"
          value={orderDetails.upi_merchant_name}
          onChange={changeHandler}
        />
        <input
          type="text"
          name="paid_to"
          placeholder="Paid To"
          className="offline-order-input"
          value={orderDetails.paid_to}
          onChange={changeHandler}
        />
        <label htmlFor="">Upload Screenshot of payment</label>
        <input
          type="file"
          name="image"
          id="image"
          className="offline-order-file-input"
          accept="image/*"
          onChange={imageHandler}
        />
     
        <button className="offline-order-submit-btn" type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddOfflineOrder;
