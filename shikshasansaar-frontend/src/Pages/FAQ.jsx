import React, { useState, useContext, useRef, useEffect } from 'react';
import { ShopContext } from '../Context/ShopContext';
import './CSS/FAQ.css';
import { Player } from '@lottiefiles/react-lottie-player';
import Loading from '../Components/assets/pro-library-loading.json';

const FAQ = () => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const { allquestions } = useContext(ShopContext);
  const answerRef = useRef(null); // Create a ref for the answer container

  useEffect(() => {
    // Simulate a delay to load the FAQ data
    const timer = setTimeout(() => setLoading(false), 1000); // Adjust delay as needed
    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, []);

  const handleQuestionClick = (answer) => {
    setSelectedAnswer(answer);

    // Scroll to the answer box when a question is clicked
    if (answerRef.current) {
      answerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <div className="loading-main-whole-page">
        <div className="loading">
          <Player
            autoplay
            loop
            src={Loading}
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
    <div className="chatbot-container">
      <h1 className="h2-h2">Click on a question to get its answer.</h1>
      <div className="question-container">
        {allquestions.map((item) => (
          <button
            key={item.id}
            className="question-button"
            onClick={() => handleQuestionClick(item.answer)}
          >
            {item.question}
          </button>
        ))}
      </div>
      {selectedAnswer && (
        <div className="answerbox" ref={answerRef}>
          <div className="answer-container">
            <h3>Answer:</h3>
            <p>{selectedAnswer}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQ;
