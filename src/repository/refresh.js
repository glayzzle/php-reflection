/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

/**
 * Refresh the file contents
 * @public
 * @return {Promise}
 */
module.exports = function refresh (filename, encoding, stat) {
  if (!this.files.hasOwnProperty(filename)) {
    return this.parse(filename, encoding, stat);
  } else {
    if (this.files[filename] instanceof Promise) {
      return this.files[filename];
    }
    /*var self = this;
    var crc32 = this.options.cacheByFileHash ?
      this.files[filename].crc32 : null;
    this.files[filename] = new Promise(function(done, reject) {
      fs.readFile(
        path.join(self.directory, filename),
        encoding, function(err, data) {
          // @todo
          done();
        });
    });*/
    return new Promise(function(done, reject) {
      done(); // this.files[filename];
    });
  }
};
