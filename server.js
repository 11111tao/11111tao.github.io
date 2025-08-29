const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure blog directory exists
const BLOG_DIR = path.join(__dirname, 'blog');
if (!fs.existsSync(BLOG_DIR)) {
	fs.mkdirSync(BLOG_DIR, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, BLOG_DIR);
	},
	filename: function (req, file, cb) {
		// Sanitize filename: keep .md extension
		const original = file.originalname || 'upload.md';
		const base = path.basename(original).replace(/[^a-zA-Z0-9_\-\.]/g, '_');
		const name = base.toLowerCase().endsWith('.md') ? base : `${base}.md`;
		cb(null, name);
	}
});

const upload = multer({
	storage,
	limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

const app = express();
app.use(cors());

// Health check
app.get('/api/health', (req, res) => {
	res.json({ ok: true });
});

// Upload endpoint: expects multipart/form-data with field name "file"
app.post('/api/upload', upload.single('file'), (req, res) => {
	if (!req.file) {
		return res.status(400).json({ error: 'No file uploaded' });
	}
	return res.json({
		ok: true,
		filename: req.file.filename,
		path: `/blog/${req.file.filename}`
	});
});

// Static serve saved blog files (optional for local dev)
app.use('/blog', express.static(BLOG_DIR));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Upload server listening on http://localhost:${PORT}`);
});

