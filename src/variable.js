/*!
 * Copyright (C) 2016 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */


var node = require('./node');

/**
 * **Extends from {@link NODE.md|:link: node}**
 * 
 * Reprensents a variable declaration
 * 
 * @public 
 * @constructor variable
 * @property {String} name
 */
var variable = node.extends('variable');

/**
 * @protected Consumes the current ast node
 */
variable.prototype.consume = function(ast) {
  this.name = ast[1][1];
};

module.exports = variable;


