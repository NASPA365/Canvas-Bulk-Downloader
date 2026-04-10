const express = require('express');
const path = require('path');
const { fetchCanvasJson, getCanvasAbsoluteUrl } = require('../lib/canvasClient');
const { sanitizeFilename, ensureUniqueFilename, getCourseDownloadDir, downloadCanvasStream } = require('../lib/files');

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

router.get('/', async (req, res) => {
  if (!requireCanvasCredentials(res)) return;

  try {
    const courses = await fetchCanvasJson('courses?enrollment_state=active', process.env.CANVAS_TOKEN);
    res.json(courses);
  } catch (error) {
    console.error('Canvas fetch error:', error);
    res.status(error.status || 500).json({ error: 'Failed to fetch courses from Canvas' });
  }
});

router.get('/:courseId/details', async (req, res) => {
  if (!requireCanvasCredentials(res)) return;

  const courseId = req.params.courseId;

  try {
    const course = await fetchCanvasJson(`courses/${courseId}?include[]=syllabus_body`, process.env.CANVAS_TOKEN);
    const modules = await fetchCanvasJson(`courses/${courseId}/modules?include[]=items&per_page=100`, process.env.CANVAS_TOKEN);

    await Promise.all(modules.map(async (module) => {
      if (!Array.isArray(module.items)) return;
      await Promise.all(module.items.map(async (item) => {
        if (String(item.type).toLowerCase() !== 'file') return;

        if (item.content_id) {
          try {
            const fileMetadata = await fetchCanvasJson(`files/${item.content_id}`, process.env.CANVAS_TOKEN);
            item.download_url = fileMetadata.url ? getCanvasAbsoluteUrl(fileMetadata.url) : getCanvasAbsoluteUrl(item.url);
            item.filename = fileMetadata.filename || item.title || `file_${item.content_id}`;
          } catch (error) {
            item.download_url = getCanvasAbsoluteUrl(item.url);
            item.filename = item.title || `file_${item.content_id}`;
          }
        } else if (item.url) {
          item.download_url = getCanvasAbsoluteUrl(item.url);
          item.filename = item.title || path.basename(item.url);
        }
      }));
    }));

    res.json({ course, modules });
  } catch (error) {
    console.error('Canvas course details fetch error:', error);
    res.status(error.status || 500).json({ error: error.message || 'Failed to fetch course details from Canvas' });
  }
});

router.post('/:courseId/download-module-files', async (req, res) => {
  if (!requireCanvasCredentials(res)) return;

  const courseId = req.params.courseId;

  try {
    const course = await fetchCanvasJson(`courses/${courseId}`, process.env.CANVAS_TOKEN);
    const modules = await fetchCanvasJson(`courses/${courseId}/modules?include[]=items&per_page=100`, process.env.CANVAS_TOKEN);
    const courseDir = getCourseDownloadDir(course.name, courseId, path.join(__dirname, '..', 'downloads'));
    const downloadedFiles = [];

    for (const module of modules) {
      if (!Array.isArray(module.items)) continue;
      for (const item of module.items) {
        if (String(item.type).toLowerCase() !== 'file') continue;

        let downloadUrl = null;
        let filename = item.title || `file_${item.content_id || item.id}`;

        if (item.content_id) {
          try {
            const fileMetadata = await fetchCanvasJson(`files/${item.content_id}`, process.env.CANVAS_TOKEN);
            downloadUrl = fileMetadata.url ? getCanvasAbsoluteUrl(fileMetadata.url) : getCanvasAbsoluteUrl(item.url);
            filename = fileMetadata.filename || filename;
          } catch (error) {
            downloadUrl = getCanvasAbsoluteUrl(item.url);
          }
        } else if (item.url) {
          downloadUrl = getCanvasAbsoluteUrl(item.url);
        }

        if (!downloadUrl) continue;

        const safeName = sanitizeFilename(filename);
        const uniqueFilename = ensureUniqueFilename(safeName, courseDir);
        const destPath = path.join(courseDir, uniqueFilename);
        await downloadCanvasStream(downloadUrl, destPath, process.env.CANVAS_TOKEN);

        downloadedFiles.push({
          module: module.name || `module_${module.id}`,
          item: item.title || item.content_id || `file_${item.id}`,
          filename: uniqueFilename,
          path: `/downloads/${path.relative(path.join(__dirname, '..', 'downloads'), destPath).replace(/\\/g, '/')}`
        });
      }
    }

    if (downloadedFiles.length === 0) {
      return res.status(404).json({ error: 'No downloadable file attachments found in this course modules.' });
    }

    res.json({ success: true, count: downloadedFiles.length, files: downloadedFiles });
  } catch (error) {
    console.error('Course module file download error:', error);
    res.status(error.status || 500).json({ error: error.message || 'Failed to download module files from Canvas.' });
  }
});

module.exports = router;
