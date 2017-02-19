/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var point = require('grafine').point;
var inherits = require('util').inherits;
var position = require('../utils/position');
var comment = require('../utils/comment');

/**
 * Generic node object (inherited by all objects)
 *
 * @public
 * @constructor {node}
 * @param {file} parent The parent node
 * @param {node} parent The parent node
 * @param {array} ast The current AST node
 *
 * @property {node} parent Parent node instance
 * @property {relation[]} relations {@link RELATION.md|:link:} List of linked nodes
 * @property {position|null} position {@link POSITION.md|:link:} Current node position
 * @property {comment|null} doc {@link COMMENT.md|:link:} Node attached commebnt
 */
var node = function(graph, file, parent, ast) {

    point.apply(this, [graph]);

    if (!this.type && this.constructor.name.length > 0) {
        this.type = this.constructor.name;
    }

};
inherits(node, point);

/**
 * Gets the current repository
 * @return {repository} {@link REPOSITORY.md|:link:}
 */
node.prototype.getRepository = function() {
    return this.graph.repository;
};

/**
 * Gets the file node
 * @return {file} {@link FILE.md|:link:}
 */
node.prototype.getFile = function() {
    if (this.type === 'file') {
        return this;
    }
    if (!this._file) {
        var uuid = this.first('file');
        if (uuid) {
            this._file = this.graph.get(uuid);
        }
    }
    return this._file;
};

/**
 * Gets the parent node
 * @return {node} {@link NODE.md|:link:}
 */
node.prototype.getParent = function() {
    if (!this._parent) {
        var uuid = this.first('parent');
        if (uuid) {
            this._parent = this.graph.get(uuid);
        }
    }
    return this._parent;
};

/**
 * Gets the current namespace
 * @return {namespace} {@link NAMESPACE.md|:link:}
 */
node.prototype.getNamespace = function() {
    if (this.type === 'namespace') {
        return this;
    }
    if (!this._namespace) {
        var parent = this.getParent();
        if (parent) {
            this._namespace = parent.getNamespace();
        }
    }
    return this._namespace;
};

/**
 * Gets the parent block
 * @return {block} {@link BLOCK.md|:link:}
 */
node.prototype.eachChild = function(cb) {
    var childs = this.related.parent;
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
 * @protected Consumes the current ast node
 */
node.prototype.consume = function(file, parent, ast) {

    if (file) {
        this.set('file', file);
    }

    if (parent) {
        this.set('parent', parent);
    }

    if (ast) {
        if (ast.state && ast.state.token) {
            this.state = ast.state;
        }

        // check if contains a position node
        if (ast.loc) {
            this.position = new position(ast.loc);
        }

        // check if contains a doc node
        if (typeof ast.doc === 'object' && ast.doc !== null) {
            this.doc = new comment(ast.doc);
        }
    }
};

/**
 * Node helper for importing data
 */
node.import = function(data, graph) {
    var result = node.create(data._t, graph);
    result.type = data._t;
    result.state = data._n[0];
    result.position = position.import(data._n[1]);
    result.doc = data._n[2] ? doc.import(data._n[2]) : null;
    grafine.point.prototype.import.apply(
        result, [data]
    );
    return result;
};

/**
 * Gets a POJO representation of the current node that can be serialized / {@link #import|unserialized}
 * @return {Object|null}
 */
node.prototype.export = function() {
    var result = point.prototype.export.apply(this, []);
    result._t = this.type;
    result._n = [
        this.state,
        this.position.export(),
        this.doc ? this.doc.export() : null
    ];
    return result;
};


/**
 * Use this function to extend a node into a specific object.
 *
 * In order to make the cache wording automatically, the class
 * name must be the same as the filename `foo` class into `./foo.js`
 *
 * *WARNING* : It you pass a constructor, make sur it's named in order to
 * automatically retrieve it's classname (used by the caching system)
 *
 * @public
 * @param {constructor|string} ctor Define the named constructor, or the class name
 * @return {constructor}
 *
 * @example Create with a constructor
 * var block = require('./block');
 * var child = block.extends(function className(parent, ast) {
 *   block.apply(this, [parent, ast]);
 *   // customized init code
 * });
 * child.prototype.foo = function() ...
 *
 * @example Create with a generic class name
 * var block = require('./block');
 * var child = block.extends('className');
 * child.prototype.foo = function() ...
 *
 */
node.extends = declareExtends(node);

/**
 * List of node builders
 * @public
 */
node.builders = {};

/**
 * Helper for creating a new node
 * @param {String} type
 * @param {node} parent
 * @param {Array|null} ast
 * @return {node}
 * @throws {Error} if the specified type is not fond
 */
node.create = function (type, graph) {
  if (!node.builders.hasOwnProperty(type)) {
    require('../nodes/' + type);
  }
  if (!node.builders.hasOwnProperty(type)) {
    throw new Error('"' + type + '" is not found');
  }

  return new node.builders[type](graph);
};

/** @private recursive extends */
function declareExtends (base) {
  return function (ctor) {
    var _super = ctor;
    if (typeof ctor !== 'function') {
      _super = function (parent, ast) {
        base.apply(this, arguments);
        this.type = ctor;
      };
      node.builders[ctor] = _super;
    } else {
      node.builders[_super.name] = _super;
    }
    // recursive extends
    _super.extends = declareExtends(_super);
    inherits (_super, base);
    return _super;
  };
}

module.exports = node;
