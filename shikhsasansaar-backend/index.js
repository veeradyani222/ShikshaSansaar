const port = process.env.PORT || 4000;
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require('fs');
const xlsx = require('xlsx');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cloudinary = require('cloudinary').v2;
const Razorpay = require("razorpay");
const bcrypt = require('bcrypt');
const twilio = require('twilio');
require('dotenv').config();



app.use(bodyParser.json());
app.use(express.json({ limit: '10mb' }));
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});



// Middleware for parsing URL-encoded bodies with a size limit

app.use(express.urlencoded({ limit: '10mb', extended: true }));



app.use(cors());

// MongoDB connection
mongoose.connect('mongodb+srv://veeradyani2:S%40nju_143@cluster0.uafyz.mongodb.net/pro-library?retryWrites=true&w=majority');


app.get("/", (req, res) => {
    res.send("Express app is running");
});

// Multer configuration for image upload
const uploadPath = path.join('/tmp', 'upload', 'images');

// Ensure the `/tmp/upload/images` directory exists
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true }); // Create the directory if it doesn't exist
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath); // Use the writable `/tmp` directory
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueSuffix); // Generate a unique filename
    },
});

const upload = multer({ storage: storage });


app.use('/images', express.static(path.join(__dirname, 'upload/images')));


// Endpoint for uploading product images
app.post("/upload", upload.single('product'), (req, res) => {
    cloudinary.uploader.upload(req.file.path, (error, result) => {
        if (error) {
            return res.status(500).json({ success: 0, message: "Image upload failed", error });
        }

        res.json({
            success: 1,
            image_url: result.secure_url // Use the secure URL provided by Cloudinary
        });
    });
});


// For faculty

app.post("/upload-faculty", upload.single('image'), (req, res) => {
    const path = req.file.path; // Get the path of the uploaded file (from multer)

    // Upload the image to Cloudinary
    cloudinary.uploader.upload(path, { folder: "faculty_images" }, (error, result) => {
        if (error) {
            console.error("Error uploading to Cloudinary:", error);
            return res.status(500).json({ success: 0, message: "Image upload failed" });
        }

        // Respond with the Cloudinary image URL
        res.json({
            success: 1,
            image_url: result.secure_url // This is the persistent Cloudinary URL
        });
    });
});
//For Orders
// Endpoint for uploading order images
app.post("/upload-order", upload.single('order'), (req, res) => {
    cloudinary.uploader.upload(req.file.path, (error, result) => {
        if (error) {
            return res.status(500).json({ success: 0, message: "Image upload failed", error });
        }
        res.json({
            success: 1,
            image_url: result.secure_url // Returns secure Cloudinary URL
        });
    });
});

// Endpoint for uploading product images
app.post("/upload-product-image", upload.single('image'), (req, res) => {
    cloudinary.uploader.upload(req.file.path, (error, result) => {
        if (error) {
            return res.status(500).json({ success: 0, message: "Image upload failed", error });
        }

        res.json({
            success: 1,
            image_url: result.secure_url // Use the secure URL provided by Cloudinary
        });
    });
});



// For faculty

// app.post("/upload-faculty", upload.single('image'), (req, res) => {

//     fs.readFile(req.file.path, (err, data) => {
//         if (err) {
//             console.error("Error reading file:", err);
//             return res.status(500).json({ error: "Failed to process image" });
//         }

//         // Convert the file data to a base64 string
//         const base64Image = Buffer.from(data).toString('base64');
//         const mimeType = req.file.mimetype; // Get the MIME type of the image
//         const base64String = `data:${mimeType};base64,${base64Image}`;

//         // Optionally, delete the file after conversion
//         fs.unlink(req.file.path, (err) => {
//             if (err) {
//                 console.error("Error deleting file:", err);
//             }
//         });

//         // Send the base64 string as the response
//         res.json({
//             success: 1,
//             image_url: base64String
//         });
//     });
// });


const SliderImages = mongoose.model("SliderImages", new mongoose.Schema({
    id: { type: Number, required: true },  // 
    image: { type: String, required: true },
    date: { type: Date, default: Date.now },
}));

app.post('/addSliderImages', upload.single('image'), async (req, res) => {
    try {
        // Upload the image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);

        const lastSliderImages = await SliderImages.findOne({}, {}, { sort: { id: -1 } });
        const id = lastSliderImages ? lastSliderImages.id + 1 : 1;

        // Create a new SliderImages document with the Cloudinary image URL
        const sliderImages = new SliderImages({
            id: id,
            image: result.secure_url, // Use the secure URL from Cloudinary
        });

        // Save the new product in the database
        await sliderImages.save();

        res.json({
            success: true,
            image: sliderImages.image,
        });
    } catch (error) {
        console.error("Error saving slider image:", error);
        res.status(500).json({ error: "Failed to add slider image" });
    }
});


app.get('/allsliderImages', async (req, res) => {
    let sliderImages = await SliderImages.find({});
    res.send(sliderImages);
});

app.post('/removeslider', async (req, res) => {
    try {
        const result = await SliderImages.findOneAndDelete({ id: req.body.id });

        if (!result) {
            return res.status(404).json({ success: false, message: 'Image not found' });
        }

        res.json({
            success: true,
            message: 'Image removed successfully',
            id: req.body.id,
        });
    } catch (error) {
        console.error("Error removing image:", error);
        res.status(500).json({ success: false, error: "Failed to remove image" });
    }
});
//Schema for Product Imaegs

const ProductImage = mongoose.model("ProductImage", new mongoose.Schema({
    id: { type: Number, required: true },
    image_code: { type: String, required: true },
    image: { type: String, required: true },
    date: { type: Date, default: Date.now },
}));

// Endpoint for adding a product image
app.post('/addProductImage', upload.single('image'), async (req, res) => {
    try {
        // Fetch the last product by id
        const lastProductImage = await ProductImage.findOne({}, {}, { sort: { id: -1 } });
        const id = lastProductImage ? lastProductImage.id + 1 : 1;

        // Create a new product image with data from the request
        const product_image = new ProductImage({
            id: id,
            image_code: req.body.image_code,
            image: req.body.image,
        });

        // Save the new product image in the database
        await product_image.save();

        res.json({
            success: true,
            name: req.body.name,
        });
    } catch (error) {
        console.error("Error saving product image:", error);
        res.status(500).json({ error: "Failed to add product image" });
    }
});

// Endpoint to get all product images
app.get('/allProductImages', async (req, res) => {
    let product_image = await ProductImage.find({}).sort({ date: -1 });
    res.send(product_image);
});

// Endpoint for removing a product image
app.post('/removeProductImage', async (req, res) => {
    await ProductImage.findOneAndDelete({ id: req.body.id });

    res.json({
        success: true,
        name: req.body.name,
    });
});


// Define the schema
const ProductSchema = new mongoose.Schema({
    id: { type: String, required: false },
    name: { type: String, required: false },
    image: { type: String, required: false },
    image_code: { type: String, required: false },
    category: { type: String, required: false },
    sub_category: { type: String, required: false },
    lecturer: { type: String, required: false },
    new_price: { type: Number, required: false },
    old_price: { type: Number, required: false },
    kit_contents: { type: String, required: false },
    lecture_duration: { type: String, required: false },
    ammendment_support: { type: String, required: false },
    doubt_solving: { type: String, required: false },
    technical_support: { type: String, required: false },
    note: { type: String, required: false },
    about_faculty: { type: String, required: false },
    specifications: { type: [String], required: false }, // Updated: Array of variations
    demo_link: { type: String, default: null },
    tag: { type: String, default: null },
    hide: { type: Boolean, default: false },
    offer: { type: String, default: null },
    date: { type: Date, default: Date.now },
    reviews: [
        {
            user: { type: String, required: true },
            email: { type: String, required: true },
            rating: { type: Number, required: true, min: 1, max: 5 },
            comment: { type: String, required: true },
            date: { type: Date, default: Date.now },
        },
    ],
    available: { type: Boolean, default: true },
    subject: { type: String, required: false },
    lecture_number: { type: String, required: false },
    study_material_type: { type: String, required: false },
    batch_type: { type: String, required: false },
    topics_covered: { type: String, required: false },
    mode_description: { type: String, required: false },
    views_extension: { type: String, required: false },
    validity_start: { type: String, required: false },
    validity_explanation: { type: String, required: false },
    video_runs_on: { type: String, required: false },
    internet_connectivity: { type: String, required: false },
    system_requirement: { type: String, required: false },
    processing_time: { type: String, required: false },
    pro_library_benefits: { type: String, required: false },
});


