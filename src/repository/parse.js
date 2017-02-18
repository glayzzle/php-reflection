/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var path    = require('path');
var fs      = require('fs');

var worker  = null;
var parser  = require('../utils/parser');
var crc32   = require('../utils/crc32');

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

    if (filename in this._pending) {
        return this._pending[filename];
    }

    var fileNode = this.getFile(filename);
    var isFresh = false;

    if (!encoding) {
      encoding = this.options.encoding;
    }

    if (fileNode) {
        isFresh = true;
        if (!stat) {
            stat = fs.statSync(filename);
        }
        // checking statistics
        if (
          this.options.cacheByFileDate &&
          fileNode.mtime < stat.mtime.getTime()
        ) {
          isFresh = false;
        }
        if (
          this.options.cacheByFileSize &&
          stat.size !== fileNode.size
        ) {
          isFresh = false;
        }
    }

    if (!isFresh) {
        // need to refresh the node
        var self = this;
        this._pending[filename] = new Promise(function(done, reject) {
            if (self.options.forkWorker) {
                // using workers
                if (!worker) {
                    worker = require('../worker');
                }
                // reads from a forked process
                worker(filename, null, self.directory, self.options).then(
                    function(cache) {
                        delete self._pending[filename];
                        if (cache.hit) {
                            // no changes (checked from MD5)
                            self.emit('cache', {
                                name: filename,
                                file: fileNode
                            });
                        } else {
                            if (fileNode) {
                                fileNode.delete();
                            }
                            /** @todo
                            self.files[filename] = file.import(self, cache);
                            self.files[filename].refresh();
                            self.emit('parse', {
                                name: filename,
                                file: self.files[filename]
                            });*/
                        }
                        return done(fileNode);
                    },
                    // error retrieved from worker
                    function(e) {
                        delete self._pending[filename];
                        self.emit('error', {
                            name: filename,
                            error: e
                        });
                        return reject(e);
                    }
                );
            } else {
                // reads from the main process
                var fullFilename = path.resolve(self.directory, filename);
                fs.readFile(fullFilename, encoding, function(err, data) {
                    var ast, crcIntVal = 0;
                    if (!err) {
                        // checking the crc32 contents
                        if (self.options.cacheByFileHash) {
                            crcIntVal = crc32(data);
                            if (fileNode && crcIntVal === fileNode.crc32) {
                                // file is already ok
                                delete self._pending[filename];
                                self.emit('cache', {
                                    name: filename,
                                    file: fileNode
                                });
                                return done(fileNode);
                            }
                        }
                        try {
                            ast = parser.read(self, data, filename);
                        } catch (e) {
                            err = e;
                        }
                    }
                    delete self._pending[filename];
                    if (err) {
                        self.emit('error', err);
                        return reject(err);
                    } else {
                        try {
                            // refresh contents (already parsed)
                            if (fileNode) {
                                fileNode.delete();
                            }
                            // Creates a new node
                            fileNode = self.db.create('file', null, ast);
                            fileNode.setName(filename);
                            fileNode.size = data.length;
                            fileNode.mtime = stat.mtime.getTime();
                            fileNode.crc32 = crcIntVal;
                            return done(fileNode);
                        } catch (e) {
                            self.emit('error', e);
                            return reject(e);
                        }
                    }
                });
            }
        });
        return this._pending[filename];
    }

    return Promise.resolve(fileNode);
};
