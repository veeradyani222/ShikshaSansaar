import React, { useEffect, useState, useRef, useContext } from 'react';
import { ShopContext } from '../../Context/ShopContext';
import './Counter.css';

const Counter = ({ targetSuccessRate }) => {
    const { all_users } = useContext(ShopContext); // Access `all_users` from context
    const [students, setStudents] = useState(0);
    const [successRate, setSuccessRate] = useState(0);
    const counterRef = useRef(null);
    const [isCounting, setIsCounting] = useState(false); // State to track if counting has started

    useEffect(() => {
        // Dynamically calculate target students
        const targetStudents = 10000 + (all_users?.length || 0);

        const animateCounter = (target, setCounter) => {
            let count = 0;
            const increment = Math.ceil(target / 100); // Increment based on target

            const interval = setInterval(() => {
                if (count < target) {
                    count += increment;
                    if (count > target) count = target; // Ensure it doesn't exceed the target
                    setCounter(count);
                } else {
                    clearInterval(interval);
                }
            }, 30); // Adjust the speed of the counter here
        };

        const handleScroll = () => {
            if (counterRef.current) {
                const rect = counterRef.current.getBoundingClientRect();
                const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;

                if (isVisible && !isCounting) {
                    setIsCounting(true); // Set counting state to true
                    animateCounter(targetStudents, setStudents);
                    animateCounter(targetSuccessRate, setSuccessRate);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll); // Cleanup on unmount
        };
    }, [all_users, targetSuccessRate, isCounting]);

    return (
        <div className="counter">
            <div className="counter-container" ref={counterRef}>
                <div className="counter-item">
                    <h3>Number of Students</h3>
                    <p>{students}+</p>
                </div>
                <div className="counter-item">
                    <h3>Success Rate</h3>
                    <p>{successRate}%</p>
                </div>
            </div>
        </div>
    );
};

export default Counter;
