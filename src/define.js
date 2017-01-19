/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var node = require('./node');
var expr = require('./expr');

/**
 * ** Extends from {@link NODE.md|:link: node} **
 *
 * Represents a constant declaration
 *
 * @public
 * @constructor Define
 * @property {String|expr} name
 * @property {expr} value {@link EXPR.md|:link:}
 * @property {Boolean|expr} caseInsensitive
 */
var Define = node.extends('define');

/**
 * @protected Consumes the current ast node
 */
Define.prototype.consume = function(ast) {
  this.name = expr.resolve(this, ast.arguments[0]);
  if (ast.arguments.length > 1) {
    this.value = expr.resolve(this, ast.arguments[1]);
  }
  if (ast.arguments.length > 2) {
    this.caseInsensitive = expr.resolve(this, ast.arguments[2]);
  } else {
    this.caseInsensitive = false;
  }
};

module.exports = Define;
