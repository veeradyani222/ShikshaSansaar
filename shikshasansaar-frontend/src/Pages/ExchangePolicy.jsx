import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../Context/ShopContext';
import { Player } from '@lottiefiles/react-lottie-player';
import Loading from '../Components/assets/pro-library-loading.json';

const ExchangePolicy = () => {
    const { all_Content } = useContext(ShopContext); // Retrieve all_content from context
    const [loading, setLoading] = useState(true); // State for loading

    useEffect(() => {
        // Simulate a delay for loading
        const timer = setTimeout(() => setLoading(false), 1000); // Adjust delay as needed
        return () => clearTimeout(timer); // Cleanup timer on unmount
    }, []);

    // Find the object that contains the "terms_conditions"
    const termsConditions = all_Content?.find(content => content.exchange_policy);

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
                {termsConditions && termsConditions.exchange_policy && termsConditions.exchange_policy.length > 0 ? (
                    termsConditions.exchange_policy.map((condition, index) => ( // Iterate over each condition
                        <div
                            key={index}
                            className="terms"
                            dangerouslySetInnerHTML={{ __html: condition }} // Render HTML safely
                        />
                    ))
                ) : (
                    <p>No Exchange Policy available</p> // Fallback if terms_conditions is empty
                )}
            </div>
        </div>
    );
};

export default ExchangePolicy;
