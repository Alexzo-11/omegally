'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation'; // Added usePathname
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const router = useRouter();
  const pathname = usePathname(); // Get current path

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    router.push('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    router.push(`/products?q=${encodeURIComponent(q)}`);
    setSearchQuery('');
  };

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const isAdmin = user?.role === 'admin';

  // Hide search on dashboard
  const hideSearch = pathname === '/dashboard';

  return (
    <>
      <header className="navbar">
        {/* Top row */}
        <div className="nav-container">
          <Link href="/" className="nav-logo">
            <img 
              src="/logo.png" 
              alt="Omegally Logo" 
              style={{ 
                height: '100%', 
                maxHeight: '40px',
                width: 'auto',
                objectFit: 'contain'
              }} 
            />
          </Link>

          <nav className="nav-links">
            <Link href="/">Home</Link>
            <Link href="/products">Products</Link>
          </nav>

          <div className="nav-actions">
            {/* Desktop only */}
            <div className="nav-desktop-actions">
              <ThemeToggle />
              <Link href="/cart" className="nav-icon-btn cart-icon">
                <i className="fas fa-shopping-cart"></i>
                {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
              </Link>
              <div className="profile-wrap" ref={dropdownRef}>
                <button
                  className="nav-icon-btn profile-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-label="Profile"
                >
                  {user ? (
                    <span className="avatar">{user.name?.charAt(0).toUpperCase() || 'U'}</span>
                  ) : (
                    <i className="fas fa-user"></i>
                  )}
                </button>
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    {user ? (
                      <>
                        <div className="dropdown-header">
                          <div className="dropdown-name">{user.name}</div>
                          <div className="dropdown-email">{user.email}</div>
                        </div>
                        <Link href="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                          <i className="fas fa-user-circle"></i> Profile
                        </Link>
                        <Link href="/dashboard" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                          <i className="fas fa-tachometer-alt"></i> Dashboard
                        </Link>
                        {isAdmin && (
                          <Link href="/admin" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                            <i className="fas fa-cog"></i> Admin Panel
                          </Link>
                        )}
                        <button className="dropdown-item danger" onClick={handleLogout}>
                          <i className="fas fa-sign-out-alt"></i> Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href="/login" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                          <i className="fas fa-sign-in-alt"></i> Login
                        </Link>
                        <Link href="/register" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                          <i className="fas fa-user-plus"></i> Register
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile only — toggle */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>

        {/* Search bar row (Hidden on mobile via CSS AND hidden on dashboard) */}
        {!hideSearch && (
          <div className="navbar-search">
            <div className="nav-container">
              <form onSubmit={handleSearchSubmit} className="search-form">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-submit">Search</button>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Mobile bottom sheet */}
      {mobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-handle" />

            <div className="sheet-user">
              <div className="sheet-avatar">
                {user ? user.name?.charAt(0).toUpperCase() : <i className="fas fa-user"></i>}
              </div>
              <div>
                <div style={{ fontWeight: 700 }}>{user ? user.name : 'Guest'}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {user ? user.email : 'Sign in to continue'}
                </div>
              </div>
            </div>

            <div className="sheet-section">
              <Link href="/profile" className="sheet-item" onClick={() => setMobileMenuOpen(false)}>
                <i className="fas fa-user-circle"></i><span>Profile</span>
                <i className="fas fa-chevron-right sheet-arrow"></i>
              </Link>
              <Link href="/cart" className="sheet-item" onClick={() => setMobileMenuOpen(false)}>
                <i className="fas fa-shopping-cart"></i>
                <span>Cart {totalItems > 0 && <span className="sheet-badge">{totalItems}</span>}</span>
                <i className="fas fa-chevron-right sheet-arrow"></i>
              </Link>
              <div className="sheet-item" style={{ cursor: 'default' }}>
                <i className="fas fa-moon"></i>
                <span style={{ flex: 1 }}>Theme</span>
                <ThemeToggle />
              </div>
              <Link href="/dashboard" className="sheet-item" onClick={() => setMobileMenuOpen(false)}>
                <i className="fas fa-tachometer-alt"></i><span>Dashboard</span>
                <i className="fas fa-chevron-right sheet-arrow"></i>
              </Link>
              <Link href="/products" className="sheet-item" onClick={() => setMobileMenuOpen(false)}>
                <i className="fas fa-box"></i><span>Products</span>
                <i className="fas fa-chevron-right sheet-arrow"></i>
              </Link>
            </div>

            <div className="sheet-actions">
              {user ? (
                <button className="btn btn-danger w-full" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i> Logout
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Link href="/login" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setMobileMenuOpen(false)}>Login</Link>
                  <Link href="/register" className="btn" style={{ flex: 1 }} onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}