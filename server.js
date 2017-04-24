var express = require('express')
var path = require('path')
var compression = require('compression')
var http = require('http');
var https = require('https');
var fs = require('fs');
var Config = require('./config')

var app = express()

// serve our static stuff like index.css
app.use(express.static(path.join(__dirname, 'build')))

// send all requests to index.html so browserHistory in React Router works
app.get('*', function (req, res) {
  // and drop 'public' in the middle of here
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

var PORT = process.env.PORT || 8080
/*app.listen(PORT, function() {
  console.log('Production Express server running at localhost:' + PORT)
})*/
var options = {
  key: fs.readFileSync(Config.options.key),
  cert: fs.readFileSync(Config.options.cert)
}

app.server = https.createServer(options, app);

app.server.listen('443', '0.0.0.0', () => {
console.log(`Server running on ${app.server.address().address}${app.server.address().port}`);
});
