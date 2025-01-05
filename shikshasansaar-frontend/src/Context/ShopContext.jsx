import React, { createContext, useState, useEffect } from "react";
export const ShopContext = createContext(null);

// Default cart setup
function getDefaultCart() {
  return {};
}

// Default wishlist setup
const getDefaultWishlist = () => {
  return {}; 
};

const ShopContextProvider = (props) => {
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL; // Set the backend URL
  const [all_products, setall_products] = useState([]);
  const [all_productimages, setall_productimages] = useState([]);
  const [all_faculties, setall_faculties] = useState([]);
  const [all_blogs, setall_blogs] = useState([]);
  const [all_reviews, setall_reviews] = useState([]);
  const [all_sliders, setall_sliders] = useState([]);
  const [all_Content, setall_Content] = useState([]);
  const [allusers, setallusers] = useState([]);
  const [allquestions, setallquestions] = useState([]);
  const [cartItems, setCartItems] = useState(getDefaultCart());
  const [buyItems, setBuyItems] = useState([]);
  const [wishlistItems, setwishlistItems] = useState(getDefaultWishlist());

  // Fetch products, sliders, and content
  useEffect(() => {
    fetch(`${BACKEND_URL}/allproducts`)
      .then((response) => response.json())
      .then((data) => setall_products(data))
      .catch((error) => console.error('Error fetching all products:', error));
  }, []);

  useEffect(() => {
    fetch(`${BACKEND_URL}/allFaculties`)
      .then((response) => response.json())
      .then((data) => setall_faculties(data))
      .catch((error) => console.error('Error fetching all faculties:', error));
  }, []);

  useEffect(() => {
    fetch(`${BACKEND_URL}/allBlogs`)
      .then((response) => response.json())
      .then((data) => setall_blogs(data))
      .catch((error) => console.error('Error fetching all faculties:', error));
  }, []);

  useEffect(() => {
    fetch(`${BACKEND_URL}/allReviews`)
      .then((response) => response.json())
      .then((data) => setall_reviews(data))
      .catch((error) => console.error('Error fetching all reviews:', error));
  }, []);

  useEffect(() => {
    fetch(`${BACKEND_URL}/allsliderImages`)
      .then((response) => response.json())
      .then((data) => setall_sliders(data))
      .catch((error) => console.error('Error fetching slider images:', error));
  }, []);

  useEffect(() => {
    fetch(`${BACKEND_URL}/allquestions`)
      .then((response) => response.json())
      .then((data) => setallquestions(data))
      .catch((error) => console.error('Error fetching all questions:', error));
  }, []);

  useEffect(() => {
    fetch(`${BACKEND_URL}/allusers`)
      .then((response) => response.json())
      .then((data) => setallusers(data))
      .catch((error) => console.error('Error fetching all questions:', error));
  }, []);


  useEffect(() => {
    fetch(`${BACKEND_URL}/allContent`)
      .then((response) => response.json())
      .then((data) => setall_Content(data))
      .catch((error) => console.error('Error fetching all content:', error));
  }, []);

  useEffect(() => {
    fetch(`${BACKEND_URL}/allProductImages`)
      .then((response) => response.json())
      .then((data) => setall_productimages(data))
      .catch((error) => console.error('Error fetching all product images:', error));
  }, []);

  const getImageSrcByCode = (image_code) => {
    const productImage = all_productimages.find((img) => img.image_code === image_code);
  
    // Return the image src if found, else return a fallback or null
    if (productImage) {
      return productImage.image;
    } else {
      return null; // or you can return a default image if not found
    }
  };

  // Load cart and wishlist and buydata if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('auth-token');

    if (token) {
        fetch(`${BACKEND_URL}/getcart`, {
            method: 'GET',
            headers: { 'auth-token': token },
        })
            .then((response) => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
            .then((data) => {
                if (Object.keys(data).length === 0) {
                    setCartItems({});
                    localStorage.setItem('cartItems', JSON.stringify({})); // Update localStorage
                    console.log('Cart is empty. Cleared cartItems.');
                    return;
                }

                const updatedCart = {};

                const formatCompositeKey = (
                    productId,
                    mode,
                    views,
                    validity,
                    attempt,
                    language,
                    recording,
                    bookType,
                    oldPrice,
                    newPrice
                ) => {
                    const formattedMode = mode.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                    const formattedViews = views.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                    const formattedValidity = validity.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                    const formattedAttempt = attempt.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                    const formattedLanguage = language.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                    const formattedRecording = recording.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                    const formattedBookType = bookType.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

                    return `${productId}${formattedMode}${formattedViews}${formattedValidity}${formattedAttempt}${formattedLanguage}${formattedRecording}${formattedBookType}${oldPrice}${newPrice}`;
                };

                data.forEach((item) => {
                    const compositeKey = formatCompositeKey(
                        item.productId,
                        item.mode,
                        item.views,
                        item.validity,
                        item.attempt,
                        item.language,
                        item.recording,
                        item.bookType,
                        item.oldPrice,
                        item.newPrice
                    );

                    updatedCart[compositeKey] = {
                        productId: item.productId,
                        mode: item.mode,
                        views: item.views,
                        validity: item.validity,
                        attempt: item.attempt,
                        language: item.language,
                        recording: item.recording,
                        bookType: item.bookType,
                        oldPrice: item.oldPrice,
                        newPrice: item.newPrice,
                        quantity: item.quantity,
                        price: item.price,
                        link: item.link || '',
                    };
                });

                setCartItems(updatedCart);
                localStorage.setItem('cartItems', JSON.stringify(updatedCart)); // Sync with localStorage
                console.log('Updated cartItems and localStorage:', updatedCart);
            })
            .catch((error) => console.error('Error fetching cart:', error));
    }
}, [setCartItems, BACKEND_URL]);