// Middleware to update the image field when image_code changes
ProductSchema.pre('save', async function (next) {
    if (this.isModified('image_code')) {
        try {
            const productImage = await ProductImage.findOne({ image_code: this.image_code });
            if (!productImage) {
                throw new Error(`No image found for image_code: ${this.image_code}`);
            }
            this.image = productImage.image;
        } catch (error) {
            return next(error);
        }
    }
    next();
});

// Virtual for calculating average rating
ProductSchema.virtual('main_review').get(function () {
    if (!this.reviews.length) return null;
    const totalRating = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    return (totalRating / this.reviews.length).toFixed(1);
});

// Include virtuals in JSON responses
ProductSchema.set('toJSON', { virtuals: true });
ProductSchema.set('toObject', { virtuals: true });

const Product = mongoose.model('Product', ProductSchema);


// Route to add a review
app.post('/api/products/:id/reviews', async (req, res) => {
    try {
        const productId = req.params.id;
        const { user, email, rating, comment } = req.body;

        if (!user || !email || !rating || !comment) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const product = await Product.findOne({ id: productId });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.reviews.push({
            user,
            email,
            rating: parseInt(rating, 10),
            comment,
            date: new Date()
        });

        await product.save();
        res.status(201).json({ message: 'Review added successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to get all reviews for a specific product
app.get('/api/products/:id/reviews', async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findOne({ id: productId }, 'reviews');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product.reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/addproduct', upload.single('file'), async (req, res) => {
    try {
        const filePath = req.file.path;
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // Fetch existing images
        const allProductImages = await ProductImage.find();
        const imageMap = {};
        allProductImages.forEach((image) => {
            imageMap[image.image_code] = image.image;
        });

        const productMap = new Map();

        for (const row of sheetData) {
            try {
                // Validate required fields: only 'name' is required
                if (!row.name) {
                    throw new Error(`Missing product name for row: ${JSON.stringify(row)}`);
                }

                // Use product name for grouping
                const productName = row.name.toLowerCase().trim();

                // Determine the image URL: use image_code if provided, else fallback to default
                const imageUrl = row.image_code ? imageMap[row.image_code] || 'default-placeholder-image.jpg' : 'default-placeholder-image.jpg';

                // Check for direct specifications column; split it into an array if present
                // Process specifications field
                let processedSpecifications = [];

                if (row.specifications) {
                    // Split specifications into separate strings and clean up extra whitespace
                    processedSpecifications = row.specifications
                        .split(',')
                        .map((spec) => spec.trim()) // Trim whitespace
                        .filter((spec) => spec.length > 0); // Remove empty strings
                } else {
                    // Fallback to dynamically generating specifications if not explicitly provided
                    const dynamicSpec = [
                        row.mode,
                        row.validity,
                        row.views,
                        row.attempt,
                        row.bookType,
                        row.language,
                        row.recording,
                        row.newPrice,
                        row.oldPrice,
                        row.link,
                    ]
                        .filter((field) => field) // Remove undefined or null fields
                        .join('-');

                    if (dynamicSpec) {
                        processedSpecifications.push(dynamicSpec);
                    }
                }

                // Add or update product in the map
                if (!productMap.has(productName)) {
                    const uniqueId = `${row.name.replace(/\s+/g, '-').toLowerCase()}-${new mongoose.Types.ObjectId()}`;

                    productMap.set(productName, {
                        id: uniqueId,
                        name: row.name,
                        image: imageUrl,
                        image_code: row.image_code,
                        category: row.category || 'specified later',
                        sub_category: row.sub_category || 'specified later',
                        lecturer: row.lecturer || 'specified later',
                        new_price: row.new_price || 0,
                        old_price: row.old_price || 0,
                        kit_contents: row.kit_contents || 'Not specified',
                        lecture_duration: row.lecture_duration || 'specified later',
                        ammendment_support: row.ammendment_support || 'Online Via text or phone',
                        doubt_solving: row.doubt_solving || 'Via dedicated WhatsApp group and call',
                        technical_support: row.technical_support || 'Available',
                        note: row.note || 'Not specified',
                        about_faculty: row.about_faculty || 'The Above mentioned faculty are masters of their respective fields, with extensive experience in the education fields, they perfectly solve the doubts of their students and deliver great results',
                        demo_link: row.link || null,
                        specifications: [], // Initialize empty specifications array
                        tag: row.tag || null,
                        offer: row.offer || null,
                        hide: row.hide === 'true',
                        available: row.available === 'true',
                        subject: row.subject || 'specified later',
                        lecture_number: row.lecture_number || 'specified later',
                        study_material_type: row.study_material_type || 'specified later',
                        batch_type: row.batch_type || 'specified later',
                        topics_covered: row.topics_covered || 'All',
                        mode_description: row.mode_description || 'specified later',
                        views_extension: row.views_extension || 'Possible on chargeable basis',
                        validity_start: row.validity_start || 'From the date of activation',
                        validity_explanation: row.validity_explanation || 'specified later',
                        video_runs_on: row.video_runs_on || 'Windows Laptop and Android mobile',
                        internet_connectivity: row.internet_connectivity || 'For Pen Drive Mode Internet Required Only at the Time of Activation / For Google Drive Mode Internet Required For Downloading Lecture / For Live Mode Internet All Time Required While Watching Lecture',
                        system_requirement: row.name.toLowerCase().includes('dt')
                            ? `# For DT\n
# Android Version (Google Drive Option and Pendrive Option):\n
- Once installed on a particular Laptop or Mobile, the same cannot be used on a different device.\n
- Simultaneous login on both Android App and Laptop is not permitted.\n
- The machine on which the application is installed once cannot be changed.\n\n
# Google Drive and Pendrive:\n
- It can be played on LAPTOP Only.\n
- It will run only on Windows OS.\n
- It will run only on Windows 8.1 or 10 or above.\n\n
# Mobile Android ONLY:\n
- It will NOT Run on MOTOROLA devices.\n
- Android version 7.0 or higher will be required.\n
- 3 GB RAM and 32 GB Internal Memory At least will be Required.`
                            : row.name.toLowerCase().includes('idt')
                                ? `# For IDT\n
# Windows Laptop:\n
- Supported OS: Windows 8, 8.1 & 10.\n
- Intel Core i3, 2.0 GHz.\n
- 4GB RAM.\n
- 20% Free space on C Drive.\n\n
# Android Devices:\n
- Android version 6 & above.\n
- Motorola Mobile/Tablet or Rooted devices are NOT supported.\n\n
# Apple Devices:\n
- Not supported on MAC, Apple PC or Tablet.\n\n
# Video Player - Vsmart Unified Player:\n
1. You can switch From one to another device (Laptop to Phone or Phone to Laptop) with unified player option.\n
2. Video lectures can be played on your:\n   - Windows Laptop.\n   - Android Phone/Tablet.\n3. You can watch the lectures on any ONE device at a time.`
                                : 'Not specified',

                        processing_time: row.processing_time || 'Within 24 to 48 Working Hours',
                        pro_library_benefits: row.pro_library_benefits || `1. One Stop Solution For Books, Lectures, Test Series and Mentoring.\n
2. Free shipping on all orders.\n
3. Dedicated After-Sale Support.`,
                    });
                }

                // Append the specification to the existing product's specifications array
                productMap.get(productName).specifications.push(...processedSpecifications);
            } catch (error) {
                console.warn(`Skipping product due to error: ${error.message}`);
                continue; // Skip this row and move to the next
            }
        }

        // Save all valid products to the database
        const products = Array.from(productMap.values());
        await Product.insertMany(products);

        res.json({ success: true, products });
    } catch (error) {
        console.error('Error adding products:', error);
        res.status(500).json({ error: 'Failed to add products. Check logs for more details.' });
    }
});


// Route to get all products
app.get('/allproducts', async (req, res) => {
    try {
        let products = await Product.find({}).sort({ date: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

// Endpoint for removing a product
app.post('/removeproduct', async (req, res) => {
    try {
        await Product.findOneAndDelete({ id: req.body.id });
        res.json({ success: true, name: req.body.name });
    } catch (error) {
        res.status(500).json({ error: "Failed to remove product" });
    }
});

app.put('/updateproduct', async (req, res) => {
    try {
        const { filter, updateData } = req.body;

        if (!filter || !updateData) {
            return res.status(400).json({ message: 'Filter and update data are required' });
        }

        // Find the product by ID or other criteria and update it
        const product = await Product.findOneAndUpdate(filter, updateData, { new: true });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


//OFFLINE ORDERS CREATION

const Order = mongoose.model("Order", new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true }, // Your Name
    email: { type: String, required: true }, // Your Email
    mobile: { type: String, required: true }, // Your Mobile No (only 10 Digit)
    subject: { type: String, required: true }, // Subject
    postal_address: { type: String, required: true }, // Postal Address
    state: { type: String, required: true }, // State
    city: { type: String, required: true }, // City
    pin_code: { type: String, required: true }, // Pin Code (only 6 Digit)
    faculty: { type: String, required: true }, // Faculty
    course_level: { type: String, required: true }, // Course Level
    course_type: { type: String, required: true }, // Course Type
    mode_of_lectures: { type: String, required: true }, // Mode Of Lectures
    exam_attempt_month: { type: String, required: true }, // Exam Attempt Month
    exam_attempt_year: { type: String, required: true }, // Exam Attempt Year
    product_mrp: { type: Number, required: true }, // Product MRP
    amount_paid: { type: Number, required: true }, // Amount Paid
    amount_due: { type: Number, required: true }, // Amount Due
    mode_of_payment: { type: String, required: true }, // Mode Of Payment
    upi_merchant_name: { type: String }, // UPI Merchant Name
    paid_to: { type: String }, // Paid To (Person Name/Agent Name)
    image: { type: String }, // Payment Screen Shot
    date: { type: Date, default: Date.now }, // Date
    available: { type: Boolean, default: true } // Available
}));



// Endpoint for adding an order
app.post('/addorder', upload.single('image'), async (req, res) => {
    try {
        const lastOrder = await Order.findOne({}, {}, { sort: { id: -1 } });
        const id = lastOrder ? lastOrder.id + 1 : 1;

        const order = new Order({
            id: id,
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            subject: req.body.subject,
            postal_address: req.body.postal_address,
            state: req.body.state,
            city: req.body.city,
            pin_code: req.body.pin_code,
            faculty: req.body.faculty,
            course_level: req.body.course_level,
            course_type: req.body.course_type,
            mode_of_lectures: req.body.mode_of_lectures,
            exam_attempt_month: req.body.exam_attempt_month,
            exam_attempt_year: req.body.exam_attempt_year,
            product_mrp: req.body.product_mrp,
            amount_paid: req.body.amount_paid,
            amount_due: req.body.amount_due,
            mode_of_payment: req.body.mode_of_payment,
            upi_merchant_name: req.body.upi_merchant_name,
            paid_to: req.body.paid_to,
            image: req.body.image, // Receives Cloudinary URL from frontend
        });

        await order.save();
        res.json({ success: true, name: req.body.name });
    } catch (error) {
        console.error("Error saving order:", error);
        res.status(500).json({ error: "Failed to add order" });
    }
});


app.get('/allorders', async (req, res) => {
    let orders = await Order.find({}).sort({ date: -1 });
    res.send(orders);
});



// Endpoint for removing a product
app.post('/removeorder', async (req, res) => {
    await Order.findOneAndDelete({ id: req.body.id });

    res.json({
        success: true,
        name: req.body.name,
    });
});

//Quote Your Price

//QUERIES

const Query = mongoose.model("Query", new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true }, // Your Name
    email: { type: String, required: true }, // Your Email
    mobile: { type: String, required: true }, // Your Mobile No (only 10 Digit)
    orderid:{ type: String, required: true },
    issue:{ type: String, required: true },
    image: { type: String },
    date: { type: Date, default: Date.now }, // Date
    available: { type: Boolean, default: true } // Available
}));



// Endpoint for adding an order
app.post('/addquery', upload.single('image'), async (req, res) => {
    try {
        const lastQuery = await Query.findOne({}, {}, { sort: { id: -1 } });
        const id = lastQuery ? lastQuery.id + 1 : 1;

        const query = new Query({
            id: id,
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            orderid:req.body.orderid,
            issue:req.body.issue,
            image: req.body.image, 
        });

        await query.save();
        res.json({ success: true, name: req.body.name });
    } catch (error) {
        console.error("Error saving order:", error);
        res.status(500).json({ error: "Failed to add order" });
    }
});


app.get('/allorders', async (req, res) => {
    let orders = await Order.find({}).sort({ date: -1 });
    res.send(orders);
});



// Endpoint for removing a product
app.post('/removeorder', async (req, res) => {
    await Order.findOneAndDelete({ id: req.body.id });

    res.json({
        success: true,
        name: req.body.name,
    });
});



const QuoteYourPrice = mongoose.model("QuoteYourPrice", new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile_number: { type: String, required: true },
    seller: { type: String, required: true },
    quotedprice: { type: String, required: true },
    productname: { type: String, required: true },
    productid: { type: String, required: true },
    image: { type: String, required: false }, // Image URL or path
    date: { type: Date, default: Date.now },
}));

// Endpoint for adding a quote with an image
app.post('/addQuoteYourPrice', upload.single('image'), async (req, res) => {
    try {
        const lastQuote = await QuoteYourPrice.findOne({}, {}, { sort: { id: -1 } });
        const id = lastQuote ? lastQuote.id + 1 : 1;

        const quote = new QuoteYourPrice({
            id: id,
            name: req.body.name,
            email: req.body.email,
            mobile_number: req.body.mobile_number,
            seller: req.body.seller,
            quotedprice: req.body.quotedprice,
            productname: req.body.productname,
            productid: req.body.productid,
            image: req.body.image || null,
        });

        await quote.save();
        res.json({ success: true, name: req.body.name });
    } catch (error) {
        console.error("Error saving quote:", error);
        res.status(500).json({ error: "Failed to add quote" });
    }
});

// Endpoint to get all quotes
app.get('/allQuotes', async (req, res) => {
    try {
        const quotes = await QuoteYourPrice.find({}).sort({ date: -1 });
        res.json(quotes);
    } catch (error) {
        console.error("Error fetching quotes:", error);
        res.status(500).json({ error: "Failed to fetch quotes" });
    }
});

// Endpoint for removing a quote
app.post('/removeQuote', async (req, res) => {
    try {
        await QuoteYourPrice.findOneAndDelete({ id: req.body.id });
        res.json({
            success: true,
            id: req.body.id,
        });
    } catch (error) {
        console.error("Error deleting quote:", error);
        res.status(500).json({ error: "Failed to remove quote" });
    }
});


const Faculty = mongoose.model("Faculty", new mongoose.Schema({
    id: { type: Number, required: true },
    image: { type: String, required: true },
    lecturer: { type: String, required: true },
    about_faculty: { type: String, required: true },
    date: { type: Date, default: Date.now },
}));



// Endpoint for adding a product
app.post('/addFaculty', upload.single('image'), async (req, res) => {
    try {
        // Fetch the last product by id
        const lastFaculty = await Faculty.findOne({}, {}, { sort: { id: -1 } });
        const id = lastFaculty ? lastFaculty.id + 1 : 1;

        // Create a new product with data from the request
        const faculty = new Faculty({
            id: id,
            image: req.body.image,
            lecturer: req.body.lecturer,
            about_faculty: req.body.about_faculty,
            product_link: req.body.product_link,
        });

        // Save the new product in the database
        await faculty.save();

        res.json({
            success: true,
            name: req.body.name,
        });
    } catch (error) {
        console.error("Error saving faculty:", error);
        res.status(500).json({ error: "Failed to add faculty" });
    }
});

app.get('/allFaculties', async (req, res) => {
    let faculty = await Faculty.find({}).sort({ date: -1 });
    res.send(faculty);
});



// Endpoint for removing a product
app.post('/removefaculty', async (req, res) => {
    await Faculty.findOneAndDelete({ id: req.body.id });

    res.json({
        success: true,
        name: req.body.name,
    });
});



//  GreetingMessage schema
const GreetingMessage = mongoose.model("GreetingMessage", new mongoose.Schema({
    greeting_message: { type: String, required: true },
    date: { type: Date, default: Date.now },
}));

// Endpoint for adding a greeting message
app.post('/addGreetingMessage', async (req, res) => {
    try {
        const { greeting_message } = req.body;

        // Ensure that the greeting_message is provided
        if (!greeting_message) {
            return res.status(400).json({ error: "Greeting message is required" });
        }

        // Create a new instance of the GreetingMessage model
        const newGreetingMessage = new GreetingMessage({
            greeting_message: greeting_message
        });

        // Save the greeting message in the database
        await newGreetingMessage.save();

        res.json({
            success: true,
            message: "Greeting message added successfully!",
            greeting_message: newGreetingMessage.greeting_message,
            date: newGreetingMessage.date
        });
    } catch (error) {
        console.error("Error saving greeting message:", error);
        res.status(500).json({ error: "Failed to add greeting message" });
    }
});

// Endpoint for getting all greeting messages
app.get('/allGreetingMessage', async (req, res) => {
    try {
        // Retrieve all greeting messages, sorted by the date in descending order
        const greetingMessages = await GreetingMessage.find({}).sort({ date: -1 });

        // If no greeting messages are found, return a message
        if (!greetingMessages.length) {
            return res.status(404).json({ message: "No greeting messages found" });
        }

        res.json(greetingMessages);
    } catch (error) {
        console.error("Error fetching greeting messages:", error);
        res.status(500).json({ error: "Failed to retrieve greeting messages" });
    }
});


const Blog = mongoose.model("Blog", new mongoose.Schema({
    id: { type: Number, required: true },
    image: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    tags: { type: [String], required: true },
}));



// Endpoint for adding a product
app.post('/addBlog', upload.single('image'), async (req, res) => {
    try {
        // Fetch the last product by id
        const lastBlog = await Blog.findOne({}, {}, { sort: { id: -1 } });
        const id = lastBlog ? lastBlog.id + 1 : 1;

        // Create a new product with data from the request
        const blog = new Blog({
            id: id,
            image: req.body.image,
            title: req.body.title,
            description: req.body.description,
            tags: req.body.tags,
            date: req.body.date,
        });

        // Save the new product in the database
        await blog.save();

        res.json({
            success: true,
            name: req.body.name,
        });
    } catch (error) {
        console.error("Error saving faculty:", error);
        res.status(500).json({ error: "Failed to add faculty" });
    }
});

app.get('/allBlogs', async (req, res) => {
    let blog = await Blog.find({}).sort({ date: -1 });
    res.send(blog);
});



// Endpoint for removing a product
app.post('/removeBlog', async (req, res) => {
    await Blog.findOneAndDelete({ id: req.body.id });

    res.json({
        success: true,
        name: req.body.name,
    });
});

const Reviews = mongoose.model("Reviews", new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    review: { type: String, required: true },
    date: { type: Date, default: Date.now },
}));



// Endpoint for adding a product
app.post('/addReview', async (req, res) => {
    try {
        // Fetch the last product by id
        const lastReview = await Reviews.findOne({}, {}, { sort: { id: -1 } });
        const id = lastReview ? lastReview.id + 1 : 1;

        // Create a new product with data from the request
        const review = new Reviews({
            id: id,
            name: req.body.name,
            review: req.body.review,
        });

        // Save the new product in the database
        await review.save();

        res.json({
            success: true,
            name: req.body.name,
        });
    } catch (error) {
        console.error("Error saving faculty:", error);
        res.status(500).json({ error: "Failed to add faculty" });
    }
});

app.get('/allReviews', async (req, res) => {
    let review = await Reviews.find({}).sort({ date: -1 });
    res.send(review);
});



// Endpoint for removing a product
app.post('/removeReview', async (req, res) => {
    await Reviews.findOneAndDelete({ id: req.body.id });

    res.json({
        success: true,
        name: req.body.name,
    });
});

const Content = mongoose.model("Content", new mongoose.Schema({
    id: { type: Number, required: true },
    about_sections: { type: [String], required: true },
    terms_conditions: { type: [String], required: true },
    privacy_policy: { type: [String], required: true },
    refund_policy: { type: [String], required: true },
    exchange_policy: { type: [String], required: true },
    contact_numbers: { type: [String], required: true },
    email_ids: { type: [String], required: true },
    addresses: { type: [String], required: true },
    instagram: { type: String, required: false },
    github: { type: String, required: false },
    facebook: { type: String, required: false },
    twitter: { type: String, required: false },
    promo_code: { type: String, required: false },
    offer_percentage: { type: Number, required: false },
    date: { type: Date, default: Date.now },
}));

// Endpoint for adding a content
app.post('/addContent', async (req, res) => {
    try {
        // Fetch the last content by id
        const lastContent = await Content.findOne({}, {}, { sort: { id: -1 } });
        const id = lastContent ? lastContent.id + 1 : 1;

        // Create a new content with data from the request (arrays sent directly from frontend)
        const content = new Content({
            id: id,
            about_sections: req.body.about_sections, // Use the array directly
            terms_conditions: req.body.terms_conditions,
            privacy_policy: req.body.privacy_policy,
            refund_policy: req.body.refund_policy,
            privacy_policy: req.body.exchange_policy,
            contact_numbers: req.body.contact_numbers,
            email_ids: req.body.email_ids,
            addresses: req.body.addresses,
            instagram: req.body.instagram,
            github: req.body.github,
            facebook: req.body.facebook,
            twitter: req.body.twitter,
            promo_code: req.body.promo_code,
            offer_percentage: req.body.offer_percentage
        });

        await content.save();

        res.json({
            success: true,
            content: content, // Return the newly created content or _id
        });
    } catch (error) {
        console.error("Error saving content:", error);
        res.status(500).json({ error: "Failed to add content" });
    }
});

// Endpoint for fetching all content
app.get('/allContent', async (req, res) => {
    try {
        let content = await Content.find({});
        res.json(content);
    } catch (error) {
        console.error("Error fetching content:", error);
        res.status(500).json({ error: "Failed to fetch content" });
    }
});

app.put('/updateContent/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedContent = req.body;
        const result = await Content.findByIdAndUpdate(id, updatedContent, { new: true });

        if (result) {
            res.json({ success: true, content: result });
        } else {
            res.status(404).json({ success: false, message: 'Content not found' });
        }
    } catch (error) {
        console.error("Error updating content:", error);
        res.status(500).json({ success: false, error: "Failed to update content" });
    }
});

