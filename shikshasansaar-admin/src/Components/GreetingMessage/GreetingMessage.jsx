import React, { useState, useEffect } from 'react';
import './GreetingMessage.css';

const GreetingMessage = () => {
  const [content, setContent] = useState({
    greeting_message: "", // Only greeting message is needed
  });
  
  const [greetingMessages, setGreetingMessages] = useState([]);
  const [error, setError] = useState(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // Fetch the latest greeting message when the component mounts
  useEffect(() => {
    const fetchGreetingMessage = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/allGreetingMessage`);
        const result = await response.json();

        if (result.length > 0) {
          // Set the most recent greeting message
          setGreetingMessages(result);
          setContent({
            greeting_message: result[0].greeting_message || "", // Use the first message as the latest
          });
        } else {
          console.error("No greeting messages found");
        }
      } catch (error) {
        console.error("Error fetching greeting message:", error);
        setError("Failed to fetch greeting message");
      }
    };

    fetchGreetingMessage();
  }, [BACKEND_URL]);

  // Handle changes for the greeting_message field
  const handleContentChange = (e) => {
    setContent({ ...content, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the updated content
    const updatedContent = {
      greeting_message: content.greeting_message,
    };

    try {
      const response = await fetch(`${BACKEND_URL}/addGreetingMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedContent),
      });

      const result = await response.json();

      if (result.success) {
        alert('Greeting message updated successfully!');
        console.log('Updated Data:', result.greeting_message);
        // Optionally, you can fetch the updated greeting messages here
        setGreetingMessages([result, ...greetingMessages]);
      } else {
        alert('Failed to update greeting message');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating the greeting message.');
    }
  };

  return (
    <div className="add-content-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Greeting Message</label>
          <input
            type="text"
            name="greeting_message"
            value={content.greeting_message}
            placeholder="Enter greeting message"
            onChange={handleContentChange}
            className="text-input"
          />
        </div>

        <button type="submit" className="submit-btn">Submit</button>
      </form>

      {/* Display the fetched greeting message */}
      {greetingMessages.length > 0 && (
        <div className="greeting-display">
          <h2>Current Greeting Message:</h2>
          <p>{greetingMessages[0].greeting_message}</p>
        </div>
      )}

      {/* Display any errors */}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default GreetingMessage;
