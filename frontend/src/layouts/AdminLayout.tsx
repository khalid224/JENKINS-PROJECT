import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useThemeStore } from '../store/useThemeStore';
import { Sun, Moon, LayoutDashboard, Package, LogOut, Home } from 'lucide-react';
import { BRAND_NAME } from '../utils/constants';

const AdminLayout: React.FC = () => {
  const { isDark, toggle } = useThemeStore();
  const { pathname } = useLocation();

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/products', label: 'Products', icon: Package },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-[#0f0f0f] transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-[#0d0d0d] flex flex-col min-h-screen">
        <div className="px-6 py-6 border-b border-gray-800">
          <Link to="/" className="font-serif text-white font-bold text-lg tracking-widest">
            {BRAND_NAME}
          </Link>
          <p className="text-xs text-gray-500 mt-1 tracking-widest uppercase">Admin Panel</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors duration-200 rounded-sm ${
                pathname === to
                  ? 'bg-[#c5a880]/10 text-[#c5a880]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-gray-800 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <Home size={16} /> View Store
          </Link>
          <Link
            to="/login"
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-400 hover:text-red-400 transition-colors"
          >
            <LogOut size={16} /> Sign Out
          </Link>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-14 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#181818] flex items-center justify-between px-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
            {pathname.replace('/admin', '').replace('/', '') || 'Dashboard'}
          </p>
          <button
            onClick={toggle}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-[#c5a880] transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
