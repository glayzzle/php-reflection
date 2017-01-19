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
 * The namespace is an organisational unit that stores
 * inner nodes and use the namespace prefix to avoid
 * names colision.
 *
 * @constructor Method
 *
 * @property {String} name The method name
 * @property {Boolean} isStatic
 * @property {Boolean} isAbstract
 * @property {Boolean} isFinal
 * @property {Boolean} isPrivate
 * @property {Boolean} isProtected
 * @property {Boolean} isPublic
 * @property {variable[]} args List of arguments
 */
var Method = block.extends('method');

/**
 * @protected Consumes the current ast node
 */
Method.prototype.consume = function(ast) {
  this.name = ast[1];
  this.fullName = this.parent.fullName + '::' + this.name;
// @todo
};

module.exports = Method;
