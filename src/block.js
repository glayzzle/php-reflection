/*!
 * Copyright (C) 2016 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */

var node = require('./node');

/**
 * **Extends from {@link NODE.md|:link: node}**
 * 
 * Initialize a new file with the specified AST contents
 * 
 * @public @constructor block
 * @property {variable[]} variables {@link VARIABLE.md|:link:} A list of variables in current scope
 * @property {define[]} defines {@link DEFINE.md|:link:} A list of defined constants
 * @property {function[]} functions {@link FUNCTION.md|:link:} 
 * @property {class[]} classes {@link CLASS.md|:link:} 
 * @property {interface[]} interfaces {@link INTERFACE.md|:link:} 
 * @property {trait[]} traits {@link TRAIT.md|:link:} 
 * @property {use[]} uses {@link USE.md|:link:} 
 */
var block = node.extends(function block(parent, ast) {
    node.apply(this, arguments);
    this.variables = [];
    this.defines = [];
    this.functions = [];
    this.classes = [];
    this.interfaces = [];
    this.traits = [];
    this.uses = [];
});

/**
 * @protected Gets the current block
 */
block.prototype.getBlock = function() {
    return this;
};


/**
 * Generic consumer of a list of nodes
 * @abstract @protected 
 * @param {Array} node The AST node to eat
 * @return void
 */
block.prototype.consumeChild = function(node) {};

/**
 * Static helper that resolves the AST type of the specified node.
 * 
 * This function will strip position node, or comment node to read
 * directly the AST node
 *
 * @public
 * @param {Array} node
 * @return {String}
 * 
 * @example
 * var block = require('./block');
 * var type = block.getASTType([
 *   'position', [..start..], [..end..], [
 *     'innerNode'
 *   ]
 * ]); // type = 'innerNode'
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

module.exports = block;