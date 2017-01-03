/*!
 * Copyright (C) 2016 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */


var node = require('./node');
var expr = require('./expr');

/**
 * ** Extends from {@link NODE.md|:link: node} **
 * 
 * Represents a constant declaration
 * 
 * @public @constructor define
 * @property {String|expr} name 
 * @property {expr} value {@link EXPR.md|:link:}
 * @property {Boolean|expr} caseInsensitive 
 */
var _def = node.extends('define');

/**
 * @protected Consumes the current ast node
 */
_def.prototype.consume = function(ast) {
  var args = ast[2];
  this.name = expr.resolve(this, args[0]);
  if (args.length > 1) {
    this.value = expr.resolve(this, args[1]);
  }
  if (args.length > 2) {
    this.caseInsensitive = expr.resolve(this, args[2]);
  } else {
    this.caseInsensitive = false;
  }
};

module.exports = _def;