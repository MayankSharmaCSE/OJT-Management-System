# Deployment Guide - OJT Management System

I have prepared your repository for deployment. Follow these steps to go live.

## 1. Database Setup (Recommended: Neon.tech)
- Sign up at [Neon.tech](https://neon.tech).
- Create a new project and copy the **Connection String**.
- Keep this string ready for the Backend setup.

## 2. Backend Deployment (Render)
I have added a `render.yaml` file to your project. This makes deployment almost automatic.
- Log in to [Render.com](https://render.com).
- Click **New +** -> **Blueprint**.
- Connect your GitHub repository.
- Render will detect the `render.yaml` and configure the service.
- **IMPORTANT**: During setup, you will be asked for the `DATABASE_URL`. Paste your Neon connection string there.
- Once deployed, copy your backend URL (e.g., `https://ojt-backend.onrender.com`).

## 3. Frontend Deployment (Vercel)
- Log in to [Vercel.com](https://vercel.com).
- Click **Add New** -> **Project**.
- Connect your GitHub repository.
- In the **Project Settings**:
    - **Root Directory**: Select `frontend`.
    - **Framework Preset**: Vite.
    - **Environment Variables**: Add `VITE_API_URL` and set its value to `https://your-backend-url.onrender.com/api/v1`.
- Click **Deploy**.
- Once deployed, copy your frontend URL (e.g., `https://ojt-management.vercel.app`).

## 4. Final Security Step (CORS)
Now that your frontend is live, you must allow it to talk to your backend:
- Go back to your **Render Dashboard**.
- Select your `ojt-backend` service.
- Go to **Environment**.
- Update the `CORS_ORIGINS` variable.
    - Change it from `http://localhost:3000` to `http://localhost:3000,https://your-frontend-url.vercel.app`.
- Save and wait for the redeploy.

---
### Files Created/Modified:
- [requirements.txt](file:///Users/mayanksharma/Desktop/OJT/backend/requirements.txt) - Added `gunicorn` for production.
- [render.yaml](file:///Users/mayanksharma/Desktop/OJT/render.yaml) - Blueprint for one-click Render deployment.
- [.env.production](file:///Users/mayanksharma/Desktop/OJT/frontend/.env.production) - Template for production environment.