useEffect(() => {
  const token = localStorage.getItem('auth-token');
if (token) {
    fetch(`${BACKEND_URL}/getbuy`, {
      method: 'GET',
      headers: { 'auth-token': token },
    })
    .then(response => {

        return response.text(); // Log raw response
    })
    .then(text => {
        try {
            const data = JSON.parse(text);
            console.log("Parsed buy data:", data);
            setBuyItems(data);
        } catch (e) {
            console.error("Failed to parse JSON:", e);
        }
    })
    .catch(err => console.error("Fetch error:", err));
}
}, [setBuyItems, BACKEND_URL]); // Empty dependency array means this runs once on component mount




  // useEffect(() => {
  //   const token = localStorage.getItem('auth-token');
  //   if (token) {
  //     fetch(${BACKEND_URL}/getbuy, {
  //       method: 'GET',
  //       headers: { 'auth-token': token },
  //     })
  //       .then((response) => {
  //         if (!response.ok) throw new Error(HTTP error! status: ${response.status});
  //         return response.text(); // Use text() to log the raw response
  //       })
  //       .then((text) => {
  //         try {
  //           const data = JSON.parse(text); // Try parsing JSON after logging
  //           setbuyItems(data);
  //         } catch (e) {
  //           console.error('Failed to parse bought items JSON:', e);
  //           console.error('Received text:', text);
  //         }
  //       })
  //       .catch((error) => console.error('Error fetching bought items:', error));
  //   }
  // }, []);

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      fetch(`${BACKEND_URL}/getwishlist`, {
        method: 'GET',
        headers: { 'auth-token': token },
      })
        .then((response) => {
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          return response.text(); // Use text() to log the raw response
        })
        .then((text) => {
          try {
            const data = JSON.parse(text); // Try parsing JSON after logging
            setwishlistItems(data);
          } catch (e) {
            console.error('Failed to parse wishlist JSON:', e);
            console.error('Received text:', text);
          }
        })
        .catch((error) => console.error('Error fetching wishlist:', error));
    }
  }, []);

  // Add to cart and sync with server
  const addToCart = (
    productId,
    selectedModel,
    selectedView,
    selectedVariation,
    selectedAttempt,
    selectedLanguage ,
    selectedRecording ,
    selectedBookType ,
    newPrice,
    oldPrice,
    link = ''
  ) => {
    setCartItems((prev) => {
      const updatedCart = { ...prev };
  
      // Helper function to format the composite key
      const formatCompositeKey = (
        productId,
        mode,
        views,
        validity,
        attempt,
        language,
        recording,
        bookType,
        oldPrice,
        newPrice
      ) => {
        // Remove all special characters, including dots and spaces, then convert to lowercase
        const formattedMode = mode.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const formattedViews = views.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const formattedValidity = validity.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const formattedAttempt = attempt.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const formattedLanguage = language.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const formattedRecording = recording.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const formattedBookType = bookType.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  
        return `${productId}${formattedMode}${formattedViews}${formattedValidity}${formattedAttempt}${formattedLanguage}${formattedRecording}${formattedBookType}${oldPrice}${newPrice}`;
      };
  
      // Construct composite key
      const compositeKey = formatCompositeKey(
        productId,
        selectedModel,
        selectedView,
        selectedVariation,
        selectedAttempt,
        selectedLanguage,
        selectedLanguage,
        selectedBookType,
        oldPrice,
        newPrice
      );
  
      if (!updatedCart[compositeKey]) {
        updatedCart[compositeKey] = {
          productId,
          mode: selectedModel,
          views: selectedView,
          validity: selectedVariation,
          attempt:selectedAttempt,
          language:selectedLanguage,
          recording:selectedRecording,
          bookType:selectedBookType,
          newPrice,
          oldPrice,
          link,
          quantity: 1,
        };
  
        // Send the item to the server if the user is authenticated
        if (localStorage.getItem('auth-token')) {
          fetch(`${BACKEND_URL}/addtocart`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'auth-token': localStorage.getItem('auth-token'),
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              productId,
              mode: selectedModel,
              views: selectedView,
              validity: selectedVariation,
              attempt:selectedAttempt,
              language:selectedLanguage,
              recording:selectedRecording,
              bookType:selectedBookType,
              newPrice,
              oldPrice,
              link,
            }),
          })
            .then((response) => response.json())
            .catch((error) => console.error('Error adding to cart:', error));
        } else {
          console.warn('User is not authenticated. Cart item not sent to server.');
        }
      } else {
        console.log('Item already exists in cart. Quantity not increased.');
      }
  
      // Update the local storage with the modified cart
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  
      return updatedCart;
    });
  };
  


