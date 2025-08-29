const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3001;

// CORS ve JSON middleware
app.use(cors());
app.use(express.json());

// Upload klasörü oluştur
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
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
app.use('/uploads', express.static('uploads'));

// Upload endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Dosya yüklenmedi' });
    }

    const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    
    console.log('✅ Dosya yüklendi:', imageUrl);

    res.json({
      success: true,
      imageUrl: imageUrl,
      filename: req.file.filename,
      size: req.file.size
    });

  } catch (error) {
    console.error('❌ Upload hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Upload sunucusu çalışıyor: http://localhost:${PORT}`);
  console.log(`📁 Upload klasörü: ${uploadsDir}`);
});