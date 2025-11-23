const express = require("express");
const cors = require("cors");
const app = express();

// Middleware - Allow Chrome extension and localhost
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    // Allow localhost and Chrome extensions
    if (origin.startsWith('http://localhost') || 
        origin.startsWith('https://localhost') ||
        origin.startsWith('chrome-extension://')) {
      return callback(null, true);
    }
    
    // Allow custom CORS origins from env
    const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [];
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging disabled for production

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'healthy',
    message: 'Mentra Backend API Server',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Mount v1 routes
const aiRoutes = require("./routes/v1/ai.routes");
const reflectionsRoutes = require("./routes/v1/reflections.routes");
const statsRoutes = require("./routes/v1/stats.routes");
const settingsRoutes = require("./routes/v1/settings.routes");

// Mount AI routes at /api/ai
app.use("/api/ai", aiRoutes);
app.use("/api/v1/ai", aiRoutes);

// Mount other routes
app.use("/api/reflections", reflectionsRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/settings", settingsRoutes);

app.use("/api/v1/reflections", reflectionsRoutes);
app.use("/api/v1/stats", statsRoutes);
app.use("/api/v1/settings", settingsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app;
