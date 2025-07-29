const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const http = require('http');
const mongoose = require('mongoose');
const authRoutes = require('./server/routes/authRoutes');
const connectDB = require('./server/utils/db');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const http = require('http');
const mongoose = require('mongoose');
const authRoutes = require('./server/routes/authRoutes');
const connectDB = require('./server/utils/db');
const setupSocket = require('./server/socket'); // ✅ یہ لائن شامل کریں

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

// ✅ Serve PDFs
app.get('/pdf/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'client', 'pdf', req.params.filename);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline');
  res.sendFile(filePath);
});

// ✅ Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.get('/admin-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'admin-dashboard.html'));
});

// ✅ Setup Socket
setupSocket(server); // ✅ اب یہ کام کرے گا

// ✅ Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

require('./server/socket');


const app = express();
const server = http.createServer(app);

// ✅ MongoDB (from Railway Shared Variables)
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

// ✅ Static files (Frontend)
app.use(express.static(path.join(__dirname, 'client')));

// ✅ Serve PDFs
app.get('/pdf/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'client', 'pdf', req.params.filename);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline');
  res.sendFile(filePath);
});

// ✅ API Routes
app.use('/api/auth', authRoutes);

// ✅ Frontend Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.get('/admin-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'admin-dashboard.html'));
});

// ✅ Socket setup
setupSocket(server);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