//Schema for FAQs

const Questions = mongoose.model("Questions", new mongoose.Schema({
    id: { type: Number, required: true },
    question: { type: String, required: false },
    answer: { type: String, required: false },
    date: { type: Date, default: Date.now },
}));

// Endpoint for adding a question
app.post('/addquestions', async (req, res) => {
    try {
        // Fetch the last question by id
        const lastQuestion = await Questions.findOne({}, {}, { sort: { id: -1 } });
        const id = lastQuestion ? lastQuestion.id + 1 : 1;

        // Create a new question with data from the request
        const question = new Questions({
            id: id,
            question: req.body.question,
            answer: req.body.answer,
        });

        await question.save();

        res.json({
            success: true,
            message: "Question added successfully",
        });
    } catch (error) {
        console.error("Error saving question:", error);
        res.status(500).json({ error: "Failed to add question" });
    }
});

// Endpoint for fetching all questions
app.get('/allquestions', async (req, res) => {
    try {
        let questions = await Questions.find({}).sort({ date: -1 });
        res.json(questions);
    } catch (error) {
        console.error("Error fetching questions:", error);
        res.status(500).json({ error: "Failed to fetch questions" });
    }
});

// Endpoint for removing a question
app.post('/removequestions', async (req, res) => {
    try {
        await Questions.findOneAndDelete({ id: req.body.id });

        res.json({
            success: true,
            message: "Question removed successfully",
        });
    } catch (error) {
        console.error("Error removing question:", error);
        res.status(500).json({ error: "Failed to remove question" });
    }
});

