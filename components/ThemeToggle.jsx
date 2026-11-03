'use client';
import { useTheme } from '@/context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button className="nav-icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
      <i className={theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'}></i>
    </button>
  );
}