/*!
 * Copyright (C) 2016 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */


var node = require('./node');
var expr = require('./expr');
var ptr = require('./ptr');

/**
 * ** Extends from {@link NODE.md|:link: node} **
 * 
 * Represents a constant declaration
 * 
 * @public @constructor constant
 * @property {String} name 
 * @property {String} fullName
 * @property {expr} value {@link EXPR.md|:link:}
 */
var _const = node.extends('constant');


/**
 * @protected Consumes the current ast node
 */
_const.prototype.consume = function(ast) {
    this.name = ast[0];

    if (this.parent.type === 'class') {
        this.fullName = this.parent.fullName + '::' + this.name;
    } else if (this.parent.type === 'namespace') {
        this.fullName = this.parent.name + '::' + this.name;
    } else {
        this.fullName = this.name;
    }

    if (ast.length === 2) {
        this.value = expr.resolve(this, ast[1]);
    }
};

/**
 * Creates an array of constants
 * @return {constant[]}
 */
_const.fromAST = function(parent, ast) {
    var result = [];
    if (ast[0] === 'const' && ast.length === 2) {
        ast[1].forEach(function(item) {
            result.push(
                ptr.create('constant', parent, item)
            );
        });
    }
    return result;
};

module.exports = _const;