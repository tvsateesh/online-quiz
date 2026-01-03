# Render Deployment Guide - Online Quiz & Games

This guide explains how to deploy the Online Quiz application (including Chess, Checkers, and Quiz games) to Render.com for production use.

## Overview

This Angular application includes multiple games and quizzes. We'll deploy it as a Node.js web service that serves the built Angular app.

## Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **GitHub Repository**: Project pushed to GitHub
3. **Node.js**: Version 16.x (specified in package.json)

## Quick Start: Deploy via Render Dashboard

### Step 1: Create Web Service

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Select the repository and configure:
   - **Name**: `online-quiz`
   - **Region**: Oregon (or closest to you)
   - **Branch**: `main` (or your default branch)
   - **Runtime**: Node
   - **Root Directory**: Leave blank (project root)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free tier (or Starter for better uptime)

5. Click **Create Web Service**

### Step 2: Configure Environment Variables (Optional)

In the Render dashboard for your service, go to **Settings** → **Environment** and add:

| Key | Value | Description |
|-----|-------|-------------|
| `NODE_ENV` | `production` | Sets production mode |
| `PORT` | `5000` | Port for Express server (auto-set by Render) |

### Step 3: Wait for Deployment

1. Render will automatically build and deploy your app
2. Watch the **Logs** tab for build progress
3. Build typically takes 3-5 minutes
4. Once complete, your app will be live at `https://online-quiz.onrender.com`

## Alternative: Deploy Using Blueprint (render.yaml)

For automated deployment, use the included `render.yaml` file:

1. In Render Dashboard, click **New +** → **Blueprint**
2. Connect your GitHub repository
3. Select the repository
4. Render will automatically detect and use `render.yaml`
5. Click **Apply**

## Build Configuration

### package.json Scripts

The app uses these scripts for deployment:
```json
{
  "scripts": {
    "start": "node server.js",
    "build": "ng build"
  }
}
```

### Build Process

1. **Install Dependencies**: `npm install`
2. **Build Angular App**: `ng build` → outputs to `dist/angular-quiz/`
3. **Start Server**: `node server.js` → serves built app on port 5000

## Post-Deployment Testing

After deployment, test these features:

1. **Home Page**: Visit your Render URL
2. **Chess Game**: Navigate to `/chess` and test AI difficulty levels
3. **Checkers Game**: Navigate to `/checkers`
4. **Quiz**: Test quiz functionality
5. **Responsive Design**: Test on mobile devices

## Custom Domain (Optional)

To use a custom domain:

1. In Render Dashboard, go to your service
2. Click **Settings** → **Custom Domain**
3. Add your domain (e.g., `quiz.yourdomain.com`)
4. Update DNS records as instructed:
   - **Type**: CNAME
   - **Name**: quiz (or your subdomain)
   - **Value**: Your Render service URL
5. Wait for DNS propagation (up to 48 hours)

## Monitoring and Logs

### View Real-Time Logs

1. In Render Dashboard, go to your service
2. Click **Logs** tab
3. Monitor application logs, errors, and requests

### Check Service Health

1. Go to **Metrics** tab
2. Monitor:
   - CPU usage
   - Memory usage
   - Request count
   - Response times

### Set Up Alerts

1. Go to **Settings** → **Notifications**
2. Add email or Slack webhook
3. Configure alerts for:
   - Service crashes
   - High error rates
   - Deployment failures

## Troubleshooting

### Budget Exceeded Errors

**Problem**: Build fails with budget exceeded errors:
```bash
Error: src/app/components/games/chess/chess.component.scss exceeded maximum budget
```

**Solution**: Already fixed! The `angular.json` has been updated with appropriate budget limits:
```json
"budgets": [
  {
    "type": "initial",
    "maximumWarning": "1mb",
    "maximumError": "2mb"
  },
  {
    "type": "anyComponentStyle",
    "maximumWarning": "10kb",
    "maximumError": "12kb"
  }
]
```

### Build Fails

**Problem**: Build command fails
```bash
# Check these in Render logs:
npm ERR! code ELIFECYCLE
```

**Solution**:
1. Verify `package.json` has all dependencies
2. Test build locally: `npm run build`
3. Check Node version matches (16.x)
4. Clear npm cache: add to build command: `npm cache clean --force && npm install`

### Application Doesn't Start

**Problem**: Service crashes on startup

**Solution**:
1. Check logs for errors
2. Verify `server.js` path is correct
3. Ensure `dist/angular-quiz` directory exists after build
4. Test locally: `npm start`

### 404 Errors on Routes

**Problem**: Angular routes return 404

**Solution**: Update `server.js` to handle Angular routing:
```javascript
// Add this before app.listen()
app.get('/*', function(request, response) {
  response.sendFile(__dirname + '/dist/angular-quiz/index.html');
});
```

### Port Issues

