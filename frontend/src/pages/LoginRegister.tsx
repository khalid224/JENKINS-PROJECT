import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BRAND_NAME } from '../utils/constants';

const LoginRegister: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=80"
          alt="Fashion backdrop"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/40" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="font-serif text-2xl font-bold text-white tracking-widest">
            {BRAND_NAME}
          </Link>
          <div>
            <p className="text-[#c5a880] text-sm tracking-[0.3em] uppercase font-medium mb-4">
              Dress With Intention
            </p>
            <h2 className="text-4xl font-serif font-bold text-white leading-tight mb-4">
              The Gentleman's Wardrobe, Reimagined.
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
              Join TX Men Wear to access exclusive collections, early access to new arrivals, and personalized styling recommendations.
            </p>
          </div>
          <div className="flex items-center gap-6">
            {[
              { value: '12K+', label: 'Members' },
              { value: '500+', label: 'Pieces' },
              { value: '4.9★', label: 'Rating' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-white font-bold text-lg">{value}</p>
                <p className="text-gray-400 text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-16 bg-white dark:bg-[#121212]">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link to="/" className="lg:hidden font-serif text-xl font-bold text-gray-900 dark:text-white tracking-widest block mb-8">
            {BRAND_NAME}
          </Link>

          {/* Toggle */}
          <div className="flex bg-gray-100 dark:bg-[#1e1e1e] p-1 mb-8">
            {(['Login', 'Register'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => { setIsLogin(tab === 'Login'); setSubmitted(false); }}
                className={`flex-1 py-2.5 text-sm font-semibold tracking-wider uppercase transition-all duration-200 ${
                  (tab === 'Login') === isLogin
                    ? 'bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Success Banner */}
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-3 mb-6 text-sm text-green-600 dark:text-green-400"
              >
                {isLogin ? '✓ Welcome back! Redirecting…' : '✓ Account created! Welcome to TX Men Wear.'}
              </motion.div>
            )}

            {isLogin ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleLoginSubmit}
                className="space-y-5"
              >
                <div>
                  <h1 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-1">Welcome Back</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Sign in to your account</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Email</label>
                  <input
                    type="email"
                    required
                    value={loginForm.email}
                    onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="john@example.com"
                    className="input-field"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Password</label>
                    <a href="#" className="text-xs text-[#c5a880] hover:underline">Forgot password?</a>
                  </div>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      required
                      value={loginForm.password}
                      onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
                      placeholder="••••••••"
                      className="input-field pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn-primary w-full justify-center py-3.5">
                  Sign In <ArrowRight size={16} />
                </button>

                <div className="luxury-divider text-xs text-gray-400">or continue with</div>

                <div className="grid grid-cols-2 gap-3">
                  {['Google', 'Apple'].map((provider) => (
                    <button
                      key={provider}
                      type="button"
                      className="btn-outline py-2.5 text-xs justify-center"
                    >
                      {provider}
                    </button>
                  ))}
                </div>

                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  No account?{' '}
                  <button type="button" onClick={() => setIsLogin(false)} className="text-[#c5a880] hover:underline font-medium">
                    Create one
                  </button>
                </p>
              </motion.form>
            ) : (
              <motion.form
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleRegisterSubmit}
                className="space-y-4"
              >
                <div>
                  <h1 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-1">Create Account</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Join the TX Men Wear community</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'firstName', label: 'First Name', placeholder: 'John' },
                    { key: 'lastName', label: 'Last Name', placeholder: 'Smith' },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">{label}</label>
                      <input
                        required
                        value={(registerForm as any)[key]}
                        onChange={(e) => setRegisterForm((f) => ({ ...f, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className="input-field"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Email</label>
                  <input
                    type="email"
                    required
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="john@example.com"
                    className="input-field"
                  />
                </div>

                {[
                  { key: 'password', label: 'Password', show: showPass, setShow: setShowPass },
                  { key: 'confirmPassword', label: 'Confirm Password', show: showConfirmPass, setShow: setShowConfirmPass },
                ].map(({ key, label, show, setShow }) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">{label}</label>
                    <div className="relative">
                      <input
                        type={show ? 'text' : 'password'}
                        required
                        value={(registerForm as any)[key]}
                        onChange={(e) => setRegisterForm((f) => ({ ...f, [key]: e.target.value }))}
                        placeholder="••••••••"
                        className="input-field pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShow((v: boolean) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {show ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                ))}

                <p className="text-xs text-gray-400">
                  By creating an account, you agree to our{' '}
                  <a href="#" className="text-[#c5a880] hover:underline">Terms of Service</a> and{' '}
                  <a href="#" className="text-[#c5a880] hover:underline">Privacy Policy</a>.
                </p>

                <button type="submit" className="btn-primary w-full justify-center py-3.5">
                  Create Account <ArrowRight size={16} />
                </button>

                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  Already a member?{' '}
                  <button type="button" onClick={() => setIsLogin(true)} className="text-[#c5a880] hover:underline font-medium">
                    Sign in
                  </button>
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
