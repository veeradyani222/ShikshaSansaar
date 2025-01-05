import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductDisplay.css';
import heart1 from './../assets/heart1.png';
import heart2 from './../assets/heart2.png';
import heart3 from './../assets/heart3.png';
import { ShopContext } from '../../Context/ShopContext'; // Context for cart functions
import ReactStars from "react-rating-stars-component";
import ProductReviewItem from './../ProductReviewItem/ProductReviewItem.jsx'
import ProductItemProductDisplay from '../ProductItemProductDisplay/ProductItemProductDisplay.jsx';

const ProductDisplay = (props) => {
  const infoSectionRef = useRef(null);
  const [activeView, setActiveView] = useState('');
  const { product } = props;
  const { addToCart, isItemInCart, all_products, getImageSrcByCode } = useContext(ShopContext);
  const [view, setView] = useState('product-info');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [review, setreview] = useState('user-reviews');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedView, setSelectedView] = useState('');
  const [selectedVariation, setSelectedVariation] = useState('');
  const [decodedSpecs, setDecodedSpecs] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);
  const [availableViews, setAvailableViews] = useState([]);
  const [availableVariations, setAvailableVariations] = useState([]);
  const [selectedSpec, setSelectedSpec] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [newReview, setNewReview] = useState({ user: '', email: '', rating: 0, comment: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [successMessage, setSuccessMessage] = useState('');  // State for success message
  const [profile, setProfile] = useState(null);
  const [error1, setError1] = useState(null);
  const generateRandomNumber = () => Math.floor(Math.random() * (95 - 7 + 1)) + 7;
  const [loved, setLoved] = useState(generateRandomNumber());
  const [bought, setBought] = useState(generateRandomNumber());
  const [goingToBuy, setGoingToBuy] = useState(generateRandomNumber());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAttempt, setSelectedAttempt] = useState("");
  const [selectedBookType, setSelectedBookType] = useState("");
const [selectedLanguage, setSelectedLanguage] = useState("");
const [selectedRecording, setSelectedRecording] = useState("");
const [availableAttempts, setAvailableAttempts] = useState([]);
const [availableBookTypes, setAvailableBookTypes] = useState([]);
const [availableLanguages, setAvailableLanguages] = useState([]);
const [availableRecordings, setAvailableRecordings] = useState([]);
const navigate = useNavigate();  // Initialize navigate
  const [loading, setLoading] = useState(false); // State to track loading
  //For the quote your price
  const [image, setImage] = useState(null);
  const [quote, setQuote] = useState({
    name: "",
    email: "",
    mobile_number: "",
    seller: "",
    quotedprice: "",
    productname: "",
    productid: "",
    image: "",
  });

  useEffect(() => {
    // Helper function to increment numbers with a delay
    const incrementNumbers = () => {
      const randomInterval = Math.floor(Math.random() * 2000) + 1000; // Random delay between 1-3 seconds

      // Increment loved number
      const lovedInterval = setInterval(() => {
        setLoved(prev => prev + 1);
      }, randomInterval);

      // Increment bought number
      const boughtInterval = setInterval(() => {
        setBought(prev => prev + 1);
      }, randomInterval + 500); // Slightly different delay for bought

      // Increment goingToBuy number
      const goingToBuyInterval = setInterval(() => {
        setGoingToBuy(prev => prev + 1);
      }, randomInterval + 1000); // Slightly different delay for going to buy

      // Clear intervals after 10 seconds to stop the increments
      setTimeout(() => {
        clearInterval(lovedInterval);
        clearInterval(boughtInterval);
        clearInterval(goingToBuyInterval);
      }, 10000);
    };

    incrementNumbers();
  }, []);

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
    setQuote({ ...quote, image: e.target.files[0] });
  };

  const toggleContent = () => {
    setShowMore((prev) => !prev);
  };

  const changeHandler = (e) => {
    setQuote({ ...quote, [e.target.name]: e.target.value });
  };

  const addQuote = async (e) => {
    e.preventDefault();
    console.log(quote);

    setLoading(true); // Start loading

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    let quoteData = { ...quote };
    let responseData;

    // Only attempt image upload if an image is provided
    if (image) {
      let formData = new FormData();
      formData.append('image', image);

      // Upload the image
      await fetch(`${BACKEND_URL}/upload-faculty`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      })
        .then((resp) => resp.json())
        .then((data) => { responseData = data });

      if (responseData.success) {
        quoteData.image = responseData.image_url;
      }
    }

    console.log(quoteData);

    // Add the quote
    await fetch(`${BACKEND_URL}/addQuoteYourPrice`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(quoteData)
    })
      .then((resp) => resp.json())
      .then((data) => {
        setLoading(false); // Stop loading after response
        if (data.success) {
          setSuccessMessage("Quote Added! We will contact you soon.");  // Set success message
          setTimeout(() => {
            closeModal();  // Close the modal after 5 seconds
          }, 5000);
        } else {
          setSuccessMessage("Failed to add quote. Please try again.");
        }
      })
      .catch((error) => {
        setLoading(false); // Stop loading if there's an error
        setSuccessMessage("An error occurred. Please try later.");
      });
  };


  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        // Redirect to login if no token exists
        window.location.href = '/login';
        return;
      }
  
      try {
        const response = await fetch(`${BACKEND_URL}/profile`, {
          method: 'GET',
          headers: { 'auth-token': token },
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }
  
        const data = await response.json();
        setProfile(data);
        setQuote((prevQuote) => ({
          ...prevQuote,
          name: `${data.first_name} ${data.last_name}`,
          email: data.email,
          mobile_number: data.mobile_number,
        }));
      } catch (err) {
        console.error(err.message || 'Failed to fetch user details');
        // Redirect to login if fetching profile fails
        window.location.href = '/login';
      }
    };
  
    fetchProfile();
  }, []);

  
  const openModal = () => {
    // Check if auth-token exists in localStorage
    const authToken = localStorage.getItem('auth-token');
    
    if (!authToken) {
      // If no auth-token, navigate to the login page
      window.location.href = '/login'; // or use a navigation library like react-router if you're using React Router
      return;
    }
  
    // Proceed with setting the quote and opening the modal if auth-token exists
    setQuote((prevQuote) => ({
      ...prevQuote,
      productname: product.name,  // Assuming product is available
      productid: product.id,      // Assuming product is available
    }));
    setIsModalOpen(true);
  };
  

  const closeModal = () => {
    setSuccessMessage('');  // Clear success message immediately
    setIsModalOpen(false);  // Close the modal immediately
  };

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/products/${product.id}/reviews`);
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      setError('Failed to fetch reviews.');
    }
  };

  useEffect(() => {
    if (product && all_products.length > 0) {
      // Filter products by the same category
      const productsInCategory = all_products.filter(
        (item) => item.category === product.category && item.id !== product.id
      );

      // Shuffle and select 10 random products
      const shuffled = productsInCategory.sort(() => 0.5 - Math.random());
      const randomTen = shuffled.slice(0, 10);

      setRelatedProducts(randomTen);
    }
  }, [product, all_products]);


  // Handle input change for new review
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prevReview) => ({
      ...prevReview,
      [name]: value,
    }));
  };

  // Add a new review for the current product
  const addReview = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/products/${product.id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReview),
      });
      const data = await response.json();

      if (response.ok) {
        setSuccess('Review added successfully.');
        setreview('user-reviews'); // Switch back to user reviews after adding
        setError('');
        setNewReview({ user: '', email: '', rating: 0, comment: '' }); // Reset form
        fetchReviews(); // Refresh reviews list
      } else {
        setError(data.message || 'Failed to add review.');
      }
    } catch (error) {
      setError('Failed to add review.');
    }
  };


  const normalizeValue = (value) => value?.toLowerCase().replace(/\s+/g, "");

  const decodeSpecifications = (specifications) => {
    return specifications.map((spec) => {
      // Split the spec into parts
      const parts = spec.split("-");
  
      // Destructure all the parts into variables
      const [model, v, vw, attempt, bookType, language, recording, newPrice, oldPrice, ...linkParts] = parts;
  
      // Rejoin remaining parts into a link
      const link = linkParts.join("-");
  
      return {
        model,
        vw,
        v,
        newPrice: parseInt(newPrice),
        oldPrice: parseInt(oldPrice),
        attempt,
        bookType,
        language,
        recording,
        link,
        // Add normalized versions for comparison
        normalized: {
          model: normalizeValue(model),
          vw: normalizeValue(vw),
          v: normalizeValue(v),
          attempt: normalizeValue(attempt),
          bookType: normalizeValue(bookType),
          language: normalizeValue(language),
          recording: normalizeValue(recording),
        },
      };
    });
  };
  
  // Deduplicate specs based on normalized values
  const deduplicateSpecifications = (decodedSpecs) => {
    return Object.values(
      decodedSpecs.reduce((acc, spec) => {
        const key = [
          spec.normalized.model,
          spec.normalized.v,
          spec.normalized.vw,
          spec.normalized.attempt,
          spec.normalized.bookType,
          spec.normalized.language,
          spec.normalized.recording,
        ].join("-");
        if (!acc[key]) acc[key] = spec; // Retain only the first occurrence
        return acc;
      }, {})
    );
  };
  
  // Find the least price and preselect it
  useEffect(() => {
    if (product) {
      const decoded = decodeSpecifications(product.specifications);
      setDecodedSpecs(decoded);
  
      // Deduplicate specs for display purposes
      const uniqueSpecs = deduplicateSpecifications(decoded);
  
      // Find the least price specification
      const leastPriceSpec = uniqueSpecs.reduce((min, spec) => (spec.newPrice < min.newPrice ? spec : min), uniqueSpecs[0]);
  
      // Initialize the selections with least price specification
      setSelectedModel(leastPriceSpec.model);
      setSelectedView(leastPriceSpec.vw);
      setSelectedVariation(leastPriceSpec.v);
      setSelectedAttempt(leastPriceSpec.attempt);
      setSelectedBookType(leastPriceSpec.bookType);
      setSelectedLanguage(leastPriceSpec.language);
      setSelectedRecording(leastPriceSpec.recording);
      setSelectedSpec(leastPriceSpec);
  
      // Set the complete list of options for all attributes (from original decoded specs)
      setAvailableModels([...new Set(decoded.map((spec) => spec.model))]);
      setAvailableViews([...new Set(decoded.map((spec) => spec.vw))]);
      setAvailableVariations([...new Set(decoded.map((spec) => spec.v))]);
      setAvailableAttempts([...new Set(decoded.map((spec) => spec.attempt))]);
      setAvailableBookTypes([...new Set(decoded.map((spec) => spec.bookType))]);
      setAvailableLanguages([...new Set(decoded.map((spec) => spec.language))]);
      setAvailableRecordings([...new Set(decoded.map((spec) => spec.recording))]);
    }
  }, [product]);
  
  const handleOptionChange = (type, value) => {
    // Update the selected state based on the dropdown type
    const updatedSelections = {
      model: type === "model" ? value : selectedModel,
      view: type === "view" ? value : selectedView,
      variation: type === "variation" ? value : selectedVariation,
      attempt: type === "attempt" ? value : selectedAttempt,
      bookType: type === "bookType" ? value : selectedBookType,
      language: type === "language" ? value : selectedLanguage,
      recording: type === "recording" ? value : selectedRecording,
    };
  
    // Filter specs based on current selections
    const filteredSpecs = decodedSpecs.filter((spec) => {
      return (
        (!updatedSelections.model || normalizeValue(spec.model) === normalizeValue(updatedSelections.model)) &&
        (!updatedSelections.view || normalizeValue(spec.vw) === normalizeValue(updatedSelections.view)) &&
        (!updatedSelections.variation || normalizeValue(spec.v) === normalizeValue(updatedSelections.variation)) &&
        (!updatedSelections.attempt || normalizeValue(spec.attempt) === normalizeValue(updatedSelections.attempt)) &&
        (!updatedSelections.bookType || normalizeValue(spec.bookType) === normalizeValue(updatedSelections.bookType)) &&
        (!updatedSelections.language || normalizeValue(spec.language) === normalizeValue(updatedSelections.language)) &&
        (!updatedSelections.recording || normalizeValue(spec.recording) === normalizeValue(updatedSelections.recording))
      );
    });
  
    // Update available options for each field
    const availableModels = [...new Set(decodedSpecs.map((spec) => spec.model))];
    const availableViews = [...new Set(filteredSpecs.map((spec) => spec.vw))];
    const availableVariations = [...new Set(filteredSpecs.map((spec) => spec.v))];
    const availableAttempts = [...new Set(filteredSpecs.map((spec) => spec.attempt))];
    const availableBookTypes = [...new Set(filteredSpecs.map((spec) => spec.bookType))];
    const availableLanguages = [...new Set(filteredSpecs.map((spec) => spec.language))];
    const availableRecordings = [...new Set(filteredSpecs.map((spec) => spec.recording))];
  
    // Auto-select single options
    const newSelectedView = availableViews.length === 1 ? availableViews[0] : updatedSelections.view;
    const newSelectedVariation = availableVariations.length === 1 ? availableVariations[0] : updatedSelections.variation;
    const newSelectedAttempt = availableAttempts.length === 1 ? availableAttempts[0] : updatedSelections.attempt;
    const newSelectedBookType = availableBookTypes.length === 1 ? availableBookTypes[0] : updatedSelections.bookType;
    const newSelectedLanguage = availableLanguages.length === 1 ? availableLanguages[0] : updatedSelections.language;
    const newSelectedRecording = availableRecordings.length === 1 ? availableRecordings[0] : updatedSelections.recording;
  
    // Find the matching spec or default to the least price spec
    const selectedSpec =
      filteredSpecs.find(
        (spec) =>
          normalizeValue(spec.model) === normalizeValue(updatedSelections.model) &&
          normalizeValue(spec.vw) === normalizeValue(newSelectedView) &&
          normalizeValue(spec.v) === normalizeValue(newSelectedVariation) &&
          normalizeValue(spec.attempt) === normalizeValue(newSelectedAttempt) &&
          normalizeValue(spec.bookType) === normalizeValue(newSelectedBookType) &&
          normalizeValue(spec.language) === normalizeValue(newSelectedLanguage) &&
          normalizeValue(spec.recording) === normalizeValue(newSelectedRecording)
      ) ||
      filteredSpecs.reduce((min, spec) => (spec.newPrice < min.newPrice ? spec : min), filteredSpecs[0]);
  
    // Update state
    setSelectedModel(updatedSelections.model);
    setSelectedView(newSelectedView);
    setSelectedVariation(newSelectedVariation);
    setSelectedAttempt(newSelectedAttempt);
    setSelectedBookType(newSelectedBookType);
    setSelectedLanguage(newSelectedLanguage);
    setSelectedRecording(newSelectedRecording);
    setSelectedSpec(selectedSpec);
  
    // Update available options
    setAvailableModels(availableModels);
    setAvailableViews(availableViews);
    setAvailableVariations(availableVariations);
    setAvailableAttempts(availableAttempts);
    setAvailableBookTypes(availableBookTypes);
    setAvailableLanguages(availableLanguages);
    setAvailableRecordings(availableRecordings);
  };
  
  

  const handleScrollToInfo = () => {
    infoSectionRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'center', // Centers the div vertically in the viewport
    });
  };

  const handleProductInfo = () => {
    setActiveView('product-info');
    setView('product-info');

  };

  const handlecontents = () => {
    setActiveView('contents');
    setView('contents');

  };

  const handleaboutfaculty = () => {
    setActiveView('about-faculty');
    setView('about-faculty');

  };



  const handlereviews = () => {
    setActiveView('reviews');
    setView('reviews');
  };

  const formatToIndianCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };


  const handleAddToCart = () => {
 
  
    if (!selectedModel || !selectedView || !selectedVariation) {
      alert("Please select all required options.");
      return;
    }
  
    console.log("Adding to cart:", {
      productId: product.id,
      model: selectedModel,
      view: selectedView,
      validity: selectedVariation,
      attempt: selectedSpec?.attempt,
      language: selectedSpec?.language,
      recording: selectedSpec?.recording,
      bookType: selectedSpec?.bookType,
      price: selectedSpec ? selectedSpec.newPrice : product.price,
      oldPrice: selectedSpec ? selectedSpec.oldPrice : product.old_price,
      link: selectedSpec?.link || "",
    });
  
    addToCart(
      product.id,
      selectedModel,
      selectedView,
      selectedVariation,
      selectedSpec?.attempt,
      selectedSpec?.language,
      selectedSpec?.recording,
      selectedSpec?.bookType,
      selectedSpec ? selectedSpec.newPrice : product.price,
      selectedSpec ? selectedSpec.oldPrice : product.old_price,
      selectedSpec?.link || ""
    );
  
    // Navigate to /cart with a slight delay before reloading
    setTimeout(() => {
      navigate('/cart');
      window.location.reload(); // Reload the page after navigation
    }, 1000);  // Delay of 1 second (1000 ms)
  
    // Optionally open the logout modal
    setIsLogoutModalOpen(true);
  };
  
  const handleclosemodal = () => {
    setIsLogoutModalOpen(false);
  };

  const handleIsItemInCart = () => {
    // Collect all required attributes
    const requiredAttributes = [
      selectedModel,
      selectedView,
      selectedVariation,
      selectedSpec?.attempt,
      selectedSpec?.language,
      selectedSpec?.recording,
      selectedSpec?.bookType
    ];
  
    // Check if any attribute is missing
    if (requiredAttributes.some(attr => attr === undefined || attr === null)) {
      console.warn("Missing required attributes: Ensure all fields are selected.");
      return;
    }
  
    // Prepare the price values, defaulting to product prices if not provided
    const newPrice = selectedSpec?.newPrice || product.price;
    const oldPrice = selectedSpec?.oldPrice || product.old_price;
  
    // Call the isItemInCart function with the required parameters
    isItemInCart(
      product.id,
      selectedModel,
      selectedView,
      selectedVariation,
      selectedSpec.attempt,
      selectedSpec.language,
      selectedSpec.recording,
      selectedSpec.bookType,
      newPrice,
      oldPrice
    );
  };
  

  const calculateFinalPrice = (price, offer) => {
    

    return price; // Return original price if offer format is invalid
  };

  const finalNewPrice = calculateFinalPrice(
    selectedSpec ? selectedSpec.newPrice : product.new_price,
    product.offer
  );


  return (
    <div className="product-display-important">

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-button" onClick={closeModal}>✖</button>
            <h2>Quote your Price</h2>
            <form onSubmit={addQuote}>
              <label>
                Name:   
                <input type="text" value={quote.name} disabled />
              </label>
              <label>
                Email:
                <input type="email" value={quote.email} disabled />
              </label>
              <label>
                Mobile:
                <input type="text" value={quote.mobile_number} disabled />
              </label>
              <label>
                Product Name:
                <input type="text" value={quote.productname} disabled />
              </label>
              <label>
                Product ID:
                <input type="text" value={quote.productid} disabled />
              </label>
              <label>
                Seller:
                <input
                  type="text"
                  name="seller"
                  value={quote.seller}
                  onChange={changeHandler}
                />
              </label>
              <label>
                Quoted Price:
                <input
                  type="number"
                  name="quotedprice"
                  value={quote.quotedprice}
                  onChange={changeHandler}
                />
              </label>
              <label>
                Image:
                <input type="file" onChange={imageHandler} />
              </label>
              {loading && <div className="loading-message">Please wait...</div>}  {/* Display loading message */}
              {successMessage && !loading && <div className="success-message">{successMessage}</div>}  {/* Display success message */}
              <button className='submit-btn' type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}

      <div className="product-display">
        <div className="image-gallery">
          <div className="main-image">
            <img src={getImageSrcByCode(product.image_code)} alt={product.name} className="main-product-image" />
          </div>
        </div>

        <div className="product-details">
          <h1 className="product-name ">{product.name}</h1>
          <p className="product-description">{product.description}</p>

          <div className="price-section">
            {selectedSpec ? (
              <>
                <span className="new-price">
                  {formatToIndianCurrency(finalNewPrice)}
                </span>
                <span className="old-price">
                  {formatToIndianCurrency(selectedSpec.oldPrice)}
                </span>
                {product.offer && (
                  <span className="offer-applied">
                    Extra Discount of Rs.{product.offer} Applied!
                  </span>
                )}
              </>
            ) : (
              <>
                <span className="new-price">
                  {formatToIndianCurrency(finalNewPrice)}
                </span>
                <span className="old-price">
                  {formatToIndianCurrency(product.old_price)}
                </span>
                {product.offer && (
                  <span className="offer-applied">
                    Extra {`${product.offer}`.includes('%') ? product.offer : `₹${product.offer}`} off applied lols!
                  </span>
                )}

              </>
            )}
          </div>

          <div className="specification-selection">
  {/* Mode Selection */}
  <div className="mode-option-main">
    <div className="mode-option-head"> Mode</div>
    <select
      id="model"
      className="mode-options"
      value={selectedModel}
      onChange={(e) => handleOptionChange("model", e.target.value)}
    >
      <option value="">Select Mode</option>
      {availableModels.map((model, index) => (
        <option key={index} value={model}>
          {model}
        </option>
      ))}
    </select>
  </div>

  {/* Views Selection */}
  <div className="mode-option-main">
    <div className="mode-option-head"> Views</div>
    <select
      id="view"
      className="mode-options"
      value={selectedView}
      onChange={(e) => handleOptionChange("view", e.target.value)}
    >
      <option value="">Select Views</option>
      {availableViews.map((view, index) => (
        <option key={index} value={view}>
          {view}
        </option>
      ))}
    </select>
  </div>

  {/* Validity Selection */}
  <div className="mode-option-main">
    <div className="mode-option-head"> Validity</div>
    <select
      id="variation"
      className="mode-options"
      value={selectedVariation}
      onChange={(e) => handleOptionChange("variation", e.target.value)}
    >
      <option value="">Select Validity</option>
      {availableVariations.map((variation, index) => (
        <option key={index} value={variation}>
          {variation}
        </option>
      ))}
    </select>
  </div>

  {/* Attempt Selection */}
  <div className="mode-option-main">
    <div className="mode-option-head"> Attempt</div>
    <select
      id="attempt"
      className="mode-options"
      value={selectedAttempt}
      onChange={(e) => handleOptionChange("attempt", e.target.value)}
    >
      <option value="">Select Attempt</option>
      {availableAttempts.map((attempt, index) => (
        <option key={index} value={attempt}>
          {attempt}
        </option>
      ))}
    </select>
  </div>

  {/* Book Type Selection */}
  <div className="mode-option-main">
    <div className="mode-option-head"> Book Type</div>
    <select
      id="bookType"
      className="mode-options"
      value={selectedBookType}
      onChange={(e) => handleOptionChange("bookType", e.target.value)}
    >
      <option value="">Select Book Type</option>
      {availableBookTypes.map((bookType, index) => (
        <option key={index} value={bookType}>
          {bookType}
        </option>
      ))}
    </select>
  </div>

  {/* Language Selection */}
  <div className="mode-option-main">
    <div className="mode-option-head"> Language</div>
    <select
      id="language"
      className="mode-options"
      value={selectedLanguage}
      onChange={(e) => handleOptionChange("language", e.target.value)}
    >
      <option value="">Select Language</option>
      {availableLanguages.map((language, index) => (
        <option key={index} value={language}>
          {language}
        </option>
      ))}
    </select>
  </div>

  {/* Recording Selection */}
  <div className="mode-option-main">
    <div className="mode-option-head"> Recording</div>
    <select
      id="recording"
      className="mode-options"
      value={selectedRecording}
      onChange={(e) => handleOptionChange("recording", e.target.value)}
    >
      <option value="">Select Recording</option>
      {availableRecordings.map((recording, index) => (
        <option key={index} value={recording}>
          {recording}
        </option>
      ))}
    </select>
  </div>
</div>



          <button onClick={openModal} className="add-to-cart-button">
            Quote your Price
          </button>

          <button
            onClick={handleAddToCart}
            className="add-to-cart-button"
          >
            {handleIsItemInCart() ? 'Added!' : 'Add to Cart'}
          </button>

        </div>

      </div>
      <div className="other-details-products">
      <div className='product-important-note'>
          <div className="note-head">Important Note</div>
          <div className="note">{product.note}</div>
        </div>
        <nav className='product-navbar'>
          <ul>
            <li className={activeView === 'product-info' ? 'active-product-display' : ''} onClick={handleProductInfo} >All Information</li>
            <li className={activeView === 'contents' ? 'active-product-display' : ''} onClick={handlecontents} >Kit Contents</li>
            <li className={activeView === 'about-faculty' ? 'active-product-display' : ''} onClick={handleaboutfaculty} >About Faculty</li>
            <li className={activeView === 'reviews' ? 'active-product-display' : ''} onClick={handlereviews} >Reviews</li>
          </ul>
        </nav>
        <div ref={infoSectionRef} className="information-about-product">

        {view === 'product-info' && (
  <div className="product-info-container-main">
    <div className="product-info-table-container">
      <table className="product-info-table">
        <tbody>
          <tr>
            <th className="table-header">Product Name</th>
            <td className="table-data">{product.name}</td>
          </tr>
          <tr>
            <th className="table-header">Category & Sub-Category</th>
            <td className="table-data">{product.category} - {product.sub_category}</td>
          </tr>
          <tr>
            <th className="table-header">Faculty</th>
            <td className="table-data">{product.lecturer}</td>
          </tr>
          <tr>
            <th className="table-header">Mode</th>
            <td className="table-data">{selectedModel}</td>
          </tr>
          <tr>
            <th className="table-header">Views</th>
            <td className="table-data">{selectedView}</td>
          </tr>
          <tr>
            <th className="table-header">Validity</th>
            <td className="table-data">{selectedVariation}</td>
          </tr>
          <tr>
            <th className="table-header">Attempt</th>
            <td className="table-data">{selectedAttempt}</td>
          </tr>
          <tr>
            <th className="table-header">Language</th>
            <td className="table-data">{selectedLanguage}</td>
          </tr>
          <tr>
            <th className="table-header">Recording</th>
            <td className="table-data">{selectedRecording}</td>
          </tr>
          <tr>
  <th className="table-header">Lecture Duration</th>
  <td className="table-data">
    <p className="lecture-duration-text">
      {product.lecture_duration} hours
    </p>
  </td>
</tr>

          <tr>
            <th className="table-header">Study Material</th>
            <td className="table-data">{selectedBookType}</td>
          </tr>
          <tr>
            <th className="table-header">Doubt Solving</th>
            <td className="table-data">{product.doubt_solving}</td>
          </tr>
          <tr>
  <th className="table-header">Subject</th>
  <td className="table-data">
    <p className="subject-text">
      {product.subject}
    </p>
  </td>
</tr>

<tr>
  <th className="table-header">Number of Lectures</th>
  <td className="table-data">
    <p className="lecture-number-text">
      {product.lecture_number} lectures
    </p>
  </td>
</tr>

          <tr>
            <th className="table-header">Batch Type</th>
            <td className="table-data">{product.batch_type}</td>
          </tr>
          <tr>
            <th className="table-header">Topics Covered</th>
            <td className="table-data">{product.topics_covered}</td>
          </tr>
          <tr>
            <th className="table-header">Mode Description</th>
            <td className="table-data">{product.mode_description}</td>
          </tr>
          <tr>
            <th className="table-header">Views Extension</th>
            <td className="table-data">{product.views_extension}</td>
          </tr>
          <tr>
            <th className="table-header">Validity Start</th>
            <td className="table-data">{product.validity_start}</td>
          </tr>
          <tr>
            <th className="table-header">Validity Explanation</th>
            <td className="table-data">{product.validity_explanation}</td>
          </tr>
          <tr>
            <th className="table-header">Video Runs On</th>
            <td className="table-data">{product.video_runs_on}</td>
          </tr>
          <tr>
  <th className="table-header">Internet Connectivity</th>
  <td className="table-data">
    <p className="internet-connectivity">
      {product.internet_connectivity}
    </p>
  </td>
</tr>

          <tr>
            <th className="table-header">System Requirements</th>
            <td className="table-data">
      <div>
        <strong>System Requirement for DT:- &nbsp; &nbsp; </strong>
        {showMore && (
          <div>
            <ul>
              <li>
                Simultaneous login on Android App and Laptop or Desktop is
                permitted after you log out from the other device.
                <br />
                <em>For Example:</em> If you have activated on Android and now
                wish to watch the lectures on a Desktop or Laptop, you just need
                to log out of the application on Android and log in to the
                application on the Laptop or Desktop.
              </li>
              <li>
                <strong>For Google Drive & Pen Drive:</strong>
                <ul>
                  <li>It can be played on LAPTOP or DESKTOP (screen size: 22 inches).</li>
                  <li>It will run only on Windows OS.</li>
                  <li>It will run only on Windows 8.1, 10, 11, or any higher version.</li>
                </ul>
              </li>
              <li>
                <strong>For Mobile (Android ONLY):</strong>
                <ul>
                  <li>It will NOT run on Motorola devices.</li>
                  <li>Android version 7.0 or higher is required.</li>
                  <li>3 GB RAM & 32 GB internal memory are required at least.</li>
                </ul>
              </li>
            </ul>
            <strong>System Requirements for IDT:</strong>
            <ul>
              <li>
                <strong>Windows:</strong>
                <ul>
                  <li>Laptop & Desktop both supported.</li>
                  <li>Minimum processor: Pentium D.</li>
                  <li>Minimum RAM: 2 GB.</li>
                  <li>Supports Windows 7, 8, and 10 (Windows 7 Home Basic not supported).</li>
                </ul>
              </li>
              <li>
                <strong>Android:</strong>
                <ul>
                  <li>Minimum RAM: 3 GB (Recommended: 4 GB).</li>
                  <li>Minimum Android version: 7.0 & above.</li>
                  <li>Phone should have good performance.</li>
                </ul>
              </li>
              <li>
                <strong>iOS:</strong>
                <ul>
                  <li>iPhone: Requires iOS 12.1 or later.</li>
                  <li>iPad: Requires iPadOS 12.1 or later.</li>
                  <li>MAC: Laptop does not support.</li>
                </ul>
              </li>
            </ul>
          </div>
        )}
        <button
          onClick={toggleContent}
          style={{
            cursor: "pointer",
            background: "none",
            border: "none",
            color: "blue",
            marginTop: "10px",
            fontSize:"8px"
          }}
        >
          {showMore ? "Show Less" : "Show More"}
        </button> 
      </div>
    </td>
          </tr>
          <tr>
            <th className="table-header">Processing Time</th>
            <td className="table-data">{product.processing_time}</td>
          </tr>
          <tr>
            <th className="table-header">Amendment Support</th>
            <td className="table-data">{product.ammendment_support}</td>
          </tr>
          <tr>
            <th className="table-header">Technical Support</th>
            <td className="table-data">{product.technical_support}</td>
          </tr>
          <tr>
  <th className="table-header">
Pro-Library Benefits
  </th>
  <td className="table-data">
    <ul>
      <li>1. One Stop Solution For Books, Lectures, Test Series, and Mentoring.</li>
      <li>2. Free shipping on all orders.</li>
      <li>3. Dedicated After-Sale Support.</li>
    </ul>
  </td>
</tr>

        </tbody>
      </table>
    </div>
  </div>
)}



          {view === 'reviews' && (
            <div className="product-info-container-main">
              <div className="review-main-container-important">
                <div className="review-buttons">
                  <button
                    className={review === 'user-reviews' ? 'active' : ''}
                    onClick={() => setreview('user-reviews')}
                  >
                    View Reviews
                  </button>
                  <button
                    className={review === 'add-review' ? 'active' : ''}
                    onClick={() => setreview('add-review')}
                  >
                    Add a Review
                  </button>
                </div>

                {review === 'user-reviews' ? (
                  <div className="reviews-list">
                    {reviews.length > 0 ? (
                      <div className="review-grid">
                        {reviews.map((review, index) => (
                          <ProductReviewItem
                            key={index}
                            name={review.user}
                            email={review.email}
                            rating={
                              <ReactStars
                                count={5}
                                value={review.rating}
                                edit={false}
                                size={20}
                                activeColor="#FF8C00" // Dark Orange for the user reviews
                              />
                            }
                            review={review.comment}
                            date={review.date}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className='loading-1'>Be the first one to add a review!</p>
                    )}
                  </div>
                ) : (
                  <div className="add-review-form">
                    <h3>Add a Review</h3>
                    {error && <p className="error">{error}</p>}
                    {success && <p className="success">{success}</p>}
                    <input
                      type="text"
                      name="user"
                      value={newReview.user}
                      onChange={handleInputChange}
                      placeholder="Your Name"
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      value={newReview.email}
                      onChange={handleInputChange}
                      placeholder="Your Email"
                      required
                    />
                    <div className="star-rating-input">
                      <ReactStars
                        count={5}
                        value={newReview.rating}
                        onChange={(newRating) => setNewReview({ ...newReview, rating: newRating })}
                        size={40}
                        activeColor="#FF8C00" // Dark Orange for the star rating input
                      />

                    </div>
                    <textarea
                      name="comment"
                      value={newReview.comment}
                      onChange={handleInputChange}
                      placeholder="Write your review"
                      required
                    />
                    <button onClick={addReview}>Submit Review</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contents */}
          {view === 'contents' && (
  <div className='product-important-note2'>
    <div className="note-head2">Kit Contents</div>
    <div className="note2">
      {product.kit_contents.split('\r\n\r\n').map((item, index) => (
        <p key={index}>
          {item.split('\r\n').map((subItem, subIndex) => (
            <span key={subIndex}>
              {subItem}
              <br />
            </span>
          ))}
        </p>
      ))}
    </div>
  </div>
)}


          {/* ABOUT FACULTY */}

          {view === 'about-faculty' && (
  <div className='product-important-note1'>
    <div className="note-head1">About the Faculty</div>
    <div className="note1">
      {product.about_faculty.split('\r\n\r\n').map((item, index) => (
        <p key={index}>{item.split('\r\n').map((subItem, subIndex) => (
          <span key={subIndex}>
            {subItem}
            <br />
          </span>
        ))}</p>
      ))}
    </div>
  </div>
)}

         


        </div>

        {/* IMPORTANT NOTE */}

        {/* Modal */}

        {isLogoutModalOpen && (
          <div className="logout-modal">
            <div className="logout-modal-content">
              <h3>The Product has been added to cart!</h3>
              <button onClick={handleclosemodal}>Okay</button>
            </div>
          </div>
        )}

{product.demo_link && (
  <div className="product-demo-video">
    <div className="product-demo-video-heading">Watch Demo Lecture</div>
    <iframe
      src={product.demo_link.replace("watch?v=", "embed/")}
      className="video-frame"
      allowFullScreen
    ></iframe>
  </div>
)}



        <div className="buy-more-product-display">
          <div className="heading">Students also purchased</div>
          <div className="related-products-list">
            {relatedProducts.map((relatedProduct) => (
              <ProductItemProductDisplay
                key={relatedProduct.id}
                id={relatedProduct.id} // Pass id to the item
                image={getImageSrcByCode(relatedProduct.image_code)} // Pass image
                name={relatedProduct.name} // Pass name
                lecturer={relatedProduct.lecturer} // Pass lecturer
                category={relatedProduct.category} // Pass category
                sub_category={relatedProduct.sub_category} // Pass sub_category
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;
