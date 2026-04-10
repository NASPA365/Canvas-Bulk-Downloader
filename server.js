require('dotenv').config();

const express = require('express');
const path = require('path');
const coursesRoutes = require('./routes/courses');
const downloadRoutes = require('./routes/download');
const { initDownloadsDirectory } = require('./lib/files');

const app = express();
const PORT = process.env.PORT || 3000;
const downloadsDir = path.join(__dirname, 'downloads');

initDownloadsDirectory(downloadsDir);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/downloads', express.static(downloadsDir));
app.use(express.json());

app.use('/api/courses', coursesRoutes);
app.use('/api', downloadRoutes);

if (!process.env.CANVAS_URL || !process.env.CANVAS_TOKEN) {
  console.warn('WARNING: CANVAS_URL or CANVAS_TOKEN is not set. /api/courses will fail until these environment variables are configured.');
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
