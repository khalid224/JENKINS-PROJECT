import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { BRAND_NAME } from '../utils/constants';

type SocialIconProps = { size?: number };

const InstagramIcon = ({ size = 15 }: SocialIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
const TwitterIcon = ({ size = 15 }: SocialIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l16 16M4 20L20 4"/>
    <path d="M4 4c1 4 3.5 7 7 9s7 3 9 3M20 4c-1 4-3.5 7-7 9S6 16 4 17"/>
  </svg>
);
const FacebookIcon = ({ size = 15 }: SocialIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const YoutubeIcon = ({ size = 15 }: SocialIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
  </svg>
);

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0d0d0d] text-gray-300">
      {/* Newsletter */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="section-subtitle !text-[#c5a880] mb-2">Newsletter</p>
              <h3 className="text-2xl font-serif text-white">
                Stay Ahead of the Style
              </h3>
              <p className="text-gray-400 mt-1 text-sm">
                New arrivals & exclusive offers delivered to your inbox.
              </p>
            </div>
            <form
              className="flex w-full md:w-auto"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 md:w-72 px-5 py-3 bg-white/5 border border-gray-700 text-white placeholder-gray-500 outline-none focus:border-[#c5a880] transition-colors"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-[#c5a880] text-white hover:bg-[#b29367] transition-colors flex items-center gap-2 shrink-0"
              >
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link
              to="/"
              className="font-serif text-xl font-bold text-white tracking-widest"
            >
              {BRAND_NAME}
            </Link>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed">
              Premium menswear crafted with intention. Timeless style for the
              modern gentleman.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[
                { icon: InstagramIcon, label: 'Instagram', href: '#' },
                { icon: TwitterIcon, label: 'Twitter', href: '#' },
                { icon: FacebookIcon, label: 'Facebook', href: '#' },
                { icon: YoutubeIcon, label: 'YouTube', href: '#' },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center border border-gray-700 text-gray-400 hover:border-[#c5a880] hover:text-[#c5a880] transition-colors duration-200"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-widest uppercase mb-4">
              Shop
            </h4>
            <ul className="space-y-2.5">
              {['New Arrivals', 'Suits', 'Shirts', 'Outerwear', 'Casual', 'Accessories'].map(
                (item) => (
                  <li key={item}>
                    <Link
                      to="/products"
                      className="text-sm text-gray-400 hover:text-[#c5a880] transition-colors duration-200"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-widest uppercase mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {['About Us', 'Careers', 'Press', 'Sustainability', 'Store Locator'].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-gray-400 hover:text-[#c5a880] transition-colors duration-200"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-widest uppercase mb-4">
              Support
            </h4>
            <ul className="space-y-2.5">
              {['FAQ', 'Shipping & Returns', 'Size Guide', 'Care Instructions', 'Contact Us'].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-gray-400 hover:text-[#c5a880] transition-colors duration-200"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {['Privacy Policy', 'Terms of Service', 'Cookie Settings'].map((t) => (
              <a key={t} href="#" className="hover:text-[#c5a880] transition-colors">
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
