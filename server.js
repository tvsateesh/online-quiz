// This file is deprecated. Use backend/src/server.ts instead.
// This is kept for backward compatibility only.
// To run the application, use: npm run build && npm start
// or cd backend && npm run build && npm start

var express = require('express');
var path = require('path');

var app = express();
app.set('port', (process.env.PORT || 5001));

// Redirect to use proper backend
console.log('⚠️  This server.js is deprecated.');
console.log('Please use the backend TypeScript server instead:');
console.log('  cd backend');
console.log('  npm install');
console.log('  npm run build');
console.log('  npm start');
console.log('');

// Fallback: serve Angular static files
// Try dist first, otherwise use public folder or redirect to dev server
const distPath = path.join(__dirname, 'dist');
const publicPath = path.join(__dirname, 'public');

// Serve static files from dist if it exists
try {
  if (require('fs').existsSync(distPath)) {
    app.use(express.static(distPath));
  } else if (require('fs').existsSync(publicPath)) {
    app.use(express.static(publicPath));
  }
} catch (e) {
  console.log('No dist or public folder found');
}

// SPA fallback
app.get('/*', function(request, response) {
  const indexPath = path.join(distPath, 'index.html');
  const publicIndexPath = path.join(publicPath, 'index.html');
  
  try {
    if (require('fs').existsSync(indexPath)) {
      response.sendFile(indexPath);
    } else if (require('fs').existsSync(publicIndexPath)) {
      response.sendFile(publicIndexPath);
    } else {
      response.status(503).send('Application is building. Please wait and refresh the page.');
    }
  } catch (e) {
    response.status(500).send('Error loading application');
  }
});

app.listen(app.get('port'), function() {
  console.log('Fallback server running on port', app.get('port'));
});