**Problem**: App doesn't listen on correct port

**Solution**: Render automatically sets `PORT` environment variable. Verify `server.js` uses:
```javascript
app.set('port', (process.env.PORT || 5000));
```

### Free Plan Cold Starts

**Problem**: First request is slow after inactivity

**Solution**:
- Free tier spins down after 15 minutes
- Upgrade to **Starter** plan ($7/month) for 24/7 uptime
- Or accept 30-60 second cold start delay

## Performance Optimization

### 1. Enable Production Mode

Ensure Angular builds in production mode:
```json
"build": "ng build --configuration production"
```

### 2. Add Compression

Update `server.js`:
```javascript
var compression = require('compression');
app.use(compression());
```

Then install: `npm install compression --save`

### 3. Cache Static Assets

```javascript
app.use(express.static(__dirname + '/dist/angular-quiz', {
  maxAge: '1y'
}));
```

### 4. Optimize Build

In `angular.json`, ensure optimization is enabled:
```json
"configurations": {
  "production": {
    "optimization": true,
    "buildOptimizer": true,
    "aot": true
  }
}
```

## Continuous Deployment

Render automatically deploys when you push to your connected branch.

### Auto-Deploy

1. Push to `main` branch
2. Render detects changes
3. Automatically builds and deploys
4. Monitor in **Logs** tab

### Manual Deploy

1. Go to service dashboard
2. Click **Manual Deploy** → **Deploy latest commit**
3. Or trigger from specific commit/branch

### Disable Auto-Deploy

1. Go to **Settings** → **Build & Deploy**
2. Toggle off **Auto-Deploy**
3. Use manual deploys only

## Scaling

### Vertical Scaling

Upgrade instance size for better performance:
1. Go to **Settings** → **Instance Type**
2. Choose larger instance (Starter, Standard, Pro)

### Horizontal Scaling (Paid Plans)

1. Go to **Settings** → **Scaling**
2. Increase instance count
3. Render handles load balancing automatically

## Environment-Specific Configuration

### Development vs Production

Create environment files:

**src/environments/environment.prod.ts**:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://online-quiz.onrender.com'
};
```

**src/environments/environment.ts**:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:4200'
};
```

## Cost Optimization

### Free Tier Usage

- ✅ Perfect for personal projects and testing
- ✅ Unlimited build minutes
- ❌ Spins down after 15 minutes inactivity
- ❌ 750 hours/month limit across all services

### Starter Plan ($7/month)

- ✅ 24/7 uptime (no cold starts)
- ✅ Better performance
- ✅ Custom domains with SSL
- ✅ Priority support

### When to Upgrade

Upgrade if you need:
- Consistent response times
- Professional presentation
- Custom domain
- Higher traffic capacity

## Backup and Recovery

### Code Backup

1. Maintain clean git history
2. Tag releases: `git tag v1.0.0 && git push --tags`
3. Create backup branch: `git checkout -b backup-main`

### Configuration Backup

1. Document environment variables
2. Keep `render.yaml` in version control
3. Export service settings from dashboard

### Rollback

To rollback to previous version:
1. Go to **Settings** → **Deploys**
2. Find previous successful deploy
3. Click **Redeploy**

## Security Best Practices

### 1. Environment Variables

Store sensitive data in environment variables, not code:
```javascript
const apiKey = process.env.API_KEY;
```

### 2. HTTPS

Render provides free SSL certificates automatically for all deployments.

### 3. Headers

Add security headers in `server.js`:
```javascript
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});
```

### 4. Dependencies

Keep dependencies updated:
```bash
npm audit
npm audit fix
```

## Support Resources

- **Render Documentation**: https://render.com/docs
- **Community Forum**: https://community.render.com
- **Status Page**: https://status.render.com
- **Support**: support@render.com

## Deployment Checklist

Before deploying, ensure:

- [ ] All dependencies in `package.json`
- [ ] Build script works locally: `npm run build`
- [ ] Server starts locally: `npm start`
- [ ] Environment variables documented
- [ ] Angular routing configured in `server.js`
- [ ] Production optimizations enabled
- [ ] Git repository up to date
- [ ] README.md updated with deployment info

## Next Steps After Deployment

1. ✅ Test all game features (Chess, Checkers, Quiz)
2. ✅ Verify responsive design on mobile
3. ✅ Set up custom domain (optional)
4. ✅ Configure monitoring and alerts
5. ✅ Share your deployed app!

## Example Deployment Timeline

| Time | Activity |
|------|----------|
| 0:00 | Connect GitHub repository |
| 0:01 | Configure build settings |
| 0:02 | Start deployment |
| 0:03-0:07 | Install dependencies and build |
| 0:08 | Deploy and start service |
| 0:09 | Service live! |

---

**Your online quiz and games are ready to go live! 🎮🎯**

**Live Demo**: `https://your-service-name.onrender.com`
