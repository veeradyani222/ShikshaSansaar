import React, { useState, useEffect } from 'react';
import './FAQList.css';
import cross_icon from '../assets/cart_cross_icon.png';

const FAQList = () => {
  const [allQuestions, setAllQuestions] = useState([]);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchInfo = async () => {
    await fetch(`${BACKEND_URL}/allquestions`)
      .then((res) => res.json())
      .then((data) => {
        setAllQuestions(data);
      });
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const handleRemove = async (id) => {
    await fetch(`${BACKEND_URL}/removequestions`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id }),
    });
    await fetchInfo();
  };

  return (
    <div className='faq-list'>
      <div className="faq-list-head">
        <p>Id</p>
        <p>Question</p>
        <p>Answer</p>
        <p>Remove</p>
      </div>
      <div className="faq-list-main">
        <hr />
        {allQuestions.map((question, index) => (
          <div key={index} className="faq-list-item">
               <p>{question.id}</p>
            <p>{question.question}</p>
            <p>{question.answer}</p>
            <button onClick={() => handleRemove(question.id)}>
              <img src={cross_icon} alt="Remove" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQList;
