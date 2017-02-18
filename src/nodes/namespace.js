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
    this.name = '\\' + ast.name.name;
    Block.prototype.consume.apply(this, arguments);
};

/**
 * Retrieves a list of use nodes
 */
Namespace.prototype.getUses = function() {
    var result = [];
    var uses = this.get('uses');
    if (uses.length > 0) {
        for(var i = 0; i < uses.length; i++) {
            var item = this.graph.get(uses[i]);
            if (item) result.push(item);
        }
    }
    return result;
};

/**
 * Resolves an alias class if defines in use statements
 */
Namespace.prototype.resolveAlias = function(alias) {
    var uses = this.get('uses');
    if (uses.length > 0) {
        for(var i = 0; i < uses.length; i++) {
            var item = this.graph.get(uses[i]);
            if (item && alias in item.aliases) {
                return item.aliases[alias];
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
