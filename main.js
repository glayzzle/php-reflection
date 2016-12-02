/**
 * Copyright (C) 2014 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */

var parser = require('php-parser');
var fs = require('fs');
var file = require('./src/file');
var files = {};

module.exports = {
    /**
     * Parsing a file
     * @param {string} filename 
     * @param {string} encoding The encoding (by default utf8)
     * @return Promise
     */
    parse: function(filename, encoding) {
        if (!files.hasOwnProperty(filename)) {
            files[filename] = new Promise(function(done, reject) {
                fs.readFile(filename, encoding, function(err, data) {
                    if (!err)  {
                        try {
                            var ast = parser.parseCode(data, {
                                locations: true,
                                extractDoc: true,
                                suppressErrors: true
                            });
                        } catch(e) {
                            err = e;
                        }
                    }
                    if (err) {
                        delete files[filename];
                        return reject(err);
                    } else {
                        try {
                            files[filename] = new file(filename, ast);
                        } catch(e) {
                            delete files[filename];
                            return reject(e);
                        }
                        
                    }
                });
            });
            return files[filename];
        } else {
            return this.refresh(filename, encoding);
        }
    },
    /**
     * Clean all the cache
     * @return this
     */
    cleanAll: function() {
        files = {};
        return this;
    },
    /**
     * Removes a file
     * @return this
     */
    remove: function(filename) {
        if (files.hasOwnProperty(filename)) {
            if (files[filename] instanceof file) {
                files[filename].remove();
            }
            delete files[filename];
        }
        return this;
    },
    /**
     * Iterate over each file
     * @param {function} cb A closure : `function(file, name)`
     * @return this
     */
    each: function(cb) {
        for(var name in files) {
            if (files[name] instanceof file) {
                cb.apply(this, files[name], name);
            }
        }
        return this;
    },
    /**
     * Retrieves a file object
     * @param {string} filename The filename to retrieve
     * @return file|null Returns the file if exists, or null if not defined
     */
    get: function(filename) {
        if (files.hasOwnProperty(filename)) {
            return files[filename];
        } else {
            return null;
        }
    },
    /**
     * Gets/Sets the files repository
     * @param {object} data Sets the specified data
     * @return this|object Retrieves the cache (if data not set)
     */
    cache: function(data) {
        if (typeof data !== 'undefined') {
            // sets the data
            files = {};
            if (data) {
                // creating files from structure
                for(var name in data) {
                    result[name] = file.import(data[name]);
                }
                // update object links
                for(var name in files) {
                    files[name].import();
                }
            }
            return this;
        } else {
            // gets the data
            var result = {};
            for(var name in files) {
                if (files[name] instanceof file) {
                    result[name] = files[name].export();
                }
            }
            return result;
        }
    },
    /**
     * Rename a file
     * @param {string} oldName The original filename
     * @param {string} newName The new filename
     * @return this
     */
    rename: function(oldName, newName) {
        if (files.hasOwnProperty(oldName)) {
            files[newName] = files[oldName];
            files[newName].name = newName;
            delete files[oldName];
        }
        return this;
    },
    /**
     * Refresh the file contents
     */
    refresh: function(filename, encoding) {
        if (!files.hasOwnProperty(filename)) {
            return this.parse(filename, encoding);
        } else {
            if (files[name] instanceof Promise) {
                return files[name];
            }
            files[filename] = new Promise(function(done, reject) {
                fs.readFile(filename, encoding, function(err, data) {
                });
            });
            return files[filename];
        }
    }
};