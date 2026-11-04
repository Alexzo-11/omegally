// app/sitemap.js
import { connectToDatabase } from '@/lib/mongoose';
import Product from '@/models/Product';

export default async function sitemap() {
  const baseUrl = 'https://omegally.vercel.app';

  // Static pages that always exist
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/policies`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  // Dynamic product pages
  let productRoutes = [];
  try {
    await connectToDatabase();
    const products = await Product.find({}).select('_id updatedAt').lean();

    productRoutes = products.map((product) => ({
      url: `${baseUrl}/products/${product._id}`,
      lastModified: product.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Sitemap: Failed to fetch products', error.message);
    // If DB fails, still return static routes — a partial sitemap is better than none
  }

  return [...staticRoutes, ...productRoutes];
}