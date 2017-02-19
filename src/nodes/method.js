/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var Node = require('../data/node');
var Block = require('./block');

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
var Method = Block.extends('method');

/**
 * Gets the definition object
 * @return {Class|Interface|Trait}
 */
Method.prototype.getClass = function() {
    return this.getParent();
};

/**
 * Gets the definition object
 * @return {Class|Interface|Trait}
 */
Method.prototype.getArguments = function() {
    return this._db.resolve(
        this.get('args')
    );
};

/**
 * Gets the definition object
 * @return {Class|Interface|Trait}
 */
Method.prototype.getVariables = function() {
    var items = this.getArguments();
    // @todo
    return items;
};

/**
 * @protected Consumes the current ast node
 */
Method.prototype.consume = function(file, parent, ast) {

    Node.prototype.consume.apply(this, arguments);

    this.name = ast.name;
    this.fullName = this.getParent().fullName + '::' + this.name;

    // flags
    this.isStatic = ast.isStatic;
    this.isFinal = ast.isFinal;
    this.isAbstract = ast.isAbstract;
    this.isPublic = ast.visibility === 'public';
    this.isProtected = ast.visibility === 'protected';
    this.isPrivate = ast.visibility === 'private';

    // define arguments
    this.args = [];
    for(var i = 0; i < ast.arguments.length; i++) {
        this.add(
            'args',
            this._db.create('variable', this, ast.arguments[i])
        );
    }

    if (!this.isAbstract) {
        this.consumeAST(ast.body);
    }

    // @todo extract return type
};

module.exports = Method;
