// // scripts/seedProducts.mjs
// import dotenv from 'dotenv';
// import mongoose from 'mongoose';
// import Product from '../models/Product.js'; // include .js extension for Node

// dotenv.config({ path: '.env.local' });

// // Sample product data
// const products = [
//   {
//     title: 'Wireless Noise-Cancelling Headphones Pro',
//     description: 'Premium over-ear headphones with active noise cancellation, 40-hour battery life, and Hi-Res audio.',
//     price: 129.99,
//     currency: 'USD',
//     rating: 4.8,
//     numReviews: 342,
//     stock: 50,
//     isFeatured: true,
//     images: ['https://picsum.photos/seed/headphone1/400/300'],
//     brand: 'AudioTech',
//   },
//   {
//     title: 'Smart Fitness Band with Heart Monitor',
//     description: 'Track your steps, heart rate, sleep, and workouts with this sleek waterproof fitness band.',
//     price: 89.00,
//     currency: 'USD',
//     rating: 4.6,
//     numReviews: 215,
//     stock: 100,
//     isFeatured: true,
//     images: ['https://picsum.photos/seed/fitness1/400/300'],
//     brand: 'FitLife',
//   },
//   {
//     title: 'Ultrabook Laptop 14" 16GB 512GB SSD',
//     description: 'Lightweight and powerful laptop with Intel Core i7, 16GB RAM, 512GB SSD, and stunning 4K display.',
//     price: 899.00,
//     currency: 'USD',
//     rating: 4.9,
//     numReviews: 178,
//     stock: 25,
//     isFeatured: true,
//     images: ['https://picsum.photos/seed/laptop1/400/300'],
//     brand: 'TechPro',
//   },
//   {
//     title: '4K Action Camera Waterproof 60FPS',
//     description: 'Capture your adventures in stunning 4K at 60FPS. Waterproof to 40m, with image stabilization.',
//     price: 249.99,
//     currency: 'USD',
//     rating: 4.7,
//     numReviews: 98,
//     stock: 60,
//     isFeatured: true,
//     images: ['https://picsum.photos/seed/camera1/400/300'],
//     brand: 'ActionCam',
//   },
//   {
//     title: 'Wireless Earbuds with Noise Cancellation',
//     description: 'True wireless earbuds with active noise cancellation, 24-hour battery, and IPX5 waterproof.',
//     price: 79.99,
//     currency: 'USD',
//     rating: 4.4,
//     numReviews: 156,
//     stock: 120,
//     isFeatured: false,
//     images: ['https://picsum.photos/seed/earbuds1/400/300'],
//     brand: 'SoundWave',
//   },
//   {
//     title: 'Gaming Mouse RGB 16000 DPI',
//     description: 'High-precision gaming mouse with adjustable DPI up to 16000, customizable RGB lighting, and 8 programmable buttons.',
//     price: 49.99,
//     currency: 'USD',
//     rating: 4.3,
//     numReviews: 87,
//     stock: 200,
//     isFeatured: false,
//     images: ['https://picsum.photos/seed/mouse1/400/300'],
//     brand: 'GameOn',
//   },
//   {
//     title: 'Mechanical Keyboard with RGB Backlight',
//     description: 'Tactile mechanical keyboard with blue switches, full N-key rollover, and customizable RGB lighting.',
//     price: 89.99,
//     currency: 'USD',
//     rating: 4.7,
//     numReviews: 112,
//     stock: 75,
//     isFeatured: false,
//     images: ['https://picsum.photos/seed/keyboard1/400/300'],
//     brand: 'TypeMaster',
//   },
//   {
//     title: 'Smartphone 6.5" 128GB 5G',
//     description: '6.5-inch AMOLED display, 128GB storage, 5G connectivity, and a powerful triple-lens camera system.',
//     price: 699.99,
//     currency: 'USD',
//     rating: 4.5,
//     numReviews: 203,
//     stock: 40,
//     isFeatured: true,
//     images: ['https://picsum.photos/seed/phone1/400/300'],
//     brand: 'MobileX',
//   },
//   {
//     title: 'Electric Scooter with 25km Range',
//     description: 'Foldable electric scooter with 25km range, 25km/h top speed, and dual braking system.',
//     price: 399.99,
//     currency: 'USD',
//     rating: 4.2,
//     numReviews: 65,
//     stock: 15,
//     isFeatured: false,
//     images: ['https://picsum.photos/seed/scooter1/400/300'],
//     brand: 'EcoRide',
//   },
//   {
//     title: 'Wireless Charging Pad 15W',
//     description: 'Fast wireless charging pad compatible with all Qi-enabled devices. Supports up to 15W charging.',
//     price: 29.99,
//     currency: 'USD',
//     rating: 4.0,
//     numReviews: 45,
//     stock: 300,
//     isFeatured: false,
//     images: ['https://picsum.photos/seed/charger1/400/300'],
//     brand: 'ChargePro',
//   },
//   {
//     title: 'Smart Home Security Camera',
//     description: '1080p HD security camera with night vision, motion detection, and two-way audio.',
//     price: 59.99,
//     currency: 'USD',
//     rating: 4.1,
//     numReviews: 78,
//     stock: 90,
//     isFeatured: false,
//     images: ['https://picsum.photos/seed/camera2/400/300'],
//     brand: 'SafeHome',
//   },
//   {
//     title: 'Portable Bluetooth Speaker',
//     description: 'Waterproof Bluetooth speaker with 20W output, 12-hour battery, and built-in microphone.',
//     price: 39.99,
//     currency: 'USD',
//     rating: 4.3,
//     numReviews: 134,
//     stock: 150,
//     isFeatured: false,
//     images: ['https://picsum.photos/seed/speaker1/400/300'],
//     brand: 'AudioMax',
//   },
//   {
//     title: 'Smartwatch with GPS and Heart Rate',
//     description: 'GPS-enabled smartwatch with heart rate monitoring, sleep tracking, and 7-day battery life.',
//     price: 199.99,
//     currency: 'USD',
//     rating: 4.6,
//     numReviews: 189,
//     stock: 55,
//     isFeatured: true,
//     images: ['https://picsum.photos/seed/watch1/400/300'],
//     brand: 'TechWear',
//   },
//   {
//     title: 'USB-C Hub 7-in-1',
//     description: '7-port USB-C hub with 4K HDMI, 100W power delivery, Gigabit Ethernet, and USB 3.0 ports.',
//     price: 44.99,
//     currency: 'USD',
//     rating: 4.2,
//     numReviews: 92,
//     stock: 180,
//     isFeatured: false,
//     images: ['https://picsum.photos/seed/hub1/400/300'],
//     brand: 'ConnectPro',
//   },
//   {
//     title: 'Wireless Keyboard and Mouse Combo',
//     description: 'Ergonomic wireless keyboard and mouse set with 2.4GHz connectivity, silent keys, and long battery life.',
//     price: 54.99,
//     currency: 'USD',
//     rating: 4.0,
//     numReviews: 56,
//     stock: 130,
//     isFeatured: false,
//     images: ['https://picsum.photos/seed/combo1/400/300'],
//     brand: 'EasyType',
//   },
// ];



// async function seedDatabase() {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log('✅ Connected to MongoDB');

//     // Optional: clear existing
//     await Product.deleteMany({});
//     console.log('🧹 Cleared existing products');

//     const result = await Product.insertMany(products);
//     console.log(`✅ Successfully inserted ${result.length} products`);
//     console.log('📦 Sample products:');
//     result.forEach((p, i) => {
//       console.log(`  ${i+1}. ${p.title} - $${p.price}`);
//     });
//   } catch (error) {
//     console.error('❌ Seeding failed:', error);
//   } finally {
//     await mongoose.disconnect();
//     console.log('🔌 Disconnected');
//   }
// }

// seedDatabase();
// "seed": "node scripts/seedProducts.mjs",
//     "create-admin": "node scripts/createAdmin.mjs"