/*!
 * Copyright (C) 2016 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */


var node = require('./node');
var expr = require('./expr');

/**
 * **Extends from {@link NODE.md|:link: node}**
 * 
 * Reprensents a class property declaration
 * 
 * @public 
 * @constructor property
 * @property {String} name
 * @property {String} fullName
 * @property {Boolean} isStatic
 * @property {Boolean} isPrivate
 * @property {Boolean} isProtected
 * @property {Boolean} isPublic
 * @property {expr} value {@link EXPR.md|:link:}
 */
var property = node.extends('property');

/**
 * @protected Consumes the current ast node
 */
property.prototype.consume = function(ast) {
  this.name = ast[0];
  this.fullName = this.parent.fullName + '::' + this.name;
  if (ast[1]) {
    this.value = expr.resolve(this, ast[1]);
  }
};

module.exports = property;