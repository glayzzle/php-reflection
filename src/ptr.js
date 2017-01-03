/*!
 * Copyright (C) 2016 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */

var node = require('./node');

/**
 * This class handles hierarchical links between the document nodes
 * @constructor ptr
 * @property {file} file {@link FILE.md|:link:} The related file
 * @property {Number} index The {@link NODE.md|:link: node} offset into the nodes array
 */
var ptr = function(file, index) {
  this.file = file;
  this.index = index;
};

/**
 * Retrieves the related node
 * @return {node}
 */
ptr.prototype.get = function() {
  return this.file.nodes[this.index];
};

/**
 * Serialize the pointer 
 */
ptr.prototype.export = function() {
  return this.index;
};

/**
 * Creates a ptr instance for the specified node
 * @param {String} type
 * @param {node} parent {@link NODE.md|:link:}
 * @param {Array} ast
 * @return {ptr}
 */
ptr.create = function(type, parent, ast) {
  var file = parent.getFile();
  var offset = file.nodes.length;
  node.create(type, parent, ast);
  return new ptr(file, offset);
};


module.exports = ptr;