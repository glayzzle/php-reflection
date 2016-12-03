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
block.prototype.consumeChild = function(node) {
    var ast = block.getAST(node);
    var type = ast[0];
/*
    if (type === 'class') {
        this.classes.push(
            new node.builders['class'](this, node)
        );
    } else if (type === 'interface') {
        this.interfaces.push(
            new node.builders['interface'](this, node)
        );
    } else if (type === 'trait') {
        this.traits.push(
            new node.builders['trait'](this, node)
        );
    } else if (type === 'function') {
        this.functions.push(
            new node.builders['function'](this, node)
        );
    } else if (type === 'call') {
        if (
            ast[1][0] === 'ns' && 
            ast[1][1].length === 1 && 
            ast[1][1][0] === 'define'
        ) {
            this.defines.push(
                new node.builders['define'](this, node)
            );
        }
    }
    // @todo use, var */
};

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
    return block.getAST(ast)[0];
};

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
 * var ast = block.getAST([
 *   'position', [..start..], [..end..], [
 *     'innerNode'
 *   ]
 * ]); // ast = ['innerNode'...]
 */
block.getAST = function(ast) {
    var result = ast;
    if (result) {
        if (typeof result[0] === 'string') {
            if (result[0] === 'position') {
                result = result[3];
            }
            if (result[0] === 'doc' && result.length === 3) {
                result = result[2];
                if (result[0] === 'position') {
                    result = result[3];
                }
            }
        }
    }
    return result;
};

module.exports = block;