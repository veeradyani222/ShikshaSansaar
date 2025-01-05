import React, { useState } from 'react';
import './AddFAQ.css';

const AddFAQ = () => {
  const [faq, setFaq] = useState({
    question: "",
    answer: ""
  });


  const changeHandler = (e) => {
    setFaq({ ...faq, [e.target.name]: e.target.value });
  };

  const addFAQ = async (e) => {
    e.preventDefault();
    console.log(faq);
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    await fetch(`${BACKEND_URL}/addquestions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(faq),
    })
    .then((resp) => resp.json())
    .then((data) => {
      data.success ? alert("Question Added!") : alert("Failed to add question!");
    });
  };

  return (
    <div className="faq-form-container">
      <h1 className="faq-heading">Please submit your question and answer below:</h1>
      <form className="faq-form" onSubmit={addFAQ}>
        <input
          type="text"
          name="question"
          placeholder="Your Question"
          className="faq-input"
          value={faq.question}
          onChange={changeHandler}
        />
        <textarea
          name="answer"
          placeholder="Your Answer"
          className="faq-textarea"
          value={faq.answer}
          onChange={changeHandler}
        />
        <button type="submit" className="faq-submit-button">Submit FAQ</button>
      </form>
    </div>
  );
};

export default AddFAQ;
