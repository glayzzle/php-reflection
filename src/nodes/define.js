/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var Node = require('../data/node');
var Expr = require('./expr');

/**
 * ** Extends from {@link NODE.md|:link: node} **
 *
 * Represents a constant declaration
 *
 * @public
 * @constructor Define
 * @property {String|expr} name
 * @property {expr} value {@link EXPR.md|:link:}
 * @property {Boolean|expr} caseInsensitive
 */
var Define = Node.extends('define');

/**
 * Gets the define var name
 */
Define.prototype.getName = function() {
    return this.name;
};

/**
 * Gets the define value
 */
Define.prototype.getValue = function() {
    return this.value;
};

/**
 * @protected Consumes the current ast node
 */
Define.prototype.consume = function(file, parent, ast) {
    Node.prototype.consume.apply(this, arguments);
    this.name = Expr.resolve(this, ast.arguments[0]);
    this.indexName(this.name);
    if (ast.arguments.length > 1) {
        this.value = Expr.resolve(this, ast.arguments[1]);
    }
    if (ast.arguments.length > 2) {
        this.caseInsensitive = expr.resolve(this, ast.arguments[2]);
    } else {
        this.caseInsensitive = false;
    }
};

module.exports = Define;
