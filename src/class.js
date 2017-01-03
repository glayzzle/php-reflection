/*!
 * Copyright (C) 2016 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
var node = require('./node');
var reference = require('./reference');

/**
 * ** Extends from {@link NODE.md|:link: node} **
 *
 * Represents a class
 *
 * @public
 * @constructor class
 * @property {string} name
 * @property {string} fullName
 * @property {boolean} isAbstract
 * @property {boolean} isFinal
 * @property {reference<class>} extends {@link CLASS.md|:link:}
 * @property {interface[]} implements {@link INTERFACE.md|:link:}
 * @property {property[]} properties {@link PROPERTY.md|:link:}
 * @property {method[]} methods {@link METHOD.md|:link:}
 * @property {trait[]} traits {@link TRAIT.md|:link:}
 */
var _class = node.extends('class');

/**
 * @protected Consumes the current ast node
 */
_class.prototype.consume = function(ast) {

  // handle name
  this.name = ast.name;
  this.fullName = this.getNamespace().name + '\\' + this.name;

  // handle flags
  this.isAbstract = ast.isAbstract;
  this.isFinal = ast.isFinal;

  // handle extends
  if (ast.extends) {
    this.extends = reference.toClass(this, ast.extends, 'extends');
  } else {
    this.extends = false;
  }

  // handle implements
  this.implements = [];
  if (ast.implements && ast.implements.length > 0) {
    for (var i = 0; i < ast.implements.length; i++) {
      this.implements.push(
        reference.toInterface(this, ast.implements[i], 'implements')
      );
    }
  }

  // the class definition
  this.constants = [];
  this.properties = [];
  this.methods = [];
  this.traits = [];

  var lastDoc = null;
  for(var i = 0; i < ast.body.length; i++) {
    var item = ast.body[i];
    if (item.kind === 'doc') {
      lastDoc = item;
    } else {
      item.doc = lastDoc;
      lastDoc = null;
      if (item.kind === 'classconstant') {
        this.constants.push(
          node.create('constant', this, item)
        );
      } else if (item.kind === 'property') {
        this.properties.push(
          node.create('property', this, item)
        );
      } else if (item.kind === 'method') {
        this.methods.push(
          node.create('method', this, item)
        );
      }
    }
  }
};

module.exports = _class;
