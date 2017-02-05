/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var block = require('./block');
var ptr = require('../data/ptr');

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
var Method = block.extends('method');

/**
 * @protected Consumes the current ast node
 */
Method.prototype.consume = function(ast) {
  this.name = ast.name;
  this.fullName = this.parent.fullName + '::' + this.name;
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
    this.args.push(
      ptr.create('variable', this, ast.arguments[i])
    );
  }
  // parse inner body
  if (ast.body && ast.body.children) {
    this.scanForChilds(ast.body.children);
  }
};

module.exports = Method;
