const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const http = require('http');
const mongoose = require('mongoose');
const authRoutes = require('./server/routes/authRoutes');
const setupSocket = require('./server/socket'); // ✅ یہاں بھی درست

const app = express();
const server = http.createServer(app);

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

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

// ✅ PDF View
app.get('/pdf/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'client', 'pdf', req.params.filename);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline');
  res.sendFile(filePath);
});

// ✅ Start Socket Server
setupSocket(server); // 🔥 یہ لائن socket.io کو start کرتی ہے

// ✅ Start Express Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
