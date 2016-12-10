/*!
 * Copyright (C) 2016 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */

var node = require('./node');
var ptr = require('./ptr');
var comment = require('./comment');

/**
 * **Extends from {@link NODE.md|:link: node}**
 * 
 * Initialize a new file with the specified AST contents
 * 
 * @public 
 * @constructor block
 * @property {variable[]} variables {@link VARIABLE.md|:link:} A list of variables in current scope
 * @property {define[]} defines {@link DEFINE.md|:link:} A list of defined constants
 * @property {function[]} functions {@link FUNCTION.md|:link:} List of declared functions
 * @property {class[]} classes {@link CLASS.md|:link:} List of classes
 * @property {interface[]} interfaces {@link INTERFACE.md|:link:} List of interfaces
 * @property {trait[]} traits {@link TRAIT.md|:link:} List of defined traits
 * @property {block[]} blocks {@link BLOCK.md|:link:} List of variable scoped blocks
 */
var block = node.extends(function block(parent, ast) {
    this.variables = [];
    this.defines = [];
    this.functions = [];
    this.classes = [];
    this.interfaces = [];
    this.traits = [];
    this.blocks = [];
    node.apply(this, arguments);
});

/**
 * @protected Gets the current block
 */
block.prototype.getBlock = function() {
    return this;
};

/**
 * @protected Consumes the current ast node
 */
block.prototype.consume = function(ast) {
    this.scanForChilds(ast);
};

/**
 * @protected Scan for inner childs
 */
block.prototype.scanForChilds = function(ast) {
    if (!Array.isArray(ast)) return;
    if (ast.length === 0) return;
    for(var i = 0; i < ast.length; i++) {
        var item = ast[i];
        if (Array.isArray(item) && item.length > 0) {
            if (Array.isArray(item[0])) {
                this.scanForChilds(item);
            } else {
                this.consumeChild(item);
            }
        }
    }
};

/**
 * Generic consumer of a list of nodes
 * @abstract @protected 
 * @param {Array} ast The AST node to eat
 * @return void
 */
block.prototype.consumeChild = function(ast) {

    if (!Array.isArray(ast)) return;
    if (ast.length === 0) return;
    if (Array.isArray(ast[0])) return this.scanForChilds(ast);

    // reads the current node
    var item = block.getAST(ast);
    var type = item[0];

    // handle class definition
    if (type === 'class') {
        var cls = ptr.create('class', this, ast);
        if (this._lastDoc) {
            cls.get().doc = comment.create(cls.get(), this._lastDoc);
            this._lastDoc = null;
        }
        this.classes.push(cls);
        if (this.type !== 'namespace') {
            this.getNamespace().classes.push(cls);
        }
    }

    else if (type === 'doc') {
        this._lastDoc = item;
    }

    // consome system statements
    else if (type === 'sys') {
        var cmd = item[1];
        if (
            cmd === 'include' ||
            cmd === 'include_once' ||
            cmd === 'require' ||
            cmd === 'require_once'
        ) {
            ptr.create('external', this, ast);
        }
    }

    // consume IF nodes
    else if (type === 'if') {
        // IF BODY
        if (Array.isArray(item[2]) && item[2].length > 0) {
            this.blocks.push(
                ptr.create('block', this, item[2])
            );
        }
        // ELSE STATEMENT
        if (Array.isArray(item[3]) && item[3].length > 0) {
            this.blocks.push(
                ptr.create('block', this, item[3])
            );
        }
    }

    // try nodes
    else if (type === 'try') {
        // BODY
        this.blocks.push(
            ptr.create('block', this, item[1])
        );
        // CATCH
        item[2].forEach(function(item) {
            this.blocks.push(
                ptr.create('block', this, item.body)
            );
        }.bind(this));
        // FINALLY
        if (item[3]) {
            this.blocks.push(
                ptr.create('block', this, item[3])
            );
        }
    }
    
    // functions
    else if (type === 'function') {
        var fn = ptr.create('function', this, item);
        this.functions.push(fn);
        if (this.type !== 'namespace') {
            this.getNamespace().functions.push(fn);
        }
    }

    // variables
    else if (type === 'set') {
        if (item[1][0] === 'var') {
            this.variables.push(
                ptr.create('variable', this, ast)
            );
        }
    }

    // nested childs
    else {
        this.scanForChilds(item);
    }

    /*else if (type === 'interface') {
        this.interfaces.push(
            new node.builders['interface'](this, node)
        );
    } else if (type === 'trait') {
        this.traits.push(
            new node.builders['trait'](this, node)
        );
    }  else if (type === 'call') {
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