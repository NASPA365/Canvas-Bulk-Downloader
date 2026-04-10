const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream/promises');
const { Readable } = require('stream');

function sanitizeFilename(name) {
  return (name || 'file').replace(/[^a-zA-Z0-9-_.]/g, '_').replace(/_+/g, '_');
}

function ensureDirExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function ensureUniqueFilename(filename, dir = path.resolve('.')) {
  ensureDirExists(dir);
  const base = path.basename(filename, path.extname(filename));
  const ext = path.extname(filename);
  let target = filename;
  let counter = 1;

  while (fs.existsSync(path.join(dir, target))) {
    target = `${base}_${counter++}${ext}`;
  }

  return target;
}

function getCourseDownloadDir(courseName, courseId, downloadsDir) {
  const safeCourseName = sanitizeFilename(courseName || `course_${courseId}`);
  const courseDir = path.join(downloadsDir, safeCourseName);
  ensureDirExists(courseDir);
  return courseDir;
}

async function downloadCanvasStream(url, destPath, token) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const body = await response.text();
    const error = new Error(`Canvas file download ${response.status}: ${body}`);
    error.status = response.status;
    throw error;
  }

  if (!response.body) {
    throw new Error('No response body available for download.');
  }

  const fileStream = fs.createWriteStream(destPath);
  await pipeline(Readable.fromWeb(response.body), fileStream);
}

function initDownloadsDirectory(downloadsDir) {
  ensureDirExists(downloadsDir);
}

module.exports = {
  sanitizeFilename,
  ensureDirExists,
  ensureUniqueFilename,
  getCourseDownloadDir,
  downloadCanvasStream,
  initDownloadsDirectory
};
