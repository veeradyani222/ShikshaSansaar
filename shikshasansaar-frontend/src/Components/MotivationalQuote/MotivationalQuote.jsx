import React, { useEffect, useState } from 'react';
import './MotivationalQuote.css'

// Sample motivational quotes data
const quotesData = {
    "quotes": [
      { "quote": "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful.", "author": "Albert Schweitzer" },
      { "quote": "The future belongs to those who believe in the beauty of their dreams.", "author": "Eleanor Roosevelt" },
      { "quote": "Don't watch the clock; do what it does. Keep going.", "author": "Sam Levenson" },
      { "quote": "It does not matter how slowly you go as long as you do not stop.", "author": "Confucius" },
      { "quote": "The only limit to our realization of tomorrow will be our doubts of today.", "author": "Franklin D. Roosevelt" },
      { "quote": "Success is the sum of small efforts, repeated day in and day out.", "author": "Robert Collier" },
      { "quote": "Your limitation—it's only your imagination.", "author": "" },
      { "quote": "Push yourself, because no one else is going to do it for you.", "author": "" },
      { "quote": "Great things never come from comfort zones.", "author": "" },
      { "quote": "Dream it. Wish it. Do it.", "author": "" },
      { "quote": "Success doesn’t just find you. You have to go out and get it.", "author": "" },
      { "quote": "The harder you work for something, the greater you’ll feel when you achieve it.", "author": "" },
      { "quote": "Dream bigger. Do bigger.", "author": "" },
      { "quote": "Don’t stop when you’re tired. Stop when you’re done.", "author": "" },
      { "quote": "Wake up with determination. Go to bed with satisfaction.", "author": "" },
      { "quote": "Do something today that your future self will thank you for.", "author": "" },
      { "quote": "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle.", "author": "Christian D. Larson" },
      { "quote": "Opportunities don’t happen, you create them.", "author": "Chris Grosser" },
      { "quote": "Success usually comes to those who are too busy to be looking for it.", "author": "Henry David Thoreau" },
      { "quote": "Don’t be pushed around by the fears in your mind. Be led by the dreams in your heart.", "author": "Roy T. Bennett" },
      { "quote": "What lies behind us and what lies before us are tiny matters compared to what lies within us.", "author": "Ralph Waldo Emerson" },
      { "quote": "The future depends on what you do today.", "author": "Mahatma Gandhi" },
      { "quote": "Success is walking from failure to failure with no loss of enthusiasm.", "author": "Winston Churchill" },
      { "quote": "Start where you are. Use what you have. Do what you can.", "author": "Arthur Ashe" },
      { "quote": "I find that the harder I work, the more luck I seem to have.", "author": "Thomas Jefferson" },
      { "quote": "Success is not in what you have, but who you are.", "author": "Bo Bennett" },
      { "quote": "The way to get started is to quit talking and begin doing.", "author": "Walt Disney" },
      { "quote": "Life is 10% what happens to us and 90% how we react to it.", "author": "Charles R. Swindoll" },
      { "quote": "Believe you can and you're halfway there.", "author": "Theodore Roosevelt" },
      { "quote": "You are never too old to set another goal or to dream a new dream.", "author": "C.S. Lewis" },
      { "quote": "Your time is limited, so don’t waste it living someone else’s life.", "author": "Steve Jobs" },
      { "quote": "Act as if what you do makes a difference. It does.", "author": "William James" },
      { "quote": "Success is not how high you have climbed, but how you make a positive difference to the world.", "author": "Roy T. Bennett" },
      { "quote": "The only way to do great work is to love what you do.", "author": "Steve Jobs" },
      { "quote": "Success is not just about what you accomplish in your life; it’s about what you inspire others to do.", "author": "Unknown" },
      { "quote": "The secret of getting ahead is getting started.", "author": "Mark Twain" },
      { "quote": "Limit your 'always' and your 'nevers'.", "author": "Amy Poehler" },
      { "quote": "Challenges are what make life interesting. Overcoming them is what makes life meaningful.", "author": "Joshua J. Marine" },
      { "quote": "What we fear doing most is usually what we most need to do.", "author": "Tim Ferriss" },
      { "quote": "It always seems impossible until it’s done.", "author": "Nelson Mandela" },
      { "quote": "Success is not the result of spontaneous combustion. You must set yourself on fire.", "author": "Arnold H. Glasow" },
      { "quote": "Success is a journey, not a destination. The doing is often more important than the outcome.", "author": "Arthur Ashe" },
      { "quote": "The road to success and the road to failure are almost exactly the same.", "author": "Colin R. Davis" },
      { "quote": "What you get by achieving your goals is not as important as what you become by achieving your goals.", "author": "Zig Ziglar" },
      { "quote": "Every accomplishment starts with the decision to try.", "author": "John F. Kennedy" },
      { "quote": "Don't be afraid to give up the good to go for the great.", "author": "John D. Rockefeller" }
    ]
  };
  

const MotivationalQuote = () => {
    const [quote, setQuote] = useState('');

    useEffect(() => {
        // Function to select a random quote
        const getRandomQuote = () => {
            const randomIndex = Math.floor(Math.random() * quotesData.quotes.length);
            const selectedQuote = quotesData.quotes[randomIndex];
            setQuote(`${selectedQuote.quote} ${selectedQuote.author ? `- ${selectedQuote.author}` : ''}`);
        };

        getRandomQuote();
    }, []);

    return (
        <div className="motivational-container">
            <div className="motivational-quote">
            <p>{quote}</p>
        </div>
        </div>
    );
};

export default MotivationalQuote;
