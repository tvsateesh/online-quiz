# Render Deployment Guide

## The Problem & Solution

**Error:** "Cannot POST /api/auth/signup" when deployed on Render

This happens because:
1. Frontend and backend need to be built and deployed together
2. Backend must serve both API routes AND the static Angular frontend
3. The build order and paths must be correct

## What Was Fixed

1. **Updated Backend Server** (`backend/src/server.ts`):
   - Added proper error handling for missing frontend build
   - Logs the frontend path and status
   - Correctly serves static files before SPA fallback

2. **Updated Root Package.json Scripts**:
   ```json
   "build": "npm run build:frontend && npm run build:backend"
   "start": "npm run start:server"
   "build:frontend": "ng build --configuration production"
   "build:backend": "cd backend && npm install && npm run build"
   "start:server": "cd backend && npm start"
   ```

3. **Updated Render Configuration** (`render.yaml`):
   - BuildCommand: `npm install && npm run build` - Builds both frontend and backend
   - StartCommand: `npm start` - Starts the backend server
   - Environment variables configured for MongoDB and JWT

## Deployment Steps

### 1. Ensure All Code is Committed
```bash
git add .
git commit -m "Fix: Update deployment configuration for Render"
git push origin main
```

### 2. On Render Dashboard

1. **Connect your repository** (if not already connected)
2. **Create a new Web Service**:
   - Repository: Your GitHub repo
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Region: Oregon (or your preferred region)
   - Plan: Free or Paid

3. **Add Environment Variables**:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A strong random secret (change from default)
   - `PORT`: `5001`

4. **Deploy**:
   - Click "Create Web Service"
   - Wait for build and deployment to complete
   - Check logs for errors

## Expected Output

During build on Render, you should see:
```
> npm run build
> npm run build:frontend && npm run build:backend

# Angular build output...
Build at: 2026-01-04T02:08:29.967Z - Hash: 8d4bc227c28d8ca3

# Backend build output...
> brain-games-backend@1.0.0 build
> tsc
```

During startup on Render, you should see:
```
> npm start
> npm run start:server
> cd backend && npm start

Brain Games & Rock Stock backend listening on port 5001
✓ Connected to MongoDB
✓ Serving frontend from: ...dist/angular-quiz
```

## Testing After Deployment

1. **Test Frontend** - Visit `https://your-app.onrender.com`
   - Should see the login page
   - Click "Sign up here"

2. **Test API** - Make a request to your deployed API:
   ```bash
   curl -X POST https://your-app.onrender.com/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{
       "username": "testuser",
       "email": "test@example.com",
       "password": "Test123",
       "firstName": "Test",
       "lastName": "User"
     }'
   ```

3. **Expected Response**:
   ```json
   {
     "success": true,
     "message": "User registered successfully",
     "user": {...},
     "token": "eyJ..."
   }
   ```

## Troubleshooting

### "Cannot POST /api/auth/signup"
- Build command didn't complete successfully
- Check Render logs for build errors
- Ensure both frontend and backend built without errors

### "Frontend not found"
- Angular build failed
- Check logs for Angular compilation errors
- Common issue: Budget exceeded warnings (not errors)

### MongoDB Connection Failed
- Check MONGODB_URI is correctly set
- Ensure MongoDB Atlas network access includes Render IPs
- Test connection string locally first

### Port Issues
- Render assigns a specific port, don't override PORT variable
- Leave PORT=5001 to use default, or let Render override it

## Database

The application uses MongoDB Atlas cloud database.

Connection details in `.env`:
```env
MONGODB_URI=mongodb+srv://sateesh:Pandu%40143@rnd.yhfgr7a.mongodb.net/gamesdb?retryWrites=true&w=majority&appName=RnD
```

## Local Testing

To test locally before deploying:

```bash
# Build everything
npm run build

# Start the server
npm start

# Test the API
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"test123"}'

# Test the frontend
open http://localhost:5001
```

## Architecture

```
┌─────────────────────────────────────────┐
│       RENDER DEPLOYMENT                 │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │   Node.js Server (Port 5001)    │   │
│  │                                 │   │
│  │  ┌───────────────────────────┐  │   │
│  │  │  Express Server           │  │   │
│  │  │                           │  │   │
│  │  │  - /api/* routes          │  │   │
│  │  │  - /auth endpoints        │  │   │
│  │  │  - Static file server     │  │   │
│  │  │  - SPA fallback           │  │   │
│  │  └───────────────────────────┘  │   │
│  │                                 │   │
│  │  ┌───────────────────────────┐  │   │
│  │  │  Angular Frontend         │  │   │
│  │  │  (dist/angular-quiz)      │  │   │
│  │  │                           │  │   │
│  │  │  - Signup Component       │  │   │
│  │  │  - Login Component        │  │   │
│  │  │  - Games                  │  │   │
│  │  └───────────────────────────┘  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  MongoDB Atlas (Cloud)          │   │
│  │  - gamesdb database             │   │
│  │  - users collection             │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

**All set!** Your app should now deploy successfully to Render with both the frontend and backend working together.
