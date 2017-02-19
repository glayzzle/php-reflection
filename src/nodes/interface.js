/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var Node = require('../data/node');
var Block = require('./block');

/**
 * ** Extends from {@link NODE.md|:link: node} **
 *
 * Represents an interface
 *
 * @public
 * @constructor Interface
 * @property {string} name
 * @property {string} fullName
 * @property {boolean} isFinal
 * @property {reference<interface>} extends {@link CLASS.md|:link:}
 * @property {constant[]} constants {@link INTERFACE.md|:link:}
 * @property {property[]} properties {@link PROPERTY.md|:link:}
 * @property {method[]} methods {@link METHOD.md|:link:}
 */
var Interface = Block.extends('interface');


/**
 * Gets the extended class
 */
Interface.prototype.getExtends = function() {
    if (this.extends) {
        return this._db.resolve(
            this.get('extends')
        );
    }
    return null;
};

/**
 * Gets the list of methods
 */
Interface.prototype.getMethods = function(includeParents) {
    // @todo
    return null;
};

/**
 * Force relations to refresh
 */
Interface.prototype.refreshRelations = function() {
    if (this.extends) {
        this.remove('extends');
        for(var i = 0; i < this.extends.length; i++) {
            var results = this._db.search({
                interface: this.extends[i]
            });
            if (results.length > 0) {
                var item = this._db.get(items[i]);
                if (item) {
                    this.add('extends', item);
                }
            }
        }
    }
};

/**
 * @protected Consumes the current ast node
 */
Interface.prototype.consume = function(file, parent, ast) {

    Node.prototype.consume.apply(this, arguments);

    // handle name
    this.name = ast.name;
    this.fullName = this.getNamespace().name + '\\' + this.name;

    this.indexName(this.name);

    // handle extends
    if (ast.extends) {
        this.extends = [];
        for(var i = 0; i < ast.extends.length; i++) {
            this.extends.push(
                this.getNamespace().resolveClassName(
                    ast.extends[i]
                )
            );
        }
    } else {
        this.extends = false;
    }

    if (ast.body) {
        this.consumeAST.apply(ast.body);
    }
};

module.exports = Interface;
