var fs = require('fs');
var path = require('path');
var _ = require('underscore');
const http = require('http');
const querystring = require('querystring');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf8', (err, data) => {
    data = data.split('\n');
    callback(data);
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(function(arr) {
    if (arr.indexOf(url) > -1) {
      callback(true);
    } else {
      callback(false);
    }
  });
};

exports.addUrlToList = function(url, callback) {
  // append the url to the sites.txt file
  fs.appendFile(exports.paths.list, url, (error)=> {
    if (error) {
      console.log('error!');
      console.log('headers', r.headers);
    } else {
      console.log('Added ' + url + ' to the list');
      // statusCode = 200;
      callback(true);

    }
  });

};

exports.isUrlArchived = function(url, callback) {
  fs.readFile((exports.paths.archivedSites + '/' + url), (error, data) => {

    if (error) {
      callback(false);
    } else {
      callback(true);
    }
  }); 
};

exports.downloadUrls = function(urls) {

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];

    const options = {
      host: url, 
      port: 80,
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
      thisResponse.pipe(fs.createWriteStream(exports.paths.archivedSites + '/' + url));
      

      // statusCode = 200;
      // let headers = {};
      // headers['Content-type'] = 'text/html';
      // res.writeHead(statusCode, headers);
      // var readStream = fs.createReadStream(exports.paths.siteAssets + '/loading.html');
      // readStream.pipe(res);     

    }).on('error', (e)=> {
      console.log(e, 'error!');  
    });
  }

};


// Purposes of the above methods according to the tests
// #readListOfUrls
//       4) should read urls from sites.txt
//     #isUrlInList
//       5) should check if a url is in the list
//     #addUrlToList
//       6) should add a url to the list
//     #isUrlArchived
//       7) should check if a url is archived
//     #downloadUrls
//       ✓ should download all pending urls in the list (504ms)

// const archive = exports;

// var statusCode = 404;
//   var headers = {};
//   headers['Content-type'] = 'text/html';

// exports.