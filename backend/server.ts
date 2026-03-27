import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config({ path: './backend/.env' });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI is not set in .env file');
  process.exit(1);
}
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev';
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

// Models
const UserSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);

const EmployeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  position: { type: String, required: true },
  department: { type: String, required: true },
  salary: { type: Number, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const Employee = mongoose.model('Employee', EmployeeSchema);

// Middleware
const authMiddleware = (req: any, res: any, next: any) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

async function startServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Connect to MongoDB
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }

  // Auth Routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'User already exists' });

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        name: name || '',
        email,
        password: hashedPassword,
      });
      await user.save();

      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
      res.status(201).json({ token, email: user.email, name: user.name });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, email: user.email, name: user.name });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Employee CRUD Routes
  app.get('/api/employees', authMiddleware, async (req: any, res) => {
    try {
      const employees = await Employee.find();
      res.json(employees);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/employees', authMiddleware, async (req: any, res) => {
    try {
      const employee = new Employee({ ...req.body, createdBy: req.user.id });
      await employee.save();
      res.status(201).json(employee);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.put('/api/employees/:id', authMiddleware, async (req: any, res) => {
    try {
      const employee = await Employee.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!employee) return res.status(404).json({ message: 'Employee not found' });
      res.json(employee);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.delete('/api/employees/:id', authMiddleware, async (req: any, res) => {
    try {
      const employee = await Employee.findByIdAndDelete(req.params.id);
      if (!employee) return res.status(404).json({ message: 'Employee not found' });
      res.json({ message: 'Employee deleted' });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
      configFile: 'frontend/vite.config.ts',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
