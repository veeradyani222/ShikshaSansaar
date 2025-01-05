import React, { useState, useEffect } from 'react';
import './EditContent.css';
import ReactQuill from 'react-quill'; // Import Quill
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

const EditContent = () => {
  const [contentList, setContentList] = useState([]);
  const [editContent, setEditContent] = useState({});
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/allContent`);
        const data = await response.json();
        setContentList(data);
        const initialEditContent = data.reduce((acc, content) => {
          acc[content._id] = content;
          return acc;
        }, {});
        setEditContent(initialEditContent);
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    };

    fetchContent();
  }, []);

  const handleChange = (id, field, value) => {
    setEditContent({
      ...editContent,
      [id]: {
        ...editContent[id],
        [field]: value
      }
    });
  };

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`${BACKEND_URL}/updateContent/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editContent[id]),
      });

      const result = await response.json();

      if (result.success) {
        alert('Content updated successfully!');
      } else {
        alert('Failed to update content');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating content.');
    }
  };

  return (
    <div className="edit-content-container">
      <h1>Edit Content</h1>
      {contentList.length > 0 ? (
        contentList.map((content) => (
          <div key={content._id} className="content-item">
            <h2>{content.title}</h2>
            <div className="content-fields">
              {/* Display editable fields for each content */}
              {Object.keys(content).map((key) => {
                if (key !== '_id' && key !== 'title') { // Exclude non-editable fields like _id
                  return (
                    <div key={key} className="field-group">
                      <label>{key}</label>
                      {key.includes('offer') ? ( // Example check for 'offer' related fields
                        <ReactQuill
                          value={editContent[content._id][key] || ''}
                          onChange={(value) => handleChange(content._id, key, value)}
                          theme="snow"
                          style={{ height: '200px' }} // Adjust height as needed
                        />
                      ) : (
                        <textarea
                          value={editContent[content._id][key] || ''}
                          onChange={(e) => handleChange(content._id, key, e.target.value)}
                          rows="4" // Adjust number of rows for a bigger input box
                          style={{ width: '100%', padding: '10px', resize: 'vertical' }} // Styling
                        />
                      )}
                    </div>
                  );
                }
                return null;
              })}
              <button onClick={() => handleUpdate(content._id)}>Update</button>
            </div>
          </div>
        ))
      ) : (
        <p>No content available.</p>
      )}
    </div>
  );
};

export default EditContent;
