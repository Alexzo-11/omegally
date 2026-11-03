'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProfileDropdown() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleLogout = () => {
    logout();
    setOpen(false);
    router.push('/');
  };

  return (
    <div className="profile-wrap" ref={ref}>
      <button className="nav-icon-btn profile-btn" onClick={() => setOpen(!open)}>
        {user ? (
          <span className="avatar">{user.name?.charAt(0).toUpperCase()}</span>
        ) : (
          <i className="fas fa-user"></i>
        )}
      </button>
      {open && (
        <div className="dropdown-menu">
          {user ? (
            <>
              <div className="dropdown-header">
                <div className="dropdown-name">{user.name}</div>
                <div className="dropdown-email">{user.email}</div>
              </div>
              <Link href="/" className="dropdown-item" onClick={() => setOpen(false)}>
                <i className="fas fa-receipt"></i> My Orders
              </Link>
              <button className="dropdown-item danger" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="dropdown-item" onClick={() => setOpen(false)}>
                <i className="fas fa-sign-in-alt"></i> Login
              </Link>
              <Link href="/register" className="dropdown-item" onClick={() => setOpen(false)}>
                <i className="fas fa-user-plus"></i> Register
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}