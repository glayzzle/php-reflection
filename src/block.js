/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

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
  if (Array.isArray(ast)) {
    for (var i = 0; i < ast.length; i++) {
      this.consumeChild(ast[i]);
    }
  } else if (ast && ast.kind) {
    this.consumeChild(ast);
  }
};

/**
 * Generic consumer of a list of nodes
 * @abstract @protected
 * @param {Array} ast The AST node to eat
 * @return void
 */
block.prototype.consumeChild = function(ast) {
  if (!ast || !ast.kind) return;

  // handle class definition
  if (ast.kind === 'doc') {
    this._lastDoc = item;
  } else {

    // attach last doc node to current node
    if (this._lastDoc) {
      ast.doc = this._lastDoc;
      this._lastDoc = null;
    }

    // scan a class
    if (ast.kind === 'class') {
      var cls = ptr.create('class', this, ast);
      this.classes.push(cls);
      if (this.type !== 'namespace') {
        this.getNamespace().classes.push(cls);
      }
    }

    // consome interface
    else if (ast.kind === 'interface') {
      var int = ptr.create('interface', this, ast);
      this.interfaces.push(int);
      if (this.type !== 'namespace') {
        this.getNamespace().interfaces.push(cls);
      }
    }

    // consome trait
    else if (ast.kind === 'trait') {
      var trait = ptr.create('trait', this, ast);
      this.traits.push(trait);
      if (this.type !== 'namespace') {
        this.getNamespace().traits.push(trait);
      }
    }

    // consome a namespace (from inner statements like declare)
    else if (ast.kind === 'namespace') {
      node.create('namespace', this.getFile(), ast);
    }

    // consome include statements
    else if (ast.kind === 'include') {
      ptr.create('external', this, ast);
    }

    // consume IF nodes
    else if (ast.kind === 'if') {
      // IF BODY
      if (ast.body) {
        this.blocks.push(
          ptr.create('block', this, ast.body)
        );
      }
      // ELSE STATEMENT
      if (ast.alternate) {
        this.blocks.push(
          ptr.create('block', this, ast.alternate)
        );
      }
    }

    // try nodes
    else if (ast.kind === 'try') {

      // BODY
      this.blocks.push(
        ptr.create('block', this, ast.body)
      );

      // CATCH
      if (Array.isArray(ast.catches)) {
        ast.catches.forEach(function(item) {
          this.blocks.push(
            ptr.create('block', this, item.body)
          );
        }.bind(this));
      }

      // FINALLY
      if (ast.allways) {
        this.blocks.push(
          ptr.create('block', this, ast.allways)
        );
      }
    }

    // functions
    else if (ast.kind === 'function') {
      var fn = ptr.create('function', this, ast);
      this.functions.push(fn);
      if (this.type !== 'namespace') {
        this.getNamespace().functions.push(fn);
      }
    }

    // variables (by assignment)
    else if (ast.kind === 'assign' && ast.left.kind === 'variable') {
      this.variables.push(
        ptr.create('variable', this, ast)
      );
    }

    // extract defines
    else if (ast.kind === 'call' && ast.what.name === 'define') {
      this.defines.push(
        ptr.create('define', this, ast)
      );
    }

    // namespace constants
    else if (ast.kind === 'constant') {
      this.getNamespace().constants.push(
        ptr.create('constant', this, ast)
      );
    }

    // namespace use statements
    else if (ast.kind === 'usegroup') {
      var prefix = ast.name ? ast.name.name : '';
      for(var i = 0; i < ast.items.length; i++) {
        var alias = ast.items[i].alias;
        var name = ast.items[i].name.name;
        if (name[0] !== '\\') name = '\\' + name;
        if (!alias) {
          alias = name.split('\\');
          alias = alias[alias.length - 1];
        }
        this.getNamespace().uses[alias] = prefix + name;
      }
    }

    // @todo : variables by global statement
    // @todo : variables by static statement

    // nested childs
    else {
      // generic recusive scanner
      for(var k in ast) {
        var item = ast[k];
        if (Array.isArray(item)) {
          this.scanForChilds(item);
        } else if (item && item.kind) {
          this.consumeChild(item);
        }
      }
    }
  }

  /* @todo var */
};

module.exports = block;
