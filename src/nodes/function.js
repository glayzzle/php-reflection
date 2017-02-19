/*!
 * Copyright (C) 2016 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */

var Node = require('../data/node');
var Block = require('./block');

/**
 * **Extends from [block](BLOCK.md)**
 *
 * The namespace is an organisational unit that stores
 * inner nodes and use the namespace prefix to avoid
 * names colision.
 *
 * @constructor Function
 *
 * @property {String} name The function name
 * @property {String} fullName
 * @property {Boolean} isClosure
 * @property {variable[]} args List of arguments
 * @property {variable[]} uses List of used variables
 */
var Func = Block.extends('function');

/**
 * Gets the list of function arguments
 */
Func.prototype.getArguments = function() {
    return this._db.resolve(
        this.get('args')
    );
};

/**
 * Gets the list of function variables
 */
Func.prototype.getVariables = function() {
    var items = this.getArguments();
    /** @todo */
    return items;
};


/**
 * @protected Consumes the current ast node
 */
Func.prototype.consume = function(file, parent, ast) {
    Node.prototype.consume.apply(this, [file, parent, ast]);
    this.isClosure = ast.kind === 'closure';

    if (this.isClosure) {
        this.fullName = this.name = '#closure';
        for(var i = 0; i < ast.uses.length; i++) {
            // @fixme : should refer to an existing variable (if any)
            this.add(
                'uses',
                this._db.create('variable', this, ast.arguments[i])
            );
        }
    } else {
        this.name = ast.name;
        this.fullName = this.getNamespace().name + '\\' + this.name;
        this.indexName(this.fullName);
    }

    // define arguments
    for(var i = 0; i < ast.arguments.length; i++) {
        this.add(
            'args',
            this._db.create('variable', this, ast.arguments[i])
        );
    }

    // parse inner body
    if (ast.body && ast.body.children) {
        this.scanForChilds(ast.body.children);
    }
};

module.exports = Func;
