var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var querystring = require('querystring');
const http = require('http');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  //res.end(archive.paths.list);
  console.log("req.url inside handleRequest " + req.url + " req.method " + req.method);
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
      fs.readFile(archive.paths.archivedSites + '/' + url, (error, data) => {
        if (error) {
          fs.readFile(archive.paths.list, 'utf-8', (error, data) => {
            if (error) {
              // this file should already exitst
              console.log('Something is wrong');
            }
            // console.log(data.length, 'data length');
            data = data.split('/n');
            if (data.includes(url)) {
              // make the archive file
              // then remove this url from the file


              const options = {
                host: url, 
                port: 80,
                path: '/'
              };
              http.get(options, (res)=>{
                console.log('response object inside get request');
                console.log(res);

              }).on('error', (e)=> {
                console.log(e, 'error!');  
              });
            } else {
              // first time this url is requested
              // add the url to the file
              fs.appendFile(archive.paths.list, '/n' + url, (error)=> {
                if (error) {
                  console.log('error!');
                }
              });
            }
          });
        } else {
          res.end(data);
        }
      });
    }
  } else if (req.method === 'POST') {
    statusCode = 201;
    let body = '';
    req.on('data', (data)=>{
      body += data;
    });
    req.on('end', ()=>{
      var url = querystring.parse(body).url;
      
    });

    
    statusCode = 200;
    res.writeHead(statusCode, headers);
    var readStream = fs.createReadStream(archive.paths.siteAssets + '/index.html');
    readStream.pipe(res);  
  }
};
