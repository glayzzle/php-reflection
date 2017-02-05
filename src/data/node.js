/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

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
var node = function(parent, ast) {

  if (!parent) return;

  this.parent = parent;
  if (!this.type && this.constructor.name.length > 0) {
    this.type = this.constructor.name;
  }

  this.relations = [];

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
      this.doc = new comment(this, ast.doc);
    }
  }

  if (this.type !== 'file') {
    // automatic reference
    this.getFile().nodes.push(this);
  }
  if (ast) {
    this.consume(ast);
  }
};


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
  if (!this._file) {
    if (this.type === 'file') {
      this._file = this;
    } else {
      this._file = this.parent.getFile();
    }
  }
  return this._file;
};

/**
 * Gets the current repository
 * @return {Repository} {@link REPOSITORY.md|:link:}
 */
node.prototype.getRepository = function() {
  var file = this.getFile();
  if (file) {
    return file.repository;
  }
  return null;
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
    this._namespace = this.parent.getNamespace();
  }
  return this._namespace;
};

/**
 * Gets the parent block
 * @return {block} {@link BLOCK.md|:link:}
 */
node.prototype.getBlock = function() {
  if (this.parent) {
    return this.parent.getBlock();
  }
  return null;
};

/**
 * @protected Consumes the current ast node
 */
node.prototype.consume = function(ast) {};

/**
 * @private
 * Takes nodes instances and transform them in an object
 * @param {node|Object|Array} self
 * @return {Object|null}
 */
var deshydate = function(self) {

  if (!self) return null;

  // primitives
  if (typeof self === 'string') return self;
  if (typeof self.getTime === 'function') return self.getTime();
  if (typeof self === 'boolean') return self;
  if (typeof self === 'number') return self;

  var result = null;

  // try to export array
  if (Array.isArray(self)) {
    result = [];
    for (var i = 0; i < self.length; i++) {
      var n = deshydate(self[i]);
      if (n) {
        result.push(n);
      }
    }
    return result.length > 0 ? result : null;
  }

  // objects filter
  if (typeof self === 'object' && !(self instanceof node)) {
    if (typeof self.export === 'function') {
      return self.export();
    } else {
      return null;
    }
  }

  // try to export object
  result = {};
  for (var k in self) {
    if (k === 'parent' || k[0] === '_') continue;
    var n = self[k];
    if (n instanceof node) {
      result[k] = n.export();
      if (!result[k]) {
        delete result[k];
      }
    } else if (Array.isArray(n)) {
      if (n.length > 0) {
        result[k] = [];
        n.forEach(function(item) {
          item = deshydate(item);
          if (item) {
            result[k].push(item);
          }
        });
        if (result[k].length === 0) {
          delete result[k];
        }
      }
    } else if (typeof n !== 'function') {
      var item = deshydate(n);
      if (item)
        result[k] = item;
    }
  }
  if (Object.keys(result).length > 0) {
    return result;
  }
  return null;
};

/**
 * @private
 * Take an object and create its instances
 */
var hydrate = function(object) {};

/**
 * Node helper for importing data
 * @todo to implement
 */
node.import = function(repository, data) {};

/**
 * Node helper for importing data
 * @todo to implement
 */
node.prototype.refresh = function() {};

/**
 * Gets a POJO representation of the current node that can be serialized / {@link #import|unserialized}
 * @return {Object|null}
 */
node.prototype.export = function() {
  return deshydate(this);
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
node.create = function(type, parent, ast) {
  if (!node.builders.hasOwnProperty(type)) {
    require('../nodes/' + type);
  }
  if (!node.builders.hasOwnProperty(type)) {
    throw new Error('"' + type + '" is not found');
  }

  return new node.builders[type](parent, ast);
};

/** @private recursive extends */
function declareExtends(base) {
  return function(ctor) {
    var _super = ctor;
    if (typeof ctor !== 'function') {
      _super = function(parent, ast) {
        this.type = ctor;
        base.apply(this, arguments);
      };
      node.builders[ctor] = _super;
    } else {
      node.builders[_super.name] = _super;
    }
    // recursive extends
    _super.extends = declareExtends(_super);
    inherits(_super, base);
    return _super;
  };
}
;

module.exports = node;
