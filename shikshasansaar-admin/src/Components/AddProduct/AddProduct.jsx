// import React, { useState, useEffect } from 'react';
// import './AddProduct.css';
// import upload_image from '../assets/upload_image.png';

// const AddProduct = () => {
//   const [image, setImage] = useState(null);
//   const [productDetails, setProductDetails] = useState({
//     name: "",
//     image: "",
//     category: "",
//     sub_category: "",
//     lecturer: "",
//     new_price: "",
//     old_price: "",
//     description: "",
//     kit_contents: "",
//     lecture_duration: "",
//     batch_start: "",
//     batch_end: "",
//     ammendment_support: "",
//     validity: "",
//     views: "",
//     mode: "",
//     language: "",
//     study_material: "",
//     doubt_solving: "",
//     technical_support: "",
//     note: "",
//     about_faculty: "",
//     product_link:"",
//   });

 
//   const categorySubCategories = {
//     "CA Final": [
//       "AFM", "Audit", "Direct Tax (DT)", "FR", "Indirect Tax (IDT)", "LAW", "SCMPE"
//     ],
//     "CA Inter": [
//       "Accounts", "Audit", "Direct Tax (DT)", "LAW", "Taxation"
//     ],
//     "CMA Courses": [
//       "CMA Final", "CMA Foundation", "CMA Inter", "Direct Tax (DT)"
//     ],
//     "CS Courses": [
//       "CS Executive", "CS Professional", "CSEET"
//     ],
//     // Add more
//   };

//   const [subCategoryOptions, setSubCategoryOptions] = useState([]);

//   useEffect(() => {
//     const options = categorySubCategories[productDetails.category] || [];
//     setSubCategoryOptions(options);
//   }, [productDetails.category]);

//   const imageHandler = (e) => {
//     setImage(e.target.files[0]);
//     setProductDetails({ ...productDetails, image: e.target.files[0] });
//   };

//   const changeHandler = (e) => {
//     setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
//   };

//   const addProduct = async (e) => {
//     e.preventDefault();
//     console.log(productDetails);

//     let product = { ...productDetails };
//     let responseData;
//     let formData = new FormData();
//     formData.append('product', image);

//     await fetch('http://localhost:4000/upload', {
//       method: 'POST',
//       headers: {
//         Accept: 'application/json'
//       },
//       body: formData,
//     }).then((resp) => resp.json()).then((data) => { responseData = data });

//     if (responseData.success) {
//       product.image = responseData.image_url;
//     }

//     console.log(product);
//     await fetch('http://localhost:4000/addproduct', {
//       method: 'POST',
//       headers: {
//         Accept: 'application/json',
//         'Content-type': 'application/json',
//       },
//       body: JSON.stringify(product)
//     }).then((resp) => resp.json()).then((data) => {
//       data.success ? alert("Product Added!") : alert("Failed!")
//     })
//   };

//   return (
//     <div className="add-product-container">
//       <h1 className="heading">Fill the Below Fields</h1>
//       <form className="add-product-form" onSubmit={addProduct}>
//         <input
//           type="text"
//           name="name"
//           placeholder="Product Name"
//           className="input-field"
//           value={productDetails.name}
//           onChange={changeHandler}
//         />
// <select
//           name="category"
//           className="input-field category-field"
//           value={productDetails.category}
//           onChange={changeHandler}
//         >
//           <option value="" disabled>Select Category</option>
//           <option value="CA Final">CA Final</option>
//           <option value="CA Inter">CA Inter</option>
//           <option value="CMA Courses">CMA Courses</option>
//           <option value="CS Courses">CS Courses</option>
          
//         </select>
//         <select
//           name="sub_category"
//           className="input-field"
//           value={productDetails.sub_category}
//           onChange={changeHandler}
//           disabled={subCategoryOptions.length === 0}
//         >
//           <option value="" disabled>Select Sub-Category</option>
//           {subCategoryOptions.map((subCategory, index) => (
//             <option key={index} value={subCategory}>{subCategory}</option>
//           ))}
//         </select>

//         <input
//           type="text"
//           name="lecturer"
//           placeholder="Lecturer's Name"
//           className="input-field"
//           value={productDetails.lecturer}
//           onChange={changeHandler}
//         />

