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
app.use(express.static(__dirname + '/dist/angular-quiz'));
app.get('/*', function(request, response) {
  response.sendFile(path.join(__dirname + '/dist/angular-quiz/index.html'));
});

app.listen(app.get('port'), function() {
  console.log('Fallback server running on port', app.get('port'));
});
