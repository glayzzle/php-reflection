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
 * 
 * @property {String} name The namespace full name
 * @property {constant[]} constants An array of constants
 */
var namespace = block.extends();


/**
 * @protected Consumes the current ast node
 */
namespace.prototype.consume = function(ast) {

    this.getFile().namespaces.push(this);
    this.name = ast[1].join('/');
    this.constants = {};

    ast[2].forEach(function(item) {
        
    });
};



/**
 * @protected Gets the current namespace
 */
namespace.prototype.getNamespace = function() {
    return this;
};

module.exports = namespace;