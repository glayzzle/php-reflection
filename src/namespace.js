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
 */
var namespace = block.extends('namespace');


/**
 * @protected Consumes the current ast node
 */
namespace.prototype.consume = function(ast) {

    var self = this;
    this.name = ast[1].join('/');
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
        } else {
            self.consumeChild(item);
        }
    });
};


module.exports = namespace;