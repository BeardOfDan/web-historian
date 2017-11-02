var http = require('http');
var handler = require('./request-handler');
var initialize = require('./initialize.js');
const cron = require('node-cron');
const htmlfetcher = require('../workers/htmlfetcher');

// Why do you think we have this here?
// HINT: It has to do with what's in .gitignore
initialize('./archives');

var port = 8080;
var ip = '127.0.0.1';
var server = http.createServer(handler.handleRequest);

if (module.parent) {
  module.exports = server;
} else {
  server.listen(port, ip);
  console.log('Listening on http://' + ip + ':' + port);
}


//exceute every 1 min
cron.schedule('1 * * * * *', function() {
  console.log('This is a cron job');  

  htmlfetcher();

});