//Schema for subscribers
const Subscribers = mongoose.model("Subscribers", new mongoose.Schema({
    id: { type: Number, required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    date: { type: Date, default: Date.now },
}));

// Endpoint for adding a subscribers
app.post('/addsubscribers', async (req, res) => {
    try {
        // Fetch the last subscriber by id
        const lastSubscriber = await Subscribers.findOne({}, {}, { sort: { id: -1 } });
        const id = lastSubscriber ? lastSubscriber.id + 1 : 1;

        // Create a new subscriber
        const subscriber = new Subscribers({
            id,
            email: req.body.email,
            name: req.body.name,
        });

        await subscriber.save();

        res.json({
            success: true,
            message: "Subscriber added successfully",
        });
    } catch (error) {
        console.error("Error saving subscriber:", error);
        res.status(500).json({ error: "Failed to add subscriber" });
    }
});


// Endpoint for fetching all subscriber
app.get('/allsubscribers', async (req, res) => {
    try {
        const subscribers = await Subscribers.find({}).sort({ date: -1 }); // Sort by latest
        res.json(subscribers);
    } catch (error) {
        console.error("Error fetching subscribers:", error);
        res.status(500).json({ error: "Failed to fetch subscribers" });
    }
});


// Endpoint for removing a subscriber
app.post('/removesubscribers', async (req, res) => {
    try {
        await Subscribers.findOneAndDelete({ id: req.body.id });
        res.json({
            success: true,
            message: "Subscriber removed successfully",
        });
    } catch (error) {
        console.error("Error removing subscriber:", error);
        res.status(500).json({ error: "Failed to remove subscriber" });
    }
});


//Sending emails to subscribers


app.post('/sendmessages', async (req, res) => {
    const { message } = req.body; // The message admin wants to send

    if (!message || message.trim() === '') {
        return res.status(400).json({ error: "Message content cannot be empty" });
    }

    try {
        // Get all subscribers
        const subscribers = await Subscribers.find({});
        const emails = subscribers.map((subscriber) => ({
            email: subscriber.email,
            name: subscriber.name || "Subscriber",
        }));

        // Set up email transport
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Send emails
        for (const { email, name } of emails) {
            const emailHtml = `
                <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px;">
                    <h1 style="color: #c0392b;">Hi ${name},</h1>
                    <p style="font-size: 16px; line-height: 1.5;">We hope you're doing well! Our team has some exciting updates for you:</p>
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; border: 1px solid #ccc;">
                        <p style="font-size: 14px; color: #555;">${message}</p>
                    </div>
                    <p style="font-size: 16px; margin-top: 20px;">
                        Don't miss out on exclusive updates at Pro Library. Click the button below to explore now!
                    </p>
                    <div style="text-align: center; margin-top: 20px;">
                        <a href="${process.env.FRONTEND_URL}" target="_blank" style="background-color: #d14822; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Go to Pro Library</a>
                    </div>
                    <footer style="text-align: center; margin-top: 30px;">
                       <p>Designed and Developed Entirely by 
                            <a href="https://wa.me/918770495344" style="text-decoration: none; color: #FF6F00; font-weight: bold;" target="_blank">
                                Veer Adyani
                            </a>
                        </p>
                    </footer>
                </div>
            `;

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Newsletter Update",
                html: emailHtml,
            });
        }

        res.json({ success: true, message: "Messages sent successfully!" });
    } catch (error) {
        console.error("Error sending messages:", error);
        res.status(500).json({ error: "Failed to send messages" });
    }
});

