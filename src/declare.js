/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var block = require('./block');
var expr = require('./expr');

/**
 * ** Extends from {@link BLOCK.md|:link: block} **
 *
 * The declare construct is used to set execution directives
 * for a block of code.
 *
 * {@link http://php.net/manual/en/control-structures.declare.php}
 *
 * @public
 * @constructor Declare
 * @property {Object} options List of key/value declarations
 */
var Declare = block.extends('declare');

/**
 * @protected reads each declared option
 */
Declare.prototype.consume = function(ast) {

  // @fixme object are not exported as cache
  this.options = {};
  for(var k in ast.what) {
    this.options[k] = expr.resolve(this, ast.what[k]);
  }

  // Iterator over each namespace item
  this.scanForChilds(ast.children);
};

module.exports = Declare;
