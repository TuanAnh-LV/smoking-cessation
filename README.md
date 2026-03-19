# Smoking Cessation (BE + FE)

A full-stack web application to support smoking-cessation tracking and related features.

## Features

- Authentication
  - Sign up / Sign in / Sign out
  - Forgot password / Reset password
- User Profile
  - Update personal information
  - Manage smoking-cessation goals
- Smoking Tracking
  - Log cigarettes smoked (daily tracking)
  - Track smoke-free streak
  - Statistics by day/week/month
- Plan & Progress
  - Set quit date and reduction plan
  - Progress dashboard (money saved / health milestones)
- Notifications / Reminders
  - Daily reminders
  - Motivation messages
- Admin (if applicable)
  - Manage users
  - Manage content (tips, articles)
- Realtime / Chat (if applicable)
  - Support chat / community (Socket)

> Nếu bạn xác nhận dự án có/không có các mục “Admin”, “Chat/Realtime”, mình sẽ chỉnh lại cho đúng.

## Project Structure

- `BE/` — Backend (Node.js)
- `FE/` — Frontend (React + Vite)

## Requirements

- Node.js (LTS recommended)
- npm

## Setup & Run (Backend)

```bash
cd BE
npm install
npm run dev
```

> If there is no `dev` script, use:
```bash
npm start
```

## Setup & Run (Frontend)

```bash
cd FE
npm install
npm run dev
```

Then open the local URL printed by Vite (usually `http://localhost:5173`).

## Environment Variables

This project may require environment variables for things like:
- Database connection
- Firebase credentials
- API base URL (frontend)

Create `.env` files as needed (commonly: `BE/.env` and/or `FE/.env`) and fill in values based on your deployment/config.

## Deployment Notes

- Frontend includes `FE/vercel.json` (can be deployed to Vercel).
- Backend deployment depends on your hosting choice.

## License

Add a license if you plan to open-source this project.
