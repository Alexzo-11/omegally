import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import Review from '@/models/Review';
import Product from '@/models/Product';
import Order from '@/models/Order';
import { withAuth } from '@/middleware/auth';

// GET: Fetch all reviews for a product
export const GET = async (req, { params }) => {
  await connectToDatabase();
  const { id } = await params;
  const reviews = await Review.find({ product: id }).sort({ createdAt: -1 });
  return NextResponse.json({ reviews });
};

// POST: Submit a review (only if user bought the product)
export const POST = withAuth(async (req, { params }) => {
  try {
    await connectToDatabase();
    const { id } = await params;
    const { rating, comment } = await req.json();

    // Check if user bought this product
    const hasPurchased = await Order.findOne({
      user: req.user.id,
      'items.product': id,
      paymentStatus: 'paid'
    });

    if (!hasPurchased) {
      return NextResponse.json({ error: 'You can only review products you have purchased.' }, { status: 403 });
    }

    // Check if user already reviewed
    const existing = await Review.findOne({ product: id, user: req.user.id });
    if (existing) {
      return NextResponse.json({ error: 'You have already reviewed this product.' }, { status: 400 });
    }

    // Create review
    const review = new Review({
      product: id,
      user: req.user.id,
      name: hasPurchased.user?.name || 'Verified Buyer',
      rating: Number(rating),
      comment
    });
    await review.save();

    // Recalculate average rating for the product
    const allReviews = await Review.find({ product: id });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    
    await Product.findByIdAndUpdate(id, {
      rating: avgRating.toFixed(1),
      numReviews: allReviews.length
    });

    return NextResponse.json(review, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
});