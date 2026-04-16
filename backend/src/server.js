import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import employeeRoutes from './routes/employees.js';
import User from './models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI is not set in .env file');
  process.exit(1);
}

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000; // change to 5000 for backend

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api', employeeRoutes);
  app.use('/api/*', (req, res) => res.status(404).json({ message: 'API route not found' }));

  const frontendDist = path.resolve(__dirname, '../../frontend/dist');
  if (fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));
    app.get('*', (req, res) => res.sendFile(path.join(frontendDist, 'index.html')));
  } else {
    app.get('*', (req, res) => res.status(404).json({ message: 'Route not found' }));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}

startServer();
