/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var node = require('./node');
var reference = require('./reference');

/**
 * ** Extends from {@link NODE.md|:link: node} **
 *
 * Represents a trait
 *
 * @public
 * @constructor Trait
 * @property {string} name
 * @property {string} fullName
 * @property {reference<trait>} extends {@link CLASS.md|:link:}
 * @property {constant[]} constants {@link PROPERTY.md|:link:}
 * @property {property[]} properties {@link PROPERTY.md|:link:}
 * @property {method[]} methods {@link METHOD.md|:link:}
 */
var trait = node.extends('trait');

/**
 * @protected Consumes the current ast node
 */
trait.prototype.consume = function(ast) {

  // handle name
  this.name = ast.name;
  this.fullName = this.getNamespace().name + '\\' + this.name;

  // handle extends
  if (ast.extends) {
    this.extends = reference.toTrait(this, ast.extends, 'extends');
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

  var lastDoc = null;
  for(var i = 0; i < ast.body.length; i++) {
    var item = ast.body[i];
    if (item.kind === 'doc') {
      lastDoc = item;
    } else {
      item.doc = lastDoc;
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
      lastDoc = null;
    }
  }
};

module.exports = trait;