const SentEmails = new mongoose.Schema({
    recipients: [String], // List of email addresses
    message: String,
    date: { type: Date, default: Date.now },
});


app.get('/allsentemails', async (req, res) => {
    try {
        const sentEmails = await SentEmails.find({}).sort({ date: -1 }); // Assuming `SentEmails` schema
        res.json(sentEmails);
    } catch (error) {
        console.error("Error fetching sent emails:", error);
        res.status(500).json({ error: "Failed to fetch sent emails" });
    }
});


// Schema for User Data
const Users = mongoose.model('Users', new mongoose.Schema({
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    mobile_number: { type: String, unique: true },
    cartData: { type: Object, default: {} },
    wishlistData: { type: Object, default: {} },
    buyData: { type: Object, default: {} },
    verified: { type: Boolean, default: false },
    verificationToken: { type: String },
    comments: { type: String },
    Date: { type: Date, default: Date.now }
}));

// Twilio Configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Twilio Account SID
const authToken = process.env.TWILIO_AUTH_TOKEN; // Your Twilio Auth Token
const twilioClient = twilio(accountSid, authToken);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER; // Your Twilio Phone Number

const tempUsers = {}; // In-memory storage for demonstration (use Redis or similar in production)

app.post('/signup', async (req, res) => {
    console.log("Received signup request:", req.body);
    try {
        const { first_name, last_name, email, password, mobile_number } = req.body;

        // Validate input
        if (!first_name || !last_name || !email || !password || !mobile_number) {
            return res.status(400).json({ success: false, errors: "All fields are required." });
        }

        // Check if email or mobile number already exists in the database
        const existingUser = await Users.findOne({
            $or: [{ email }, { mobile_number }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                errors: "Email or mobile number is already registered."
            });
        }

        // Generate OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        // Temporarily store user details with OTP
        tempUsers[mobile_number] = {
            first_name,
            last_name,
            email,
            password, // Hash before saving to DB after verification
            otp,
            createdAt: Date.now(), // Track timestamp to expire OTP if needed
        };

        // Send OTP via Twilio
        const message = `Your verification code is: ${otp}`;

        await twilioClient.messages.create({
            body: message,
            from: twilioPhoneNumber,
            to: mobile_number
        });

        res.json({ success: true, message: "Please verify your mobile number." });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ error: "Signup failed." });
    }
});


