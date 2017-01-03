/*!
 * Copyright (C) 2016 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */


var node = require('./node');
var expr = require('./expr');

/**
 * ** Extends from {@link NODE.md|:link: node} **
 *
 * Represents an external link (require or include)
 *
 * @public
 * @constructor external
 * @property {String|expr} target {@link EXPR.md|:link:} The target file to be included
 * @property {Boolean} once If true it's a include_once or require_once statement
 * @property {Boolean} strict If true then it's a require statement
 */
var _ext = node.extends('external');


/**
 * @protected Consumes the current ast node
 */
_ext.prototype.consume = function(ast) {
  this.strict = ast.require;
  this.once = ast.once;
  this.target = expr.resolve(this, ast.target);
};

/**
 * Try to resolve the target statement and retrive the file
 * @todo
 * @return {file} {@link FILE.md|:link:}
 */
_ext.prototype.getTargetFile = function() {};

module.exports = _ext;
