import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Users, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { register } from '../../services/authService';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await register({ email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userEmail', res.data.email);
      localStorage.setItem('userRole', res.data.role || 'user');
      navigate(res.data.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center p-4 font-serif">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-[32px] shadow-xl max-w-md w-full border border-black/5"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-[#5A5A40] p-4 rounded-full">
            <Users className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-[#1A1A1A] mb-2">Create Account</h1>
        <p className="text-center text-[#5A5A40]/60 mb-8 italic">Start your journey with us today</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5A5A40]/40" />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full pl-12 pr-4 py-3 bg-[#F5F5F0] border-none rounded-2xl focus:ring-2 focus:ring-[#5A5A40] transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5A5A40]/40" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full pl-12 pr-12 py-3 bg-[#F5F5F0] border-none rounded-2xl focus:ring-2 focus:ring-[#5A5A40] transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[#5A5A40]/60 hover:text-[#5A5A40]"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">{error}</p>}

          <button
            type="submit"
            className="w-full py-4 bg-[#5A5A40] text-white rounded-full font-medium hover:bg-[#4A4A30] transition-all shadow-lg shadow-[#5A5A40]/20 flex items-center justify-center gap-2"
          >
            Register
            <ChevronRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/login" className="text-[#5A5A40] hover:underline underline-offset-8 transition-all">
            Already have an account? Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
