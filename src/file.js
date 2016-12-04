/*!
 * Copyright (C) 2016 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */

var block = require('./block');
var scope = require('./scope');
var namespace = require('./namespace');
var declare = require('./declare');
var comment = require('./comment');

/**
 * **Extends from [block](BLOCK.md)**
 * 
 * Initialize a new file with the specified AST contents
 * 
 * @constructor {file}
 * @property {repository} repository The repository instance
 * @property {Date} version Last time when the file was parsed
 * @property {integer} size The total file size
 * @property {String} name The filename
 * @property {namespace[]} namespaces {@link NAMESPACE.md|:link:} List of namespaces
 * @property {declare[]} declares {@link DECLARE.md|:link:} List of declare nodes
 * @property {reference[]} links {@link REFERENCE.md|:link:} List of references (constants, classes, interfaces...)
 * @property {external[]} externals {@link EXTERNAL.md|:link:} List of external references
 * @property {error} error Error node
 */
var file = block.extends(function file(repository, name, ast) {
    this.repository = repository;
    this.version = new Date();
    this.size = 0;
    this.name = name;
    this.namespaces = [];
    this.declares = [];
    this.links = [];
    this.externals = [];
    this.error = null;
    this._scopes = [];

    // super constructor
    block.apply(this, [this, ast]);
});

/**
 * @protected Consumes the current ast node
 */
file.prototype.consume = function(ast) {

    // check the AST structure
    if (ast[0] !== 'program' || !Array.isArray(ast[1])) {
        throw new Error('Bad AST node');
    }

    // last docBlock node
    var doc = null;

    // empty namespace
    var root = [];


    // scan each document node
    ast[1].forEach(function(item) {
        var type = block.getASTType(item);
        
        if (type) {
            if (type === 'declare') {
                this.declares.push(
                    new declare(this, item)
                );
            } else if (type === 'namespace') {
                var ns = new namespace(this, item);
                if (doc) {
                    ns.doc = new comment(doc);
                    doc = null;
                }
            } else if (type === 'doc' || type === 'comment') {
                doc = item;
            } else {
                // out of namespace scope
                if (doc) {
                    root.push(doc);
                }
                root.push(item);
            }
        }
    }.bind(this));

    // create an empty namespace
    if (root.length > 0) {
        new namespace(this, [
            'namespace', [''], root
        ]);
    }
};



/**
 * Gets the current file instance
 */
file.prototype.getFile = function() {
    return this;
};

/**
 * Gets a scope reader
 * @return {scope}
 */
file.prototype.getScope = function(offset) {
    return new scope(this, offset);
};

/**
 * Gets the current namespace
 */
file.prototype.getNamespace = function() {
    if (this.namespaces.length > 0) {
        return this.namespaces[0];
    } else {
        return null;
    }
};

/**
 * Removes the current file from the parser (need to clean external references)
 */
file.prototype.remove = function() {

};

/**
 * Refreshing symbols
 */
file.prototype.refresh = function() {

};

module.exports = file;