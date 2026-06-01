import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, ShoppingBag, TrendingUp, Users,
  Plus, Pencil, Trash2, X, Check, Search,
} from 'lucide-react';
import { useProductStore } from '../store/useProductStore';
import { formatPrice } from '../utils/formatters';
import type { Product, ProductCategory } from '../utils/types';
import { CATEGORIES } from '../utils/constants';
import { createProduct, deleteProduct, updateProduct } from '../api/products';

const STATS = [
  { label: 'Total Products', icon: Package, color: 'text-blue-400', bgColor: 'bg-blue-400/10' },
  { label: 'Total Orders', icon: ShoppingBag, color: 'text-[#c5a880]', bgColor: 'bg-[#c5a880]/10', value: '1,247' },
  { label: 'Revenue (MTD)', icon: TrendingUp, color: 'text-green-400', bgColor: 'bg-green-400/10', value: '$84,320' },
  { label: 'Customers', icon: Users, color: 'text-purple-400', bgColor: 'bg-purple-400/10', value: '3,891' },
];

interface ProductForm {
  name: string;
  price: string;
  originalPrice: string;
  category: ProductCategory;
  description: string;
  inStock: boolean;
  isNew: boolean;
  isFeatured: boolean;
  tags: string;
}

const emptyForm: ProductForm = {
  name: '', price: '', originalPrice: '',
  category: 'Suits', description: '',
  inStock: true, isNew: false, isFeatured: false, tags: '',
};

