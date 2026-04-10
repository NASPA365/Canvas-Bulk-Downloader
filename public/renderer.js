function createStatusSpan() {
  const statusSpan = document.createElement('span');
  statusSpan.style.marginLeft = '12px';
  statusSpan.style.fontStyle = 'italic';
  return statusSpan;
}

function createButton(text, options = {}) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = text;

  if (options.className) {
    button.className = options.className;
  }

  if (options.marginLeft) {
    button.style.marginLeft = options.marginLeft;
  }

  return button;
}

export function createDownloadLinkList(files) {
  const fileList = document.createElement('span');
  fileList.style.display = 'inline-block';
  fileList.style.marginLeft = '8px';
  fileList.style.fontWeight = 'normal';

  const maxLinks = 5;
  files.slice(0, maxLinks).forEach((file, index) => {
    const fileLink = document.createElement('a');
    fileLink.href = file.path;
    fileLink.target = '_blank';
    fileLink.textContent = file.filename;
    fileLink.style.marginRight = '6px';
    fileList.appendChild(fileLink);

    if (index < Math.min(files.length, maxLinks) - 1) {
      fileList.appendChild(document.createTextNode(', '));
    }
  });

  if (files.length > maxLinks) {
    fileList.appendChild(document.createTextNode(` + ${files.length - maxLinks} more`));
  }

  return fileList;
}

export function renderCourseModules(course, modules, detailsDiv, onDownloadFile) {
  detailsDiv.innerHTML = '';

  const title = document.createElement('div');
  title.innerHTML = `<strong>Modules for ${course.name || course.id}</strong>`;
  detailsDiv.appendChild(title);

  if (!Array.isArray(modules) || modules.length === 0) {
    const empty = document.createElement('div');
    empty.textContent = 'No modules found for this course.';
    detailsDiv.appendChild(empty);
    return;
  }

  const list = document.createElement('ul');
  list.style.listStyleType = 'none';
  list.style.margin = '0';
  list.style.padding = '0';

  modules.forEach(module => {
    const moduleName = module.name || `Module ${module.position || module.id}`;
    const moduleItem = document.createElement('li');
    moduleItem.style.marginBottom = '16px';
    moduleItem.style.padding = '10px 12px';
    moduleItem.style.border = '1px solid #ccc';
    moduleItem.style.borderRadius = '6px';
    moduleItem.style.backgroundColor = '#fafafa';

    const header = document.createElement('div');
    header.style.fontSize = '1.08rem';
    header.style.fontWeight = '700';
    header.style.marginBottom = '10px';
    header.style.color = '#222';
    header.textContent = moduleName;
    moduleItem.appendChild(header);

    if (Array.isArray(module.items) && module.items.length > 0) {
      const itemList = document.createElement('ul');
      itemList.style.paddingLeft = '18px';
      itemList.style.listStyleType = 'none';
      itemList.style.margin = '0';

      module.items.forEach(item => {
        const itemType = item.type || item.content_type || 'item';
        const itemTitle = item.title || item.context_name || item.external_url || item.filename || 'Untitled';
        const itemLine = document.createElement('li');
        itemLine.style.marginBottom = '8px';
        itemLine.style.fontSize = '0.98rem';
        itemLine.style.lineHeight = '1.4';

        const titleSpan = document.createElement('span');
        titleSpan.style.fontWeight = String(itemType).toLowerCase() === 'file' ? '600' : '500';
        titleSpan.textContent = itemTitle;
        itemLine.appendChild(titleSpan);

        if (String(itemType).toLowerCase() === 'file') {
          const itemStatus = document.createElement('span');
          itemStatus.style.marginLeft = '10px';
          const itemDownloadBtn = createButton('Download file', { className: 'download-button', marginLeft: '8px' });
          itemDownloadBtn.addEventListener('click', () => {
            onDownloadFile(item.download_url || item.url, itemStatus);
          });
          itemLine.appendChild(itemDownloadBtn);
          itemLine.appendChild(itemStatus);
        }

        itemList.appendChild(itemLine);
      });

      moduleItem.appendChild(itemList);
    } else {
      const emptyItem = document.createElement('div');
      emptyItem.textContent = 'No items available in this module.';
      moduleItem.appendChild(emptyItem);
    }

    list.appendChild(moduleItem);
  });

  detailsDiv.appendChild(list);
}

export function createCourseItem(course, callbacks) {
  const li = document.createElement('li');
  const courseCode = course.course_code || course.id || 'N/A';
  const courseName = course.name || 'Untitled course';

  const title = document.createElement('span');
  title.textContent = `${courseName} (${courseCode})`;
  title.style.marginRight = '12px';

  const statusSpan = createStatusSpan();

  const downloadBtn = createButton('Download all module files', { className: 'download-button', marginLeft: '8px' });
  downloadBtn.addEventListener('click', () => callbacks.onDownload(course, downloadBtn, statusSpan));

  const detailsBtn = createButton('Show modules', { marginLeft: '8px' });
  detailsBtn.addEventListener('click', () => callbacks.onToggleDetails(course, detailsDiv, detailsBtn));

  const detailsDiv = document.createElement('div');
  detailsDiv.style.marginTop = '8px';
  detailsDiv.style.paddingLeft = '20px';
  detailsDiv.style.display = 'none';
  detailsDiv.style.fontSize = '0.95rem';
  detailsDiv.style.lineHeight = '1.4';

  li.appendChild(title);
  li.appendChild(downloadBtn);
  li.appendChild(detailsBtn);
  li.appendChild(statusSpan);
  li.appendChild(detailsDiv);

  return { li, detailsDiv, detailsBtn, statusSpan };
}
