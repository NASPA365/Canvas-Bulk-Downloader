# Canvas Bulk Downloader

A local-only web app for browsing Canvas courses and downloading module files into the project’s `downloads/` folder.

## Features

- Loads active Canvas courses.
- Shows the modules inside each course.
- Lets you download individual files from modules.
- Lets you download all module files from a course at once.
- Saves downloaded files locally inside the project.

## How it works

The app runs on your own computer. You open it in the browser, choose a course, and click download on the files you want.

Downloaded files are saved inside the `downloads/` folder in the project root. That keeps everything together and makes the files easy to find afterward.

## Tech stack

- Node.js
- Express
- HTML
- CSS
- JavaScript
- Canvas API integration

## Setup

1. Install dependencies.
2. Create a `.env` file based on `.env.example`.
3. Add your Canvas credentials.
4. Start the server.
5. Open the app in your browser.

## Project structure

```txt
project-root/
├── downloads/
├── lib/
│   ├── canvasClient.js
│   └── files.js
├── public/
│   ├── api.js
│   ├── app.js
│   ├── index.html
│   ├── renderer.js
│   └── style.css
├── routes/
│   ├── courses.js
│   └── download.js
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

## Notes

The project scope became simpler during development. Instead of building a larger system, the focus shifted to one useful feature: a clean and reliable local downloader for Canvas course files.

## Future improvements

- Better file organization.
- Cleaner visual design.
- More control over how downloaded files are named and grouped.
- Additional handling for edge cases in Canvas file downloads.
