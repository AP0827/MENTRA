const express = require("express");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
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

app.use("/api/v1", aiRoutes);
app.use("/api/v1/reflections", reflectionsRoutes);
app.use("/api/v1/stats", statsRoutes);
app.use("/api/v1/settings", settingsRoutes);

// Also mount at /api for compatibility
app.use("/api", aiRoutes);
app.use("/api/reflections", reflectionsRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/settings", settingsRoutes);

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
