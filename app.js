const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const http = require('http');

const connectDB = require('./server/utils/db'); // ✅ MongoDB connect function
const authRoutes = require('./server/routes/authRoutes');
const setupSocket = require('./server/socket'); // ✅ Socket.IO

const app = express();
const server = http.createServer(app);

// ✅ Connect to MongoDB
connectDB();

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Static Files
app.use(express.static(path.join(__dirname, 'client')));

// ✅ Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.get('/admin-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'admin-dashboard.html'));
});

// ✅ Serve PDFs
app.get('/pdf/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'client', 'pdf', req.params.filename);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline');
  res.sendFile(filePath);
});

// ✅ Initialize Socket.IO
setupSocket(server);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
