/*!
 * Copyright (C) 2016 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */

var block = require('./block');
var _const = require('./constant');

/**
 * **Extends from [block](BLOCK.md)**
 * 
 * The namespace is an organisational unit that stores
 * inner nodes and use the namespace prefix to avoid
 * names colision.
 * 
 * @constructor {namespace}
 * 
 * @property {String} name The namespace full name
 * @property {use[]} uses {@link USE.md|:link:} List of imported (or used namespaces)
 * @property {constant[]} constants {@link CONSTANT.md|:link:} List of constants
 */
var namespace = block.extends('namespace');


/**
 * @protected Consumes the current ast node
 */
namespace.prototype.consume = function(ast) {

    var self = this;
    this.name = ast[1].join('/');

    this.uses = [];
    this.constants = [];

    /**
     * Iterator over each namespace item
     */
    ast[2].forEach(function(item) {
        var type = block.getASTType(item);
        if (type === 'const') {
            self.constants = self.constants.concat(
                _const.fromAST(self, item)
            );
        } else if (type === 'use') {
            // @todo
        } else {
            self.consumeChild(item);
        }
    });
};

/**
 * Resolves a class name if it's relative, using aliases
 * or adding current namespace prefix.
 * @param {String|Array} name
 * @return {String}
 */
namespace.prototype.resolveClassName = function(name) {
    // @todo
};

module.exports = namespace;