// This file is deprecated. Use backend/src/server.ts instead.
// This is kept for backward compatibility only.
// To run the application, use: npm run build && npm start
// or cd backend && npm run build && npm start

var express = require('express');
var path = require('path');
var fs = require('fs');

var app = express();
app.set('port', (process.env.PORT || 5001));

console.log('⚠️  This server.js is deprecated.');
console.log('Please use the backend TypeScript server instead:');
console.log('  cd backend');
console.log('  npm install');
console.log('  npm run build');
console.log('  npm start');
console.log('');

// Serve static files from dist/angular-quiz folder
const distPath = path.join(__dirname, 'dist', 'angular-quiz');

// Check if dist folder exists
if (fs.existsSync(distPath)) {
  console.log('✓ Serving from dist folder:', distPath);
  app.use(express.static(distPath));
} else {
  console.log('⚠️  WARNING: dist folder not found at', distPath);
  console.log('Run: npm run build');
}

// SPA fallback - serve index.html for all routes
app.get('/*', function(request, response) {
  const indexPath = path.join(distPath, 'index.html');
  
  if (fs.existsSync(indexPath)) {
    response.sendFile(indexPath);
  } else {
    response.status(503).send(`
      <html>
        <head><title>Building...</title></head>
        <body>
          <h1>Application Building</h1>
          <p>The application is being built. Please wait and refresh the page.</p>
          <p style="margin-top: 20px; font-size: 12px; color: #666;">
            If this message persists:<br/>
            1. Run: npm run build<br/>
            2. Then: npm start
          </p>
          <script>
            setTimeout(function() {
              location.reload();
            }, 3000);
          </script>
        </body>
      </html>
    `);
  }
});

app.listen(app.get('port'), function() {
  console.log('✓ Server running on port', app.get('port'));
});

app.listen(app.get('port'), function() {
  console.log('Fallback server running on port', app.get('port'));
});
