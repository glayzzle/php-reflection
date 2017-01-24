/*!
 * Copyright (C) 2016 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */

var block = require('./block');
var ptr = require('./ptr');

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
var fn = block.extends('function');

/**
 * @protected Consumes the current ast node
 */
fn.prototype.consume = function(ast) {
  this.isClosure = ast.kind === 'closure';
  this.uses = [];
  if (this.isClosure) {
    this.fullName = this.name = '#closure';
    for(var i = 0; i < ast.uses.length; i++) {
      // @fixme : should refer to an existing variable (if any)
      this.uses.push(
        ptr.create('variable', this, ast.uses[i])
      );
    }
  } else {
    this.name = ast.name;
    this.fullName = this.getNamespace().name + '\\' + this.name;
  }
  // define arguments
  this.args = [];
  for(var i = 0; i < ast.arguments.length; i++) {
    this.args.push(
      ptr.create('variable', this, ast.arguments[i])
    );
  }
  // parse inner body
  if (ast.body && ast.body.children) {
    this.scanForChilds(ast.body.children);
  }
};

module.exports = fn;
