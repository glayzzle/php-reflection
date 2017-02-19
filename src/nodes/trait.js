/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var Node = require('../data/node');
var Class = require('./class');

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
var Trait = Node.extends('trait');


/**
 * Force relations to refresh
 */
Trait.prototype.refreshRelations = function() {
    // @todo
};

/**
 * @protected Consumes the current ast node
 */
Trait.prototype.consume = function(file, parent, ast) {
    Node.prototype.consume.apply(this, arguments);

    // handle name
    this.name = ast.name;
    this.fullName = this.getNamespace().name + '\\' + this.name;
    this.indexName(this.fullName);

    // reads inner contents
    if (ast.body) {
        Class.prototype.consumeClassBody.apply(this, [ast.body]);
    }
};

module.exports = Trait;
