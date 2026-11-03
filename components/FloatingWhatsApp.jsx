'use client';

import { usePathname } from 'next/navigation';

export default function FloatingWhatsApp() {
  const pathname = usePathname();

  // Only show on home page and product detail pages
  if (pathname !== '/' && !pathname.startsWith('/products/')) return null;

  // Extract product ID if on a product page
  const isProductPage = pathname.startsWith('/products/');
  const productId = isProductPage ? pathname.split('/')[2] : null;
  
  // Pre-filled message
  const message = isProductPage 
    ? `Hi Admin, I'm interested in the product at omegally.com${pathname}`
    : 'Hello Admin, I have an inquiry about Omegally';

  return (
    <a
      href={`https://wa.me/2348106509069?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed', bottom: '24px', right: '24px',
        width: '60px', height: '60px', backgroundColor: '#25D366', color: '#fff',
        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '2rem', boxShadow: '0 4px 16px rgba(37, 211, 102, 0.4)', zIndex: 999,
        transition: 'transform 0.2s ease',
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <i className="fab fa-whatsapp"></i>
    </a>
  );
}