//   const addToBuy = async (purchasedProducts, paymentId) => {
//     const token = localStorage.getItem('auth-token');
//     if (!token) {
//         alert("You need to be logged in to make a purchase.");
//         return;
//     }

//     try {
//         const response = await fetch(${BACKEND_URL}/addtobuy, {
//             method: 'POST',
//             headers: {
//                 Accept: 'application/json',
//                 'auth-token': token,
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 purchasedProducts,
//                 paymentId,
//             }),
//         });

//         const data = await response.json();
//         if (response.ok) {
//             console.log('Purchase data added:', data);
//             // Handle success or show a message to the user if needed
//         } else {
//             console.error('Error adding to buy:', data.errors);
//             // Optionally show an error message to the user
//         }
//     } catch (error) {
//         console.error('Error adding to buy:', error);
//         // Handle error or show an error message to the user
//     }
// };

  // Add to wishlist and sync with server
  const addToWishlist = (itemId) => {
    setwishlistItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
    if (localStorage.getItem('auth-token')) {
      fetch(`${BACKEND_URL}/addtowishlist`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'auth-token': localStorage.getItem('auth-token'),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error('Error adding to wishlist:', error));
    }
  };

  // Remove from cart and sync with server
  const removeFromCart = (
    productId,
    mode,
    views,
    validity,
    attempt,
    language,
    recording,
    bookType,
    oldPrice,
    newPrice
) => {
    // Format the composite key
    const formatCompositeKey = (
        productId,
        mode,
        views,
        validity,
        attempt,
        language,
        recording,
        bookType,
        oldPrice,
        newPrice
    ) => {
        const formattedMode = mode.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const formattedViews = views.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const formattedValidity = validity.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const formattedAttempt = attempt.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const formattedLanguage = language.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const formattedRecording = recording.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const formattedBookType = bookType.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

        return `${productId}${formattedMode}${formattedViews}${formattedValidity}${formattedAttempt}${formattedLanguage}${formattedRecording}${formattedBookType}${oldPrice}${newPrice}`;
    };

    const compositeKey = formatCompositeKey(
        productId,
        mode,
        views,
        validity,
        attempt,
        language,
        recording,
        bookType,
        oldPrice,
        newPrice
    );

    console.log(`Remove from cart composite key: ${compositeKey}`);

    const token = localStorage.getItem('auth-token');
    if (!token) {
        console.error('No authentication token found');
        return;
    }

    // Send request to backend
    fetch(`${BACKEND_URL}/removefromcart`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'auth-token': token,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ compositeKey }),
    })
        .then((response) => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then((data) => {
            console.log('Backend response:', data);
            if (data.success) {
                // Success case: Update the cartItems state and local storage
                setCartItems((prevCartItems) => {
                    const updatedCart = { ...prevCartItems };
                    delete updatedCart[compositeKey]; // Remove the item from cartItems
                    localStorage.setItem('cartItems', JSON.stringify(updatedCart)); // Update local storage
                    console.log('Updated cartItems:', updatedCart);
                    return updatedCart;
                });
                console.log('Item successfully removed from cart.');
            } else {
                // Failure case: Reload the window
                console.error('Backend did not confirm success. Reloading window...');
                window.location.reload();
            }
        })
        .catch((error) => {
            console.error('Error removing from cart:', error);
            // Reload the window in case of an error
            console.error('Reloading window due to error...');
            window.location.reload();
        });
};



  // Remove from wishlist and sync with server
  const removeFromWishlist = (itemId) => {
    setwishlistItems((prev) => {
      if (prev[itemId] > 1) {
        return { ...prev, [itemId]: prev[itemId] - 1 };
      } else {
        const updatedWishlist = { ...prev };
        delete updatedWishlist[itemId];
        return updatedWishlist;
      }
    });
    if (localStorage.getItem('auth-token')) {
      fetch(`${BACKEND_URL}/removefromWishlist`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'auth-token': localStorage.getItem('auth-token'),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error('Error removing from wishlist:', error));
    }
  };