// <input
//           type="text"
//           name="about_faculty"
//           placeholder="About Lecturer"
//           className="input-field"
//           value={productDetails.about_faculty}
//           onChange={changeHandler}
//         />
//             <input
//           type="text"
//           name="lecture_duration"
//           placeholder="Lecture Duration"
//           className="input-field"
//           value={productDetails.lecture_duration}
//           onChange={changeHandler}
//         />
//         <div style={{ fontSize: '2.5vh', fontWeight: '500', color: '#555' }}>Batch starts on-</div>
//            <input
//           type="date"
//           name="batch_start"
//           placeholder="Batch Start"
//           className="input-field date"
//           value={productDetails.batch_start}
//           onChange={changeHandler}
//         />
//        <div style={{ fontSize: '2.5vh', fontWeight: '500', color: '#555' }}>Batch ends on-</div>
//         <input
//           type="date"
//           name="batch_end"
//           placeholder="Batch End"
//           className="input-field date"
//           value={productDetails.batch_end}
//           onChange={changeHandler}
//         />
//         <textarea
//           name="description"
//           placeholder="Description Of the course"
//           className="input-field description-field"
//           value={productDetails.description}
//           onChange={changeHandler}
//         />
//             <input
//           type="text"
//           name="validity"
//           placeholder="Validity"
//           className="input-field"
//           value={productDetails.validity}
//           onChange={changeHandler}
//         />
//         <input
//           type="text"
//           name="kit_contents"
//           placeholder="Kit Contents"
//           className="input-field"
//           value={productDetails.kit_contents}
//           onChange={changeHandler}
//         />
//         <input
//           type="text"
//           name="ammendment_support"
//           placeholder="Amendment of Support"
//           className="input-field"
//           value={productDetails.ammendment_support}
//           onChange={changeHandler}
//         />
    
//         <input
//           type="text"
//           name="views"
//           placeholder="Views"
//           className="input-field"
//           value={productDetails.views}
//           onChange={changeHandler}
//         />
//         <input
//           type="text"
//           name="mode"
//           placeholder="Mode"
//           className="input-field"
//           value={productDetails.mode}
//           onChange={changeHandler}
//         />
//         <input
//           type="text"
//           name="language"
//           placeholder="Language"
//           className="input-field"
//           value={productDetails.language}
//           onChange={changeHandler}
//         />
//         <input
//           type="text"
//           name="study_material"
//           placeholder="Study Material"
//           className="input-field"
//           value={productDetails.study_material}
//           onChange={changeHandler}
//         />
//         <input
//           type="text"
//           name="doubt_solving"
//           placeholder="Doubt Solving"
//           className="input-field"
//           value={productDetails.doubt_solving}
//           onChange={changeHandler}
//         />
//         <input
//           type="text"
//           name="technical_support"
//           placeholder="Technical Support"
//           className="input-field"
//           value={productDetails.technical_support}
//           onChange={changeHandler}
//         />
//         <input
//           type="text"
//           name="note"
//           placeholder="Additional Notes"
//           className="input-field"
//           value={productDetails.note}
//           onChange={changeHandler}
//         />
     
//         <label htmlFor="product-image" className="custom-file-upload">
//           <img src={image ? URL.createObjectURL(image) : upload_image} alt="please upload image for the product" />
//         </label>
//         <input
//           type="file"
//           id="product-image"
//           accept="image/*"
//           className="input-field file-input"
//           name="image"
//           onChange={imageHandler}
//         />
//         <input
//           type="number"
//           name="old_price"
//           placeholder="Old Price"
//           className="input-field"
//           value={productDetails.old_price}
//           onChange={changeHandler}
//         />
//         <input
//           type="number"
//           name="new_price"
//           placeholder="New Price"
//           className="input-field"
//           value={productDetails.new_price}
//           onChange={changeHandler}
//         />

//          <input
//           type="text"
//           name="product_link"
//           placeholder="Link to the product"
//           className="input-field"
//           value={productDetails.product_link}
//           onChange={changeHandler}
//         />
        
//         <button type="submit" className="submit-button">Add Product</button>
//       </form>
//     </div>
//   );
// };

// export default AddProduct;
import React, { useState } from 'react';
import './AddProduct.css';

const AddProduct = () => {
  const [excelFile, setExcelFile] = useState(null);


  const excelHandler = (e) => {
    setExcelFile(e.target.files[0]);
  };

  const addProduct = async (e) => {
    e.preventDefault();

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    if (!excelFile) {
      alert("Please upload an Excel file.");
      return;
    }

    let formData = new FormData();
    formData.append('file', excelFile);

    let responseData;

    await fetch(`${BACKEND_URL}/addproduct`, {
      method: 'POST',
      headers: {
        Accept: 'application/json', 
      },
      body: formData,
    })
      .then((resp) => resp.json())
      .then((data) => {
        responseData = data;
      });

    if (responseData && responseData.success) {
      alert('Products added successfully!');
    } else {
      alert('Failed to add products!');
    }
  };

  return (
    <div className="add-product-container">
      <h1 className="heading">Upload Excel File to Add Products</h1>
      <form className="add-product-form" onSubmit={addProduct}>
        <input
          type="file"
          id="excel-file"
          accept=".xlsx, .xls"
          className="inputfield fileinput"
          name="excel"
          onChange={excelHandler}
        />
        <button type="submit" className="submit-button">Add Products</button>
      </form>
    </div>
  );
};

export default AddProduct;
