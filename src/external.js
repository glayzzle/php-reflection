/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var node = require('./node');
var expr = require('./expr');

/**
 * ** Extends from {@link NODE.md|:link: node} **
 *
 * Represents an external link (require or include)
 *
 * @public
 * @constructor External
 * @property {String|expr} target {@link EXPR.md|:link:} The target file to be included
 * @property {Boolean} once If true it's a include_once or require_once statement
 * @property {Boolean} strict If true then it's a require statement
 */
var External = node.extends('external');


/**
 * @protected Consumes the current ast node
 */
External.prototype.consume = function(ast) {
  this.strict = ast.require;
  this.once = ast.once;
  this.target = expr.resolve(this, ast.target);
};

/**
 * Try to resolve the target statement and retrive the file
 * @return {File|Promise} {@link FILE.md|:link:}
 */
External.prototype.getTargetFile = function() {
  if (typeof this.target === 'string') {
    if (!this._file) {
      this._file = this.getRepository().get(this.target);
      if (!this._file) {
        return this.getRepository().parse(
          this.target
        ).then(function(file) {
          this._file = file;
        }.bind(this));
      }
    }
    return this._file;
  }
  return null;
};

module.exports = External;
