const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001; // Change 3001 to any other available port if needed

// --- Serve static files (HTML page for uploading models) ---
app.use(express.static('public'));

// --- 1) "LLM" Placeholder Route ---
app.post('/api/fake-llm', (req, res) => {
  const userMessage = req.body.message;
  // Simple response: echo or some dummy logic
  const response = `You said: ${userMessage} — (Fake LLM response)`;
  res.json({ response });
});

// --- 2) File Upload Setup ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// --- 3) Handle 3D Model Upload ---
app.post('/api/upload-model', upload.single('model'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ msg: 'No file uploaded!' });
  }
  // Return file path so Unity can fetch it
  return res.json({
    filePath: `http://localhost:${PORT}/uploads/${req.file.filename}`
  });
});

// Serve the uploads folder statically so Unity can access files
app.use('/uploads', express.static('uploads'));

// Start server on chosen port
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
