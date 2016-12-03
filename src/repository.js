/*!
 * Copyright (C) 2016 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */

var parser = require('php-parser');
var fs = require('fs');
var file = require('./file');

/**
 * @class repository
 * @constructor
 */
var repository = function() {
    this.files = {};
};

/**
 * Parsing a file
 * @param {string} filename 
 * @param {string} encoding The encoding (by default utf8)
 * @return {Promise}
 */
repository.prototype.parse = function(filename, encoding) {
    if (!this.files.hasOwnProperty(filename)) {
        var self = this;
        this.files[filename] = new Promise(function(done, reject) {
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
                    delete self.files[filename];
                    return reject(err);
                } else {
                    try {
                        self.files[filename] = new file(this, filename, ast);
                    } catch(e) {
                        delete files[filename];
                        return reject(e);
                    }
                    
                }
            });
        });
        return this.files[filename];
    } else {
        return this.refresh(filename, encoding);
    }
};

/**
 * Clean all the cache
 * @return {repository}
 */
repository.prototype.cleanAll = function() {
    this.files = {};
    return this;
};

/**
 * Removes a file
 * @return {repository}
 */
repository.prototype.remove = function(filename) {
    if (this.files.hasOwnProperty(filename)) {
        if (this.files[filename] instanceof file) {
            this.files[filename].remove();
        }
        delete files[filename];
    }
    return this;
};

/**
 * Iterate over each file
 * @param {function} cb A closure : `function(file, name)`
 * @return {repository}
 */
repository.prototype.each = function(cb) {
    for(var name in this.files) {
        if (this.files[name] instanceof file) {
            cb.apply(this, this.files[name], name);
        }
    }
    return this;
};

/**
 * Gets the scope for the specified offset
 * @return {scope}
 */
repository.prototype.scope = function(filename, offset) {
    if (this.files.hasOwnProperty(filename)) {
        return this.files[filename].getScope(offset);
    } else {
        return null;
    }
};

/**
 * Retrieves a file object
 * @param {String} filename The filename to retrieve
 * @return {file|null} Returns the file if exists, or null if not defined
 */
repository.prototype.get = function(filename) {
    if (this.files.hasOwnProperty(filename)) {
        return this.files[filename];
    } else {
        return null;
    }
};


/**
 * Gets/Sets the files repository
 * @param {object} data Sets the specified data
 * @return {repository|object} Retrieves the cache (if data not set)
 */
repository.prototype.cache = function(data) {
    if (typeof data !== 'undefined') {
        // sets the data
        this.files = {};
        if (data) {
            // creating files from structure
            for(var name in data) {
                this.files[name] = file.import(data[name]);
            }
            // update object links
            for(var name in files) {
                this.files[name].import();
            }
        }
        return this;
    } else {
        // gets the data
        var result = {};
        for(var name in this.files) {
            if (this.files[name] instanceof file) {
                result[name] = this.files[name].export();
            }
        }
        return result;
    }
};

/**
 * Rename a file
 * @param {string} oldName The original filename
 * @param {string} newName The new filename
 * @return {repository}
 */
repository.prototype.rename = function(oldName, newName) {
    if (this.files.hasOwnProperty(oldName)) {
        this.files[newName] = this.files[oldName];
        this.files[newName].name = newName;
        delete this.files[oldName];
    }
    return this;
};


/**
 * Refresh the file contents
 * @return {Promise}
 */
repository.prototype.refresh = function(filename, encoding) {
    if (!this.files.hasOwnProperty(filename)) {
        return this.parse(filename, encoding);
    } else {
        if (this.files[name] instanceof Promise) {
            return this.files[name];
        }
        this.files[filename] = new Promise(function(done, reject) {
            fs.readFile(filename, encoding, function(err, data) {
                // @todo
            });
        });
        return this.files[filename];
    }
};

/**
 * @exports {repository}
 */
module.exports = repository;