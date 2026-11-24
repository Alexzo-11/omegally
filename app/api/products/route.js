// app/api/products/route.js (POST handler)
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import Product from '@/models/Product';
import { verifyToken } from '@/lib/jwt';

export async function POST(req) {
  try {
    await connectToDatabase();
    
    // Check Auth
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const body = await req.json();

    // Save Product
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
    console.error('Product POST Error:', error); // This will print the exact error in Vercel logs
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}