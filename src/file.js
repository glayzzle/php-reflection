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
 */
var file = block.extends(function(repository, name, ast) {

    // check the AST structure
    if (ast[0] !== 'program' || !Array.isArray(ast[1])) {
        throw new Error('Bad AST node');
    }

    /**
     * @property {repository} repository The repository instance
     */
    this.repository = repository;

    /**
     * @property {Date} version Last time when the file was parsed
     */
    this.version = new Date();

    /**
     * @property {String} name The filename
     */
    this.name = name;

    /**
     * @property {namespace[]} namespaces List of namespaces
     */
    this.namespaces = [];

    /**
     * @property {declare[]} declares List of declare nodes
     */
    this.declares = [];

    /**
     * @property {require[]} requires List of required statements
     */
    this.requires = [];

    /**
     * @property {include[]} includes List of included files
     */
    this.includes = [];

    /**
     * @property {block[]} scopes List of scopes
     */
    this.scopes = [];

    /**
     * @property {error} error Error node
     */
    this.error = null;

    // last docBlock node
    var doc = null;

    // empty namespace
    var root = [];

    // scan each document node
    console.log(ast[1]);
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

    // super constructor
    block.apply(this, [this, []]);
});

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