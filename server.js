// Only load .env file in local development — Vercel injects env vars directly
if (!process.env.MONGODB_URI) {
  require('dotenv').config();
}
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

// NOTE: CORS is applied only to /api routes (not static assets).
// Static assets are loaded with the `crossorigin` attribute which sends an Origin header —
// running them through CORS middleware with a strict origin check causes the server to
// respond with a CORS error (JSON) instead of the actual file, resulting in a blank page.
const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://staydost.vercel.app',
  'http://localhost:5173',
  'http://localhost:5001',
].filter(Boolean);

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
if (!process.env.VERCEL) {
  app.use(morgan('dev'));
}

// ─── API Routes ─────────────────────────────────────────────────────────────
// Health + debug (no DB needed)
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'StayDost API is running', timestamp: new Date().toISOString() });
});

app.get('/api/debug-path', (req, res) => {
  const fs = require('fs');
  const possibleDists = [
    path.join(__dirname, 'client', 'dist'),
    path.join(process.cwd(), 'client', 'dist'),
    '/var/task/client/dist',
  ];
  res.json({
    __dirname,
    cwd: process.cwd(),
    distPath: possibleDists.find(p => fs.existsSync(path.join(p, 'index.html'))),
    mongoUriSet: !!process.env.MONGODB_URI,
    mongoUriPrefix: process.env.MONGODB_URI ? process.env.MONGODB_URI.slice(0, 20) + '...' : 'NOT SET',
    nodeEnv: process.env.NODE_ENV,
  });
});

// Ensure MongoDB is connected before any API handler runs (serverless-safe)
app.use('/api', cors({
  origin: (origin, callback) => {
    // Allow same-origin requests (no origin header) and configured origins
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
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

// ─── Serve React Frontend ──────────────────────────────────────────────────
// Try multiple possible paths for the dist folder (local vs Vercel serverless)
const fs = require('fs');
const possibleDists = [
  path.join(__dirname, 'client', 'dist'),
  path.join(process.cwd(), 'client', 'dist'),
  '/var/task/client/dist',
];
const distPath = possibleDists.find(p => fs.existsSync(path.join(p, 'index.html')));

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
// require.main === module is false when Vercel imports this file, true when run directly
if (require.main === module) {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`🚀 StayDost server running on http://localhost:${PORT}`);
    console.log(`   Mode: ${process.env.NODE_ENV || 'development'}`);
  });
}

// ─── Export for Vercel Serverless ──────────────────────────────────────────
module.exports = app;
