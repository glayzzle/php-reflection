/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var node = require('./node');
var reference = require('./reference');

/**
 * **Extends from {@link NODE.md|:link: node}**
 *
 * Reprensents a variable declaration
 *
 * @public
 * @constructor variable
 * @property {String} name
 * @property {String|Class|Null} type
 */
var variable = node.extends('variable');

/**
 * @protected Consumes the current ast node
 */
variable.prototype.consume = function(ast) {
  if (ast.kind === 'assign') {
    if (ast.left.kind === 'variable') {
      this.name = ast.left.name;
    } else {
      // @fixme should avoid this
      this.name = '#' + ast.left.kind;
    }
    // resolve the variable type
    var what = ast.right.kind;
    if (what === 'number') {
      this.type = 'number';
    } else if (what === 'boolean') {
      this.type = 'boolean';
    } else if (what === 'string') {
      this.type = 'string';
    } else if (what === 'array') {
      this.type = 'array';
    } else if (what === 'new') {
      this.type = reference.toClass(this, ast.right.what, 'new');
    } else {
      this.type = null;
    }
  } else if (this.kind === 'parameter') {
    this.name = ast.name;
    if (ast.type) {
      this.type = reference.toClass(this, ast.type, 'type');
    } else if (ast.value) {
      // resolve from default value
      var what = ast.value;
      if (what === 'number') {
        this.type = 'number';
      } else if (what === 'boolean') {
        this.type = 'boolean';
      } else if (what === 'string') {
        this.type = 'string';
      } else if (what === 'array') {
        this.type = 'array';
      } else {
        this.type = null;
      }
    }
  } else if (this.kind === 'variable') {
    this.name = ast.name;
  }
};

module.exports = variable;
