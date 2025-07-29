const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const http = require('http');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const setupSocket = require('./socket');

const app = express();
const server = http.createServer(app);

// ✅ MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/your-db-name')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Static files (Frontend)
app.use(express.static(path.join(__dirname, '..', 'client')));

// ✅ Serve PDFs for synced book viewing (inline instead of download)
app.get('/pdf/:filename', (req, res) => {
  const filePath = path.join(__dirname, '..', 'client', 'pdf', req.params.filename);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline'); // Force browser view instead of download
  res.sendFile(filePath);
});

// ✅ API Routes
app.use('/api/auth', authRoutes);

// ✅ Frontend Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

app.get('/admin-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'admin-dashboard.html'));
});

// ✅ Socket.IO setup
setupSocket(server);

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
