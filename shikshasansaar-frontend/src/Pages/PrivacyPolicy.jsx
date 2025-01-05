import React, { useContext } from 'react';
import { ShopContext } from '../Context/ShopContext';
import './CSS/PrivacyPolicy.css';

const PrivacyPolicy = () => {
    const { all_Content } = useContext(ShopContext); // Retrieve all_content from context

    // Find the object that contains the "privacy_policy"
    const privacyPolicyContent = all_Content.find(content => content.privacy_policy);

    return (
        <div>
            <h1></h1>
            <div className="terms-containers">
                {privacyPolicyContent && privacyPolicyContent.privacy_policy && privacyPolicyContent.privacy_policy.length > 0 ? (
                    privacyPolicyContent.privacy_policy.map((policy, index) => ( // Iterate over each policy
                        <div key={index} className='terms' dangerouslySetInnerHTML={{ __html: policy }} /> // Render HTML safely
                    ))
                ) : (
                    <p>No privacy policy available</p> // Fallback if privacy_policy is empty
                )}
            </div>
        </div>
    );
};

export default PrivacyPolicy;
