/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var Node = require('../data/node');
var Expr = require('./expr');

/**
 * **Extends from {@link NODE.md|:link: node}**
 *
 * Reprensents a class property declaration
 *
 * @public
 * @constructor Property
 * @property {String} name
 * @property {String} fullName
 * @property {Boolean} isStatic
 * @property {Boolean} isPrivate
 * @property {Boolean} isProtected
 * @property {Boolean} isPublic
 * @property {expr} value {@link EXPR.md|:link:}
 */
var Property = Node.extends('property');

/**
 * @protected Consumes the current ast node
 */
Property.prototype.consume = function(file, parent, ast) {
    Node.prototype.consume.apply(this, arguments);
    this.name = ast.name;
    this.fullName = this.getParent().fullName + '::' + this.name;

    this.isStatic = ast.isStatic;
    this.isPrivate = ast.visibility === 'private';
    this.isPublic = ast.visibility === 'public';
    this.isProtected = ast.visibility === 'protected';

    if (ast.value) {
        this.value = Expr.resolve(this, ast.value);
    }

    // @todo extract type
};

module.exports = Property;
