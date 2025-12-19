# AI-enabled Test Automation Dashboard (React + Tailwind)

This app provides a clean, responsive dashboard with authentication, file storage (Firebase or mock), drag-and-drop uploads, test generation stubs, execution queue, and reports.

## Quick Start

- Install: `npm install`
- Start: `npm start`
- Test: `npm test`

By default, the app runs in "sample/mock mode" when Firebase and/or backend env vars are missing.

## Environment

Copy `.env.example` to `.env` and fill in values as needed. Firebase values are optional; if omitted the app uses a mock adapter and sample auth.

## Tech

- React (CRA), TailwindCSS, React Router v6
- Firebase Auth + Storage (optional)
- IndexedDB mock storage
- react-dropzone, react-hot-toast
