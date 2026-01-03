var express = require('express');
var path = require('path');
var app = express();

app.set('port', (process.env.PORT || 5000));

// Serve static files from the Angular app
app.use(express.static(__dirname + '/dist/angular-quiz'));

// Send all requests to index.html so Angular can handle routing
app.get('/*', function(request, response) {
  response.sendFile(path.join(__dirname + '/dist/angular-quiz/index.html'));
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
