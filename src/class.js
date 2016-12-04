/*!
 * Copyright (C) 2016 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */


var node = require('./node');

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
 * @property {reference<class>[]} extends {@link CLASS.md|:link:}
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

    // registers at the leve
    this.name = ast[1];
    this.fullName = this.getNamespace().name + '/' + this.name;

};

module.exports = _class;