// app/api/products/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import Product from '@/models/Product';

// GET: Fetch products
export async function GET(req) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit')) || 1000; // Default to 1000 if not provided
    const page = parseInt(searchParams.get('page')) || 1;
    const skip = (page - 1) * limit;

    // Fetch products from MongoDB
    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({ products });
  } catch (error) {
    console.error('GET Products Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch products' }, { status: 500 });
  }
}