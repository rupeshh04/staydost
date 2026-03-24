require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

const { connectDB } = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const leadRoutes = require('./routes/leads');
const userRoutes = require('./routes/users');

const app = express();

// ─── Database connection is established lazily per-request (serverless-safe)
// connectDB() is awaited in the /api middleware below

// ─── Security Middleware ────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false })); // CSP disabled so we can serve React
const allowedOrigins = process.env.CLIENT_URL
  ? [process.env.CLIENT_URL]
  : ['http://localhost:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow same-origin requests (no origin header) and configured origins
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// ─── Rate Limiting ──────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// ─── General Middleware ─────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── API Routes ─────────────────────────────────────────────────────────────
// Ensure MongoDB is connected before any API handler runs (serverless-safe)
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(503).json({ success: false, message: 'Database unavailable. Please try again.' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/users', userRoutes);

// ─── Health Check ───────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'StayDost API is running', timestamp: new Date().toISOString() });
});

// ─── Serve React Frontend ──────────────────────────────────────────────────
// Try multiple possible paths for the dist folder (local vs Vercel serverless)
const fs = require('fs');
const possibleDists = [
  path.join(__dirname, 'client', 'dist'),
  path.join(process.cwd(), 'client', 'dist'),
  '/var/task/client/dist',
];
const distPath = possibleDists.find(p => fs.existsSync(path.join(p, 'index.html')));

app.get('/api/debug-path', (req, res) => {
  res.json({ __dirname, cwd: process.cwd(), distPath, possibleDists: possibleDists.map(p => ({ p, exists: fs.existsSync(p) })) });
});

if (distPath) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.get('*', (req, res) => {
    res.status(503).send('Frontend not built. distPath not found. Checked: ' + possibleDists.join(', '));
  });
}

// ─── Global Error Handler ───────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server (local dev only) ────────────────────────────────────────
if (process.env.NODE_ENV !== 'production' || require.main === module) {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`🚀 StayDost server running on http://localhost:${PORT}`);
    console.log(`   Mode: ${process.env.NODE_ENV || 'development'}`);
  });
}

// ─── Export for Vercel Serverless ──────────────────────────────────────────
module.exports = app;
