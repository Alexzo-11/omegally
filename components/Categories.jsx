'use client';
import Link from 'next/link';

const CATEGORIES = [
  { name: 'Electronics', icon: 'fa-laptop', color: '#2563EB' },
  { name: 'Fashion', icon: 'fa-tshirt', color: '#EC4899' },
  { name: 'Home & Living', icon: 'fa-couch', color: '#F59E0B' },
  { name: 'Beauty', icon: 'fa-spa', color: '#EC4899' },
  { name: 'Sports', icon: 'fa-dumbbell', color: '#059669' },
  { name: 'Accessories', icon: 'fa-watch', color: '#7C3AED' },
];

export default function Categories() {
  return (
    <section className="categories-section">
      <div className="section-container">
        <div className="section-header">
          <div>
            <span className="section-eyebrow">BROWSE</span>
            <h2 className="section-title">Shop by Category</h2>
          </div>
        </div>
        <div className="categories-grid">
          {CATEGORIES.map((cat) => (
            <Link key={cat.name} href={`/products?category=${encodeURIComponent(cat.name)}`} className="category-card">
              <div className="category-icon" style={{ background: `${cat.color}15`, color: cat.color }}>
                <i className={`fas ${cat.icon}`}></i>
              </div>
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}