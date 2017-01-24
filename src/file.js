/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var node = require('./node');
var block = require('./block');
var Scope = require('./scope');
var comment = require('./comment');

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
var File = node.extends(function file(repository, name, ast) {
  this.repository = repository;
  this.mtime = 0;
  this.size = 0;
  this.crc32 = null;
  this.name = name;
  this.nodes = [];
  this.error = null;

  // super constructor
  node.apply(this, [this, ast]);
});

/**
 * Generic lookup by node type
 * @return {Node[]}
 */
File.prototype.getByType = function(type) {
  // build type index
  if (!this._indexNodeType) {
    this._indexNodeType = {};
    for (var i = 0; i < this.nodes.length; i++) {
      var item = this.nodes[i];
      if (!this._indexNodeType.hasOwnProperty(item.type)) {
        this._indexNodeType[item.type] = [];
      }
      this._indexNodeType[item.type].push(item);
    }
  }
  return this._indexNodeType.hasOwnProperty(type) ?
    this._indexNodeType[type] : [];
};

/**
 * Generic lookup by node name
 * @return {Node[]}
 */
File.prototype.getByName = function(type, name) {
  if (!this._indexNodeName) {
    this._indexNodeName = {};
  }

  // build names index
  if (!this._indexNodeName.hasOwnProperty(type)) {
    var nodes = this.getByType(type);
    var cache = {};
    for (var i = 0; i < nodes.length; i++) {
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
    this._indexNodeName[type][name] : [];
};

/**
 * Generic lookup by node name
 * @return {Node|null}
 */
File.prototype.getFirstByName = function(type, name) {
  var result = this.getByName(type, name);
  return result.length > 0 ? result[0] : null;
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
File.prototype.consume = function(ast) {

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
        node.create('declare', self, item);
      } else if (item.kind === 'namespace') {
        if (doc) {
          item.doc = doc;
          doc = null;
        }
        node.create('namespace', self, item);
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
    node.create('namespace', this, {
      'kind': 'namespace',
      'name': {
        'kind': 'identifier',
        'name': ''
      },
      'children': root
    });
  }
};

/**
 * Gets a scope reader
 * @return {Scope} {@link SCOPE.md|:link:}
 */
File.prototype.getScope = function(offset) {
  return new Scope(this, offset);
};

/**
 * Removes the current file from the parser (need to clean external references)
 */
File.prototype.remove = function() {
  // @todo
};

/**
 * Refreshing symbols
 */
File.prototype.refresh = function() {
  // @todo
};


/**
 * Refreshing symbols
 */
File.import = function(repository, data) {
  // @todo
  return new File(repository, data.name);
};

module.exports = File;
