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
 * @constructor Constant
 * @property {String} name
 * @property {String} fullName
 * @property {expr} value {@link EXPR.md|:link:}
 */
var Constant = Node.extends('constant');


/**
 * @protected Consumes the current ast node
 */
Constant.prototype.consume = function(file, parent, ast) {

    Node.prototype.consume.apply(this, arguments);

    this.name = ast.name;

    if (this.getParent()._type === 'namespace') {
        this.fullName = this.getParent().fullName + '::' + this.name;
    } else {
        this.fullName = this.getNamespace().name + '::' + this.name;
    }
    this.indexName(this.fullName);

    if (ast.value) {
        this.value = Expr.resolve(this, ast.value);
    }
};


module.exports = Constant;
