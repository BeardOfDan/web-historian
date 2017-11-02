var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var querystring = require('querystring');
const http = require('http');
// require more modules/folders here!
var handleUrl = function(req, res, url) {
  let statusCode = 200;
  let headers = {};
  headers['Content-type'] = 'text/html';
  var options = {
    method: 'HEAD',
    host: url,
    port: 80,
    // port: 443,
    path: '/'
  };

  // check if the url is live
  const request = http.request(options, (r)=> {  
  // if the url is live, then no error will be thrown   

    console.log('about to read the file ' + archive.paths.archivedSites + '/' + url);

    fs.readFile((archive.paths.archivedSites + '/' + url), (error, data) => {
      if (error) { // if this file does not yet exist
        fs.readFile(archive.paths.list, 'utf-8', (error, data) => {

          console.log('read the file archive.paths.list');

          if (error) {
            // this file should already exitst
            console.log('Something is wrong');
          }
          data = data.split('\n');
          if (data.includes(url)) {

            console.log('the file includes ' + url);



            // should be writing the files instead of http.get-ing them

            const options = {
              host: url, 
              port: 80,
              // port: 443,
              path: '/'
            };
            
            http.get(options, (thisResponse)=>{
              console.log('response object inside get request');
              // console.log(res);
              // let body = '';

              // thisResponse.on('data', function(data) {
              //   body += data;
              // });
              // thisResponse.on('end', function() {
              //   res.end(body);
              thisResponse.pipe(fs.createWriteStream(archive.paths.archivedSites + '/' + url));
              
              statusCode = 200;
              res.writeHead(statusCode, headers);
              var readStream = fs.createReadStream(archive.paths.siteAssets + '/loading.html');
              readStream.pipe(res);     
  
            }).on('error', (e)=> {
              console.log(e, 'error!');  
            });



          } else {

            console.log('about to append ' + url + ' to the file');

            // first time this url is requested
            // add the url to the file
            fs.appendFile(archive.paths.list, '\n' + url, (error)=> {
              if (error) {
                console.log('error!');
                console.log('headers', r.headers);
              } else {
                console.log('Added ' + url + ' to the list');
                statusCode = 200;
                res.writeHead(statusCode, headers);
                var readStream = fs.createReadStream(archive.paths.siteAssets + '/loading.html');
                readStream.pipe(res); 
              }
            });
          }
        });
      } else { // if the file already exists, send it to the user
        res.end(data);
      }
    });

  });
  request.on('error', (e)=> {
    // console.log('url', url);
    // console.log('e', e);
    res.writeHead(404, headers);
    res.end('Your url is invalid');

  });

  request.end();  
};
















//Start here:


exports.handleRequest = function (req, res) {
  //res.end(archive.paths.list);
  console.log('req.url inside handleRequest ' + req.url + ' req.method' + req.method);
  var statusCode = 404;
  var headers = {};
  headers['Content-type'] = 'text/html';
  if (req.method === 'GET') {
    if (req.url === '/') {
      statusCode = 200;
      res.writeHead(statusCode, headers);
      var readStream = fs.createReadStream(archive.paths.siteAssets + '/index.html');
      readStream.pipe(res);     
    } else if (req.url === '/styles.css') {
      statusCode = 200;
      headers['Content-type'] = 'text/css';
      var readStream = fs.createReadStream(archive.paths.siteAssets + '/styles.css');
      readStream.pipe(res);  
      
    } else if (req.url === '/favicon.ico') {
      statusCode = 200;
      headers['Content-type'] = 'text/css';
      res.end();
   
    } else if (req.url.length > 1) {
      statusCode = 200;
      res.writeHead(statusCode, headers);
      const url = req.url.slice(1);
      handleUrl(req, res, url);

      // check if the url is in the archive
        // if so, then return it
      // if not
        // check if it is valid
          // if so, then add it to the list
          // if not, then return 404

      // res.writeHead(404, headers);
      // res.end('Your url is invalid');
 
    }
  } else if (req.method === 'POST') {
    statusCode = 201;
    let body = '';
    req.on('data', (data)=>{
      body += data;
    });
    req.on('end', () => {
      var url = querystring.parse(body).url;
      handleUrl(req, res, url);

    });


    



    // statusCode = 200;
    // res.writeHead(statusCode, headers);
    // var readStream = fs.createReadStream(archive.paths.siteAssets + '/index.html');
    // readStream.pipe(res);  
  }
};


