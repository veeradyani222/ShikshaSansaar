import React, { useEffect, useState } from 'react';
import './ListProduct.css';
import cross_icon from '../assets/cart_cross_icon.png';

const ListProduct = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [all_productimages, setall_productimages] = useState([]);
  const [editingProduct, setEditingProduct] = useState({
    specifications: [], // Always initialize as an array
  });



  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchInfo = async () => {
    const response = await fetch(`${BACKEND_URL}/allproducts`);
    const data = await response.json();
    setAllProducts(data);
  };

  useEffect(() => {
    fetchInfo();
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

  const handleRemove = async (id) => {
    await fetch(`${BACKEND_URL}/removeproduct`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ id: id }),
    });
    await fetchInfo();
  };

  const handleEdit = (product) => {
    setEditingProduct({ ...product }); // Clone the product into editing state
  };

  const handleInputChange = (e, field) => {
    const value = e.target.value;

    if (field === 'specifications') {
      const specificationsArray = value
        .split(',') // Split on commas
        .map((item) => item.trim()) // Remove extra spaces
        .filter((item) => item); // Remove empty strings

      setEditingProduct({ ...editingProduct, [field]: specificationsArray });
    } else {
      setEditingProduct({ ...editingProduct, [field]: value });
    }
  };



  const handleSave = async () => {
    await fetch(`${BACKEND_URL}/updateproduct`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: { id: editingProduct.id },  // Assuming you are using `id` to identify the product
        updateData: { ...editingProduct },
      }),
    });
    setEditingProduct(null);
    fetchInfo(); // Refresh the list
  };

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter') {
      await handleSave();
    }
  };



  return (
    <div className="list-product">
      <div className="list-product-head">
        <p className='heighteditingproduct'  >Product Name</p>
        <p className='heighteditingproduct'  >ID</p>
        <p className='heighteditingproduct'  >Image</p>
        <p className='heighteditingproductimage'  >Image Code</p>
        <p className='heighteditingproduct'  >Category</p>
        <p className='heighteditingproduct'  >Sub-category</p>
        <p className='heighteditingproduct'  >Lecturer</p>
        <p className='heighteditingproduct'  >New Price</p>
        <p className='heighteditingproduct'  >Old Price</p>
        <p className='heighteditingproduct'  >Kit Contents</p>
        <p className='heighteditingproduct'  >Lecture Duration</p>
        <p className='heighteditingproduct'  >Amendment Support</p>
        <p className='heighteditingproduct'  >Doubt Solving</p>
        <p className='heighteditingproduct'  >Technical Support</p>
        <p className='heighteditingproduct'  >Note</p>
        <p className='heighteditingproduct'  >About Faculty</p>
        <p className='heighteditingproduct'  >Specifications</p>
        <p className='heighteditingproduct'  >Demo Link</p>
        <p className='heighteditingproduct'  >Tag</p>
        <p className='heighteditingproduct'  >Hide</p>
        <p className='heighteditingproduct'  >Offer</p>
        <p className='heighteditingproduct'  >Date</p>
        <p className='heighteditingproduct'  >Available</p>
        <p className='heighteditingproduct'  >Subject</p>
        <p className='heighteditingproduct'  >Lecture Number</p>
        <p className='heighteditingproduct'  >Study Material Type</p>
        <p className='heighteditingproduct'  >Batch Type</p>
        <p className='heighteditingproduct'  >Topics Covered</p>
        <p className='heighteditingproduct'  >Mode Description</p>
        <p className='heighteditingproduct'  >Views Extension</p>
        <p className='heighteditingproduct'  >Validity Start</p>
        <p className='heighteditingproduct'  >Validity Explanation</p>
        <p className='heighteditingproduct'  >Video Runs On</p>
        <p className='heighteditingproduct'  >Internet Connectivity</p>
        <p className='heighteditingproduct'  >System Requirement</p>
        <p className='heighteditingproduct'  >Processing Time</p>
        <p className='heighteditingproduct'  >Pro Library Benefits</p>
        <p className='heighteditingproduct'  >Actions</p>
      </div>
      <div className="list-product-main">
        <hr />
        {allProducts.map((product, index) => (
          <div key={index} className="list-product-format-main list-product-format">
            {editingProduct?.id === product.id ? (
              <>
                <textarea
                  className='editingProductinput'
                  value={editingProduct.name}
                  onChange={(e) => handleInputChange(e, 'name')}
                  onKeyPress={handleKeyPress}
                />

                <input
                  value={editingProduct.id}
                  readOnly
                  className='editingProductinput'
                />

<p className='heighteditingproduct'><img  src={getImageSrcByCode(product.image_code)} alt="Product" /></p>

                <input
                  value={editingProduct.image_code}
                  onChange={(e) => handleInputChange(e, 'image_code')}
                  onKeyPress={handleKeyPress}
                  className='editingProductinput'
                />

                <input
                  value={editingProduct.category}
                  onChange={(e) => handleInputChange(e, 'category')}
                  onKeyPress={handleKeyPress}
                  className='editingProductinput'
                />

                <input
                  value={editingProduct.sub_category}
                  onChange={(e) => handleInputChange(e, 'sub_category')}
                  onKeyPress={handleKeyPress}
                  className='editingProductinput'
                />

                <input
                  value={editingProduct.lecturer}
                  onChange={(e) => handleInputChange(e, 'lecturer')}
                  onKeyPress={handleKeyPress}
                  className='editingProductinput'
                />

                <input
                  value={editingProduct.new_price}
                  onChange={(e) => handleInputChange(e, 'new_price')}
                  onKeyPress={handleKeyPress}
                  className='editingProductinput'
                />

                <input
                  value={editingProduct.old_price}
                  onChange={(e) => handleInputChange(e, 'old_price')}
                  onKeyPress={handleKeyPress}
                  className='editingProductinput'
                />

                <input
                  value={editingProduct.kit_contents}
                  onChange={(e) => handleInputChange(e, 'kit_contents')}
                  onKeyPress={handleKeyPress}
                  className='editingProductinput'
                />

                <input
                  value={editingProduct.lecture_duration}
                  onChange={(e) => handleInputChange(e, 'lecture_duration')}
                  onKeyPress={handleKeyPress}
                  className='editingProductinput'
                />

                <input
                  value={editingProduct.ammendment_support}
                  onChange={(e) => handleInputChange(e, 'ammendment_support')}
                  onKeyPress={handleKeyPress}
                  className='editingProductinput'
                />

                <input
                  value={editingProduct.study_material_type}
                  onChange={(e) => handleInputChange(e, 'study_material_type')}
                  onKeyPress={handleKeyPress}
                  className='editingProductinput'
                />

                <input
                  value={editingProduct.doubt_solving}
                  onChange={(e) => handleInputChange(e, 'doubt_solving')}
                  onKeyPress={handleKeyPress}
                  className='editingProductinput'
                />

                <input
                  value={editingProduct.technical_support}
                  onChange={(e) => handleInputChange(e, 'technical_support')}
                  onKeyPress={handleKeyPress}
                  className='editingProductinput'
                />

                <input
                  value={editingProduct.note}
                  onChange={(e) => handleInputChange(e, 'note')}
                  onKeyPress={handleKeyPress}
                  className='editingProductinput'
                />

                <textarea
                  value={editingProduct.about_faculty}
                  onChange={(e) => handleInputChange(e, 'about_faculty')}
                  onKeyPress={handleKeyPress}
                  className='editingProductinput'
                />

                <textarea
                  value={Array.isArray(editingProduct.specifications) ? editingProduct.specifications.join(', ') : ''}
                  onChange={(e) => handleInputChange(e, 'specifications')}
                  className='editingProductinput'
                  placeholder='Enter specifications separated by commas'
                />

                <input
                  value={editingProduct.demo_link}
                  onChange={(e) => handleInputChange(e, 'demo_link')}
                  onKeyPress={handleKeyPress}
                  className='editingProductinput'
                />

                <input
                  value={editingProduct.tag}
                  onChange={(e) => handleInputChange(e, 'tag')}
                  onKeyPress={handleKeyPress}
                  className='editingProductinput'
                />

                <input
                  value={editingProduct.hide}
                  onChange={(e) => handleInputChange(e, 'hide')}
                  onKeyPress={handleKeyPress}
                  className='editingProductinput'
                />

                <input
                  value={editingProduct.offer}
                  onChange={(e) => handleInputChange(e, 'offer')}
                  onKeyPress={handleKeyPress}
                  className='editingProductinput'
                />

                <input
                  value={editingProduct.date}
                  readOnly
                  className='editingProductinput'
                />

                <input
                  value={editingProduct.available ? 'Available' : 'Not Available'}
                  readOnly
                  className='editingProductinput'
                />

                <input
                  value={editingProduct.subject}
                  onChange={(e) => handleInputChange(e, 'subject')}
                  onKeyPress={handleKeyPress}
                  className='editingProductinput'
                />

                <input
                  value={editingProduct.lecture_number}
                  onChange={(e) => handleInputChange(e, 'lecture_number')}
                  onKeyPress={handleKeyPress}
                  className='editingProductinput'
                />

                <input
                  value={editingProduct.batch_type}
                  onChange={(e) => handleInputChange(e, 'batch_type')}
                  onKeyPress={handleKeyPress}
                  className='editingProductinput'
                />

                <input
                  value={editingProduct.topics_covered}
                  onChange={(e) => handleInputChange(e, 'topics_covered')}
                  onKeyPress={handleKeyPress}
                  className='editingProductinput'
                />

                <input
                  value={editingProduct.mode_description}
                  onChange={(e) => handleInputChange(e, 'mode_description')}
                  onKeyPress={handleKeyPress}
                  className='editingProductinput'
                />

                <input
                  value={editingProduct.views_extension}
                  onChange={(e) => handleInputChange(e, 'views_extension')}
                  onKeyPress={handleKeyPress}
                  className='editingProductinput'
                />

                <input
                  value={editingProduct.validity_start}
                  onChange={(e) => handleInputChange(e, 'validity_start')}
                  onKeyPress={handleKeyPress}
                  className='editingProductinput'
                />

                <input
                  value={editingProduct.validity_explanation}
                  onChange={(e) => handleInputChange(e, 'validity_explanation')}
                  onKeyPress={handleKeyPress}
                  className='editingProductinput'
                />

                <input
                  value={editingProduct.video_runs_on}
                  onChange={(e) => handleInputChange(e, 'video_runs_on')}
                  onKeyPress={handleKeyPress}
                  className='editingProductinput'
                />

                <input
                  value={editingProduct.internet_connectivity}
                  onChange={(e) => handleInputChange(e, 'internet_connectivity')}
                  onKeyPress={handleKeyPress}
                  className='editingProductinput'
                />

                <input
                  value={editingProduct.system_requirement}
                  onChange={(e) => handleInputChange(e, 'system_requirement')}
                  onKeyPress={handleKeyPress}
                  className='editingProductinput'
                />

                <input
                  value={editingProduct.processing_time}
                  onChange={(e) => handleInputChange(e, 'processing_time')}
                  onKeyPress={handleKeyPress}
                  className='editingProductinput'
                />

                <input
                  value={editingProduct.pro_library_benefits}
                  onChange={(e) => handleInputChange(e, 'pro_library_benefits')}
                  onKeyPress={handleKeyPress}
                  className='editingProductinput'
                />

                <button onClick={() => handleSave()}>Save</button>
              </>
            ) : (
              <>
                <p className='heighteditingproduct' onClick={() => handleEdit(product)}>{product.name}</p>
                <p className='heighteditingproduct' >{product.id}</p>
                <p className='heighteditingproduct'><img  src={getImageSrcByCode(product.image_code)} alt="Product" /></p>
                <p className='heighteditingproduct' onClick={() => handleEdit(product)}>{product.image_code}</p>
                <p className='heighteditingproduct' onClick={() => handleEdit(product)}>{product.category}</p>
                <p className='heighteditingproduct' onClick={() => handleEdit(product)}>{product.sub_category}</p>
                <p className='heighteditingproduct' onClick={() => handleEdit(product)}>{product.lecturer}</p>
                <p className='heighteditingproduct' onClick={() => handleEdit(product)}>₹{product.new_price}</p>
                <p className='heighteditingproduct' onClick={() => handleEdit(product)}>₹{product.old_price}</p>
                <p className='heighteditingproduct' onClick={() => handleEdit(product)}>{product.kit_contents}</p>
                <p className='heighteditingproduct' onClick={() => handleEdit(product)}>{product.lecture_duration}</p>
                <p className='heighteditingproduct' onClick={() => handleEdit(product)}>{product.ammendment_support}</p>
                <p className='heighteditingproduct' onClick={() => handleEdit(product)}>{product.doubt_solving}</p>
                <p className='heighteditingproduct' onClick={() => handleEdit(product)}>{product.technical_support}</p>
                <p className='heighteditingproduct' onClick={() => handleEdit(product)}>{product.note}</p>
                <p className='heighteditingproduct' onClick={() => handleEdit(product)}>{product.about_faculty}</p>
                <p className='heighteditingproduct' onClick={() => handleEdit(product)}>{product.specifications.join("\n")}</p>
                <p className='heighteditingproduct' onClick={() => handleEdit(product)}>{product.demo_link}</p>
                <p className='heighteditingproduct' onClick={() => handleEdit(product)}>{product.tag}</p>
                <p className='heighteditingproduct' onClick={() => handleEdit(product)}>{product.hide}</p>
                <p className='heighteditingproduct' onClick={() => handleEdit(product)}>{product.offer}</p>
                <p className='heighteditingproduct' onClick={() => handleEdit(product)}>{product.date}</p>
                <p className='heighteditingproduct' onClick={() => handleEdit(product)}>{product.available}</p>
                <p className='heighteditingproduct' onClick={() => handleEdit(product)}>{product.subject}</p>
                <p className='heighteditingproduct' onClick={() => handleEdit(product)}>{product.lecture_number}</p>
                <p className='heighteditingproduct' onClick={() => handleEdit(product)}>{product.study_material_type}</p>
                <p className='heighteditingproduct' onClick={() => handleEdit(product)}>{product.batch_type}</p>
                <p className='heighteditingproduct' onClick={() => handleEdit(product)}>{product.topics_covered}</p>
                <p className='heighteditingproduct' onClick={() => handleEdit(product)}>{product.mode_description}</p>
                <p className='heighteditingproduct' onClick={() => handleEdit(product)}>{product.views_extension}</p>
                <p className='heighteditingproduct' onClick={() => handleEdit(product)}>{product.validity_start}</p>
                <p className='heighteditingproduct' onClick={() => handleEdit(product)}>{product.validity_explanation}</p>
                <p className='heighteditingproduct' onClick={() => handleEdit(product)}>{product.video_runs_on}</p>
                <p className='heighteditingproduct' onClick={() => handleEdit(product)}>{product.internet_connectivity}</p>
                <p className='heighteditingproduct' onClick={() => handleEdit(product)}>{product.system_requirement}</p>
                <p className='heighteditingproduct' onClick={() => handleEdit(product)}>{product.processing_time}</p>
                <p className='heighteditingproduct' onClick={() => handleEdit(product)}>{product.pro_library_benefits}</p>
                <button onClick={() => handleRemove(product.id)}>
                  <img src={cross_icon} alt="Remove" />
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListProduct;