// Update quantity function with composite key formatted
const updateQuantity = async (
  productId,
  selectedModel,
  selectedView,
  selectedVariation,
  selectedAttempt,
  selectedLanguage,
  selectedRecording,
  selectedBookType,
  oldPrice,
  newPrice,
  newQuantity
) => {
  const token = localStorage.getItem('auth-token');
  if (!token) {
      console.error("No auth token found");
      return;
  }

  if (newQuantity < 1) {
      console.error("Invalid quantity");
      return;
  }

  // Format the composite key using consistent logic
  const formatCompositeKey = (
    productId,
    mode,
    views,
    validity,
    attempt,
    language,
    recording,
    bookType,
    oldPrice,
    newPrice
  ) => {
    const formattedMode = String(mode).replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const formattedViews = String(views).replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const formattedValidity = String(validity).replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const formattedAttempt = String(attempt).replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const formattedLanguage = String(language).replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const formattedRecording = String(recording).replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const formattedBookType = String(bookType).replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  
    // Ensure the order matches the cart structure exactly
    return `${productId}${formattedMode}${formattedViews}${formattedValidity}${formattedAttempt}${formattedLanguage}${formattedRecording}${formattedBookType}${oldPrice}${newPrice}`;
  };

  const compositeKey = formatCompositeKey(
      productId,
      selectedModel,
      selectedView,
      selectedVariation,
      selectedAttempt,
      selectedLanguage,
      selectedRecording,
      selectedBookType,
      oldPrice,
      newPrice
  );

  console.log("Sending data to backend:", { compositeKey, newQuantity }); // Debugging

  try {
      const response = await fetch(`${BACKEND_URL}/updatecart`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'auth-token': token,
          },
          body: JSON.stringify({ compositeKey, newQuantity }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      console.log('Backend response:', data);

      // Update the state with new quantity
      setCartItems((prevItems) => {
          const updatedItems = { ...prevItems };
          if (updatedItems[compositeKey]) {
              updatedItems[compositeKey] = {
                  ...updatedItems[compositeKey],
                  quantity: newQuantity,
              };
          }

          // Store the updated cart in localStorage
          localStorage.setItem('cart', JSON.stringify(updatedItems));

          return updatedItems;
      });
  } catch (error) {
      console.error("Error in updateQuantity:", error);
  }
};


// Increase and decrease quantity handlers
const increaseQuantity = (productId, selectedModel, selectedView, selectedVariation, selectedAttempt, selectedLanguage, selectedRecording, selectedBookType, oldPrice, newPrice, quantity) => {
  updateQuantity(productId, selectedModel, selectedView, selectedVariation, selectedAttempt, selectedLanguage, selectedRecording, selectedBookType, oldPrice, newPrice, quantity + 1);
};


const decreaseQuantity = (productId, selectedModel, selectedView, selectedVariation, selectedAttempt, selectedLanguage, selectedRecording, selectedBookType, oldPrice, newPrice, quantity) => {
  if (quantity > 1) {
      updateQuantity(productId, selectedModel, selectedView, selectedVariation, selectedAttempt, selectedLanguage, selectedRecording, selectedBookType, oldPrice, newPrice, quantity - 1);
  }
};


const isItemInCart = (
  itemId,
  selectedModel,
  selectedView,
  selectedVariation,
  selectedAttempt,
  selectedLanguage,
  selectedRecording,
  selectedBookType,
  oldPrice,
  newPrice
) => {
  // Format the composite key to ensure consistency
  const formatCompositeKey = (
      productId,
      model,
      view,
      variation,
      attempt,
      language,
      recording,
      bookType,
      oldPrice,
      newPrice
  ) => {
      const formattedModel = model.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      const formattedView = view.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      const formattedVariation = variation.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      const formattedAttempt = attempt.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      const formattedLanguage = language.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      const formattedRecording = recording.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      const formattedBookType = bookType.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

      return `${productId}${formattedModel}${formattedView}${formattedVariation}${formattedAttempt}${formattedLanguage}${formattedRecording}${formattedBookType}${oldPrice}${newPrice}`;
  };

  // Generate the composite key
  const compositeKey = formatCompositeKey(
      itemId,
      selectedModel,
      selectedView,
      selectedVariation,
      selectedAttempt,
      selectedLanguage,
      selectedRecording,
      selectedBookType,
      oldPrice,
      newPrice
  );

  // Check if the item exists in the cart and has a quantity greater than 0
  return cartItems[compositeKey] && cartItems[compositeKey].quantity > 0;
};

  const isItemInWishlist = (itemId) => wishlistItems[itemId] > 0;

  const getTotalCartCount = () => {
    return Object.values(cartItems).filter(item => item.quantity > 0).length; // Count the number of distinct items
  };
  

  const getTotalWishlistCount = () => Object.values(wishlistItems).filter(count => count > 0).length || 0;

  return (
    <ShopContext.Provider
      value={{
        all_products,
        all_faculties,
        all_blogs,
        all_reviews,
        all_sliders,
        all_Content,
        allquestions,
        allusers,
        cartItems,
        buyItems,
        wishlistItems,
        getImageSrcByCode,
        setCartItems,
        addToCart,
        removeFromCart,
        isItemInCart,
        getTotalCartCount,
        addToWishlist,
        removeFromWishlist,
        isItemInWishlist,
        increaseQuantity,
        decreaseQuantity,
        getTotalWishlistCount,
      }}
    >
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;