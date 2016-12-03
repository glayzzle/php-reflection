/*!
 * Copyright (C) 2016 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */

var node = require('./node');
var util = require('util');

/**
 * Initialize a new file with the specified AST contents
 * @constructor {block}
 */
var block = function(parent, ast) {
    node.apply(this, arguments);
    this.variables = {};
    this.defines = {};
    this.functions = {};
    this.classes = {};
    this.interfaces = {};
    this.traits = {};
};
util.inherits(block, node);

/**
 * Gets the current namespace
 */
block.prototype.getNamespace = function() {
    if (this.parent) {
        return this.parent.getNamespace();
    } else {
        return null;
    }
};

/**
 * Inheritance helper
 * @return {function}
 * @example
 * var block = require('./block');
 * var child = block.extends(function(parent, ast) {
 *   block.apply(this, [parent, ast]);
 * });
 * child.prototype.foo = function() ...
 */
block.extends = function(ctor) {
    if (!ctor) {
        ctor = function(parent, ast) {
            block.apply(this, arguments);
        };
    }
    util.inherits(ctor, block);
    return ctor;
};


/**
 * Resolves the AST type of the specified node
 * @param {array} node
 * @return {string}
 */
block.getASTType = function(ast) {
    var type = null;
    if (ast) {
        if (typeof ast[0] === 'string') {
            if (ast[0] === 'position') {
                ast = ast[3];
            }
            if (ast[0] === 'doc' && ast.length === 3) {
                ast = ast[2];
                if (ast[0] === 'position') {
                    ast = ast[3];
                }
            }
            type = ast[0];
        } else {
            type = 'body';
        }
    }
    return type;
};

/**
 * @exports {block}
 */
module.exports = block;