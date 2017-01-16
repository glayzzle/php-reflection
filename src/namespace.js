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
  this.uses = {};
  this.constants = [];

  /**
   * Iterator over each namespace item
   */
  ast.children.forEach(function(item) {
    if (item.kind === 'constant') {
      self.constants.push(
        ptr.create('constant', self, item)
      );
    } else if (item.kind === 'usegroup') {
      var prefix = item.name.name;
      for(var i = 0; i < item.items.length; i++) {
        var alias = item.items[i].alias;
        var name = item.items[i].name.name;
        if (name[0] !== '\\') name = '\\' + name;
        if (!alias) {
          alias = name.split('\\');
          alias = alias[alias.length - 1];
        }
        self.uses[alias] = prefix + name;
      }
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
