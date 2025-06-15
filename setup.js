const mongoose = require('mongoose');

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/digital_market', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log('MongoDB connection successful');

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

    // Sample products
    const sampleProducts = [
        {
            title: "UI Kit",
            description: "আধুনিক UI ডিজাইন কিট",
            price: 500,
            image: "/images/ui-kit.jpg",
            rating: 4.5,
            features: [
                "১০০+ UI কম্পোনেন্ট",
                "রেসপনসিভ ডিজাইন",
                "ডার্ক মোড সাপোর্ট"
            ],
            includes: [
                "Figma ফাইল",
                "Sketch ফাইল",
                "Adobe XD ফাইল"
            ],
            fullDescription: "আমাদের UI Kit আপনাকে দেবে সবচেয়ে আধুনিক এবং প্রফেশনাল ডিজাইন কম্পোনেন্ট। এই কিটে রয়েছে ১০০+ UI কম্পোনেন্ট যা আপনি আপনার প্রজেক্টে ব্যবহার করতে পারবেন।"
        },
        {
            title: "সোশ্যাল মিডিয়া টেমপ্লেট",
            description: "সোশ্যাল মিডিয়া পোস্ট টেমপ্লেট",
            price: 500,
            image: "/images/social-templates.jpg",
            rating: 4.8,
            features: [
                "৫০+ টেমপ্লেট",
                "সব প্ল্যাটফর্ম সাপোর্ট",
                "কাস্টমাইজেবল"
            ],
            includes: [
                "PSD ফাইল",
                "AI ফাইল",
                "PNG ফাইল"
            ],
            fullDescription: "আমাদের সোশ্যাল মিডিয়া টেমপ্লেট আপনাকে দেবে সবচেয়ে আধুনিক এবং আকর্ষণীয় পোস্ট ডিজাইন। এই টেমপ্লেটগুলো আপনি ফেসবুক, ইনস্টাগ্রাম, টুইটার সহ সব সোশ্যাল মিডিয়া প্ল্যাটফর্মে ব্যবহার করতে পারবেন।"
        },
        {
            title: "3D আইকন প্যাক",
            description: "3D আইকন কালেকশন",
            price: 500,
            image: "/images/3d-icons.jpg",
            rating: 4.7,
            features: [
                "২০০+ 3D আইকন",
                "PNG ফরম্যাট",
                "SVG ফরম্যাট"
            ],
            includes: [
                "PNG ফাইল",
                "SVG ফাইল",
                "Blender ফাইল"
            ],
            fullDescription: "আমাদের 3D আইকন প্যাক আপনাকে দেবে সবচেয়ে আধুনিক এবং আকর্ষণীয় 3D আইকন। এই আইকনগুলো আপনি আপনার প্রজেক্টে ব্যবহার করতে পারবেন।"
        }
    ];

    try {
        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products');

        // Insert sample products
        await Product.insertMany(sampleProducts);
        console.log('Added sample products successfully');

        // Verify products
        const products = await Product.find();
        console.log(`Total products in database: ${products.length}`);

        process.exit(0);
    } catch (error) {
        console.error('Error setting up database:', error);
        process.exit(1);
    }
}).catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
}); 