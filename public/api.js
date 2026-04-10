const JSON_HEADERS = {
  'Content-Type': 'application/json'
};

async function requestJson(url, options = {}, defaultError = 'Request failed') {
  const response = await fetch(url, options);
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(body?.error || defaultError);
  }

  return body;
}

export async function fetchCourses() {
  return requestJson('/api/courses', {}, 'Failed to load courses.');
}

export async function fetchCourseDetails(courseId) {
  return requestJson(`/api/courses/${courseId}/details`, {}, 'Failed to load course details.');
}

export async function downloadCourseModuleFiles(courseId) {
  return requestJson(`/api/courses/${courseId}/download-module-files`, {
    method: 'POST'
  }, 'Failed to download module files.');
}

export async function downloadFileByUrl(url) {
  return requestJson('/api/download-file', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ url })
  }, 'Failed to download file from Canvas.');
}
