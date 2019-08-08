/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var Node = require('../data/node');
var comment = require('../utils/comment');

/**
 * **Extends from {@link NODE.md|:link: node}**
 *
 * Initialize a new file with the specified AST contents
 *
 * @public
 * @constructor Block
 * @property {variable[]} variables {@link VARIABLE.md|:link:} A list of variables in current scope
 * @property {define[]} defines {@link DEFINE.md|:link:} A list of defined constants
 * @property {function[]} functions {@link FUNCTION.md|:link:} List of declared functions
 * @property {class[]} classes {@link CLASS.md|:link:} List of classes
 * @property {interface[]} interfaces {@link INTERFACE.md|:link:} List of interfaces
 * @property {trait[]} traits {@link TRAIT.md|:link:} List of defined traits
 * @property {block[]} blocks {@link BLOCK.md|:link:} List of variable scoped blocks
 */
var Block = Node.extends('block');

/**
 * @protected Consumes the current ast node
 */
Block.prototype.consume = function(file, parent, ast) {
    Node.prototype.consume.apply(this, [file, parent, ast]);
    this.consumeAST(ast);
};

/**
 * @protected Scan for inner childs
 */
Block.prototype.consumeAST = function(ast) {
    // generic recusive scanner
    for(var k in ast) {
        var item = ast[k];
        if (Array.isArray(item)) {
            this.scanForChilds(item);
        } else if (item && item.kind) {
            this.consumeChild(item);
        }
    }
};

/**
 * @protected Scan for inner childs
 */
Block.prototype.scanForChilds = function(ast) {
    if (Array.isArray(ast)) {
        for (var i = 0; i < ast.length; i++) {
            this.consumeChild(ast[i]);
        }
    } else if (ast && ast.kind) {
        this.consumeChild(ast);
    }
};


Block.prototype.getVariables = function() {
  return this._db.resolve(this.get('variables'));
};



/**
 * Generic consumer of a list of nodes
 * @abstract @protected
 * @param {Array} ast The AST node to eat
 * @return void
 */
Block.prototype.consumeChild = function(ast) {
    if (!ast || !ast.kind) return;

    // handle class definition
    if (ast.kind === 'doc') {
        this._lastDoc = ast;
    } else {

        // attach last doc node to current node
        if (this._lastDoc) {
            ast.doc = this._lastDoc;
            this._lastDoc = null;
        }

        // scan a class
        if (ast.kind === 'class') {
            var cls = this._db.create('class', this, ast);
            this.add('classes', cls);
            if (this._type !== 'namespace') {
                this.getNamespace().add('classes', cls);
            }
        }

        // consome interface
        else if (ast.kind === 'interface') {
            var int = this._db.create('interface', this, ast);
            this.add('interfaces', int);
            if (this._type !== 'namespace') {
                this.getNamespace().add('interfaces', int);
            }
        }

        // consome trait
        else if (ast.kind === 'trait') {
            var trait = this._db.create('trait', this, ast);
            this.add('traits', trait);
            if (this._type !== 'namespace') {
                this.getNamespace().add('traits', trait);
            }
        }

        // consome a namespace (from inner statements like declare)
        else if (ast.kind === 'namespace') {
            this.getFile().add(
                'namespaces', 
                this._db.create('namespace', this.getFile(), ast)
            );
        }

        // consome include statements
        else if (ast.kind === 'include') {
            this.getFile().add(
                'externals', 
                this._db.create('external', this, ast)
            );
        }

        // consume IF nodes
        else if (ast.kind === 'if') {
            if (this.getRepository().options.scanExpr) {
                // IF BODY
                if (ast.body) {
                    this._db.create('block', this, ast.body);
                }
                // ELSE STATEMENT
                if (ast.alternate) {
                    this._db.create('block', this, ast.body);
                }
            } else {
                // inner scan only (ignore blocks)
                if (ast.body) this.scanForChilds(ast.body);
                if (ast.alternate) this.scanForChilds(ast.alternate);
            }
        }

        // try nodes
        else if (ast.kind === 'try') {

            if (this.getRepository().options.scanExpr) {
                // BODY
                this._db.create('block', this, ast.body);
                // CATCH
                if (Array.isArray(ast.catches)) {
                    ast.catches.forEach(function(item) {
                        this._db.create('block', this, item.body);
                    }.bind(this));
                }
                // FINALLY
                if (ast.allways) {
                    this._db.create('block', this, ast.allways);
                }
            } else {
                // inner scan only (ignore blocks)
                this.scanForChilds(ast.body);
                if (Array.isArray(ast.catches)) this.scanForChilds(ast.catches);
                if (ast.allways) this.scanForChilds(ast.allways);
            }
        }

        // functions
        else if (ast.kind === 'function') {
            var fn = this._db.create('function', this, ast);
            this.add('functions', fn);
            if (this._type !== 'namespace') {
                this.getNamespace().add('functions', fn);
            }
        }

        // variables (by assignment)
        else if (
            ast.kind === 'assign' &&
            ast.left.kind === 'variable' &&
            this.getRepository().options.scanVars
        ) {
            this.add(
                'variables',
                this._db.create('variable', this, ast)
            );
        }

        // extract defines
        else if (ast.kind === 'call' && ast.what.name === 'define') {
            this.add(
                'defines',
                this._db.create('define', this, ast)
            );
        }

        // namespace constants
        else if (ast.kind === 'constant') {
            this.getNamespace().add(
                'constants',
                this._db.create('constant', this, ast)
            );
        }

        // namespace use statements
        else if (ast.kind === 'usegroup') {
            this.getNamespace().add(
                'uses',
                this._db.create('usegroup', this, ast)
            );
        }

        // @todo : variables by global statement
        // @todo : variables by static statement

        // nested childs
        else {
            this.consumeAST(ast);
        }
    }

  /* @todo var */
};

module.exports = Block;
