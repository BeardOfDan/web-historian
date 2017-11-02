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
  fs.appendFile(exports.paths.list, url, (error)=> {
    if (error) {
      console.log('error!');
      console.log('headers', r.headers);
    } else {
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
      thisResponse.pipe(fs.createWriteStream(exports.paths.archivedSites + '/' + url));
    }).on('error', (e)=> {
      console.log(e, 'error!');  
    });
  }

};

