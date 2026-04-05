import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Users, 
  LogOut, 
  Pencil, 
  Trash2, 
  X, 
  Mail, 
  Lock, 
  Briefcase, 
  DollarSign,
  Building2,
  ChevronRight,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Register Component
function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/api/auth/register', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userEmail', res.data.email);
      window.location.href = '/dashboard';
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
        
        <h1 className="text-3xl font-bold text-center text-[#1A1A1A] mb-2">
          Create Account
        </h1>
        <p className="text-center text-[#5A5A40]/60 mb-8 italic">
          Start your journey with us today
        </p>

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

          {error && (
            <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-4 bg-[#5A5A40] text-white rounded-full font-medium hover:bg-[#4A4A30] transition-all shadow-lg shadow-[#5A5A40]/20 flex items-center justify-center gap-2"
          >
            Register
            <ChevronRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <a
            href="/login"
            className="text-[#5A5A40] hover:underline underline-offset-8 transition-all"
          >
            Already have an account? Login
          </a>
        </div>
      </motion.div>
    </div>
  );
}

// Login Component
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userEmail', res.data.email);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
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
        
        <h1 className="text-3xl font-bold text-center text-[#1A1A1A] mb-2">
          Welcome Back
        </h1>
        <p className="text-center text-[#5A5A40]/60 mb-8 italic">
          Manage your workforce with elegance
        </p>

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

          {error && (
            <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-4 bg-[#5A5A40] text-white rounded-full font-medium hover:bg-[#4A4A30] transition-all shadow-lg shadow-[#5A5A40]/20 flex items-center justify-center gap-2"
          >
            Sign In
            <ChevronRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <a
            href="/register"
            className="text-[#5A5A40] hover:underline underline-offset-8 transition-all"
          >
            Don't have an account? Register
          </a>
        </div>
      </motion.div>
    </div>
  );
}

// Dashboard Component
function Dashboard() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail'));
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    position: '',
    department: '',
    salary: ''
  });

  useEffect(() => {
    if (!token) return;

    fetchEmployees();
  }, [token]);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('/api/employees', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(res.data);
    } catch (err) {
      console.error('Error fetching employees', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setToken(null);
    setUserEmail(null);
    setEmployees([]);
    window.location.href = '/login';
  };

  const handleSubmitEmployee = async (e) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        await axios.put(`/api/employees/${editingEmployee._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('/api/employees', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setIsModalOpen(false);
      setEditingEmployee(null);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        position: '',
        department: '',
        salary: ''
      });
      fetchEmployees();
    } catch (err) {
      console.error('Error saving', err);
    }
  };

  const handleEdit = (emp) => {
    setEditingEmployee(emp);
    setFormData({
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      position: emp.position,
      department: emp.department,
      salary: emp.salary.toString()
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`/api/employees/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchEmployees();
      } catch (err) {
        console.error('Error deleting employee', err);
      }
    }
  };

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0] font-sans">
      {/* Header */}
      <nav className="bg-white border-b border-black/5 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-[#5A5A40] p-2 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-[#1A1A1A] tracking-tight">Employee Management</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <span className="text-sm text-[#5A5A40]/60 hidden md:block">
              Logged in as <span className="font-medium text-[#1A1A1A]">{userEmail}</span>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-full transition-all"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pt-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-4xl font-bold text-[#1A1A1A] mb-2 font-serif">Employee List</h2>
          </div>

          <button
            onClick={() => {
              setEditingEmployee(null);
              setFormData({
                firstName: '',
                lastName: '',
                email: '',
                position: '',
                department: '',
                salary: ''
              });
              setIsModalOpen(true);
            }}
            className="self-start inline-flex items-center gap-2 px-6 py-3 bg-[#5A5A40] text-white rounded-full font-medium hover:bg-[#4A4A30] transition-all shadow-lg shadow-[#5A5A40]/20"
          >
            <Plus className="w-4 h-4" />
            Add Employee
          </button>
        </div>

        {/* Employee Table */}
        <div className="bg-white rounded-[32px] shadow-sm border border-black/5 overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#F5F5F0]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#5A5A40]/60 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#5A5A40]/60 uppercase tracking-wider">Position</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#5A5A40]/60 uppercase tracking-wider">Department</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#5A5A40]/60 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#5A5A40]/60 uppercase tracking-wider">Salary (PHP)</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#5A5A40]/60 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp._id} className="border-t border-black/5">
                  <td className="px-6 py-4 text-sm font-medium text-[#1A1A1A]">{emp.firstName} {emp.lastName}</td>
                  <td className="px-6 py-4 text-sm text-[#5A5A40]/70">{emp.position}</td>
                  <td className="px-6 py-4 text-sm text-[#5A5A40]/70">{emp.department}</td>
                  <td className="px-6 py-4 text-sm text-[#5A5A40]/70">{emp.email}</td>
                  <td className="px-6 py-4 text-sm font-medium text-[#1A1A1A]">{Number(emp.salary).toLocaleString()} PHP</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(emp)}
                        className="p-2 text-[#5A5A40] hover:bg-[#F5F5F0] rounded-xl transition-all"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(emp._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[40px] p-8 shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-[#1A1A1A] font-serif">
                  {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-[#F5F5F0] rounded-full transition-all"
                >
                  <X className="w-6 h-6 text-[#5A5A40]" />
                </button>
              </div>

              <form onSubmit={handleSubmitEmployee} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#5A5A40]/60 ml-1">First Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-5 py-3 bg-[#F5F5F0] border-none rounded-2xl focus:ring-2 focus:ring-[#5A5A40] transition-all"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#5A5A40]/60 ml-1">Last Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-5 py-3 bg-[#F5F5F0] border-none rounded-2xl focus:ring-2 focus:ring-[#5A5A40] transition-all"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#5A5A40]/60 ml-1">Email Address</label>
                  <input
                    type="email"
                    required
                    className="w-full px-5 py-3 bg-[#F5F5F0] border-none rounded-2xl focus:ring-2 focus:ring-[#5A5A40] transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#5A5A40]/60 ml-1">Position</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A5A40]/40" />
                    <input
                      type="text"
                      required
                      className="w-full pl-12 pr-5 py-3 bg-[#F5F5F0] border-none rounded-2xl focus:ring-2 focus:ring-[#5A5A40] transition-all"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#5A5A40]/60 ml-1">Department</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A5A40]/40" />
                    <input
                      type="text"
                      required
                      className="w-full pl-12 pr-5 py-3 bg-[#F5F5F0] border-none rounded-2xl focus:ring-2 focus:ring-[#5A5A40] transition-all"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#5A5A40]/60 ml-1">Annual Salary (PHP)</label>
                  <input
                    type="number"
                    required
                    className="w-full px-5 py-3 bg-[#F5F5F0] border-none rounded-2xl focus:ring-2 focus:ring-[#5A5A40] transition-all"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  />
                </div>

                <div className="md:col-span-2 pt-6">
                  <button
                    type="submit"
                    className="w-full py-4 bg-[#5A5A40] text-white rounded-full font-medium hover:bg-[#4A4A30] transition-all shadow-lg shadow-[#5A5A40]/20"
                  >
                    {editingEmployee ? 'Update Employee' : 'Create Employee'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}