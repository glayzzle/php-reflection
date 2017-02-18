/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var Node = require('../data/node');
var Block = require('./block');
var Scope = require('../utils/scope');

/**
 * **Extends from [node](NODE.md)**
 *
 * Initialize a new file with the specified AST contents
 *
 * @constructor {File}
 * @property {Repository} repository The repository instance
 * @property {Date} version Last time when the file was parsed
 * @property {integer} size The total file size
 * @property {String} name The filename
 * @property {Node[]} nodes {@link NODE.md|:link:} List of nodes
 * @property {Error} error {@link ERROR.md|:link:} Error node
 */
var File = Block.extends('file');

/**
 * Changes the current filename
 */
File.prototype.setName = function(newName) {
    this.removeIndex('file');
    this.index('file', newName);
    return this;
};

/**
 * Changes the current filename
 */
File.prototype.getName = function() {
    return this.getIndex('file');
};

/**
 * Retrieves a list of nodes with the specified type
 * @return {Node[]}
 */
File.prototype.eachNode = function(cb) {
    var childs = this.related.file;
    if (childs && childs.length > 0) {
        for(var i = 0; i < childs.length; i++) {
            var child = this.graph.get(childs[i]);
            if (child) {
                cb(child, i);
            }
        }
    }
    return this;
};

/**
 * Retrieves a list of nodes with the specified type
 * @return {Node[]}
 */
File.prototype.getFirstByName = function(type, name) {
    var childs = this.related.file;
    if (childs && childs.length > 0) {
        for(var i = 0; i < childs.length; i++) {
            var child = this.graph.get(childs[i]);
            if (child && child.type === type) {
                if (child.fullName === name || child.name === name) {
                    return child;
                }
            }
        }
    }
    return null;
};

/**
 * Retrieves a list of nodes with the specified type
 * @return {Node[]}
 */
File.prototype.getByType = function(type) {
    var childs = this.related.file;
    var result = [];
    this.eachNode(function(node) {
        if (node.type === type) {
            result.push(node);
        }
    });
    return result;
};

/**
 * @return {Namespace[]}
 */
File.prototype.getNamespaces = function() {
    return this.getByType('namespace');
};

/**
 * @return {Class[]}
 */
File.prototype.getClasses = function() {
    return this.getByType('class');
};

/**
 * @return {Interface[]}
 */
File.prototype.getInterfaces = function() {
    return this.getByType('interface');
};

/**
 * @return {External[]}
 */
File.prototype.getIncludes = function() {
    return this.getByType('external');
};

/**
 * @return {Class}
 */
File.prototype.getClass = function(name) {
    return this.getFirstByName('class', name);
};

/**
 * @return {Class}
 */
File.prototype.getNamespace = function(name) {
    return this.getFirstByName('namespace', name);
};

/**
 * @protected Consumes the current ast node
 */
File.prototype.consume = function(file, parent, ast) {

    // default values (for caching)
    this.mtime    = 0;
    this.size     = 0;
    this.crc32    = null;

    // check the AST structure
    if (ast.kind !== 'program' || !Array.isArray(ast.children)) {
        throw new Error('Bad AST node');
    }

    // last docBlock node
    var doc = null;

    // empty namespace
    var root = [];

    // self reference
    var self = this;

    // scan each document node
    ast.children.forEach(function(item) {
        if (item.kind) {
            if (item.kind === 'declare') {
                self.graph.create('declare', self, item);
            } else if (item.kind === 'namespace') {
                if (doc) {
                    item.doc = doc;
                    doc = null;
                }
                self.graph.create('namespace', self, item);
            } else if (item.kind === 'doc') {
                doc = item;
            } else {
                // out of namespace scope
                if (doc) {
                    root.push(doc);
                    doc = null;
                }
                root.push(item);
            }
        }
    });

    // create an empty namespace
    if (root.length > 0) {
        this.graph.create('namespace', this, {
            'kind': 'namespace',
            'name': {
                'kind': 'identifier',
                'name': ''
            },
            'children': root
        });
    }

    Node.prototype.consume.apply(this, arguments);
};

/**
 * Gets a scope reader
 * @return {Scope} {@link SCOPE.md|:link:}
 */
File.prototype.getScope = function(offset) {
    return new Scope(this, offset);
};

module.exports = File;
