/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var node = require('../data/node');
var ptr = require('../data/ptr');
var expr = require('./expr');

/**
 * ** Extends from {@link NODE.md|:link: node} **
 *
 * Represents a constant declaration
 *
 * @public
 * @constructor Constant
 * @property {String} name
 * @property {String} fullName
 * @property {expr} value {@link EXPR.md|:link:}
 */
var Constant = node.extends('constant');


/**
 * @protected Consumes the current ast node
 */
Constant.prototype.consume = function(ast) {
  this.name = ast.name;

  if (this.parent.type === 'class') {
    this.fullName = this.parent.fullName + '::' + this.name;
  } else if (this.parent.type === 'namespace') {
    this.fullName = this.parent.name + '::' + this.name;
  } else {
    this.fullName = this.name;
  }

  if (ast.value) {
    this.value = expr.resolve(this, ast.value);
  }
};


module.exports = Constant;
