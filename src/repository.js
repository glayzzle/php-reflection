/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var EventEmitter = require('events').EventEmitter;
var util = require('util');
var path = require('path');

var globToRegExp = require('glob-to-regexp');
var db = require('./data/db');
var node = require('./data/node');
var file = require('./nodes/file');
var block = require('./nodes/block');
var defaultOptions = require('./repository/options');

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

    // extends options
    this.options = {};
    for(var k in defaultOptions) {
        this.options[k] = options && k in options ?
            options[k] : defaultOptions[k]
        ;
    }

    // Create the storage
    this.db = new db.graph(this);

    // prepare extension filters
    this._regex = [];
    for (var i = 0; i < this.options.ext.length; i++) {
        this._regex.push(
            globToRegExp(this.options.ext[i])
        );
    }

    // counting things
    this.counter = {
        total: 0,
        loading: 0,
        loaded: 0,
        error: 0,
        symbols: 0,
        size: 0
    };
    this.directory = path.resolve(directory);

    // init EventEmitter
    EventEmitter.call(this);
};
util.inherits(repository, EventEmitter);

/**
 * Starts to read a file in order to parse it. This event is emited from
 * parse or refresh methods.
 *
 * @event repository#read
 * @type {object}
 * @property {string} name - The filename that will be parsed
 */


/**
 * Cache hit event, file is already updated
 *
 * @event repository#cache
 * @type {object}
 * @property {string} name - The filename that was found in cache
 */

/**
 * The specified file is parsed.
 *
 * @event repository#parse
 * @type {object}
 * @property {string} name - The filename that will be parsed
 * @property {file} file - The file
 */

/**
 *
 *
 * @event repository#error
 * @type {object}
 * @property {string} name - The filename that triggered the error
 * @property {object} error - The reaised error object
 */


/**
 * Scan the current directory to add PHP files to parser
 * @public
 * @param {String|Array} directory Path to scan, relative to repository root
 * @return {Promise}
 * @fires repository#progress
 * @fires repository#cache
 */
repository.prototype.scan = require('./repository/scan');

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
repository.prototype.parse = require('./repository/parse');

/**
 * Lookup at each file and retrieves specified nodes
 * @param {String} type
 * @param {Number} limit
 * @return {node[]} {@link NODE.md|:link:}
 */
repository.prototype.getByType = function(type, limit) {
  if (!limit) limit = 100;
  var result = [];
  for (var k in this.files) {
    if (this.files[k] instanceof file) {
      result = result.concat(this.files[k].getByType(type));
      if (limit > 0 && result.length > limit) {
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
    var criteria = {};
    criteria[type] = name;

    var result = [];
    for (var k in this.files) {
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
    var criteria = {};
    criteria[type] = name;
    var items = this.db.search(criteria);
    if (items.length > 0) {
        return this.db.get(items[0]);
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

    if (name[0] !== '\\') {
        name = '\\' + name;
    }

    if (name.length > 1 && name.substring(-1) === '\\') {
        name = name.substring(0, name.length - 1);
    }

    var items = this.db.search({
        namespace: name
    });

    if (items.length > 0) {

        // retrieves first item
        if (items.length === 1) {
            return this.db.get(items[0]);
        }

        // create a virtual aggregated node of all namespace elements
        var result = node.create('namespace', this);

        items.forEach(function(ns) {
            /** @todo
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
            */
        });
        return result;
    } else {
        return null;
    }
};

/**
 * Synchronize with specified offset
 * @return {boolean|Error} True is node was synced, or Error object if fail
 */
repository.prototype.sync = require('./repository/sync');


/**
 * Clean all the cache
 * @public
 * @return {repository}
 */
repository.prototype.cleanAll = function() {
    this.db = new db.graph(this);
    return this;
};

/**
 * Iterate over each symbol
 * @public
 * @param {function} cb A closure : `function(node, name)`
 * @return {repository}
 */
repository.prototype.each = function(type, cb) {
    this.db.readIndex(type, function(items) {
        for(var name in items) {
            var nodes = items[name];
            if (nodes.length !== 1) {
                for(var i = 0; i < nodes.length; i++) {
                    cb(this.db.get(nodes[i]), name);
                }
            } else {
                cb(this.db.get(nodes[0]), name);
            }
        }
    });
    return this;
};

/**
 * Gets the scope for the specified offset
 * @public
 * @return {scope}
 */
repository.prototype.getScope = function(filename, offset) {
    var file = this.getFile(filename);
    if (file) {
        return file.getScope(offset);
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
repository.prototype.getFile = function(filename) {
    var items = this.db.search({
        file: filename
    });
    if (items && items.length > 0) {
        return this.db.get(items[0]);
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
repository.prototype.hasFile = function(filename) {
    var items = this.db.search({
        file: filename
    });
    return (items && items.length > 0);
};


/**
 * Iterate over each file
 * @public
 * @param {function} cb A closure : `function(file, name)`
 * @return {repository}
 */
repository.prototype.eachFile = function(cb) {
    return this.each('file', cb);
};

/**
 * Removes a file
 * @public
 * @return {repository}
 */
repository.prototype.removeFile = function(filename) {
    var items = this.db.search({
        file: filename
    });
    for(var i = 0; i < items.length; i++) {
        var item = this.db.get(items[i]);
        item.delete();
    }
    return this;
};

/**
 * Rename a file
 * @public
 * @param {string} oldName The original filename
 * @param {string} newName The new filename
 * @return {repository}
 */
repository.prototype.rename = function(oldName, newName) {
    var file = this.getFile(oldName);
    if (file) {
        file.setName(newName);
    }
    return this;
};


/**
 * Refresh the file contents
 * @public
 * @return {Promise}
 */
repository.prototype.refresh = require('./repository/refresh');

module.exports = repository;
