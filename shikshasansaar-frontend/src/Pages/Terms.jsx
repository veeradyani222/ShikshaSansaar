import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../Context/ShopContext';
import './CSS/Terms.css';
import { Player } from '@lottiefiles/react-lottie-player';
import Loading from '../Components/assets/pro-library-loading.json';

const Terms = () => {
    const { all_Content } = useContext(ShopContext); // Retrieve all_content from context
    const [loading, setLoading] = useState(true); // State for loading

    useEffect(() => {
        // Simulate a delay for loading
        const timer = setTimeout(() => setLoading(false), 1000); // Adjust delay as needed
        return () => clearTimeout(timer); // Cleanup timer on unmount
    }, []);

    // Find the object that contains the "terms_conditions"
    const termsConditions = all_Content?.find(content => content.terms_conditions);

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
        <div>
            <h1></h1>
            <div className="terms-containers">
                {termsConditions && termsConditions.terms_conditions && termsConditions.terms_conditions.length > 0 ? (
                    termsConditions.terms_conditions.map((condition, index) => ( // Iterate over each condition
                        <div
                            key={index}
                            className="terms"
                            dangerouslySetInnerHTML={{ __html: condition }} // Render HTML safely
                        />
                    ))
                ) : (
                    <p>No terms available</p> // Fallback if terms_conditions is empty
                )}
            </div>
        </div>
    );
};

export default Terms;
