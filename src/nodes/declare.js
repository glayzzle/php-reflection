/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var Block = require('./block');
var Expr = require('./expr');

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
var Declare = Block.extends('declare');

/**
 * @protected reads each declared option
 */
Declare.prototype.consume = function(file, parent, ast) {
    this.options = {};
    for(var k in ast.what) {
        this.options[k] = Expr.resolve(this, ast.what[k]);
    }
    Block.prototype.consume.apply(this, arguments);
};

module.exports = Declare;
