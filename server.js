const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    try {
        fs.mkdirSync(uploadsDir, { recursive: true });
        console.log('Uploads directory created successfully');
    } catch (error) {
        console.error('Error creating uploads directory:', error);
    }
}

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Accept images only
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('শুধুমাত্র ছবি আপলোড করা যাবে।'), false);
        }
        cb(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Error handling middleware for multer
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'ছবির সাইজ ৫ মেগাবাইটের বেশি হতে পারবে না।' });
        }
        return res.status(400).json({ message: 'ফাইল আপলোডে সমস্যা হয়েছে।' });
    }
    next(error);
});

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/digital_market', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

// Product Schema
const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    rating: { type: Number, required: true },
    features: [String],
    includes: [String],
    fullDescription: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

// Routes
// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'প্রোডাক্ট লোড করতে সমস্যা হয়েছে।' });
    }
});

// Get single product
app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'প্রোডাক্ট পাওয়া যায়নি।' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'প্রোডাক্ট লোড করতে সমস্যা হয়েছে।' });
    }
});

// Upload image
app.post('/api/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'কোন ছবি আপলোড করা হয়নি।' });
        }
        console.log('File uploaded successfully:', req.file);
        const imageUrl = `/uploads/${req.file.filename}`;
        res.json({ imageUrl });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ message: 'ছবি আপলোড করতে সমস্যা হয়েছে।' });
    }
});

// Create product
app.post('/api/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(400).json({ message: 'প্রোডাক্ট তৈরি করতে সমস্যা হয়েছে।' });
    }
});

// Update product
app.put('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!product) {
            return res.status(404).json({ message: 'প্রোডাক্ট পাওয়া যায়নি।' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(400).json({ message: 'প্রোডাক্ট আপডেট করতে সমস্যা হয়েছে।' });
    }
});

// Delete product
app.delete('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'প্রোডাক্ট পাওয়া যায়নি।' });
        }

        // Delete associated image file
        const imagePath = path.join(__dirname, product.image);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            console.log('Image file deleted:', imagePath);
        }

        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'প্রোডাক্ট সফলভাবে মুছে ফেলা হয়েছে।' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'প্রোডাক্ট মুছে ফেলতে সমস্যা হয়েছে।' });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Uploads directory: ${uploadsDir}`);
}); 