import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import Ad from '@/models/Ad';
import { withAdmin } from '@/middleware/auth';

// GET: Fetch all active ads (for the homepage)
export async function GET() {
  try {
    await connectToDatabase();
    const ads = await Ad.find({ isActive: true }).sort({ createdAt: -1 });
    return NextResponse.json({ ads });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch ads' }, { status: 500 });
  }
}

// POST: Admin only - Create a new ad
export const POST = withAdmin(async (req) => {
  try {
    await connectToDatabase();
    const body = await req.json();

    if (!body.title || !body.imageUrl) {
      return NextResponse.json({ error: 'Title and image are required' }, { status: 400 });
    }

    const ad = new Ad({
      title: body.title,
      description: body.description || '',
      imageUrl: body.imageUrl,
      linkUrl: body.linkUrl || '/',
      isActive: true,
    });

    await ad.save();
    return NextResponse.json(ad, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
});