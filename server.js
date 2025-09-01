const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const UPLOAD_BASE_DIR = path.join(__dirname, 'upload');
const BLOG_UPLOAD_DIR = path.join(UPLOAD_BASE_DIR, 'blog');
const NOTE_UPLOAD_DIR = path.join(UPLOAD_BASE_DIR, 'note');

if (!fs.existsSync(BLOG_UPLOAD_DIR)) {
    fs.mkdirSync(BLOG_UPLOAD_DIR, { recursive: true });
}
if (!fs.existsSync(NOTE_UPLOAD_DIR)) {
    fs.mkdirSync(NOTE_UPLOAD_DIR, { recursive: true });
}

// Multer storage configuration for blogs
const blogStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, BLOG_UPLOAD_DIR);
    },
    filename: function (req, file, cb) {
        const original = file.originalname || 'upload.md';
        const base = path.basename(original).replace(/[^a-zA-Z0-9_\-\.]/g, '_');
        const name = base.toLowerCase().endsWith('.md') ? base : `${base}.md`;
        cb(null, name);
    }
});

const uploadBlog = multer({
    storage: blogStorage,
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

// Multer storage configuration for notes
const noteStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, NOTE_UPLOAD_DIR);
    },
    filename: function (req, file, cb) {
        const original = file.originalname || 'upload.md';
        const base = path.basename(original).replace(/[^a-zA-Z0-9_\-\.]/g, '_');
        const name = base.toLowerCase().endsWith('.md') ? base : `${base}.md`;
        cb(null, name);
    }
});

const uploadNote = multer({
    storage: noteStorage,
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

const app = express();
app.use(cors());
app.use(express.json()); // Enable JSON body parsing

// Health check
app.get('/api/health', (req, res) => {
    res.json({ ok: true });
});

// Upload endpoint for blogs
app.post('/api/upload-blog', uploadBlog.single('file'), async (req, res) => {
    console.log('Received upload-blog request');
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    let tags = [];
    if (req.body && typeof req.body.tags !== 'undefined') {
        try {
            const parsed = typeof req.body.tags === 'string' ? JSON.parse(req.body.tags) : req.body.tags;
            tags = Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.warn('Invalid blog tags, defaulting to []');
            tags = [];
        }
    }
    const filenameWithoutExt = path.parse(req.file.filename).name;
    const tagsFilePath = path.join(BLOG_UPLOAD_DIR, `${filenameWithoutExt}.tags.json`);

    try {
        await fs.promises.writeFile(tagsFilePath, JSON.stringify({ tags }), 'utf8');
    } catch (error) {
        console.error('Failed to save blog tags:', error);
        return res.status(500).json({ error: 'Failed to save tags' });
    }

    return res.json({
        ok: true,
        filename: req.file.filename,
        path: `/upload/blog/${req.file.filename}`,
        tags: tags // Return tags with response
    });
});

// Upload endpoint for notes
app.post('/api/upload-note', uploadNote.single('file'), async (req, res) => {
    console.log('Received upload-note request');
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    let tags = [];
    if (req.body && typeof req.body.tags !== 'undefined') {
        try {
            const parsed = typeof req.body.tags === 'string' ? JSON.parse(req.body.tags) : req.body.tags;
            tags = Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.warn('Invalid note tags, defaulting to []');
            tags = [];
        }
    }
    const filenameWithoutExt = path.parse(req.file.filename).name;
    const tagsFilePath = path.join(NOTE_UPLOAD_DIR, `${filenameWithoutExt}.tags.json`);

    try {
        await fs.promises.writeFile(tagsFilePath, JSON.stringify({ tags }), 'utf8');
    } catch (error) {
        console.error('Failed to save note tags:', error);
        return res.status(500).json({ error: 'Failed to save tags' });
    }

    return res.json({
        ok: true,
        filename: req.file.filename,
        path: `/upload/note/${req.file.filename}`,
        tags: tags // Return tags with response
    });
});

// Endpoint to get all blog posts
app.get('/api/blogs', async (req, res) => {
    try {
        const files = await fs.promises.readdir(BLOG_UPLOAD_DIR);
        const blogPosts = await Promise.all(files.map(async (file) => {
            if (!file.endsWith('.md')) return null; // Only process .md files

            const filePath = path.join(BLOG_UPLOAD_DIR, file);
            const content = await fs.promises.readFile(filePath, 'utf8');
            const lines = content.split('\n');
            let title = path.parse(file).name; // Default title from filename
            if (lines.length > 0 && lines[0].startsWith('# ')) {
                title = lines[0].substring(2).trim();
            }
            const excerpt = content.substring(0, 150) + '...';
            const date = (await fs.promises.stat(filePath)).birthtime.toISOString().split('T')[0];
            const wordCount = content.split(/\s+/).length;
            const readTime = `${Math.ceil(wordCount / 200)}分钟阅读`;

            const filenameWithoutExt = path.parse(file).name;
            const tagsFilePath = path.join(BLOG_UPLOAD_DIR, `${filenameWithoutExt}.tags.json`);
            let tags = [];
            if (fs.existsSync(tagsFilePath)) {
                const tagsContent = await fs.promises.readFile(tagsFilePath, 'utf8');
                tags = JSON.parse(tagsContent).tags || [];
            }

            return { title, date, readTime, excerpt, content, tags };
        }));
        res.json({ ok: true, blogs: blogPosts.filter(Boolean) }); // Filter out nulls
    } catch (error) {
        console.error('Failed to read blog files:', error);
        res.status(500).json({ error: 'Failed to retrieve blog posts' });
    }
});

// Endpoint to get all notes
app.get('/api/notes', async (req, res) => {
    try {
        const files = await fs.promises.readdir(NOTE_UPLOAD_DIR);
        const notes = await Promise.all(files.map(async (file) => {
            if (!file.endsWith('.md')) return null; // Only process .md files

            const filePath = path.join(NOTE_UPLOAD_DIR, file);
            const content = await fs.promises.readFile(filePath, 'utf8');
            const lines = content.split('\n');
            let title = path.parse(file).name; // Default title from filename
            if (lines.length > 0 && lines[0].startsWith('# ')) {
                title = lines[0].substring(2).trim();
            }
            const excerpt = content.substring(0, 150) + '...';
            const date = (await fs.promises.stat(filePath)).birthtime.toISOString().split('T')[0];

            const filenameWithoutExt = path.parse(file).name;
            const tagsFilePath = path.join(NOTE_UPLOAD_DIR, `${filenameWithoutExt}.tags.json`);
            let tags = [];
            if (fs.existsSync(tagsFilePath)) {
                const tagsContent = await fs.promises.readFile(tagsFilePath, 'utf8');
                tags = JSON.parse(tagsContent).tags || [];
            }

            return { title, date, excerpt, content, tags };
        }));
        res.json({ ok: true, notes: notes.filter(Boolean) }); // Filter out nulls
    } catch (error) {
        console.error('Failed to read note files:', error);
        res.status(500).json({ error: 'Failed to retrieve notes' });
    }
});

// Static serve saved blog files (optional for local dev)
app.use('/upload/blog', express.static(BLOG_UPLOAD_DIR));
app.use('/upload/note', express.static(NOTE_UPLOAD_DIR));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Upload server listening on http://localhost:${PORT}`);
});

