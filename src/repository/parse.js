/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var parser  = require('../utils/parser');
var fs      = require('fs');
var worker  = require('../worker');

/**
 * Parsing a file
 * @public
 * @param {string} filename
 * @param {string} encoding The encoding (by default utf8)
 * @return {Promise}
 * @fires repository#read
 * @fires repository#parse
 * @fires repository#error
 * @fires repository#cache
 */
module.exports = function(filename, encoding, stat) {
  if (!this.files.hasOwnProperty(filename)) {
    var self = this;
    if (!encoding) {
      encoding = this.options.encoding;
    }
    this.emit('read', {
      name: filename
    });
    this.files[filename] = new Promise(function(done, reject) {

      if (typeof self.options.lazyCache === 'function') {
        try {
          // the lazy cache
          // handles files loading from cache
          // without needing to resolve all repository cache
          var result = self.options.lazyCache(filename, stat);
          if (result) {
            // retrieved from cache
            self.emit('cache', {
              name: filename
            });
            if (typeof result.then === 'function') {
              return result.then(function(file) {
                self.files[filename] = file;
                self.files[filename].refresh();
                return done(file);
              }, function(e) {
                delete self.files[filename];
                self.emit('error', e);
                return reject(e);
              });
            } else {
              self.files[filename] = result;
              self.files[filename].refresh();
              return done(result);
            }
          }
          // if result is false, then continue loading
        } catch(e) {
          delete self.files[filename];
          self.emit('error', e);
          return reject(e);
        }
      }

      if (self.options.forkWorker) {
        // reads from a forked process
        worker(filename, null, self.directory, self.options).then(function(cache) {
          if (cache.hit) {
            self.emit('cache', {
              name: filename
            });
          } else {
            self.files[filename] = file.import(self, cache);
            self.files[filename].refresh();
            self.emit('parse', {
              name: filename,
              file: self.files[filename]
            });
          }
          return done(self.files[filename]);
        }, function(e) {
          delete self.files[filename];
          self.emit('error', {
            name: filename,
            error: e
          });
          return reject(e);
        });
      } else {
        // reads from the main process
        fs.readFile(
          path.resolve(self.directory, filename),
          encoding, function(err, data) {
            var ast;
            if (!err) {
              try {
                ast = parser.read(
                  self, data.toString(encoding), filename
                );
              } catch (e) {
                err = e;
              }
            }
            if (err) {
              delete self.files[filename];
              self.emit('error', err);
              return reject(err);
            } else {
              try {
                self.files[filename] = new file(self, filename, ast);
                self.files[filename].refresh();
                self.files[filename].size = data.length;
                return done(self.files[filename]);
              } catch (e) {
                delete self.files[filename];
                self.emit('error', e);
                return reject(e);
              }
            }
          }
        );
      }
    });
    return this.files[filename];
  } else {
    return this.refresh(filename, encoding, stat);
  }
};
