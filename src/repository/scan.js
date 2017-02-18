/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var path = require('path');
var fs = require('fs');

/**
 * Scan the current directory to add PHP files to parser
 * @public
 * @param {String|Array} directory Path to scan, relative to repository root
 * @return {Promise}
 * @fires repository#progress
 * @fires repository#cache
 */
module.exports = function(directory) {
  var pending = [];
  var self = this;
  if (!directory) {
    directory = this.options.include;
  }
  if (Array.isArray(directory)) {
    directory.forEach(function(dir) {
      if (dir) {
        pending.push(self.scan(dir));
      }
    });
    return Promise.all(pending);
  }
  var root = path.resolve(this.directory, directory);
  return new Promise(function(done, reject) {
    fs.readdir(root, function(err, files) {
      if (err) return reject(err);
      files.forEach(function(file) {
        pending.push(new Promise(function(done, reject) {
          fs.stat(path.resolve(root, file), function(err, stat) {
            if (err) reject(err);
            var filename = path.join(directory, file);

            if (stat.isDirectory()) {
              if (
                self.options.exclude.indexOf(file) > -1 ||
                self.options.exclude.indexOf(filename) > -1
              ) {
                return done(); // ignore path
              } else {
                self.scan(filename).then(done, reject);
              }
            } else {
              var matched = false;
              for (var i = 0; i < self._regex.length; i++) {
                if (self._regex[i].test(file)) {
                  matched = true;
                  break;
                }
              }
              // ignore file (due to pattern)
              if (!matched) return done();
              var fileNode = self.getFile(filename);
              // handle in-memory cache
              if (fileNode) {
                // check if need to parse again
                if (
                  self.options.cacheByFileDate &&
                  fileNode.mtime > stat.mtime.getTime()
                ) {
                  self.emit('cache', {
                    name: filename
                  });
                  return done(fileNode);
                }
                // same size and
                if (
                  self.options.cacheByFileSize &&
                  stat.size === fileNode.size
                ) {
                  self.emit('cache', {
                    name: filename
                  });
                  return done(fileNode);
                }
              }
              self.counter.total++;
              self.counter.loading++;
              self.parse(
                filename,
                self.options.encoding,
                stat
              ).then(function(file) {
                self.counter.loading--;
                self.counter.loaded++;
                if (file) {
                  self.counter.size += file.size;
                  self.counter.symbols += file.nodes.length;
                }
                self.emit('progress', self.counter);
                done();
              }, function(e) {
                self.counter.loading--;
                self.counter.total--;
                self.counter.error++;
                self.emit('progress', self.counter);
                reject(e);
              });
            }
          });
        }));
      });
      Promise.all(pending).then(done, reject);
    });
  });
};
