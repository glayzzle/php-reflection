/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';
var block = require('./block');
var ptr = require('./ptr');

/**
 * **Extends from [block](BLOCK.md)**
 *
 * The namespace is an organisational unit that stores
 * inner nodes and use the namespace prefix to avoid
 * names colision.
 *
 * @constructor {namespace}
 *
 * @property {String} name The namespace full name
 * @property {use[]} uses {@link USE.md|:link:} List of imported (or used namespaces)
 * @property {constant[]} constants {@link CONSTANT.md|:link:} List of constants
 */
var namespace = block.extends('namespace');


/**
 * @protected Consumes the current ast node
 */
namespace.prototype.consume = function(ast) {
  this.name = '\\' + ast.name.name;
  this.uses = {};
  this.constants = [];
  this.scanForChilds(ast.children);
};

/**
 * Resolves a class name if it's relative, using aliases
 * or adding current namespace prefix.
 * @param {String|Array} name
 * @return {String}
 */
namespace.prototype.resolveClassName = function(name) {
  if (name.kind && name.kind === 'identifier') {
    if (name.resolution === 'fqn') {
      return name.name;
    } else if (name.resolution === 'rn') {
      return this.name + '\\' + name.name;
    } else {
      // resolve with use
      if (this.uses[name.name]) {
        return this.uses[name.name];
      }
      // relative to current namespace
      return this.name + '\\' + name.name;
    }
  }
};

module.exports = namespace;
