/*!
 * Copyright (C) 2016 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */

var node = require('./node');
var block = require('./block');
var scope = require('./scope');
var comment = require('./comment');

/**
 * **Extends from [node](NODE.md)**
 * 
 * Initialize a new file with the specified AST contents
 * 
 * @constructor {file}
 * @property {repository} repository The repository instance
 * @property {Date} version Last time when the file was parsed
 * @property {integer} size The total file size
 * @property {String} name The filename
 * @property {node[]} nodes {@link NODE.md|:link:} List of nodes
 * @property {error} error {@link ERROR.md|:link:} Error node
 */
var file = node.extends(function file(repository, name, ast) {
    this.repository = repository;
    this.version = new Date();
    this.size = 0;
    this.name = name;
    this.nodes = [];
    this.error = null;

    // super constructor
    node.apply(this, [this, ast]);
});

/**
 * Generic lookup by node type
 * @return {node[]}
 */
file.prototype.getByType = function(type) {
    // build type index
    if (!this._indexNodeType) {
        this._indexNodeType = {};
        for(var i = 0; i < this.nodes.length; i++) {
            var item = this.nodes[i];
            if (!this._indexNodeType.hasOwnProperty(item.type)) {
                this._indexNodeType[item.type] = [];
            }
            this._indexNodeType[item.type].push(item);
        }
    }
    return this._indexNodeType.hasOwnProperty(type) ? 
        this._indexNodeType[type] : []
    ;
};

/**
 * Generic lookup by node name
 * @return {node[]}
 */
file.prototype.getByName = function(type, name) {
    if (!this._indexNodeName) {
        this._indexNodeName = {};
    }

    // build names index
    if (!this._indexNodeName.hasOwnProperty(type)) {
        var nodes = this.getByType(type);
        var cache = {};
        for(var i = 0; i < nodes.length; i++) {
            var item = nodes[i];
            var index = null;
            if (item.hasOwnProperty('fullName')) {
                index = item.fullName;
            } else if (item.hasOwnProperty('name')) {
                index = item.name;
            }
            if (index) {
                if (!cache.hasOwnProperty(index)) {
                    cache[index] = [];
                }
                cache[index].push(item);
            }
        }
        this._indexNodeName[type] = cache;
    }

    return this._indexNodeName[type].hasOwnProperty(name) ? 
        this._indexNodeName[type][name] : []
    ;
};

/**
 * Generic lookup by node name
 * @return {node|null}
 */
file.prototype.getFirstByName = function(type, name) {
    var result = this.getByName(type, name);
    return result.length > 0 ? result[0] : null;
};

/**
 * @return {namespace[]}
 */
file.prototype.getNamespaces = function() {
    return this.getByType('namespace');
};

/**
 * @return {class[]}
 */
file.prototype.getClasses = function() {
    return this.getByType('class');
};

/**
 * @return {interfaces[]}
 */
file.prototype.getInterfaces = function() {
    return this.getByType('class');
};

/**
 * @return {external[]}
 */
file.prototype.getIncludes = function() {
    return this.getByType('external');
};

/**
 * @return {class}
 */
file.prototype.getClass = function(name) {
    return this.getFirstByName('class', name);
};

/**
 * @return {class}
 */
file.prototype.getNamespace = function(name) {
    return this.getFirstByName('namespace', name);
};

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

    // self reference
    var self = this;

    // scan each document node
    ast[1].forEach(function(item) {
        var type = block.getASTType(item);
        if (type) {
            if (type === 'declare') {
                node.create('declare', self, item);
            } else if (type === 'namespace') {
                var ns = node.create('namespace', self, item);
                if (doc) {
                    ns.doc = new comment(this, doc);
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
    });

    // create an empty namespace
    if (root.length > 0) {
        node.create('namespace', this, [
            'namespace', [''], root
        ]);
    }
};

/**
 * Gets a scope reader
 * @return {scope} {@link SCOPE.md|:link:}
 */
file.prototype.getScope = function(offset) {
    return new scope(this, offset);
};

/**
 * Removes the current file from the parser (need to clean external references)
 */
file.prototype.remove = function() {
    // @todo
};

/**
 * Refreshing symbols
 */
file.prototype.refresh = function() {
    // @todo
};

module.exports = file;