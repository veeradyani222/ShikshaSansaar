import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill's styles
import './AddContent.css';

const AddContent = () => {
  const [content, setContent] = useState({
    instagram: "",
    github: "",
    facebook: "",
    twitter: "",
    promo_code: "",
    offer_percentage: "",
  });

  const [inputFields, setInputFields] = useState({
    aboutSections: [""],
    termsConditions: [""],
    privacy_policy: [""],
    refund_policy: [""],
    exchange_policy: [""],
    contactNumbers: [""],
    emailIds: [""],
    addresses: [""],

  });

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // Handle input changes for Quill
  const handleQuillChange = (value, field, index) => {
    const updatedFields = [...inputFields[field]];
    updatedFields[index] = value;
    setInputFields({ ...inputFields, [field]: updatedFields });
  };

  // Handle input changes for regular text inputs
  const handleInputChange = (e, field, index) => {
    const updatedFields = [...inputFields[field]];
    updatedFields[index] = e.target.value;
    setInputFields({ ...inputFields, [field]: updatedFields });
  };

  // Handle changes for the content fields (social media URLs, promo code, etc.)
  const handleContentChange = (e) => {
    setContent({ ...content, [e.target.name]: e.target.value });
  };

  // Add More Input Fields
  const addMoreFields = (field) => {
    setInputFields({ ...inputFields, [field]: [...inputFields[field], ""] });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Function to split input based on '|' and return an array
    const splitInput = (input) => {
      return typeof input === 'string' ? input.split('|').map(item => item.trim()).filter(item => item) : [];
    };

    // Prepare the updated content
    const updatedContent = {
      ...content,
      about_sections: inputFields.aboutSections.flatMap(section => splitInput(section)), // Process all elements
      terms_conditions: inputFields.termsConditions.flatMap(section => splitInput(section)),
      privacy_policy: inputFields.privacy_policy.flatMap(section => splitInput(section)),
      exchange_policy: inputFields.exchange_policy.flatMap(section => splitInput(section)),
      refund_policy: inputFields.refund_policy.flatMap(section => splitInput(section)),
      contact_numbers: inputFields.contactNumbers.flatMap(section => splitInput(section)),
      email_ids: inputFields.emailIds.flatMap(section => splitInput(section)),
      addresses: inputFields.addresses.flatMap(section => splitInput(section)),
    };

    console.log("Privacy Policy:", updatedContent.privacy_policy);

    try {
      const response = await fetch(`${BACKEND_URL}/addContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedContent),
      });

      const result = await response.json();

      if (result.success) {
        alert('Content added successfully!');
        console.log('Added Data:', result.content);

        // Reset fields
        setInputFields({
          aboutSections: [""],
          termsConditions: [""],
          privacy_policy:[""],
          refund_policy:[""],
          exchange_policy:[""],
          contactNumbers: [""],
          emailIds: [""],
          addresses: [""]
        });
      } else {
        alert('Failed to add content');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while adding content.');
    }
  };

  return (
    <div className="add-content-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>About Sections</label>
          {inputFields.aboutSections.map((field, index) => (
            <div key={index} className="input-wrapper">
              <ReactQuill
                value={field}
                onChange={(value) => handleQuillChange(value, 'aboutSections', index)}
                placeholder="Enter about section"
                className="quill-input"
              />
            </div>
          ))}
          <button type="button" onClick={() => addMoreFields('aboutSections')} className="add-more-btn">Add More</button>
        </div>

        <div className="form-group">
          <label>Terms & Conditions</label>
          {inputFields.termsConditions.map((field, index) => (
            <div key={index} className="input-wrapper">
              <ReactQuill
                value={field}
                onChange={(value) => handleQuillChange(value, 'termsConditions', index)}
                placeholder="Enter term or condition"
                className="quill-input"
              />
            </div>
          ))}
          <button type="button" onClick={() => addMoreFields('termsConditions')} className="add-more-btn">Add More</button>
        </div>

        <div className="form-group">
          <label>Privacy Policy</label>
          {inputFields.privacy_policy.map((field, index) => (
            <div key={index} className="input-wrapper">
              <ReactQuill
                value={field}
                onChange={(value) => handleQuillChange(value, 'privacy_policy', index)}
                placeholder="Enter privacy policy"
                className="quill-input"
              />
            </div>
          ))}
          <button type="button" onClick={() => addMoreFields('privacy_policy')} className="add-more-btn">Add More</button>
        </div>

        <div className="form-group">
          <label>exchange Policy</label>
          {inputFields.exchange_policy.map((field, index) => (
            <div key={index} className="input-wrapper">
              <ReactQuill
                value={field}
                onChange={(value) => handleQuillChange(value, 'exchange_policy', index)}
                placeholder="Enter Exchange policy"
                className="quill-input"
              />
            </div>
          ))}
          <button type="button" onClick={() => addMoreFields('exchange_policy')} className="add-more-btn">Add More</button>
        </div>

        <div className="form-group">
          <label>refund Policy</label>
          {inputFields.refund_policy.map((field, index) => (
            <div key={index} className="input-wrapper">
              <ReactQuill
                value={field}
                onChange={(value) => handleQuillChange(value, 'refund_policy', index)}
                placeholder="Enter Refund policy"
                className="quill-input"
              />
            </div>
          ))}
          <button type="button" onClick={() => addMoreFields('refund_policy')} className="add-more-btn">Add More</button>
        </div>


        {/* Contact Numbers */}
        <div className="form-group">
          <label>Contact Numbers</label>
          {inputFields.contactNumbers.map((field, index) => (
            <div key={index} className="input-wrapper">
              <input
                type="text"
                value={field}
                placeholder="Enter contact number"
                onChange={(e) => handleInputChange(e, 'contactNumbers', index)}
                className="text-input"
              />
            </div>
          ))}
          <button type="button" onClick={() => addMoreFields('contactNumbers')} className="add-more-btn">Add More</button>
        </div>

        {/* Email IDs */}
        <div className="form-group">
          <label>Email IDs</label>
          {inputFields.emailIds.map((field, index) => (
            <div key={index} className="input-wrapper">
              <input
                type="text"
                value={field}
                placeholder="Enter email ID"
                onChange={(e) => handleInputChange(e, 'emailIds', index)}
                className="text-input"
              />
            </div>
          ))}
          <button type="button" onClick={() => addMoreFields('emailIds')} className="add-more-btn">Add More</button>
        </div>

        {/* Addresses */}
        <div className="form-group">
          <label>Addresses</label>
          {inputFields.addresses.map((field, index) => (
            <div key={index} className="input-wrapper">
              <input
                type="text"
                value={field}
                placeholder="Enter address"
                onChange={(e) => handleInputChange(e, 'addresses', index)}
                className="text-input"
              />
            </div>
          ))}
          <button type="button" onClick={() => addMoreFields('addresses')} className="add-more-btn">Add More</button>
        </div>

        {/* Social Media URLs */}
        <div className="form-group">
          <input
            type="text"
            name="instagram"
            value={content.instagram}
            placeholder="Instagram URL"
            onChange={handleContentChange}
            className="text-input"
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            name="github"
            value={content.github}
            placeholder="GitHub URL"
            onChange={handleContentChange}
            className="text-input"
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            name="facebook"
            value={content.facebook}
            placeholder="Facebook URL"
            onChange={handleContentChange}
            className="text-input"
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            name="twitter"
            value={content.twitter}
            placeholder="Twitter URL"
            onChange={handleContentChange}
            className="text-input"
          />
        </div>

        {/* Promo Code */}
        <div className="form-group">
          <input
            type="text"
            name="promo_code"
            value={content.promo_code}
            placeholder="Promo Code"
            onChange={handleContentChange}
            className="text-input"
          />
        </div>

        {/* Offer Percentage */}
        <div className="form-group">
          <input
            type="text"
            name="offer_percentage"
            value={content.offer_percentage}
            placeholder="Offer Percentage"
            onChange={handleContentChange}
            className="text-input"
          />
        </div>

        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
};

export default AddContent;