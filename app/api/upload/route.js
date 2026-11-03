import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { withAdmin } from '@/middleware/auth';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif',
  'video/mp4', 'video/webm'
];

export const POST = withAdmin(async (req) => {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only JPG, PNG, WEBP, GIF, MP4, or WEBM allowed' },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File too large — max 10MB' },
        { status: 400 }
      );
    }

    // Convert to base64 for Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Determine resource type (video or image)
    const resourceType = file.type.startsWith('video/') ? 'video' : 'image';

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64, {
      folder: 'omegally/products',
      resource_type: resourceType,
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      type: resourceType,
    }, { status: 201 });

  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json(
      { error: 'Upload failed', details: err.message },
      { status: 500 }
    );
  }
});