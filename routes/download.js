const express = require('express');
const path = require('path');
const { sanitizeFilename, ensureUniqueFilename, downloadCanvasStream } = require('../lib/files');

const router = express.Router();

function requireCanvasCredentials(res) {
  if (!process.env.CANVAS_URL || !process.env.CANVAS_TOKEN) {
    res.status(500).json({
      error: 'Canvas API credentials are not configured. Please set CANVAS_URL and CANVAS_TOKEN.'
    });
    return false;
  }
  return true;
}

router.post('/download-file', async (req, res) => {
  if (!requireCanvasCredentials(res)) return;

  const { url } = req.body;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Invalid url provided.' });
  }

  try {
    const canvasUrl = process.env.CANVAS_URL.replace(/\/+$/, '');
    const parsedUrl = new URL(url);
    const allowedHost = new URL(canvasUrl).host;
    if (parsedUrl.host !== allowedHost) {
      return res.status(400).json({ error: 'Only Canvas file URLs are allowed.' });
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.CANVAS_TOKEN}`
      }
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Canvas file download error:', response.status, errorBody);
      return res.status(response.status).json({
        error: `Failed to download file: ${response.status}`
      });
    }

    const contentDisposition = response.headers.get('content-disposition');
    const urlPath = parsedUrl.pathname;
    let filename = 'downloaded_file';

    if (contentDisposition) {
      const match = /filename\*?=(?:UTF-8'')?"?([^";]+)/i.exec(contentDisposition);
      if (match) {
        filename = match[1];
      }
    }

    if (filename === 'downloaded_file') {
      filename = path.basename(urlPath) || filename;
    }

    filename = sanitizeFilename(filename);
    const uniqueFilename = ensureUniqueFilename(filename, path.join(__dirname, '..', 'downloads'));
    const destPath = path.join(__dirname, '..', 'downloads', uniqueFilename);
    await downloadCanvasStream(url, destPath, process.env.CANVAS_TOKEN);

    res.json({
      success: true,
      filename: uniqueFilename,
      path: `/downloads/${uniqueFilename}`
    });
  } catch (error) {
    console.error('Canvas file proxy error:', error);
    res.status(error.status || 500).json({ error: 'Failed to download file from Canvas.' });
  }
});

module.exports = router;
