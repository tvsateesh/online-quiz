# Sign-Up Feature Documentation

## Overview
The Brain Games application now includes a complete user sign-up and authentication system with MongoDB integration.

## Features Implemented

### 1. Frontend Components
- **Signup Component** (`/src/app/signup/signup.component.ts`)
  - Reactive form with FormBuilder validation
  - Fields: username, email, firstName, lastName, password, confirmPassword
  - Real-time form validation with error messages
  - Password visibility toggle
  - Success/error message display
  - Automatic redirect to games on successful registration

### 2. Backend API Endpoints
- **POST /api/auth/signup** - User registration
  - Request body: `{ username, email, password, firstName, lastName }`
  - Response: User object with JWT token
  - Validation: Email and username uniqueness, password hashing

- **POST /api/auth/login** - User login
  - Request body: `{ email, password }`
  - Response: User object with JWT token
  - Validation: Email existence and password verification

### 3. Database
- **MongoDB User Model** (`/backend/src/models/User.ts`)
  - Fields: username, email, password (hashed), firstName, lastName, timestamps
  - Unique constraints on username and email
  - Password validation (minimum 6 characters)
  - Automatic password hashing using bcryptjs
  - Password comparison method for login verification

### 4. Authentication Service
- **Auth Service** (`/backend/src/services/authService.ts`)
  - Signup method with duplicate user checking
  - Login method with password validation
  - JWT token generation with 30-day expiration
  - Comprehensive error handling

### 5. Frontend Integration
- **Login Component Updated** with signup link
- **Signup Route** added to routing module
- **SignupComponent** declared in app module
- **HTTP Client** for API communication
- **Local Storage** for JWT token and user data persistence

## Setup Instructions

### Prerequisites
1. Node.js v14+ installed
2. MongoDB running locally or accessible via connection string
3. Angular CLI installed

### Installation

1. **Install Backend Dependencies**
```bash
cd backend
npm install
```

2. **Configure Environment Variables**
Edit `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/brain-games
JWT_SECRET=your_jwt_secret_key_here_change_in_production
PORT=5001
```

3. **Build Backend**
```bash
npm run build
```

4. **Install Frontend Dependencies**
```bash
cd ../
npm install
```

5. **Build Frontend**
```bash
npm run build
```

## Usage

### Starting the Application

1. **Start Backend Server**
```bash
cd backend
npm start  # or npm run dev for development with ts-node
```
Server runs on http://localhost:5001

2. **Start Frontend Development Server** (if developing)
```bash
ng serve --open
```
Frontend runs on http://localhost:4200

### Creating an Account

1. Navigate to login page
2. Click "Sign up here" link at the bottom
3. Fill in the sign-up form:
   - **Username**: At least 3 characters, lowercase
   - **Email**: Valid email format
   - **First Name**: Optional
   - **Last Name**: Optional
   - **Password**: At least 6 characters
   - **Confirm Password**: Must match password
4. Click "Sign Up" button
5. On success, automatically redirected to games page

### Logging In

1. Navigate to login page
2. Enter username (or email) and password
3. Click "Sign In" button
4. On success, redirected to games page
5. JWT token stored in localStorage

## API Response Examples

### Successful Signup
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Failed Signup (Duplicate Email)
```json
{
  "success": false,
  "message": "User already exists",
  "error": "Email already registered"
}
```

### Login Response
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Security Features

1. **Password Hashing**: Passwords hashed using bcryptjs with salt rounds
2. **JWT Tokens**: Secure token-based authentication with 30-day expiration
3. **Input Validation**: Email format, password length, username uniqueness
4. **CORS Protection**: Cross-origin requests properly configured
5. **Rate Limiting**: Middleware to prevent brute force attacks
6. **Environment Variables**: Sensitive configuration kept in .env

## Data Flow

```
User Registration:
1. User fills signup form
2. Frontend validates input locally
3. POST request to /api/auth/signup with user data
4. Backend validates and checks for duplicates
5. Password hashed with bcryptjs
6. User saved to MongoDB
7. JWT token generated
8. Response sent with user object and token
9. Frontend stores token in localStorage
10. User redirected to games page

User Login:
1. User enters credentials
2. POST request to /api/auth/login
3. Backend finds user in MongoDB
4. Password compared using bcryptjs.compare()
5. If valid, JWT token generated
6. Response sent with token
7. Frontend stores token and user data
8. Authenticated requests use JWT from localStorage
```

## Files Created/Modified

### New Files
- `/src/app/signup/signup.component.ts` - Component logic
- `/src/app/signup/signup.component.html` - Template
- `/src/app/signup/signup.component.scss` - Styling
- `/backend/src/models/User.ts` - MongoDB schema
- `/backend/src/services/authService.ts` - Auth business logic
- `/backend/src/routes/auth.ts` - API endpoints

### Modified Files
- `/src/app/app-routing.module.ts` - Added signup route
- `/src/app/app.module.ts` - Declared SignupComponent
- `/src/app/login/login.component.html` - Added signup link
- `/src/app/login/login.component.scss` - Added signup link styling
- `/backend/src/routes/index.ts` - Added auth routes
- `/backend/src/server.ts` - MongoDB connection
- `/backend/.env` - Added MongoDB and JWT settings
- `/backend/.env.example` - Configuration template
- `/backend/tsconfig.json` - TypeScript config for backend
- `/backend/package.json` - Added mongoose, bcryptjs, jsonwebtoken

## Deployment

For production deployment to Render.com:

1. Update `.env` with production MongoDB URI
2. Set `JWT_SECRET` to a strong random value
3. Update frontend API endpoints if needed
4. Build both frontend and backend
5. Deploy backend to Render.com
6. Deploy frontend build to hosting service

See `RENDER_DEPLOYMENT.md` for detailed deployment instructions.

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in .env
- Verify MongoDB is accessible at the configured address

### JWT Token Issues
- Clear localStorage and try again: `localStorage.clear()`
- Check JWT_SECRET matches between frontend and backend
- Verify token expiration time

### Signup Form Validation
- Check browser console for validation errors
- Ensure password and confirm password match exactly
- Email must be in valid format (e.g., user@domain.com)
- Username must be at least 3 characters

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear dist folder: `rm -rf dist backend/dist`
- Rebuild everything: `npm run build`

## Future Enhancements

1. Email verification on signup
2. Password reset functionality
3. OAuth/Google Sign-In integration
4. Two-factor authentication
5. User profile management
6. Session management
7. Logout functionality
8. Remember me feature
