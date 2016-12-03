/*!
 * Copyright (C) 2016 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */

var block = require('./block');

/**
 * **Extends from [block](BLOCK.md)**
 * 
 * Defines a generic AST expression
 * 
 * @constructor expr
 * @property {Array} ast List of AST nodes (as plain arrays)
 */
var expr = block.extends('expr');


/**
 * @protected Consumes the current ast node
 */
expr.prototype.consume = function(ast) {
    this.ast = ast;
};

/**
 * Converts back AST nodes to PHP code
 * @return {String}
 * @todo
 */
expr.prototype.toPHP = function() {
    return null;
};


module.exports = expr;