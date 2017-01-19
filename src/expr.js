/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var block = require('./block');

/**
 * **Extends from [block](BLOCK.md)**
 *
 * Defines a generic AST expression
 *
 * @public
 * @constructor Expr
 * @property {Array} ast List of AST nodes (as plain arrays)
 */
var Expr = block.extends('expr');


/**
 * @protected Consumes the current ast node
 */
Expr.prototype.consume = function(ast) {
  this.ast = ast;
  this.scanForChilds(ast);
};


/**
 * Converts back AST nodes to PHP code
 * @return {String}
 * @todo
 */
Expr.prototype.toPHP = function() {
  // @todo : use php-unparser
  return null;
};

/**
 * @return {expr|Boolean|String|Number}
 */
Expr.resolve = function(parent, ast) {
  if (
    ast.kind === 'string' ||
    ast.kind === 'boolean' ||
    ast.kind === 'number'
  ) {
    return ast.value;
  } else {
    return new Expr(parent, ast);
  }
};

module.exports = Expr;
