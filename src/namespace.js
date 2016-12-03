/*!
 * Copyright (C) 2016 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */

var block = require('./block');

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