import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import Product from '@/models/Product';
import { withAdmin } from '@/middleware/auth'; // 👈 THIS IS THE MISSING IMPORT

// GET: Public — List all products

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    
    // Default to 1000 if no limit is passed, instead of 100
    const limit = parseInt(searchParams.get('limit')) || 1000; 
    const page = parseInt(searchParams.get('page')) || 1;
    const skip = (page - 1) * limit;

    const products = await Product.find({}).skip(skip).limit(limit).lean();

    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// POST: Admin only — Create a new product
export const POST = withAdmin(async (req) => {
  try {
    await connectToDatabase();
    const body = await req.json();

    if (!body.title || body.price == null) {
      return NextResponse.json({ error: 'Title and price are required' }, { status: 400 });
    }

  const product = new Product({
  title: body.title,
  description: body.description || '',
  price: Number(body.price),
  discountPrice: Number(body.discountPrice) || 0,
  deliveryFee: Number(body.deliveryFee) || 0, // Add 
  size: body.size || '', // Make sure this is here
  color: body.color || '', // Make sure this is here
  stock: Number(body.stock) || 0,
  images: Array.isArray(body.images) ? body.images : [],
  videoUrl: body.videoUrl || '',
  category: body.category || 'Other',
  brand: body.brand || '',
});

    await product.save();
    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error('Create product error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
});