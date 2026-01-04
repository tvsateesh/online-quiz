import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { logger } from './middleware/logger';
import { config } from './config';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(logger);
app.use(rateLimiter);

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/brain-games';
mongoose.connect(mongoUri).then(() => {
  console.log('✓ Connected to MongoDB');
}).catch((error) => {
  console.error('✗ MongoDB connection error:', error);
  // Continue without MongoDB if connection fails (for local development)
});

// Serve API routes
app.use('/api', routes);

// Serve static files from frontend build
const frontendPath = path.join(__dirname, '../../dist/angular-quiz');
console.log('Frontend path:', frontendPath);

const fs = require('fs');
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
  console.log('✓ Serving frontend from:', frontendPath);
} else {
  console.warn('⚠️  Frontend build not found at:', frontendPath);
}

// SPA fallback: redirect all non-API routes to index.html for Angular routing
app.get('*', (req, res) => {
  const indexPath = path.join(frontendPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath, (err) => {
      if (err) {
        res.status(404).json({ error: 'Not found' });
      }
    });
  } else {
    res.status(404).json({ error: 'Frontend not found' });
  }
});

app.use(errorHandler);

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Brain Games & Rock Stock backend listening on port ${PORT}`);
});

export default app;
