# 🔍 Google Sign-In Redirect Troubleshooting Guide

## Problem
After authenticating with Google, the app is not redirecting to the games page.

## Recent Fix Applied
✅ Updated `handleGoogleSignIn()` callback binding to properly preserve `this` context  
✅ Added detailed console logging to trace the authentication flow  
✅ Added error handling for failed token decoding  
✅ Added setTimeout to ensure state is properly updated before navigation

## Step 1: Browser Console Debugging

**Open your browser's Developer Tools (F12) and check the Console tab for these logs:**

### Expected Console Output (in order):
```
handleGoogleSignIn called with response: {...}
Google User: {email: "...", name: "...", picture: "...", ...}
User data saved to localStorage
Attempting to navigate to /games
Navigation successful: true
```

### If You See Errors:
1. **"handleGoogleSignIn called with response: {}"** or **"No credential in response"**
   - The Google button callback is firing but not returning credentials
   - **Solution**: This might be a Google Client ID issue. Check line 37 in login.component.ts

2. **"Error parsing JWT:"**
   - The token decoding failed
   - **Solution**: The token format might be invalid. Check if Google is returning a proper JWT

3. **"Navigation error:"**
   - The router.navigate() call failed
   - **Solution**: The /games route might not exist or there's a redirect happening

## Step 2: Check Browser Storage

**In DevTools, go to Application → Local Storage → http://localhost:5001**

You should see:
- `currentUser`: "your.email@gmail.com"
- `googleUser`: A JSON object with email, name, picture, token

If these are NOT present:
- The handleGoogleSignIn() is not completing successfully
- Check the console for errors

## Step 3: Verify the Route Exists

Run this in the browser console:
```javascript
// This should return true if the route exists
window.location.href = 'http://localhost:5001/games'
```

If you get a blank page or error:
- The /games route might not be configured
- There might be a redirect loop

## Step 4: Test the Traditional Login

Try the traditional login (admin/admin) to verify:
1. The games page works
2. The redirect is functional
3. The route guard (if any) is not blocking

If traditional login works but Google Sign-In doesn't:
- The issue is specific to Google authentication handling

## Step 5: Manual Testing Steps

### In Browser Console:

```javascript
// 1. Check if handleGoogleSignIn can be called directly
// First, simulate what Google does
const testResponse = {
  credential: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IiJ9.eyJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwibmFtZSI6IlRlc3QgVXNlciIsInBpY3R1cmUiOiJodHRwczovLyJ9.test'
};

// 2. Check localStorage storage
localStorage.setItem('currentUser', 'test@gmail.com');
localStorage.getItem('currentUser'); // Should return 'test@gmail.com'

// 3. Try manual navigation
// Open your browser console and run:
angular.element(document.body).injector().get('$state').go('games');
// OR
window.location = '/games';
```

## Step 6: Check Network Activity

1. Open DevTools → Network tab
2. Clear the network log
3. Click Google Sign-In button
4. Look for requests:
   - Should see call to `https://accounts.google.com/gsi/client`
   - Should see POST to Google's OAuth endpoint
   - After auth, check if browser makes request to `/games`

## Common Issues & Solutions

### Issue 1: Infinite Loop or Page Refresh
**Symptom**: Page keeps refreshing after login  
**Cause**: There might be a redirect back to login  
**Solution**:
1. Check if there's auto-redirect logic in app.component or a guard
2. Verify the /games route doesn't redirect back to login
3. Clear browser cache (Ctrl+Shift+Delete)

### Issue 2: Blank Page After Login
**Symptom**: Page goes blank or shows 404  
**Cause**: The /games route might not be loading properly  
**Solution**:
1. Check that GamesComponent is declared in app.module.ts
2. Verify the route path is exactly "games" (not "/games")
3. Check for lazy-loading that might not be set up

### Issue 3: Console Shows Errors
**Symptom**: Errors in console but no redirect  
**Cause**: Navigation is failing silently  
**Solution**:
```typescript
// The code now includes .then() to catch errors:
this.router.navigate(['/games']).then(
  (success) => console.log('Navigation successful:', success),
  (error) => console.log('Navigation error:', error)
);
```

### Issue 4: localStorage Not Updating
**Symptom**: localStorage is empty after sign-in  
**Cause**: handleGoogleSignIn() not being called  
**Solution**:
1. Check browser console for "handleGoogleSignIn called with response"
2. If not present, Google's callback isn't firing
3. Verify Client ID is correct (not placeholder)
4. Check that google-signin-btn div exists in HTML

## Step 7: Clear Cache and Reload

Sometimes browser caching causes issues:
```bash
# Hard refresh in browser
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)
```

Or in browser console:
```javascript
// Clear all storage
localStorage.clear();
sessionStorage.clear();

// Then reload
window.location.reload();
```

## Step 8: Verify Code Changes

Check that the file was properly updated:

In browser console:
```javascript
// This will show if the updated code is loaded
// Open DevTools → Sources → left panel → online-quiz:/// → src/app/login/login.component.ts
// Look for .bind(this) in handleGoogleSignIn callback
```

## Real-Time Testing

1. **Open DevTools (F12)**
2. **Go to Console tab**
3. **Click Google Sign-In button**
4. **Watch for console messages in this order**:
   ```
   ✓ handleGoogleSignIn called with response: {...}
   ✓ Google User: {email: "...", ...}
   ✓ User data saved to localStorage
   ✓ Attempting to navigate to /games
   ✓ Navigation successful: true
   ```

## If It Still Doesn't Work

Try these diagnostic commands in the browser console:

```javascript
// 1. Check current URL
console.log('Current URL:', window.location.href);

// 2. Check if router exists
console.log('Router:', window.ng);

// 3. Check localStorage
console.log('LocalStorage:', localStorage.getItem('currentUser'));

// 4. Manual navigation test
window.location = 'http://localhost:5001/games';
```

## Files Changed

- `src/app/login/login.component.ts` - Updated handleGoogleSignIn with better debugging and binding

## What Changed

✅ Bound callback with `.bind(this)` to preserve context  
✅ Added console.log at each step  
✅ Added error checking for decoded token  
✅ Added setTimeout for state update  
✅ Added .then() to capture navigation result  
✅ Better error messages  

## Next Steps If Still Not Working

1. Check that the dev server reloaded (look for `ng serve` output)
2. Do a hard refresh in browser (Cmd+Shift+R or Ctrl+Shift+R)
3. Check browser console for new messages with detailed logging
4. Share the console output for further debugging

---

**The app is now logging every step of the authentication flow!**

Watch the console to see exactly where the process stops if it's not working.
