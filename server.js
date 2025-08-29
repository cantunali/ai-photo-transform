// @ts-check
// CommonJS server for Railway deployment
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS konfigürasyonu (production için)
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://*.netlify.app',
    'https://*.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));

app.use(express.json());

// Upload klasörü oluştur
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer konfigürasyonu
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Desteklenmeyen dosya tipi'));
    }
  }
});

// Static dosya servis
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Upload endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Dosya yüklenmedi' });
    }

    const baseUrl = process.env.RAILWAY_STATIC_URL || 
                   process.env.PUBLIC_URL || 
                   `http://localhost:${PORT}`;
    
    const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
    
    console.log('✅ Dosya yüklendi:', imageUrl);

    res.json({
      success: true,
      imageUrl: imageUrl,
      filename: req.file.filename,
      size: req.file.size,
      uploadedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Upload hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası', message: error.message });
  }
});

// Dosya bilgisi endpoint
app.get('/api/file-info/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadsDir, filename);
  
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    res.json({
      exists: true,
      filename: filename,
      size: stats.size,
      uploadedAt: stats.birthtime,
      url: `${process.env.RAILWAY_STATIC_URL || `http://localhost:${PORT}`}/uploads/${filename}`
    });
  } else {
    res.status(404).json({ exists: false, error: 'Dosya bulunamadı' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    port: PORT,
    env: process.env.NODE_ENV || 'development',
    uploadsCount: fs.readdirSync(uploadsDir).length
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'AI Photo Transform Backend',
    version: '1.0.0',
    status: 'running',
    endpoints: [
      'POST /api/upload',
      'GET /api/health',
      'GET /api/file-info/:filename',
      'GET /uploads/:filename'
    ]
  });
});

// Error handling
app.use((error, req, res, next) => {
  console.error('❌ Server Error:', error);
  res.status(500).json({ error: 'Internal Server Error', message: error.message });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend sunucu çalışıyor: http://localhost:${PORT}`);
  console.log(`📁 Upload klasörü: ${uploadsDir}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});