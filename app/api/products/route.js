// app/api/products/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import Product from '@/models/Product';

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    
    // If limit is not specified, return ALL products (no limit)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')) : 0;
    const page = parseInt(searchParams.get('page')) || 1;
    const skip = (page - 1) * (limit || 1000);

    let query = Product.find({}).sort({ createdAt: -1 }).skip(skip);
    
    // Only apply limit if it was explicitly passed
    if (limit > 0) {
      query = query.limit(limit);
    }

    const products = await query.lean();

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Products API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}