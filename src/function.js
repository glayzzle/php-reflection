/*!
 * Copyright (C) 2016 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */

var block = require('./block');

/**
 * **Extends from [block](BLOCK.md)**
 * 
 * The namespace is an organisational unit that stores
 * inner nodes and use the namespace prefix to avoid
 * names colision.
 * 
 * @constructor function
 * 
 * @property {String} name The function name
 * @property {String} fullName
 * @property {Boolean} isClosure
 * @property {variable[]} args List of arguments
 * @property {variable[]} uses List of used variables
 */
var fn = block.extends('function');

module.exports = fn;