const AdminDashboard: React.FC = () => {
  const { products, fetchProducts, addProduct, removeProduct, updateProduct: storeUpdate } = useProductStore();
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    if (products.length === 0) fetchProducts();
  }, []);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setDrawerOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setForm({
      name: p.name,
      price: String(p.price),
      originalPrice: String(p.originalPrice ?? ''),
      category: p.category,
      description: p.description,
      inStock: p.inStock,
      isNew: p.isNew ?? false,
      isFeatured: p.isFeatured ?? false,
      tags: p.tags.join(', '),
    });
    setDrawerOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        category: form.category,
        description: form.description,
        inStock: form.inStock,
        isNew: form.isNew,
        isFeatured: form.isFeatured,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        images: editingProduct?.images ?? ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80'],
        sizes: editingProduct?.sizes ?? ['S', 'M', 'L', 'XL'],
        rating: editingProduct?.rating ?? 4.5,
        reviewCount: editingProduct?.reviewCount ?? 0,
      };

      if (editingProduct) {
        const updated = await updateProduct(editingProduct.id, payload);
        storeUpdate(editingProduct.id, updated);
        setSavedMsg('Product updated successfully!');
      } else {
        const created = await createProduct(payload);
        addProduct(created);
        setSavedMsg('Product created successfully!');
      }
      setDrawerOpen(false);
      setTimeout(() => setSavedMsg(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteProduct(id);
      removeProduct(id);
      setSavedMsg('Product deleted.');
      setTimeout(() => setSavedMsg(''), 2000);
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Saved message */}
      <AnimatePresence>
        {savedMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-20 right-6 z-50 bg-green-500 text-white px-5 py-3 shadow-lg text-sm flex items-center gap-2"
          >
            <Check size={15} /> {savedMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map(({ label, icon: Icon, color, bgColor, value }) => (
          <div
            key={label}
            className="bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-gray-800 p-5 flex items-center gap-4"
          >
            <div className={`w-11 h-11 ${bgColor} flex items-center justify-center shrink-0`}>
              <Icon size={20} className={color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {label === 'Total Products' ? products.length : value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-gray-800">
        {/* Table Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 gap-4 flex-wrap">
          <h2 className="font-serif text-lg font-semibold text-gray-900 dark:text-white">
            Products
          </h2>
          <div className="flex items-center gap-3 flex-1 justify-end">
            <div className="relative max-w-xs w-full">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-8 py-2 text-sm w-full"
              />
            </div>
            <button onClick={openCreate} className="btn-primary py-2 text-xs whitespace-nowrap">
              <Plus size={14} /> Add Product
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                {['Product', 'Category', 'Price', 'Status', 'Rating', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-10 h-12 object-cover bg-gray-100 dark:bg-gray-800 shrink-0"
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white leading-tight max-w-[180px] truncate">
                          {p.name}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div>
                      <span className="font-semibold text-[#c5a880]">{formatPrice(p.price)}</span>
                      {p.originalPrice && (
                        <span className="text-xs text-gray-400 line-through ml-1.5">{formatPrice(p.originalPrice)}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`text-xs px-2.5 py-1 font-medium ${
                        p.inStock
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                          : 'bg-red-50 dark:bg-red-900/20 text-red-500'
                      }`}
                    >
                      {p.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                    {p.isNew && (
                      <span className="ml-1.5 text-xs px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-500">New</span>
                    )}
                    {p.isFeatured && (
                      <span className="ml-1.5 text-xs px-2 py-1 bg-[#c5a880]/10 text-[#c5a880]">Featured</span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-gray-600 dark:text-gray-400">
                    ★ {p.rating} <span className="text-gray-400">({p.reviewCount})</span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(p)}
                        className="p-1.5 text-gray-400 hover:text-[#c5a880] transition-colors"
                        title="Edit product"
                      >
                        <Pencil size={15} />
                      </button>
                      {confirmDeleteId === p.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(p.id)}
                            disabled={deletingId === p.id}
                            className="text-xs px-2 py-1 bg-red-500 text-white hover:bg-red-600 transition-colors"
                          >
                            {deletingId === p.id ? '…' : 'Confirm'}
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="text-xs px-2 py-1 border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(p.id)}
                          className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                          title="Delete product"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              No products found matching "{search}".
            </div>
          )}
        </div>

        <div className="px-6 py-3 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400">
          Showing {filtered.length} of {products.length} products
        </div>
      </div>

      {/* Product Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[70]"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white dark:bg-[#181818] z-[80] flex flex-col shadow-2xl overflow-y-auto scrollbar-thin"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-[#181818] z-10">
                <h3 className="font-serif text-lg font-semibold text-gray-900 dark:text-white">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button onClick={() => setDrawerOpen(false)} className="text-gray-400 hover:text-gray-700 dark:hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <Field label="Product Name">
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Midnight Navy Wool Suit"
                    className="input-field"
                  />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Price ($)">
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                      placeholder="899"
                      className="input-field"
                    />
                  </Field>
                  <Field label="Original Price ($)">
                    <input
                      type="number"
                      value={form.originalPrice}
                      onChange={(e) => setForm((f) => ({ ...f, originalPrice: e.target.value }))}
                      placeholder="Optional"
                      className="input-field"
                    />
                  </Field>
                </div>

                <Field label="Category">
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as ProductCategory }))}
                    className="input-field"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Description">
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Describe the product…"
                    rows={4}
                    className="input-field resize-none"
                  />
                </Field>

                <Field label="Tags (comma-separated)">
                  <input
                    value={form.tags}
                    onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                    placeholder="e.g. formal, wool, slim-fit"
                    className="input-field"
                  />
                </Field>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { key: 'inStock', label: 'In Stock' },
                    { key: 'isNew', label: 'New Arrival' },
                    { key: 'isFeatured', label: 'Featured' },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(form as any)[key]}
                        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.checked }))}
                        className="w-4 h-4 accent-[#c5a880]"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
                    </label>
                  ))}
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <button onClick={() => setDrawerOpen(false)} className="btn-outline flex-1 justify-center py-3">
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving || !form.name || !form.price}
                    className="btn-primary flex-1 justify-center py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Saving…
                      </span>
                    ) : editingProduct ? (
                      <><Check size={15} /> Update Product</>
                    ) : (
                      <><Plus size={15} /> Create Product</>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