app.post('/verify-otp', async (req, res) => {
    try {
        const { mobile_number, otp } = req.body;

        // Retrieve temporary user details
        const tempUser = tempUsers[mobile_number];

        if (!tempUser) {
            return res.status(400).json({ success: false, errors: "User not found or OTP expired." });
        }

        // Validate OTP
        if (tempUser.otp !== otp) {
            return res.status(400).json({ success: false, errors: "Invalid OTP." });
        }

        // Save verified user to the database
        const user = new Users({
            first_name: tempUser.first_name,
            last_name: tempUser.last_name,
            email: tempUser.email,
            password: tempUser.password, // Ensure password is hashed
            mobile_number,
            verified: true,
        });

        await user.save();

        // Cleanup temporary storage
        delete tempUsers[mobile_number];

        // Send welcome email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Welcome Onboard!',
            html: `
                <h1>Welcome to Pro Library, ${user.first_name} ${user.last_name}!</h1>
                <p>Your account is successfully verified. We are excited to have you onboard!</p>
                <p>Enjoy exploring our services.</p>
                <footer>
                    <p>Best Regards,</p>
                    <p>The Pro Library Team</p>
                </footer>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: "Mobile number verified successfully." });
    } catch (error) {
        console.error("Error during OTP verification:", error);
        res.status(500).json({ error: "OTP verification failed." });
    }
});


// Login route
app.post('/login', async (req, res) => {
    let user = await Users.findOne({ email: req.body.email });
    if (user) {
        // Directly compare the raw password (no bcrypt compare)
        if (req.body.password === user.password) {
            const data = {
                user: {
                    id: user.id,
                }
            };
            const token = jwt.sign(data, 'secret_ecom', { expiresIn: '730h' }); // Token expiration can be set
            res.json({ success: true, token });
        } else {
            res.json({ success: false, errors: "Wrong Password" });
        }
    } else {
        res.json({ success: false, errors: "Wrong Email Id" });
    }
});


// Middleware to fetch user
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ errors: 'Please authenticate using a valid token' });
    }
    try {
        const data = jwt.verify(token, 'secret_ecom');
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ errors: "Please authenticate using a valid token" });
    }
};

//FORGOT USER

app.post('/forgot-password', async (req, res) => {
    const { mobile_number } = req.body;

    try {
        // Find user by mobile number
        const user = await Users.findOne({ mobile_number });
        if (!user) {
            return res.status(404).json({ message: "User with that mobile number not found" });
        }

        // Generate a token for the reset link
        const token = jwt.sign({ userId: user._id }, 'secret_ecom', { expiresIn: '15m' });

        // Set up email transport
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Set your email here
                pass: process.env.EMAIL_PASS, // Set your email password here
            },
        });

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Reset Your Password - Pro-Library',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #FF6F00; text-align: center;">Password Reset Request</h2>
                    <p>Hi ${user.first_name},</p>
                    <p>You recently requested to reset your password for your Pro-Library account. Click the button below to reset it:</p>
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="https://pro-library-c70q.onrender.com/ResetPassword?token=${token}" 
                           style="display: inline-block; background-color: #FF6F00; color: white; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-weight: bold;">
                           Reset Your Password
                        </a>
                    </div>
                    <p>If you didn't request this, you can ignore this email. Your password won't be changed.</p>
                    <p>This link will expire in <strong>15 minutes</strong>.</p>
                    <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
                    <footer style="text-align: center; font-size: 12px; color: #555;">
                        <p><strong>Pro-Library</strong></p>
                       <p>Designed and Developed Entirely by 
                            <a href="https://wa.me/918770495344" style="text-decoration: none; color: #FF6F00; font-weight: bold;" target="_blank">
                                Veer Adyani
                            </a>
                        </p>
                    </footer>
                </div>
            `,
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        // Respond with success
        res.status(200).json({
            message: "Password reset link sent to your email.",
            email: user.email // Return the email to hide part of it in frontend if necessary
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error sending reset link" });
    }
});


app.post('/reset-password', async (req, res) => {
    const { token, newPassword, confirmPassword } = req.body;

    // Check if both passwords match
    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, 'secret_ecom'); // Use the same secret key as when generating the token
        const user = await Users.findById(decoded.userId); // Get the user based on the decoded ID
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Save the new password directly (no hashing)
        user.password = newPassword;
        await user.save();

        // Respond with success message
        res.status(200).json({ message: "Password successfully reset" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Invalid or expired token" });
    }
});


app.put('/addComment/:id', async (req, res) => {
    const userId = req.params.id; // Accessing the id parameter directly
    const { comment } = req.body;

    try {
        const user = await Users.findById(userId); // Using findById to locate the user

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Update the comment field
        user.comments = comment; // Update to a single string

        await user.save(); // Save the updated user
        res.status(200).send('Comment added successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding comment');
    }
});

// Route to update the order status
app.put('/update-order-status', async (req, res) => {
    const { orderId, newStatus } = req.body;

    console.log('Received request to update order status:', { orderId, newStatus });

    // Validate the request body
    if (!orderId || !newStatus) {
        console.error('Invalid request: Missing orderId or newStatus');
        return res.status(400).json({ message: 'Invalid request: Missing orderId or newStatus' });
    }

    try {
        console.log('Updating order status for orderId:', orderId);

        // Use MongoDB operators to directly update the order's status
        const result = await Users.updateOne(
            { 'buyData.orderId': orderId }, // Match the order within buyData
            { $set: { 'buyData.$.status': newStatus } } // Use $ to update the matched order's status
        );

        console.log('MongoDB update result:', result);

        // Check if the order was found and updated
        if (result.matchedCount === 0) {
            console.error('Order not found for orderId:', orderId);
            return res.status(404).json({ message: 'Order not found' });
        }

        if (result.modifiedCount === 0) {
            console.error('Order status was not updated. It may already have the same status.');
            return res.status(400).json({ message: 'Order status not updated. Possibly already set to the same value.' });
        }

        console.log('Order status updated successfully for orderId:', orderId);
        res.status(200).json({ message: 'Order status updated successfully' });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



//PAYMENTS
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create a Razorpay order
app.post("/create-order", async (req, res) => {
    const { amount, currency } = req.body;

    const options = {
        amount: amount * 100, // Convert to paise
        currency,
        receipt: `receipt_order_${Math.random() * 1000}`,
    };

    try {
        const order = await razorpay.orders.create(options);
        res.status(200).json({
            id: order.id,
            currency: order.currency,
            amount: order.amount,
        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong while creating order", error: error.message });
    }
});


// Capture payment route


app.post("/capture-payment", async (req, res) => {
    const { paymentId, amount, userId, cartData, discount } = req.body;

    console.log("Received request to capture payment with the following data:", {
        paymentId, amount, userId, cartData, discount,
    });

    try {
        // Capture the payment with Razorpay
        const captureResponse = await razorpay.payments.capture(paymentId, amount * 100, "INR");

        if (captureResponse.status !== "captured") {
            console.error("Payment capture failed with status:", captureResponse.status);
            return res.status(500).json({ success: false, message: "Payment capture failed!" });
        }

        console.log("Payment captured successfully:", captureResponse);
        const productIds = Object.values(cartData).map(cartItem => cartItem.productId);
        const products = await Product.find({ id: { $in: productIds } });

        // Generate order details
        const orderId = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const orderDate = new Date().toISOString();
        const newOrder = {
            orderId,
            orderDate,
            totalAmount: amount,
            items: Object.values(cartData).map(cartItem => ({
                productId: cartItem.productId,
                link: cartItem.link,
                quantity: cartItem.quantity,
                mode: cartItem.mode,
                views: cartItem.views,
                validity: cartItem.validity,
                oldPrice: cartItem.oldPrice,
                newPrice: cartItem.newPrice,
                attempt: cartItem.attempt,
                language: cartItem.language,
                recording: cartItem.recording,
                bookType: cartItem.bookType,
                paymentId,
            })),
            discount: discount || 0,
            status: Object.values(cartData).every(item => item.link) ? "Completed" : "Processing",
        };

        console.log("New order details:", newOrder);

        // Update user's buyData by pushing the new order, and clear cartData in one atomic operation
        const userData = await Users.findByIdAndUpdate(
            userId,
            {
                $push: { buyData: newOrder },
                $set: { cartData: {} }, // Clears the cartData
            },
            { new: true }
        );

        if (!userData) {
            console.error("User not found or update failed for userId:", userId);
            return res.status(404).json({ success: false, message: "User not found" });
        }

        console.log("User's buyData updated and cartData cleared.");

        // Send the email receipt
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const itemsTable = await Promise.all(
            Object.values(cartData).map(async (item) => {
                // Fetch product based on the `id` field
                const product = await Product.findOne({ id: item.productId });
                const itemTotal = item.newPrice * item.quantity; // Calculate item total (price * quantity)
                return `
                    <tr>
                        <td style="font-size: 12px;">${product ? product.name : 'Unknown Product'}</td>
                        <td style="font-size: 12px;">${item.mode} / ${item.views} / ${item.validity} / ${item.attempt} / ${item.language} / ${item.recording} / ${item.bookType}</td>
                        <td style="font-size: 12px;">₹${item.newPrice}</td>
                        <td style="font-size: 12px;">${item.quantity}</td>
                        <td style="font-size: 12px;">₹${itemTotal.toFixed(2)}</td> <!-- New column for total amount per item -->
                    </tr>`;
            })
        );

        const formatDate = (dateString) => {
            const date = new Date(dateString);

            const day = String(date.getDate()).padStart(2, '0'); // Adds leading zero if necessary
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');

            return `${day}/${month}/${year} ${hours}:${minutes}`;
        };

        // In your code
        const formattedOrderDate = formatDate(orderDate);

        const totalAmountBeforeDiscount = Object.values(cartData).reduce((total, item) => {
            return total + (item.newPrice * item.quantity); // Sum all item totals
        }, 0);
        
        // Calculate the discount
        const discountAmount = totalAmountBeforeDiscount * discount; // Apply discount
        const totalAmountAfterDiscount = totalAmountBeforeDiscount - discountAmount; // Final total after discount
        
        // Generate the email HTML
        const emailHTML = `
            <h3 style="font-size: 14px;">Thank You for your Purchase!</h3>
            <h1 style="font-size: 16px;">Order Receipt</h1>
            <p style="font-size: 12px;">Hi ${userData.first_name},</p>
            <p style="font-size: 12px;">Your order has been successfully placed. Below are the details:</p>
            <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%; font-size: 12px;">
                <thead>
                    <tr>
                        <th>Course Name</th>
                        <th>Mode / Views / Validity / Attempt / Language / Recording / BookType</th>
                        <th>Price</th>
                        <th>Quantity</th> <!-- Added Quantity column -->
                        <th>Total Amount</th> <!-- Added Total Amount column -->
                    </tr>
                </thead>
                <tbody>
                    ${itemsTable.join("")}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="4" style="text-align: right; font-size: 12px;"><strong>Discount (${(discount * 100).toFixed(2)}%):</strong></td>
                        <td style="font-size: 12px;">- ₹${discountAmount.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="4" style="text-align: right; font-size: 12px;"><strong>Total Amount Paid:</strong></td>
                        <td style="font-size: 12px;">₹${totalAmountAfterDiscount.toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>
            <p style="font-size: 12px;">Order Date: ${formattedOrderDate}</p>
            <footer style="margin-top: 20px; font-size: 10px; text-align: center;">
                <p><strong>Pro-Library</strong></p>
                <p>Designed and Developed Entirely by 
                    <a href="https://wa.me/918770495344" style="text-decoration: none; color: #FF6F00; font-weight: bold;" target="_blank">
                        Veer Adyani
                    </a>
                </p>
            </footer>
        `;
        // Send the email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: userData.email,
            subject: "Order Receipt from Pro-Library",
            html: emailHTML,
        });
        console.log("Email sent successfully to:", userData.email);

        // Respond with a success message
        res.status(200).json({
            success: true,
            message: "Payment captured, order added to buyData, and email sent",
            captureResponse,
        });
    } catch (error) {
        console.error("Error capturing payment or sending email:", error.message);
        res.status(500).json({ success: false, message: "Payment capture or email sending failed!", error: error.message });
    }
});




// Update order route
// app.post("/update-order", async (req, res) => {
//     const { userId, buyData, cartData } = req.body;

//     try {
//         const user = await Users.findById(userId);
//         if (!user) {
//             console.error("User not found:", userId);
//             return res.status(404).json({ success: false, message: "User not found" });
//         }

//         // Ensure `buyData` is an array on the user document
//         if (!Array.isArray(user.buyData)) {
//             user.buyData = [];
//         }

//         // Append the new order from `buyData` parameter to the user's `buyData` array
//         user.buyData.push(buyData);
//         console.log("Order added to buyData:", buyData);

//         // Clear `cartData` after successful order update
//         user.cartData = {};

//         await user.save();

//         res.status(200).json({ success: true, message: "Order updated successfully" });
//     } catch (error) {
//         console.error("Error updating order:", error.message);
//         res.status(500).json({ success: false, message: "Order update failed", error: error.message });
//     }
// });




app.get('/profile', async (req, res) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ errors: 'Please authenticate using a valid token' });
    }
    try {
        const data = jwt.verify(token, 'secret_ecom');
        const user = await Users.findById(data.user.id).select('-password');  // Don't return password
        if (!user) {
            return res.status(404).send({ errors: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(401).send({ errors: "Please authenticate using a valid token" });
    }
});


app.get('/allusers', async (req, res) => {
    try {
        let users = await Users.find({}).sort({ date: -1 });
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

// Add this to your existing code

// Endpoint for updating user details
app.put('/update-user', fetchUser, async (req, res) => {
    try {
        const { first_name, last_name, email, mobile_number } = req.body;
        const user = await Users.findById(req.user.id);

        user.first_name = first_name || user.first_name;
        user.last_name = last_name || user.last_name;
        user.email = email || user.email;
        user.mobile_number = mobile_number || user.mobile_number;

        await user.save();

        res.json({ success: true, message: 'User details updated successfully', user });
    } catch (error) {
        console.error("Error updating user details:", error);
        res.status(500).json({ error: "Failed to update user details" });
    }
});

// Endpoint for updating user password
app.put('/update-password', fetchUser, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Fetch the user's data from the database
        const user = await Users.findById(req.user.id);

        // Check if the current password matches the stored password
        if (user.password !== currentPassword) {
            return res.status(400).json({ error: "Current password is incorrect" });
        }

        // Update the password if the current password is correct
        user.password = newPassword;
        await user.save();

        res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ error: "Failed to update password" });
    }
});

//EMPLOYEES

const Employees = mongoose.model('Employees', new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    features: { type: Object, default: {} },
    Date: { type: Date, default: Date.now }
}));

// Endpoint to add a new employee
app.post('/add_employee', async (req, res) => {
    try {
        const { name, username, password, role, features } = req.body;

        const newEmployee = new Employees({
            name,
            username,
            password,
            role,
            features
        });

        await newEmployee.save();
        res.status(201).json({ message: 'Employee added successfully', employee: newEmployee });
    } catch (error) {
        res.status(500).json({ message: 'Error adding employee', error: error.message });
    }
});

// Endpoint to get all employees
app.get('/all_employees', async (req, res) => {
    try {
        const employees = await Employees.find();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving employees', error: error.message });
    }
});

// Endpoint to login an employee
app.post('/login-employee', async (req, res) => {
    const { username, password, role } = req.body;

    try {
        // Find the employee by username and role
        const employee = await Employees.findOne({ username, role });
        if (!employee) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Verify password (no hashing)
        if (password !== employee.password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token with employee name
        const token = jwt.sign(
            {
                id: employee._id,
                name: employee.name, // Include employee name
                role: employee.role,
                features: employee.features,
            },
            process.env.JWT_SECRET, // Make sure JWT_SECRET is set in your environment variables
            { expiresIn: '24h' } // Token expiry time
        );

        // Send the token and features to the client
        res.json({ token, features: employee.features });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});


app.post('/addtocart', fetchUser, async (req, res) => {
    const {
        productId,
        mode,
        views,
        validity,
        attempt ,
        language,
        recording ,
        bookType ,
        newPrice,
        oldPrice,
        link,
    } = req.body;

    if (
        !productId ||
        !mode ||
        !views ||
        !validity ||
        !attempt ||
        !language ||
        !recording ||
        !bookType ||
        newPrice == null ||
        oldPrice == null
    ) {
        return res.status(400).send({
            error:
                'All fields are required: productId, mode, views, validity, newPrice, oldPrice',
        });
    }

    let userData = await Users.findById(req.user.id);
    if (!userData) return res.status(404).send({ error: 'User not found' });

    // Helper function to format composite key
    const formatCompositeKey = (productId, mode, views, validity, attempt, language, recording, bookType, oldPrice, newPrice) => {
        const safeString = (value) => {
            // Ensure the value is a string before using .replace()
            return typeof value === 'string' ? value.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() : String(value).replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        };
    
        const formattedMode = safeString(mode);
        const formattedViews = safeString(views);
        const formattedValidity = safeString(validity);
        const formattedAttempt = safeString(attempt);  // Convert attempt to string
        const formattedLanguage = safeString(language);
        const formattedRecording = safeString(recording);
        const formattedBookType = safeString(bookType);
    
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

    if (userData.cartData[compositeKey]) {
        userData.cartData[compositeKey].quantity += 1;
    } else {
        userData.cartData[compositeKey] = {
            productId,
            mode,
            views,
            validity,
            attempt,
            language,
            recording,
            bookType,
            oldPrice,
            newPrice,
            link,
            quantity: 1,
        };
    }

    await Users.findByIdAndUpdate(req.user.id, { cartData: userData.cartData });
    res.send({ message: 'Added to cart' });
});

app.post('/updatecart', fetchUser, async (req, res) => {
    const { compositeKey, newQuantity } = req.body;

    try {
        // Check if user exists
        const user = await Users.findOne({ _id: req.user.id, [`cartData.${compositeKey}`]: { $exists: true } });
        if (!user) {
            return res.status(404).send({ errors: "User or item not found in cart" });
        }

        // Use $set operator to update quantity in cartData for the specified compositeKey
        await Users.updateOne(
            { _id: req.user.id },
            { $set: { [`cartData.${compositeKey}.quantity`]: newQuantity } }
        );

        // Retrieve updated cart data to send back
        const updatedUser = await Users.findById(req.user.id);
        res.send({ message: "Cart updated successfully", cartData: updatedUser.cartData });
    } catch (error) {
        console.error("Error updating cart item quantity:", error);
        res.status(500).send({ errors: "Internal Server Error" });
    }
});


// app.post('/addtocart', fetchUser, async (req, res) => {
//     let userData = await Users.findById(req.user.id);
//     if (!userData) return res.status(404).send({ errors: "User not found" });

//     // Validate selectedOption
//     if (!req.body.selectedOption) {
//         return res.status(400).send({ errors: "Selected option is required" });
//     }

//     // Create a composite key for cartData using itemId and selectedOption
//     const compositeKey = `${req.body.itemId}(${req.body.selectedOption})`;

//     if (userData.cartData[compositeKey]) {
//         userData.cartData[compositeKey] += 1; // Increment quantity if already exists
//     } else {
//         userData.cartData[compositeKey] = 1; // Add new entry
//     }

//     await Users.findByIdAndUpdate(req.user.id, { cartData: userData.cartData });
//     res.send({ message: 'Added to cart' });
// });


// Endpoint for adding products to wishlist
app.post('/addtowishlist', fetchUser, async (req, res) => {
    let userData = await Users.findById(req.user.id);
    if (!userData) return res.status(404).send({ errors: "User not found" });

    if (userData.wishlistData[req.body.itemId]) {
        userData.wishlistData[req.body.itemId] += 1;
    } else {
        userData.wishlistData[req.body.itemId] = 1;
    }
    await Users.findByIdAndUpdate(req.user.id, { wishlistData: userData.wishlistData });
    res.send({ message: 'Added to wishlist' });
});

// Endpoint for removing products from cart
// const removeFromCart = (itemId, selectedOption) => {
//     const compositeKey = `${itemId}(${selectedOption})`; // Correct composite key
//     console.log(`Remove from cart composite key: ${compositeKey}`); // Log the composite key here

//     // Update cartItems state
//     setcartItems((prev) => {
//         // Check if the item exists in the cart
//         if (prev[compositeKey]) {
//             // Check if the quantity is greater than 1
//             if (prev[compositeKey].quantity > 1) {
//                 // Decrement the quantity
//                 return {
//                     ...prev,
//                     [compositeKey]: {
//                         ...prev[compositeKey],
//                         quantity: prev[compositeKey].quantity - 1
//                     }
//                 };
//             } else {
//                 // If quantity is 1, remove the item from the cart
//                 const updatedCart = { ...prev };
//                 delete updatedCart[compositeKey];
//                 return updatedCart;
//             }
//         }
//         // If item does not exist, return previous state
//         return prev;
//     });

//     // Send request to backend to remove item from cart
//     const token = localStorage.getItem('auth-token'); // Store token in a variable

//     if (token) {
//         fetch(`${BACKEND_URL}/removefromcart`, {
//             method: 'POST',
//             headers: {
//                 'Accept': 'application/json',
//                 'auth-token': token,
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ itemId, selectedOption }), // Include selectedOption in the request
//         })
//         .then((response) => {
//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`); // Handle HTTP errors
//             }
//             return response.json();
//         })
//         .then((data) => {
//             console.log(data); // Log success message or any data returned from the server
//         })
//         .catch((error) => {
//             console.error('Error removing from cart:', error); // Log any errors encountered
//         });
//     } else {
//         console.error('No authentication token found'); // Log if no token exists
//     }
// };


app.post('/removefromcart', fetchUser, async (req, res) => {
    const { compositeKey } = req.body; // Extract compositeKey from request body

    try {
        // Use `findOneAndUpdate` to remove the item and return the updated cart
        const updatedUserData = await Users.findOneAndUpdate(
            { _id: req.user.id, [`cartData.${compositeKey}`]: { $exists: true } }, // Ensure the item exists
            { $unset: { [`cartData.${compositeKey}`]: "" } }, // Remove the item
            { new: true, projection: { cartData: 1 } } // Return only the updated cart
        );

        if (!updatedUserData) {
            return res.status(404).send({ errors: "Item not found in cart or user not found" });
        }

        // Send the updated cart to the frontend
        res.send({
            message: "Item removed from cart successfully.",
            updatedCart: updatedUserData.cartData,
        });
    } catch (error) {
        console.error("Error removing item from cart:", error);
        res.status(500).send({ errors: "Internal Server Error" });
    }
});



// Endpoint for removing products from wishlist
app.post('/removefromWishlist', fetchUser, async (req, res) => {
    let userData = await Users.findById(req.user.id);
    if (!userData) return res.status(404).send({ errors: "User not found" });

    if (userData.wishlistData[req.body.itemId] > 1) {
        userData.wishlistData[req.body.itemId] -= 1;
    } else {
        delete userData.wishlistData[req.body.itemId];
    }

    await Users.findByIdAndUpdate(req.user.id, { wishlistData: userData.wishlistData });
    res.send({ message: 'Removed from wishlist' });
});

// Endpoint for getting user cart
app.get('/getcart', fetchUser, async (req, res) => {
    try {
        // Fetch user data
        let userData = await Users.findById(req.user.id);
        if (!userData) {
            return res.status(404).send({ errors: "User not found" });
        }

        if (!userData.cartData || Object.keys(userData.cartData).length === 0) {
            return res.send({}); // Return an empty object
        }
        

        // Assuming Products is your Product model that contains all product data
        const cartItems = await Promise.all(
            Object.entries(userData.cartData).map(async ([compositeKey, cartItemData]) => {
                // Extract productId, mode, views, validity, oldPrice, newPrice from cartItemData instead of compositeKey
                const { productId, mode, views, validity, attempt,bookType,language,recording, oldPrice, newPrice, quantity, link = '' } = cartItemData;

                // Fetch the product based on productId
                const product = await Product.findOne({ id: productId });
                if (!product) {
                    return null; // Skip if product not found
                }

                return {
                    productId,
                    mode,         // Original mode with formatting intact
                    views,        // Original views with formatting intact
                    validity,
                    attempt,
                    bookType,
                    language,
                    recording,     
                    oldPrice,
                    newPrice,
                    quantity,
                    price: newPrice, // Use the new price for the selected variation
                    link           // Include the link in the response
                };
            })
        );

        // Filter out any null items (in case product not found or invalid key)
        const validCartItems = cartItems.filter(item => item !== null);

        res.send(validCartItems); // Send the valid cartItems array
    } catch (error) {
        console.error("Error fetching cart data:", error);
        res.status(500).send({ errors: "Internal Server Error" });
    }
});


// Endpoint for getting user wishlist
app.get('/getwishlist', fetchUser, async (req, res) => {
    try {
        let userData = await Users.findById(req.user.id);
        if (!userData) {
            return res.status(404).send({ errors: "User not found" });
        }
        res.send(userData.wishlistData);
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).send({ errors: "Internal Server Error" });
    }
});


app.get('/getbuy', fetchUser, async (req, res) => {
    try {
        // Fetch user data by user ID from the token
        const userData = await Users.findById(req.user.id);
        if (!userData) {
            return res.status(404).json({ errors: "User not found" });
        }

        // Check if buyData exists; if not, return an empty array
        const userOrders = userData.buyData || [];
        return res.status(200).json({ success: true, orders: userOrders });
    } catch (error) {
        console.error("Error fetching buy data:", error);
        return res.status(500).json({ errors: "Internal Server Error" });
    }
});


app.post("/analytics", async (req, res) => {
    try {
        // Variables to calculate analytics
        const courseCount = {};
        const modeCount = {};
        const viewCount = {};
        const validityCount = {};
        const facultyCount = {};
        const categoryCount = {};
        const subCategoryCount = {};
        const dailyRevenue = {};
        const weeklyRevenue = {};
        let totalRevenue = 0;
        let totalDiscount = 0;
        let orderCount = { completed: 0, processing: 0, pending: 0 };
        let totalOrders = 0;

        const { startDate, endDate } = req.body;
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Fetch all users
        const allUsers = await Users.find({});

        // Process Each User's buyData
        for (const user of allUsers) {
            for (const order of user.buyData) {
                const orderDate = new Date(order.orderDate);

                // Filter orders by date range
                if (startDate && endDate && (orderDate < start || orderDate > end)) {
                    continue;
                }

                totalRevenue += order.totalAmount;
                totalOrders++;
                orderCount[order.status.toLowerCase()]++;

                // Calculate the discount for the order
                const itemTotalWithoutDiscount = order.items.reduce((sum, item) => sum + item.newPrice * item.quantity, 0);
                const discountAmount = itemTotalWithoutDiscount - order.totalAmount;
                totalDiscount += discountAmount;

                for (const item of order.items) {
                    // Fetch product dynamically using item.productId
                    const product = await Product.findOne({ id: item.productId });
                    if (!product) {
                        console.warn(`Product with id ${item.productId} not found.`);
                        continue; // Skip if product is not found
                    }

                    // Update Course Count
                    courseCount[product.name] = (courseCount[product.name] || 0) + item.quantity;

                    // Update Mode Count
                    modeCount[item.mode] = (modeCount[item.mode] || 0) + item.quantity;

                    // Update Views Count
                    viewCount[item.views] = (viewCount[item.views] || 0) + 1;

                    // Update Validity Count
                    validityCount[item.validity] = (validityCount[item.validity] || 0) + 1;

                    // Update Faculty Count
                    facultyCount[product.lecturer] = (facultyCount[product.lecturer] || 0) + item.quantity;

                    // Update Category Count
                    categoryCount[product.category] = (categoryCount[product.category] || 0) + item.quantity;

                    // Update Subcategory Count
                    subCategoryCount[product.sub_category] = (subCategoryCount[product.sub_category] || 0) + item.quantity;

                    // Calculate Daily and Weekly Revenue
                    const day = orderDate.toISOString().split("T")[0]; // YYYY-MM-DD
                    dailyRevenue[day] = (dailyRevenue[day] || 0) + order.totalAmount;

                    const weekDay = orderDate.toLocaleString("en-US", { weekday: "long" }); // Day of the week
                    weeklyRevenue[weekDay] = (weeklyRevenue[weekDay] || 0) + order.totalAmount;
                }
            }
        }

        // Find Most Bought Analytics
        const mostBoughtCourse = Object.keys(courseCount).reduce((a, b) => courseCount[a] > courseCount[b] ? a : b, null);
        const mostBoughtMode = Object.keys(modeCount).reduce((a, b) => modeCount[a] > modeCount[b] ? a : b, null);
        const mostBoughtViews = Object.keys(viewCount).reduce((a, b) => viewCount[a] > viewCount[b] ? a : b, null);
        const mostBoughtValidity = Object.keys(validityCount).reduce((a, b) => validityCount[a] > validityCount[b] ? a : b, null);
        const mostBoughtFaculty = Object.keys(facultyCount).reduce((a, b) => facultyCount[a] > facultyCount[b] ? a : b, null);
        const mostBoughtCategory = Object.keys(categoryCount).reduce((a, b) => categoryCount[a] > categoryCount[b] ? a : b, null);
        const mostBoughtSubCategory = Object.keys(subCategoryCount).reduce((a, b) => subCategoryCount[a] > subCategoryCount[b] ? a : b, null);

        // Find Top 10 Analytics
        const top10Courses = Object.entries(courseCount).sort((a, b) => b[1] - a[1]).slice(0, 10);
        const top10Faculties = Object.entries(facultyCount).sort((a, b) => b[1] - a[1]).slice(0, 10);

        // Additional Analytics
        const averageOrderValue = totalRevenue / totalOrders;
        const topDayOfWeek = Object.keys(weeklyRevenue).reduce((a, b) => weeklyRevenue[a] > weeklyRevenue[b] ? a : b, null);

        // Send the response
        res.json({
            mostBoughtCourse,
            mostBoughtMode,
            mostBoughtViews,
            mostBoughtValidity,
            mostBoughtFaculty,
            mostBoughtCategory,
            mostBoughtSubCategory,
            totalRevenue,
            totalDiscount,
            orderCount,
            averageOrderValue,
            top10Courses,
            top10Faculties,
            topDayOfWeek
        });
    } catch (error) {
        console.error("Error in /analytics route:", error);
        res.status(500).json({ error: "An error occurred while processing analytics." });
    }
});


// Start the server
app.listen(port, (error) => {
    if (!error) {
        console.log("Server is running on " + port);
    } else {
        console.log("Server is not running, error - " + error);
    }
});
