import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useProductStore } from '../store/useProductStore';
import ProductCard from '../components/ProductCard';
import { BRAND_TAGLINE } from '../utils/constants';

const CATEGORIES = [
  { label: 'Suits', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80', color: 'from-gray-900/80' },
  { label: 'Shirts', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80', color: 'from-slate-900/80' },
  { label: 'Outerwear', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=600&q=80', color: 'from-zinc-900/80' },
  { label: 'Casual', image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&q=80', color: 'from-stone-900/80' },
];

const Home: React.FC = () => {
  const { products, loading, fetchProducts } = useProductStore();

  useEffect(() => {
    if (products.length === 0) fetchProducts();
  }, []);

  const featured = products.filter((p) => p.isFeatured).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNew).slice(0, 4);

  return (
    <div className="animate-fade-in">
      {/* ─── HERO ─── */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80"
          alt="TX Men Wear hero"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="relative z-10 text-center px-4 max-w-3xl mx-auto"
        >
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.5em' }}
            animate={{ opacity: 1, letterSpacing: '0.3em' }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-[#c5a880] text-xs font-medium tracking-[0.4em] uppercase mb-4"
          >
            TX Men Wear · Collection 2025
          </motion.p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-white leading-[1.1] mb-6">
            {BRAND_TAGLINE}
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            Premium menswear curated for the discerning gentleman. Timeless silhouettes, exceptional craftsmanship.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/products" className="btn-primary">
              Shop Collection <ArrowRight size={16} />
            </Link>
            <Link to="/products?category=Suits" className="btn-outline border-white text-white hover:bg-white hover:text-gray-900">
              Explore Suits
            </Link>
          </div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50"
        >
          <ChevronDown size={28} />
        </motion.div>
      </section>

      {/* ─── MARQUEE STRIP ─── */}
      <div className="bg-[#c5a880] py-3 overflow-hidden">
        <div className="flex gap-8 animate-[marquee_20s_linear_infinite] whitespace-nowrap">
          {Array(6).fill('NEW ARRIVALS · FREE SHIPPING OVER $300 · PREMIUM CRAFTSMANSHIP · TX MEN WEAR ·').map((t, i) => (
            <span key={i} className="text-white text-xs font-semibold tracking-[0.3em] uppercase shrink-0">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ─── CATEGORIES ─── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="section-subtitle mb-2">Explore</p>
          <h2 className="section-title">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={`/products?category=${cat.label}`}
                className="group relative aspect-[3/4] overflow-hidden block"
              >
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} to-transparent`} />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-white font-serif text-xl font-semibold">{cat.label}</h3>
                  <span className="text-[#c5a880] text-xs font-medium tracking-wider uppercase flex items-center gap-1 mt-1 group-hover:gap-2 transition-all">
                    Shop Now <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="section-subtitle mb-2">Handpicked</p>
            <h2 className="section-title">Featured Pieces</h2>
          </div>
          <Link to="/products" className="hidden md:flex items-center gap-2 text-sm font-medium text-[#c5a880] hover:gap-3 transition-all">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-200 dark:bg-gray-800" />
                <div className="mt-3 space-y-2">
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 w-1/2" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featured.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* ─── BANNER ─── */}
      <section className="relative py-28 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1400&q=80"
          alt="Luxury banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/65" />
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <p className="section-subtitle !text-[#c5a880] mb-3">Luxury Redefined</p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white max-w-xl leading-tight mb-6">
            Crafted for Those Who Set the Standard
          </h2>
          <p className="text-gray-300 max-w-md mb-8 leading-relaxed">
            Every piece in our collection is a testament to impeccable tailoring and premium materials sourced from the world's finest mills.
          </p>
          <Link to="/products" className="btn-primary">
            Explore the Collection <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

      {/* ─── NEW ARRIVALS ─── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="section-subtitle mb-2">Just In</p>
            <h2 className="section-title">New Arrivals</h2>
          </div>
          <Link to="/products?sort=newest" className="hidden md:flex items-center gap-2 text-sm font-medium text-[#c5a880] hover:gap-3 transition-all">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-200 dark:bg-gray-800" />
                <div className="mt-3 h-4 bg-gray-200 dark:bg-gray-800 w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {newArrivals.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* ─── USP STRIP ─── */}
      <section className="border-t border-b border-gray-200 dark:border-gray-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { title: 'Free Shipping', sub: 'On orders over $300' },
            { title: 'Premium Quality', sub: 'Finest fabrics & craftsmanship' },
            { title: 'Easy Returns', sub: '30-day hassle-free returns' },
            { title: 'Expert Styling', sub: 'Personal styling consultations' },
          ].map(({ title, sub }) => (
            <div key={title} className="space-y-1">
              <h4 className="font-serif text-gray-900 dark:text-white font-semibold">{title}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">{sub}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
