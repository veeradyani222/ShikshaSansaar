import React, { useContext, useState } from 'react';
import './Offers.css';
import { ShopContext } from '../../Context/ShopContext';

const Offers = () => {
    const { all_Content } = useContext(ShopContext);
    const [copied, setCopied] = useState(false);

    // Assuming there is only one coupon, otherwise you might want to map through all
    const foundCoupon = all_Content.find(content => content.promo_code);

    const handleCopy = () => {
        if (foundCoupon) {
            navigator.clipboard.writeText(foundCoupon.promo_code)
                .then(() => setCopied(true))
                .catch((err) => console.error('Failed to copy: ', err));
        }
    };

    return (
        <div className='offers-main'>
            <div className="offer_heading">
              Great Offers available!
            </div>
            <div className="offer_page">
                <div className="offers_bottom">
                    {foundCoupon ? (
                        <>
                            <h2>Use the below promo code to avail additional {foundCoupon.offer_percentage}% off on all purchases!</h2>
                            <div className="promo_code">{foundCoupon.promo_code}</div>
                            <button onClick={handleCopy}>{copied ? 'Copied!' : 'Copy Code'}</button>
                        </>
                    ) : (
                        <p>No offers available at the moment.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Offers;
