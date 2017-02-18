/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var Node = require('../data/node');

/**
 * **Extends from {@link NODE.md|:link: node}**
 *
 * Reprensents a variable declaration
 *
 * @public
 * @constructor UseGroup
 * @property {String} name
 * @property {String|Class|Null} type
 */
var UseGroup = Node.extends('usegroup');

/**
 * @protected Consumes the current ast node
 */
UseGroup.prototype.consume = function(file, parent, ast) {
    this.aliases = {};
    var prefix = ast.name ? ast.name.name : '';
    for(var i = 0; i < ast.items.length; i++) {
        var alias = ast.items[i].alias;
        var name = ast.items[i].name.name;
        if (name[0] !== '\\') name = '\\' + name;
        if (!alias) {
            alias = name.split('\\');
            alias = alias[alias.length - 1];
        }
        this.aliases[alias] = prefix + name;
    }
    Node.prototype.consume(this, arguments);
};

module.exports = UseGroup;
