'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [activeMedia, setActiveMedia] = useState({ type: 'image', url: '' });

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        if (data.images && data.images.length > 0) {
          setActiveMedia({ type: 'image', url: data.images[0] });
        }
      })
      .catch(() => router.push('/products'))
      .finally(() => setLoading(false));
  }, [id, router]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/products/${id}/reviews`)
      .then(res => res.json())
      .then(data => setReviews(data.reviews || []))
      .catch(console.error);
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to review');
    setSubmittingReview(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/products/${id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newReview)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setReviews([data, ...reviews]);
      setNewReview({ rating: 5, comment: '' });
      setHasReviewed(true);
      alert('Review submitted!');
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      alert('Please login to add items to cart');
      return router.push('/login');
    }
    setAdding(true);
    addToCart({
      id: product._id, 
      title: product.title, 
      price: product.price,
      image: product.images?.[0] || '', 
      qty: quantity,
      deliveryFee: product.deliveryFee || 0 
    });
    setTimeout(() => setAdding(false), 1000);
  };

  if (loading) return (
    <div style={{ paddingTop: 'calc(var(--nav-height) + 80px)', textAlign: 'center', minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--primary)' }}></i>
    </div>
  );
  
  if (!product) return null;

  const isOutOfStock = product.stock <= 0;

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'calc(var(--nav-height) + 40px)', paddingBottom: '100px', background: 'var(--bg)' }}>
        
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          
          <div style={{ marginBottom: '32px', fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Link href="/">Home</Link> 
            <i className="fas fa-chevron-right" style={{ fontSize: '0.6rem' }}></i>
            <Link href="/products">Products</Link> 
            <i className="fas fa-chevron-right" style={{ fontSize: '0.6rem' }}></i>
            <span style={{ color: 'var(--text)', fontWeight: 600 }}>{product.title}</span>
          </div>

          <div className="product-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '60px', alignItems: 'start' }}>
            
            {/* Media Gallery */}
            <div>
              <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '20px', boxShadow: 'var(--shadow-sm)' }}>
                {activeMedia.type === 'video' ? (
                  activeMedia.url.endsWith('.mp4') ? (
                    <video src={activeMedia.url} style={{ width: '100%', maxHeight: '600px', objectFit: 'contain' }} controls playsInline />
                  ) : (
                    <img src={activeMedia.url} style={{ width: '100%', maxHeight: '600px', objectFit: 'contain' }} alt="GIF" />
                  )
                ) : (
                  <img src={activeMedia.url} style={{ width: '100%', maxHeight: '600px', objectFit: 'contain' }} alt={product.title} />
                )}
              </div>

              <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
                {product.images?.map((img, i) => (
                  <button key={i} onClick={() => setActiveMedia({ type: 'image', url: img })} style={{ width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', border: activeMedia.url === img ? '2px solid var(--primary)' : '1px solid var(--border)', flexShrink: 0, cursor: 'pointer', background: 'var(--bg-elevated)', padding: 0, opacity: activeMedia.url === img ? 1 : 0.6 }}>
                    <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={`Thumbnail ${i}`} />
                  </button>
                ))}
                {product.videoUrl && (
                  <button onClick={() => setActiveMedia({ type: 'video', url: product.videoUrl })} style={{ width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', border: activeMedia.url === product.videoUrl ? '2px solid var(--primary)' : '1px solid var(--border)', flexShrink: 0, cursor: 'pointer', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: activeMedia.url === product.videoUrl ? 1 : 0.6 }}>
                    <i className="fas fa-play" style={{ color: 'var(--primary)', fontSize: '1.2rem' }}></i>
                  </button>
                )}
              </div>
            </div>

            {/* Details */}
            <div style={{ position: 'sticky', top: 'calc(var(--nav-height) + 40px)' }}>
              
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <span style={{ background: 'rgba(37,99,235,0.1)', color: 'var(--primary)', padding: '6px 14px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>{product.category}</span>
                {product.brand && <span style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)', padding: '6px 14px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 600 }}>{product.brand}</span>}
              </div>
              
              <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '16px', color: 'var(--text)' }}>{product.title}</h1>
              
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '32px' }}>₦{Number(product.price).toLocaleString()}</div>

              <div style={{ marginBottom: '32px' }}>
                {isOutOfStock ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--danger)', fontWeight: 600, background: 'rgba(239,68,68,0.1)', padding: '8px 16px', borderRadius: '8px' }}><i className="fas fa-times-circle"></i> Out of Stock</span>
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--success)', fontWeight: 600, background: 'rgba(16,185,129,0.1)', padding: '8px 16px', borderRadius: '8px' }}><i className="fas fa-check-circle"></i> In Stock ({product.stock} available)</span>
                )}
              </div>
              {/* Price Block with Discount Logic */}
<div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
  {product.discountPrice > 0 ? (
    <>
      <span style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary)' }}>
        ₦{product.discountPrice.toLocaleString()}
      </span>
      <span style={{ fontSize: '1.2rem', color: 'var(--text-tertiary)', textDecoration: 'line-through' }}>
        ₦{product.price.toLocaleString()}
      </span>
      <span style={{ background: 'var(--danger)', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700 }}>
        SALE
      </span>
    </>
  ) : (
    <span style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary)' }}>
      ₦{product.price.toLocaleString()}
    </span>
  )}
</div>

{/* Size & Color Badges */}
{(product.size || product.color) && (
  <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
    {product.size && (
      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', padding: '8px 16px', borderRadius: '8px' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>Size</span>
        <strong style={{ fontSize: '0.95rem' }}>{product.size}</strong>
      </div>
    )}
    {product.color && (
      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', padding: '8px 16px', borderRadius: '8px' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>Color</span>
        <strong style={{ fontSize: '0.95rem' }}>{product.color}</strong>
      </div>
    )}
  </div>
)}

              <div style={{ background: 'var(--bg-elevated)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', marginBottom: '32px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><i className="fas fa-align-left" style={{ color: 'var(--primary)' }}></i> Description</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem', whiteSpace: 'pre-line' }}>{product.description || 'No description available for this product.'}</p>
              </div>

              {!isAdmin && (
                <div style={{ display: 'flex', gap: '16px', alignItems: 'stretch', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', height: '56px', background: 'var(--bg-elevated)' }}>
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: '48px', height: '100%', border: 'none', background: 'transparent', fontSize: '1.2rem', cursor: quantity <= 1 ? 'not-allowed' : 'pointer' }} disabled={quantity <= 1}>-</button>
                    <span style={{ width: '50px', textAlign: 'center', fontWeight: 700, fontSize: '1.1rem' }}>{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} style={{ width: '48px', height: '100%', border: 'none', background: 'transparent', fontSize: '1.2rem', cursor: quantity >= product.stock ? 'not-allowed' : 'pointer' }} disabled={quantity >= product.stock}>+</button>
                  </div>
                  <button onClick={handleAddToCart} disabled={isOutOfStock || adding} className="btn-primary" style={{ flex: 1, minWidth: '200px', height: '56px', borderRadius: '12px', justifyContent: 'center', fontSize: '1.05rem' }}>
                    {adding ? <><i className="fas fa-check"></i> Added!</> : isOutOfStock ? 'Out of Stock' : <><i className="fas fa-shopping-cart"></i> Add to Cart</>}
                  </button>
                </div>
              )}

              {isAdmin && (
                <div style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--warning)', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 600 }}>
                  <i className="fas fa-shield-alt"></i> You are viewing this as an Admin. Cart is disabled.
                </div>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '24px' }}>Customer Reviews</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px' }}>
              <div>
                {reviews.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)' }}>No reviews yet. Be the first to review!</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {reviews.map(r => (
                      <div key={r._id} style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', gap: '4px', color: 'var(--warning)', marginBottom: '8px' }}>
                          {[...Array(5)].map((_, i) => <i key={i} className={`fas fa-star ${i >= r.rating ? 'far' : ''}`}></i>)}
                        </div>
                        <p style={{ fontSize: '0.95rem', marginBottom: '8px' }}>{r.comment}</p>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{r.name} · {new Date(r.createdAt).toLocaleDateString()}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="card" style={{ padding: '24px', alignSelf: 'start' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '16px' }}>Write a Review</h3>
                {!user ? (
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}><Link href="/login" style={{ color: 'var(--primary)' }}>Login</Link> to write a review.</p>
                ) : hasReviewed ? (
                  <p style={{ color: 'var(--success)', fontWeight: 600 }}>Thank you for your review!</p>
                ) : (
                  <form onSubmit={handleSubmitReview}>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '6px' }}>Rating</label>
                      <select value={newReview.rating} onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })} className="input">
                        <option value={5}>5 Stars - Excellent</option>
                        <option value={4}>4 Stars - Good</option>
                        <option value={3}>3 Stars - Average</option>
                        <option value={2}>2 Stars - Poor</option>
                        <option value={1}>1 Star - Terrible</option>
                      </select>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '6px' }}>Review</label>
                      <textarea className="input" rows="4" required value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })} placeholder="What did you like or dislike?" />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={submittingReview}>
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />

      <style jsx global>{`
        @media (max-width: 900px) {
          .product-detail-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .product-detail-grid > div[style*="position: sticky"] { position: static !important; }
        }
      `}</style>
    </>
  );
}