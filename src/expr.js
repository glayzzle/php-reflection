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
 * @public @constructor expr
 * @property {Array} ast List of AST nodes (as plain arrays)
 */
var expr = block.extends('expr');


/**
 * @protected Consumes the current ast node
 */
expr.prototype.consume = function(ast) {
    this.ast = ast;
    this.scanForChilds(ast);
};


/**
 * Converts back AST nodes to PHP code
 * @return {String}
 * @todo
 */
expr.prototype.toPHP = function() {
    return null;
};

/**
 * @return {expr|Boolean|String|Number}
 */
expr.resolve = function(parent, ast) {
    var item = block.getAST(ast);
    if (item[0] === 'string') {
        return item[1];
    } else if (item[0] === 'constant') {
        var cVal = item[1].toLowerCase();
        if (cVal === 'true') {
            return true;
        } else if (cVal === 'false') {
            return false;
        } else {
            return new expr(parent, ast);
        }
    } else if (item[0] === 'number') {
        return item[1];
    } else {
        return new expr(parent, ast);
    }
};

module.exports = expr;