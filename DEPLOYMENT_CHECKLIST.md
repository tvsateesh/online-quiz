# Deployment Checklist for Render.com

Use this checklist before and after deploying to Render.com.

## Pre-Deployment Checklist

### Code Preparation
- [ ] All code changes committed to Git
- [ ] Repository pushed to GitHub
- [ ] No sensitive data in code (API keys, passwords)
- [ ] Dependencies updated in `package.json`
- [ ] `package-lock.json` is up to date

### Local Testing
- [ ] Run `npm install` successfully
- [ ] Run `npm run build` - builds without errors
- [ ] Run `npm start` - server starts and serves app
- [ ] Test Chess game functionality and AI levels
- [ ] Test Checkers game
- [ ] Test Quiz functionality
- [ ] Test on different browsers (Chrome, Firefox, Safari)
- [ ] Test responsive design on mobile viewport

### Build Configuration
- [ ] `server.js` handles all routes (catches /* for Angular routing)
- [ ] Port configured to use `process.env.PORT || 5000`
- [ ] Build output directory is `dist/angular-quiz`
- [ ] `render.yaml` file present in repository root
- [ ] Node version specified in `package.json` (engines.node: "16.x")

### Documentation
- [ ] `README.md` updated with deployment info
- [ ] `RENDER_DEPLOYMENT.md` guide available
- [ ] Environment variables documented

## Render.com Setup

### Account Setup
- [ ] Render.com account created
- [ ] GitHub account connected to Render
- [ ] Repository accessible from Render

### Service Configuration
- [ ] Create new Web Service or Blueprint
- [ ] Select correct GitHub repository
- [ ] Configure service name: `online-quiz`
- [ ] Set runtime: Node
- [ ] Set build command: `npm install && npm run build`
- [ ] Set start command: `npm start`
- [ ] Choose plan (Free or Starter)
- [ ] Select region (Oregon recommended)

### Environment Variables
- [ ] Set `NODE_ENV=production`
- [ ] Verify `PORT` is auto-configured by Render

## Deployment

### Initial Deploy
- [ ] Click "Create Web Service"
- [ ] Monitor build logs for errors
- [ ] Wait for build to complete (3-5 minutes)
- [ ] Note the deployed URL (e.g., `https://online-quiz.onrender.com`)

### Build Monitoring
- [ ] Check logs for npm install errors
- [ ] Verify Angular build completes successfully
- [ ] Confirm server starts without errors
- [ ] First deployment shows "Live" status

## Post-Deployment Testing

### Functional Testing
- [ ] Access deployed URL in browser
- [ ] Homepage loads correctly
- [ ] Navigate to Chess game (`/chess`)
- [ ] Test Chess AI on Easy difficulty
- [ ] Test Chess AI on Medium difficulty
- [ ] Test Chess AI on Hard difficulty
- [ ] Test piece movement and rules
- [ ] Test check/checkmate detection
- [ ] Navigate to Checkers game
- [ ] Test Checkers gameplay
- [ ] Test Quiz functionality
- [ ] Test navigation between pages

### Performance Testing
- [ ] Initial page load under 3 seconds (after cold start)
- [ ] Game interactions feel responsive
- [ ] No console errors in browser dev tools
- [ ] No 404 errors for routes

### Cross-Browser Testing
- [ ] Test on Chrome
- [ ] Test on Firefox
- [ ] Test on Safari
- [ ] Test on mobile Chrome (Android/iOS)
- [ ] Test on mobile Safari (iOS)

### Responsive Design
- [ ] Test on desktop (1920x1080)
- [ ] Test on laptop (1366x768)
- [ ] Test on tablet (768x1024)
- [ ] Test on mobile (375x667)
- [ ] All UI elements visible and functional

## Post-Deployment Configuration

### Optional Enhancements
- [ ] Set up custom domain
- [ ] Configure DNS records
- [ ] Enable email notifications for deployments
- [ ] Set up Slack webhook for alerts
- [ ] Configure health check endpoint

### Monitoring Setup
- [ ] Check Render dashboard metrics
- [ ] Monitor CPU and memory usage
- [ ] Review request logs
- [ ] Set up error alerts
- [ ] Bookmark deployment logs URL

### Performance Optimization
- [ ] Enable gzip compression in server.js
- [ ] Set cache headers for static assets
- [ ] Optimize Angular build for production
- [ ] Consider CDN for static assets (if needed)

## Continuous Deployment

### Auto-Deploy Configuration
- [ ] Verify auto-deploy is enabled
- [ ] Test by pushing small change to main branch
- [ ] Confirm automatic build triggers
- [ ] Monitor auto-deploy in logs

### Version Control
- [ ] Tag release: `git tag v1.0.0`
- [ ] Push tags: `git push --tags`
- [ ] Document version in changelog

## Free Tier Considerations

If using Free Tier:
- [ ] Understand 15-minute spin-down behavior
- [ ] Accept 30-60 second cold start delay
- [ ] Consider upgrade to Starter if needed
- [ ] Monitor 750 hours/month limit

## Troubleshooting Checklist

If deployment fails:
- [ ] Check build logs for specific errors
- [ ] Verify all npm dependencies install
- [ ] Confirm build command completes
- [ ] Check Node version compatibility
- [ ] Test build locally matches Render environment
- [ ] Review `server.js` for syntax errors
- [ ] Ensure `dist/angular-quiz` directory created

If app doesn't load:
- [ ] Check service status in Render dashboard
- [ ] Review runtime logs for errors
- [ ] Verify port configuration
- [ ] Test URL in incognito mode
- [ ] Check for routing issues

## Success Criteria

Deployment is successful when:
- ✅ Build completes without errors
- ✅ Service shows "Live" status
- ✅ URL accessible from any browser
- ✅ All games and features work correctly
- ✅ No console errors
- ✅ Mobile responsive design works
- ✅ AI difficulty levels function properly
- ✅ Page navigation works smoothly

## Support Resources

If you need help:
- 📚 Check `RENDER_DEPLOYMENT.md`
- 🌐 Visit [Render Docs](https://render.com/docs)
- 💬 Join [Render Community](https://community.render.com)
- 📧 Email support@render.com
- 🔍 Search [Render Status](https://status.render.com)

## Next Steps After Successful Deployment

1. Share your live URL! 🎉
2. Gather user feedback
3. Monitor error logs
4. Plan feature updates
5. Consider custom domain
6. Upgrade plan if needed
7. Document any custom configurations
8. Set up regular backups

---

**Checklist completed on**: _____________

**Deployed URL**: _____________

**Notes**: _____________
