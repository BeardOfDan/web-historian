// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.

var archive = require('../helpers/archive-helpers');

module.exports = function() {
  archive.readListOfUrls(function(urls) {
    let waiting = [];
    for (let i = 0; i < urls.length; i++) {
      archive.isUrlArchived(urls[i], function(isArchived) {
        if (!isArchived) {
          waiting.push(urls[i]);
        }
      });
    }

    archive.downloadUrls(waiting);
  });

  console.log('\nhtmlfeter just ran!\n');

};

