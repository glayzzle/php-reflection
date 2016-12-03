/*!
 * Copyright (C) 2016 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */

var aNamespace      = require('./namespace');
var aMethod         = require('./method');
var aFunction       = require('./function');
var aClass          = require('./class');
var aInterface      = require('./interface');
var aTrait          = require('./trait');

/**
 * @constructor {scope}
 */
var scope = function(file, offset) {

    this.file = file;
    this.offset = offset;
    this.namespace = null;
    this.class = null;
    this.trait = null;
    this.interface = null;
    this.method = null;

    // scanning file scope
    for(var i = 0; i < file.scopes.length; i++)  {
        var node = file.scopes[i];
        if (node.position.hit(offset)) {
            if (node instanceof aNamespace) {
                this.namespace = node;
            } else if (node instanceof aClass) {
                this.class = node;
            } else if (node instanceof aInterface) {
                this.interface = node;
            } else if (node instanceof aTrait) {
                this.trait = node;
            } else if (node instanceof aFunction) {
                this.function = node;
            } else if (node instanceof aMethod) {
                this.method = node;
            }
        }
    }
};

/**
 * Gets variables depending on current state
 */
scope.prototype.getVariables = function() {
    if (this.method) {
        return this.method.variables;
    } else if (this.function) {
        return this.function.variables;
    } else if (this.namespace) {
        return this.namespace.variables;
    }
    return null;
};

/**
 * @exports {scope}
 */
module.exports = scope;