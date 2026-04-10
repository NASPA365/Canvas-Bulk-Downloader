import { fetchCourses, fetchCourseDetails, downloadCourseModuleFiles, downloadFileByUrl } from './api.js';
import { createCourseItem, renderCourseModules, createDownloadLinkList } from './renderer.js';

const loadCoursesBtn = document.getElementById('loadCoursesBtn');
const message = document.getElementById('message');
const courseList = document.getElementById('courseList');

async function handleDownloadCourse(course, button, statusSpan) {
  statusSpan.textContent = 'Downloading module files...';
  button.disabled = true;
  button.textContent = 'Downloading files...';

  try {
    const data = await downloadCourseModuleFiles(course.id);

    if (!Array.isArray(data.files) || data.files.length === 0) {
      statusSpan.textContent = 'No downloadable file attachments found in this course.';
      return;
    }

    statusSpan.innerHTML = `Downloaded ${data.files.length} file${data.files.length === 1 ? '' : 's'}:`;
    statusSpan.appendChild(createDownloadLinkList(data.files));
  } catch (error) {
    console.error('Download modules failed:', error);
    statusSpan.textContent = error.message || 'Failed to download module files.';
  } finally {
    button.disabled = false;
    button.textContent = 'Download all module files';
  }
}

async function handleLoadCourseDetails(course, detailsDiv, detailsButton) {
  if (detailsDiv.dataset.loaded === 'true') {
    const hidden = detailsDiv.style.display === 'none';
    detailsDiv.style.display = hidden ? 'block' : 'none';
    detailsButton.textContent = hidden ? 'Hide modules' : 'Show modules';
    return;
  }

  detailsButton.disabled = true;
  detailsButton.textContent = 'Loading modules...';
  detailsDiv.textContent = 'Loading modules...';
  detailsDiv.style.display = 'block';

  try {
    const data = await fetchCourseDetails(course.id);
    renderCourseModules(course, data.modules, detailsDiv, downloadFileByUrl);
    detailsDiv.dataset.loaded = 'true';
    detailsButton.textContent = 'Hide modules';
  } catch (error) {
    console.error('Load course details failed:', error);
    detailsDiv.textContent = error.message || 'Failed to load modules.';
    detailsButton.textContent = 'Show modules';
  } finally {
    detailsButton.disabled = false;
  }
}

async function loadCourses() {
  message.textContent = 'Loading courses from Canvas...';
  courseList.innerHTML = '';

  try {
    const courses = await fetchCourses();

    if (!Array.isArray(courses) || courses.length === 0) {
      message.textContent = 'No active courses found.';
      return;
    }

    message.textContent = `${courses.length} active courses:`;

    courses.forEach(course => {
      const { li, detailsDiv, detailsBtn, statusSpan } = createCourseItem(course, {
        onDownload: handleDownloadCourse,
        onToggleDetails: handleLoadCourseDetails
      });

      courseList.appendChild(li);
    });
  } catch (error) {
    console.error('Fetch error:', error);
    message.textContent = error.message || 'Failed to load courses from the backend.';
  }
}

loadCoursesBtn.addEventListener('click', loadCourses);
