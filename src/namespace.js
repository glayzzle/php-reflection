/*!
 * Copyright (C) 2016 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
"use strict";
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

  var self = this;
  this.name = '\\' + ast.name.name;
  this.uses = [];
  this.constants = [];

  /**
   * Iterator over each namespace item
   */
  ast.children.forEach(function(item) {
    if (item.kind === 'constant') {
      self.constants.push(
        ptr.create('constant', self, item)
      );
    } else if (item.kind === 'usegroup' || item.kind === 'useitem') {
      // @todo
    } else {
      self.consumeChild(item);
    }
  });
};

/**
 * Resolves a class name if it's relative, using aliases
 * or adding current namespace prefix.
 * @param {String|Array} name
 * @return {String}
 */
namespace.prototype.resolveClassName = function(name) {
  if (Array.isArray(name)) {
    if (name[0] === 'ns' && Array.isArray(name[1])) {
      name = name[1];
    }
    name = name.join('\\');
  }
  if (name[0] !== '\\') {
    // @todo resolve use statements
    name = this.name + '\\' + name;
  }
  return name;
};

module.exports = namespace;
