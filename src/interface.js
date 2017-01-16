/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
var node = require('./node');
var reference = require('./reference');


/**
 * ** Extends from {@link NODE.md|:link: node} **
 *
 * Represents an interface
 *
 * @public
 * @constructor interface
 * @property {string} name
 * @property {string} fullName
 * @property {boolean} isFinal
 * @property {reference<interface>} extends {@link CLASS.md|:link:}
 * @property {constant[]} constants {@link INTERFACE.md|:link:}
 * @property {property[]} properties {@link PROPERTY.md|:link:}
 * @property {method[]} methods {@link METHOD.md|:link:}
 */
var _interface = node.extends('interface');


/**
 * @protected Consumes the current ast node
 */
_interface.prototype.consume = function(ast) {

  // handle name
  this.name = ast.name;
  this.fullName = this.getNamespace().name + '\\' + this.name;

  // handle flags
  this.isFinal = ast.isFinal;

  // handle extends
  if (ast.extends) {
    this.extends = [];
    for(var i = 0; i < ast.extends.length; i++) {
      this.extends.push(
        reference.toInterface(this, ast.extends[i], 'extends')
      );
    }
  } else {
    this.extends = false;
  }
};

module.exports = _interface;
