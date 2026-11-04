// import dotenv from 'dotenv';
// import mongoose from 'mongoose';
// import bcrypt from 'bcrypt';

// dotenv.config({ path: '.env.local' });

// const MONGODB_URI = process.env.MONGODB_URI;

// if (!MONGODB_URI) {
//   console.error('❌ MONGODB_URI missing in .env.local');
//   process.exit(1);
// }

// const ADMIN = {
//   name: 'Admin',
//   email: 'admin@ecomflex.com',      // 🔧 change
//   password: 'AdminPass123!',        // 🔧 change — strong password
//   phone: '+2348012345678',
//   role: 'admin',
// };

// async function run() {
//   await mongoose.connect(MONGODB_URI);
//   console.log('✅ Connected to MongoDB');

//   const users = mongoose.connection.collection('users');

//   const existing = await users.findOne({ email: ADMIN.email.toLowerCase() });
//   if (existing) {
//     // Upgrade to admin if already exists
//     await users.updateOne(
//       { email: ADMIN.email.toLowerCase() },
//       { $set: { role: 'admin' } }
//     );
//     console.log('♻️  Existing user upgraded to admin:', ADMIN.email);
//   } else {
//     const hashed = await bcrypt.hash(ADMIN.password, 10);
//     await users.insertOne({
//       ...ADMIN,
//       email: ADMIN.email.toLowerCase(),
//       password: hashed,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     });
//     console.log('✅ Admin created:', ADMIN.email);
//   }

//   await mongoose.disconnect();
//   console.log('🔌 Disconnected');
// }

// run().catch((e) => {
//   console.error('❌ Error:', e);
//   process.exit(1);
// });