/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var point = require('grafine/src/point');
var inherits = require('util').inherits;
var position = require('../utils/position');
var comment = require('../utils/comment');

/**
 * Generic node object (inherited by all objects)
 *
 * @public @constructor {node}
 * @param {node} parent The parent node
 * @param {array} ast The current AST node
 *
 * @property {node} parent Parent node instance
 * @property {relation[]} relations {@link RELATION.md|:link:} List of linked nodes
 * @property {position|null} position {@link POSITION.md|:link:} Current node position
 * @property {comment|null} doc {@link COMMENT.md|:link:} Node attached commebnt
 */
var node = function(file, parent, ast) {

    point.apply(this, [file]);

    if (parent) {
        this.set('parent', parent);
    }

    if (!this.type && this.constructor.name.length > 0) {
        this.type = this.constructor.name;
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


    if (ast) {
        this.consume(ast);
    }
};

inherits(node, point);

/**
 * Scan relations nodes and retrieves related nodes
 * @param {String} type
 * @return {node[]}
 */
node.prototype.getByRelationType = function(type) {
  var nodes = [];
  this.relations.forEach(function(item) {
    if (item.type === type) {
      nodes.push(item.from);
    }
  });
  return nodes;
};

/**
 * Gets the file node
 * @return {file} {@link FILE.md|:link:}
 */
node.prototype.getFile = function() {
    return this.graph;
};

/**
 * Gets the current repository
 * @return {Repository} {@link REPOSITORY.md|:link:}
 */
node.prototype.getRepository = function() {
  return this.graph.graph;
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
    this._namespace = this.properties.parent.getNamespace();
  }
  return this._namespace;
};

/**
 * Gets the parent block
 * @return {block} {@link BLOCK.md|:link:}
 */
node.prototype.getBlock = function() {
  if (this.parent) {
    return this.properties.parent.getBlock();
  }
  return null;
};

/**
 * @protected Consumes the current ast node
 */
node.prototype.consume = function(ast) {};

/**
 * Node helper for importing data
 * @todo to implement
 */
node.import = function(file, data) {
    var result = node.create(file, data.type);
    result.type = data.type;
    result.state = data.node[0];
    result.position = position.import(data.node[1]);
    result.doc = data.node[2] ? doc.import(data.node[2]) : null;
    return result;
};

/**
 * Gets a POJO representation of the current node that can be serialized / {@link #import|unserialized}
 * @return {Object|null}
 */
node.prototype.export = function() {
    var result = point.prototype.export.apply(this, []);
    result.type = this.type;
    result.node = [
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
node.create = function (type, file, parent, ast) {
  if (!node.builders.hasOwnProperty(type)) {
    require('../nodes/' + type);
  }
  if (!node.builders.hasOwnProperty(type)) {
    throw new Error('"' + type + '" is not found');
  }

  return new node.builders[type](parent, ast);
};

/** @private recursive extends */
function declareExtends (base) {
  return function (ctor) {
    var _super = ctor;
    if (typeof ctor !== 'function') {
      _super = function (parent, ast) {
        this.type = ctor;
        base.apply(this, arguments);
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
