/*!
 * Copyright (C) 2016 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */

var fs = require('fs');
var path = require('path');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var globToRegExp = require('glob-to-regexp');
var parser = require('php-parser');

var file = require('./file');
var node = require('./node');

/**
 *
 * The repository stores a list of files with their symbols
 * and acts like a database.
 *
 * You can request it to retrieve
 * [nodes](NODE.md) like [namespaces](NAMESPACE.md], functions or classes.
 *
 * You can also use it to retrieve scope context from a specific
 * offset (usefull for an editor).
 *
 * @public
 * @constructor {repository}
 * @property {Object} files
 * @property {Object} options
 * @property {String} directory
 * @property {Object} counter
 */
var repository = function(directory, options) {
    // direct function call
    if (typeof this === 'function') {
        return new this(directory, options);
    }
    this.files = {};
    // options
    this.options = {
        // list of excluded directory names
        exclude: ['.git', '.svn', 'node_modules'],
        // list of included directories
        include: ['./'],
        // list of php extension files
        ext: [
            '*.php','*.php3','*.php5','*.phtml',
            '*.inc','*.class','*.req'
        ],
        // extract vars from each scope (functions, classes)
        // may use memory but could be usefull for resolving
        // their type (on autocompletion)
        scanVars: true,
        // extract scopes from
        scanExpr: true,
        // default parsing encoding
        encoding: 'utf8',
        // should spawn a worker process to avoir blocking
        // the main loop (may be slower with small projects or single cpu)
        forkWorker: require('os').cpus().length > 1,
        // use the file mtime property to check changes
        cacheByFileDate: true,
        // use the file size to detect changes
        cacheByFileSize: false,
        // use an hash algorithm to detect changes
        // if low cache hit, may slow down the parsing
        cacheByFileHash: true
    };
    // extends options
    if (options && typeof options === 'object') {
        for(var k in options) {
            this.options[k] = options[k];
        }
    }

    // prepare extension filters
    this._regex = [];
    for(var i = 0; i < this.options.ext.length; i++) {
        this._regex.push(
            globToRegExp(
                this.options.ext[i]
            )
        );
    }

    // counting things
    this.counter = {
        total: 0,
        loading: 0,
        loaded: 0,
        error: 0
    };
    this.directory = path.resolve(directory);

    // init EventEmitter
    EventEmitter.call(this);
};
util.inherits(repository, EventEmitter);

/**
/**
 * Scan the current directory to add PHP files to parser
 * @public
 * @param {String|Array} directory Path to scan, relative to repository root
 * @return {Promise}
 */
repository.prototype.scan = function(directory) {
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
                            for(var i = 0; i < self._regex.length; i++) {
                                if (self._regex[i].test(file)) {
                                    matched = true;
                                    break;
                                }
                            }
                            // ignore file (due to pattern)
                            if (!matched) return done();
                            // handle in-memory cache
                            if (self.files.hasOwnProperty(filename)) {
                                // check if need to parse again
                                if (
                                  self.options.cacheByFileDate &&
                                  self.files[filename].mtime === stat.mtime
                                ) {
                                    return done(self.files[filename]);
                                }
                                // same size and
                                if (
                                    self.options.cacheByFileSize &&
                                    stat.size === self.files[filename].size
                                ) {
                                    return done(self.files[filename]);
                                }
                            }
                            self.parse(filename).then(done, reject);
                        }
                    });
                }));
            });
            Promise.all(pending).then(done, reject);
        });
    });
};

/**
 * Parsing a file
 * @public
 * @param {string} filename
 * @param {string} encoding The encoding (by default utf8)
 * @return {Promise}
 */
repository.prototype.parse = function(filename, encoding) {
    if (!this.files.hasOwnProperty(filename)) {
        if (!encoding) encoding = this.options.encoding;
        var self = this;
        this.emit('parse', filename);
        this.files[filename] = new Promise(function(done, reject) {
            self.counter.total ++;
            self.counter.loading ++;
            if (self.options.forkWorker) {
                // reads from a forked process
                require('./worker')().then(function(cache) {
                    self.counter.loading --;
                    self.files[filename] = file.import(self, cache);
                    self.files[filename].refresh();
                    self.counter.loaded ++;
                    self.emit('progress', self.counter);
                }, function(e) {
                    self.counter.loading --;
                    self.counter.total --;
                    self.counter.error ++;
                    delete self.files[filename];
                    self.emit('error', e);
                    return reject(e);
                });
            } else {
                // reads from the main process
                fs.readFile(
                    path.resolve(self.directory, filename),
                    encoding, function(err, data) {
                    self.counter.loading --;
                    if (!err)  {
                        try {
                            var reader = new parser({
                                parser: {
                                    locations: true,
                                    extractDoc: true,
                                    suppressErrors: true
                                }
                            });
                            data = data.toString(encoding);
                            var ast = reader.parseCode(data);
                        } catch(e) {
                            err = e;
                        }
                    }
                    if (err) {
                        self.counter.total --;
                        delete self.files[filename];
                        self.emit('error', err);
                        return reject(err);
                    } else {
                        try {
                            self.files[filename] = new file(self, filename, ast);
                            self.files[filename].size = data.length;
                            self.counter.loaded ++;
                            self.emit('progress', self.counter);
                            return done(self.files[filename]);
                        } catch(e) {
                            self.counter.total --;
                            self.counter.error ++;
                            delete self.files[filename];
                            self.emit('error', e);
                            return reject(e);
                        }
                    }
                });
            }
        });
        return this.files[filename];
    } else {
        return this.refresh(filename, encoding);
    }
};

