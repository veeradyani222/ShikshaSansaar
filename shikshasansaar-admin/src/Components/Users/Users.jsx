import { React, useState, useEffect } from 'react';
import './Users.css';

const Users = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [comments, setComments] = useState({}); // Track comments by user ID

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchInfo = async () => {
    await fetch(`${BACKEND_URL}/allusers`)
      .then((res) => res.json())
      .then((data) => {
        setAllUsers(data);
        // Initialize comments state with existing comments from users
        const initialComments = {};
        data.forEach(user => {
          initialComments[user._id] = user.comments || ''; // Assuming user.comments is a string
        });
        setComments(initialComments);
      });
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const handleCommentChange = (id, value) => {
    setComments((prev) => ({ ...prev, [id]: value })); // Update the comment for the specific user
  };

  const handleCommentSubmit = async (id) => {
    const comment = comments[id];
    if (comment) {
      await fetch(`${BACKEND_URL}/addComment/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment }), // Send the comment to the server
      });
    }
  };

  return (
    <div className='user-list'>
      <div className="user-list-header">
        <p> First Name</p>
        <p> Last Name</p>
        <p>Email</p>
        <p>Mobile Number</p>
        <p>Password</p>
        <p>Verified</p>
        <p>Comments</p>
      </div>
      <div className="user-list-body">
        <hr />
        {allUsers.map((user) => {
          const { _id, first_name,last_name, email, mobile_number, password , verified } = user;
          return (
            <div key={_id} className="user-item">
              <p className='user-entries'>{first_name}</p>
              <p className='user-entries'>{last_name}</p>
              <p className='user-entries'>{email}</p>
              <p className='user-entries'>{mobile_number}</p>
              <p className='user-entries'>{password}</p>
              <p className='user-entries'>{verified ? 'Yes' : 'No'}</p>
              <input
                type="text"
                className='comment-input'
                value={comments[_id] || ''}
                onChange={(e) => handleCommentChange(_id, e.target.value)} // Update the comment in state
                onBlur={() => handleCommentSubmit(_id)} // Save the comment when focus leaves the input
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleCommentSubmit(_id); // Save comment on Enter key press
                  }
                }}
                placeholder="Add a comment"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Users;
