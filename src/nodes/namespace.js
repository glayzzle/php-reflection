/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var Block = require('./block');

/**
 * **Extends from [block](BLOCK.md)**
 *
 * The namespace is an organisational unit that stores
 * inner nodes and use the namespace prefix to avoid
 * names colision.
 *
 * @constructor {Namespace}
 *
 * @property {String} name The namespace full name
 */
var Namespace = Block.extends('namespace');

/**
 * @protected Consumes the current ast node
 */
Namespace.prototype.consume = function(file, parent, ast) {
    var name = ast.name;

    if (typeof name !== 'string') {
      if (name.kind === 'identifier') {
        name = name.name;
      } else {
        name = '';
      }
    }

    this.name = '\\' + name;
    Block.prototype.consume.apply(this, arguments);
    this.indexName(this.name);
};

/**
 * Converts a namespace relative object name to a fully qualified name
 * @return {String}
 */
Namespace.prototype.getFQN = function(name) {
    if (name.name) name = name.name;
    if (name[0] === '\\') {
      return name;
    }
    let fromAlias = this.resolveAlias(name);
    if (fromAlias) {
      return fromAlias;
    }
    if (this.name === '\\') {
        return '\\' + name;
    }
    return this.name + '\\' + name;
};


/**
 * Retrieves a list of classes
 */
Namespace.prototype.getClasses = function() {
  return this._db.resolve(this.get('classes'));
};  

/**
 * Retrieves a list of interfaces
 */
Namespace.prototype.getInterfaces = function() {
  return this._db.resolve(this.get('interfaces'));
};

/**
 * Retrieves a list of interfaces
 */
Namespace.prototype.getTraits = function() {
  return this._db.resolve(this.get('traits'));
};


Namespace.prototype.getFunctions = function() {
  return this._db.resolve(this.get('functions'));
};

Namespace.prototype.getUses = function() {
  return this._db.resolve(this.get('uses'));
};

Namespace.prototype.getConstants = function() {
  return this._db.resolve(this.get('constants'));
};

Namespace.prototype.getDefines = function() {
  return this._db.resolve(this.get('defines'));
};


/**
 * Retrieves a list of use nodes
 */
Namespace.prototype.getUses = function() {
  return this._db.resolve(this.get('uses'));
};

/**
 * Resolves an alias class if defined in use statements
 */
Namespace.prototype.resolveAlias = function(alias) {
    var uses = this.getUses();
    for(var i = 0; i < uses.length; i++) {
        var item = uses[i];
        if (item && alias in item.aliases) {
            return item.aliases[alias];
        }
    }
    return null;
};

/**
 * Resolves an alias class if defines in use statements
 */
Namespace.prototype.findAlias = function(className) {
  var uses = this.getUses();
  for(var i = 0; i < uses.length; i++) {
      var item = uses[i];
      for(var name in item.aliases) {
        if (item.aliases[name] === className) {
          return name;
        }
      }
  }
  return null;
};

/**
 * Resolves a class name if it's relative, using aliases
 * or adding current namespace prefix.
 * @param {String|Array} name
 * @return {String}
 */
Namespace.prototype.resolveClassName = function(name) {
    if (name.kind && name.kind === 'identifier') {
        if (name.resolution === 'fqn') {
            return name.name;
        } else if (name.resolution === 'rn') {
            return this.name + '\\' + name.name;
        } else {
            // @todo : resolve self, static keywords
            // resolve with use statements
            var alias = this.resolveAlias(name.name);
            if (alias) {
                return alias;
            }
            // relative to current namespace
            return this.name + '\\' + name.name;
        }
    }
};

module.exports = Namespace;
