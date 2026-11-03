import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import Product from '@/models/Product';
import { withAdmin } from '@/middleware/auth';

// GET: Fetch a single product (Public)
export const GET = async (req, { params }) => {
  await connectToDatabase();
  const { id } = await params;
  const product = await Product.findById(id);
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
  return NextResponse.json(product);
};

// PUT: Update a product (Admin Only)
export const PUT = withAdmin(async (req, { params }) => {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await req.json();

    const product = await Product.findByIdAndUpdate(id, body, { new: true });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
});

// DELETE: Delete a product (Admin Only)
export const DELETE = withAdmin(async (req, { params }) => {
  await connectToDatabase();
  const { id } = await params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
  return NextResponse.json({ message: 'Product deleted' });
});