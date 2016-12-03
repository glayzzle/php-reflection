/*!
 * Copyright (C) 2016 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */

var block = require('./block');

/**
 * **Extends from [block](BLOCK.md)**
 * 
 * The namespace is an organisational unit that stores
 * inner nodes and use the namespace prefix to avoid
 * names colision.
 * 
 * @constructor {namespace}
 */
var namespace = block.extends(function(parent, ast) {
    block.apply(this, [parent, ast]);
    this.name = ast[1].join('/');
    this.constants = {};
    
});

/**
 * Gets the current namespace
 */
namespace.prototype.getNamespace = function() {
    return this;
};

module.exports = namespace;