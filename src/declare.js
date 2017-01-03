/*!
 * Copyright (C) 2016 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
var block = require('./block');

/**
 * ** Extends from {@link BLOCK.md|:link: block} **
 * 
 * The declare construct is used to set execution directives 
 * for a block of code.
 * 
 * {@link http://php.net/manual/en/control-structures.declare.php}
 * 
 * @public @constructor declare
 * @property {Object} options List of key/value declarations 
 */
var declare = block.extends('declare');

/**
 * @protected reads each declared option
 */
declare.prototype.consume = function(ast) {

  // @fixme object are not exported as cache
  var options = {};
  ast[1].forEach(function(item) {
    options[item[0]] = item[1];
  });
  this.options = options;

  // Iterator over each namespace item
  this.scanForChilds(ast[2]);
};

module.exports = declare;