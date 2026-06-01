import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, Sun, Moon, Menu, X, Search, User } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useThemeStore } from '../store/useThemeStore';
import { BRAND_NAME } from '../utils/constants';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Shop' },
  { to: '/admin', label: 'Admin' },
];

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { isDark, toggle } = useThemeStore();
  const { toggleCart, itemCount } = useCartStore();
  const count = itemCount();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 dark:bg-[#121212]/95 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link
              to="/"
              className="font-serif font-bold text-xl lg:text-2xl tracking-wider text-gray-900 dark:text-white hover:text-[#c5a880] transition-colors duration-200"
            >
              {BRAND_NAME}
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `nav-link text-gray-700 dark:text-gray-300 ${
                      isActive ? 'text-[#c5a880] dark:text-[#c5a880]' : ''
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 lg:gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-gray-700 dark:text-gray-300 hover:text-[#c5a880] transition-colors duration-200"
                aria-label="Search"
              >
                <Search size={18} />
              </button>

              {/* Theme toggle */}
              <button
                onClick={toggle}
                className="p-2 text-gray-700 dark:text-gray-300 hover:text-[#c5a880] transition-colors duration-200"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Account */}
              <Link
                to="/login"
                className="hidden lg:flex p-2 text-gray-700 dark:text-gray-300 hover:text-[#c5a880] transition-colors duration-200"
                aria-label="Account"
              >
                <User size={18} />
              </Link>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-[#c5a880] transition-colors duration-200"
                aria-label={`Cart with ${count} items`}
              >
                <ShoppingBag size={20} />
                {count > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 min-w-[1.1rem] min-h-[1.1rem] flex items-center justify-center bg-[#c5a880] text-white text-[9px] font-bold rounded-full leading-none px-1"
                  >
                    {count > 99 ? '99+' : count}
                  </motion.span>
                )}
              </button>

              {/* Mobile menu */}
              <button
                onClick={() => setMobileOpen((o) => !o)}
                className="lg:hidden p-2 text-gray-700 dark:text-gray-300"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden bg-white dark:bg-[#121212] border-t border-gray-100 dark:border-gray-800"
            >
              <nav className="flex flex-col px-4 py-4 gap-1">
                {NAV_LINKS.map(({ to, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === '/'}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `py-3 px-2 text-sm font-medium tracking-wider uppercase border-b border-gray-100 dark:border-gray-800 ${
                        isActive
                          ? 'text-[#c5a880]'
                          : 'text-gray-700 dark:text-gray-300'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                ))}
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="py-3 px-2 text-sm font-medium tracking-wider uppercase text-gray-700 dark:text-gray-300"
                >
                  Account
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
            onClick={() => setSearchOpen(false)}
          >
            <motion.form
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleSearch}
              className="w-full max-w-2xl"
            >
              <div className="flex items-center bg-white dark:bg-[#1e1e1e] px-6 py-4 gap-4">
                <Search size={20} className="text-gray-400 shrink-0" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search for suits, shirts, outerwear…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 text-lg outline-none"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-center text-gray-400 text-sm mt-3">
                Press Enter to search · Esc to close
              </p>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
