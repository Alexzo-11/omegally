// app/api/products/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import Product from '@/models/Product';
import User from '@/models/User'; // Import User to verify admin
import { verifyToken } from '@/lib/jwt';

// GET: Fetch products
export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit')) || 2000;
    const page = parseInt(searchParams.get('page')) || 1;
    const skip = (page - 1) * limit;

    const products = await Product.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create a new product (Admin only)
export async function POST(req) {
  try {
    await connectToDatabase();
    
    // 1. Check Auth
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    
    const user = await User.findById(decoded.id);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // 2. Parse Body
    const body = await req.json();

    // 3. Save Product
    const product = new Product({
      title: body.title,
      description: body.description || '',
      price: Number(body.price),
      discountPrice: Number(body.discountPrice) || 0,
      deliveryFee: Number(body.deliveryFee) || 0,
      stock: Number(body.stock) || 0,
      images: Array.isArray(body.images) ? body.images : [],
      category: body.category || 'Other',
      brand: body.brand || '',
      sizes: Array.isArray(body.sizes) ? body.sizes : [],
      colors: Array.isArray(body.colors) ? body.colors : [],
      isFeatured: Boolean(body.isFeatured),
    });

    await product.save();

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('POST Product Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}