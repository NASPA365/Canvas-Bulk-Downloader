const path = require('path');

function getCanvasBaseUrl() {
  const canvasUrl = process.env.CANVAS_URL?.replace(/\/+$|\s+/g, '');
  if (!canvasUrl) {
    throw new Error('CANVAS_URL is not configured.');
  }
  return canvasUrl.includes('/api/v1') ? canvasUrl : `${canvasUrl}/api/v1`;
}

function getCanvasAbsoluteUrl(url) {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  const canvasUrl = process.env.CANVAS_URL?.replace(/\/+$|\s+/g, '');
  if (!canvasUrl) {
    throw new Error('CANVAS_URL is not configured.');
  }
  return `${canvasUrl}${url.startsWith('/') ? '' : '/'}${url}`;
}

async function fetchCanvasJson(endpoint, token, options = {}) {
  if (!token) {
    throw new Error('CANVAS_TOKEN is not configured.');
  }

  const base = getCanvasBaseUrl();
  const url = endpoint.startsWith('http') ? endpoint : `${base}/${endpoint.replace(/^\/+/, '')}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    const body = await response.text();
    const error = new Error(`Canvas API ${response.status}: ${body}`);
    error.status = response.status;
    throw error;
  }

  return response.json();
}

module.exports = {
  getCanvasBaseUrl,
  getCanvasAbsoluteUrl,
  fetchCanvasJson
};
