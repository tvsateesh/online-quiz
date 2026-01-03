# Google Sign-In Setup Guide

## Overview
The Brain Games application now includes Google Sign-In integration. This guide walks you through configuring Google OAuth 2.0 credentials.

## Implementation Status ✅
- **TypeScript Logic**: ✅ Complete (Google Sign-In initialization, JWT parsing, token handling)
- **HTML UI**: ✅ Complete (Google Sign-In button container with divider)
- **SCSS Styling**: ✅ Complete (Professional divider and button styling)
- **Backend Integration**: ✅ Ready (localStorage user data storage)

## Steps to Enable Google Sign-In

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a Project" → "New Project"
3. Name it "Brain Games" (or your preferred name)
4. Click "Create"

### 2. Set Up OAuth 2.0 Consent Screen
1. Navigate to **APIs & Services** → **OAuth consent screen**
2. Select **External** for User Type
3. Click **Create**
4. Fill in the form:
   - **App name**: Brain Games
   - **User support email**: Your email
   - **Developer contact info**: Your email
5. Click **Save and Continue**
6. Click **Save and Continue** for Scopes (no scopes needed for Sign-In)
7. Click **Save and Continue** for Test Users
8. Review and click **Back to Dashboard**

### 3. Create OAuth 2.0 Credentials
1. Navigate to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client ID**
3. Select **Web application**
4. Configure:
   - **Name**: Brain Games Web
   - **Authorized JavaScript origins**:
     - `http://localhost:4200` (development)
     - `http://localhost:5001` (local server)
     - `http://127.0.0.1:4200`
     - `http://127.0.0.1:5001`
     - Your production domain (e.g., `https://yourdomain.com`)
   
   - **Authorized redirect URIs**:
     - `http://localhost:4200/games` (development)
     - `http://localhost:5001/games` (local server)
     - Your production callback URL

5. Click **Create**
6. Copy your **Client ID**

### 4. Update Client ID in Application
1. Open [src/app/login/login.component.ts](src/app/login/login.component.ts)
2. Find line 37:
   ```typescript
   client_id: '918502147419-hn8f7k5h8g9k5h8g9k5h8g9k5h8g9k5h.apps.googleusercontent.com', // REPLACE WITH YOUR GOOGLE CLIENT ID
   ```
3. Replace the placeholder with your actual Client ID:
   ```typescript
   client_id: 'YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com',
   ```
4. Save the file

### 5. Test Google Sign-In
1. Start the development server: `npm start`
2. Navigate to `http://localhost:5001`
3. You should see the Google Sign-In button on the login page
4. Click "Sign in with Google" to test authentication
5. Check browser console for any errors: `Ctrl+Shift+J` (or `Cmd+Option+J` on Mac)

## File Structure

```
src/app/login/
├── login.component.ts         # Google Sign-In logic
├── login.component.html       # Google Sign-In button UI
└── login.component.scss       # Styling for divider and button
```

## Key Features Implemented

### 1. **Google Sign-In Button** (`login.component.ts`)
- Dynamically loads Google Sign-In script
- Initializes Google client with your credentials
- Renders the official Google Sign-In button
- Handles authentication callback

### 2. **JWT Token Processing** (`login.component.ts`)
```typescript
handleGoogleSignIn(response: any)  // Processes credential
parseJwt(token: string)            // Decodes JWT token
```
- Extracts user information (email, name, picture) from JWT
- Stores user data in localStorage for session persistence

### 3. **User Session Management**
User data stored in localStorage after successful sign-in:
```javascript
{
  googleUser: {
    email: "user@gmail.com",
    name: "User Name",
    picture: "https://...",
    token: "jwt_token"
  },
  currentUser: "user@gmail.com"
}
```

### 4. **Professional UI**
- Divider section with "OR" separator
- Google Sign-In button with proper styling
- Loading state during authentication
- Error message display for failed sign-ins

## Styling Details

### Divider Container
```scss
.divider-container {
  - Flex layout with centered "OR" text
  - Gradient lines on both sides
  - Responsive gap sizing
  - Clean, professional appearance
}
```

### Google Sign-In Button
```scss
.google-signin-container {
  - Centers the official Google button
  - Handles loading state
  - Responsive design
  - Fallback styling if button doesn't load
}
```

## Troubleshooting

### Google Button Not Showing
1. Check browser console for errors (`F12`)
2. Verify Client ID is correctly set
3. Ensure `http://localhost:5001` is in "Authorized JavaScript origins"
4. Clear browser cache and reload

### "Unauthorized origin" Error
1. Add your domain to "Authorized JavaScript origins" in Google Cloud Console
2. Go to **Credentials** → Your OAuth 2.0 Client
3. Add the origin URL under "Authorized JavaScript origins"

### User Data Not Storing
1. Check localStorage in browser DevTools (`F12` → Application → Local Storage)
2. Verify JWT token is being decoded correctly
3. Check for errors in browser console

## Testing Credentials

For **local testing**, you can use:
- **Email**: Use your own Google account or test account
- **Client ID**: Obtained from Google Cloud Console (must be created first)

## Production Deployment

When deploying to production:
1. **Update Client ID**: Change to production credentials if needed
2. **Update Authorized Origins**: Add your production domain
3. **Environment Configuration**: Consider moving Client ID to environment variables
4. **Backend Verification**: Optionally verify Google tokens on backend

### Example environment configuration:
```typescript
// For development
const CLIENT_ID = environment.development ? 'DEV_CLIENT_ID' : 'PROD_CLIENT_ID';
```

## Security Notes

1. **Client ID is Public**: It's safe to include Client ID in frontend code
2. **Token Storage**: Google provides short-lived tokens for security
3. **HTTPS Required**: Always use HTTPS in production
4. **CORS Configuration**: Backend should validate tokens if needed

## Additional Resources

- [Google Sign-In Documentation](https://developers.google.com/identity/gsi/web)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Angular Integration Guide](https://developers.google.com/identity/gsi/web/guides/integrating-javascript)

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify all configuration steps above
3. Ensure Client ID is correctly set
4. Check Google Cloud Console settings

---

**Last Updated**: January 3, 2025  
**Status**: ✅ Ready for Configuration and Testing