/**
 * Lookup at each file and retrieves specified nodes
 * @param {String} type
 * @param {Number} limit
 * @return {node[]} {@link NODE.md|:link:}
 */
repository.prototype.getByType = function(type, limit) {
    if (!limit || limit < 1) limit = 100;
    var result = [];
    for(var k in this.files) {
        if (this.files[k] instanceof file) {
            result = result.concat(this.files[k].getByType(type));
            if (result.length > limit) {
                result = result.slice(0, limit);
                break;
            }
        }
    }
    return result;
}

/**
 * Lookup at each file and retrieves named elements
 * @param {String} type
 * @param {Number} limit
 * @return {node[]} {@link NODE.md|:link:}
 */
repository.prototype.getByName = function(type, name, limit) {
    var result = [];
    for(var k in this.files) {
        if (this.files[k] instanceof file) {
            var items = this.files[k].getByName(type, name, limit);
            if (items.length > 0) {
                result = result.concat(items);
            }
        }
    }
    return result;
};

/**
 * Lookup at each file and retrieves named elements
 * @param {String} type
 * @param {Number} limit
 * @return {node|null} {@link NODE.md|:link:}
 */
repository.prototype.getFirstByName = function(type, name) {
    var result = null;
    for(var k in this.files) {
        if (this.files[k] instanceof file) {
            result = this.files[k].getFirstByName(type, name);
            if (result) return result;
        }
    }
    return null;
};

/**
 * Retrieves a namespace (cross file)
 *
 * The retrieved namespace will include :
 * - constants
 * - functions
 * - classes
 * - interfaces
 * - traits
 *
 * @param {String} name The namespace name
 * @return {namespace|null} {@link NAMESPACE.md|:link:}
 */
repository.prototype.getNamespace = function(name) {
    if (name[0] !== '\\') name = '\\' + name;
    if (name.length > 1 && name.substring(-1) === '\\') {
        name = name.substring(0, name.length - 1);
    }
    var items = this.getByName('namespace', name);
    if (items.length > 0) {
        var result = node.create('namespace');
        items.forEach(function(ns) {
            if (ns.constants.length > 0) {
                result.constants = result.constants.concat(ns.constants);
            }
            if (ns.functions.length > 0) {
                result.functions = result.functions.concat(ns.functions);
            }
            if (ns.classes.length > 0) {
                result.classes = result.classes.concat(ns.classes);
            }
            if (ns.traits.length > 0) {
                result.traits = result.traits.concat(ns.traits);
            }
            if (ns.interfaces.length > 0) {
                result.interfaces = result.interfaces.concat(ns.interfaces);
            }
        });
        return result;
    } else {
        return null;
    }
};


/**
 * Clean all the cache
 * @public
 * @return {repository}
 */
repository.prototype.cleanAll = function() {
    this.files = {};
    return this;
};

/**
 * Removes a file
 * @public
 * @return {repository}
 */
repository.prototype.remove = function(filename) {
    if (this.files.hasOwnProperty(filename)) {
        if (this.files[filename] instanceof file) {
            this.files[filename].remove();
        }
        delete this.files[filename];
    }
    return this;
};

/**
 * Iterate over each file
 * @public
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
 * @public
 * @return {scope}
 */
repository.prototype.scope = function(filename, offset) {
    if (
        this.files.hasOwnProperty(filename) && 
        this.files[filename] instanceof file
    ) {
        return this.files[filename].getScope(offset);
    } else {
        return null;
    }
};

/**
 * Retrieves a file object
 * @public
 * @param {String} filename The filename to retrieve
 * @return {file|null} Returns the file if exists, or null if not defined
 */
repository.prototype.get = function(filename) {
    if (
        this.files.hasOwnProperty(filename) && 
        this.files[filename] instanceof file
    ) {
        return this.files[filename];
    } else {
        return null;
    }
};


/**
 * Gets/Sets the files repository
 * @public
 * @param {object} data Sets the specified data
 * @return {repository|object} Retrieves the cache (if data not set)
 */
repository.prototype.cache = function(data) {
    if (typeof data !== 'undefined') {
        // sets the data
        this.files = {};
        if (data) {
            this.directory = data.directory;
            // creating files from structure
            for(var name in data.files) {
                this.files[name] = file.import(this, data[name]);
            }
            // rebuild object links
            for(var name in this.files) {
                this.files[name].refresh();
            }
        }
        return this;
    } else {
        // gets the data
        var result = {
            directory: this.directory,
            files: {}
        };
        for(var name in this.files) {
            if (this.files[name] instanceof file) {
                result.files[name] = this.files[name].export();
            }
        }
        return result;
    }
};

/**
 * Rename a file
 * @public
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
 * @public
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
            fs.readFile(
                path.join(self.directory, filename),
                encoding, function(err, data) {
                // @todo
            });
        });
        return this.files[filename];
    }
};

module.exports = repository;
