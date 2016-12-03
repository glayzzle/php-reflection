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
 * @protected Consumes the current ast node
 */
declare.prototype.consume = function(ast) {

    // reads each declared option
    var options = {};
    ast[1].forEach(function(item) {
        options[item[0]] = item[1];
    });
    this.options = options;
    
    // Iterator over each namespace item
    if (ast.length > 2 && Array.isArray(ast[2]) && ast[2].length > 0) {
        ast[2].forEach(this.consumeChild.bind(this));
    }
};

module.exports = declare;