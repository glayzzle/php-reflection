/*!
 * Copyright (C) 2016 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */

/**
 * This class contains the state at a specified offset into a file
 * @public @constructor scope
 * @property {file} file {@link FILE.md|:link:} 
 * @property {Integer} offset
 * @property {namespace} namespace {@link NAMESPACE.md|:link:} 
 * @property {class|null} class {@link CLASS.md|:link:} 
 * @property {trait|null} trait {@link TRAIT.md|:link:} 
 * @property {interface|null} trait {@link INTERFACE.md|:link:} 
 * @property {method|null} method {@link METHOD.md|:link:} 
 * @property {function|null} function {@link FUNCTION.md|:link:} 
 */
var scope = function(file, offset) {

    this.file = file;
    this.offset = offset;
    this.namespace = null;
    this.class = null;
    this.trait = null;
    this.interface = null;
    this.method = null;
    this.function = null;

    // scanning file scope
    for(var i = 0; i < file._scopes.length; i++)  {
        var node = file._scopes[i];
        if (node.position.hit(offset)) {
            if (node.type === 'namespace') {
                this.namespace = node;
            } else if (node.type === 'class') {
                this.class = node;
            } else if (node.type === 'interface') {
                this.interface = node;
            } else if (node.type === 'trait') {
                this.trait = node;
            } else if (node.type === 'function') {
                this.function = node;
            } else if (node.type === 'method') {
                this.method = node;
            }
        }
    }
};

/**
 * Gets variables depending on current state
 * @return {variable[]|null} {@link VARIABLE.md|:link:} 
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

module.exports = scope;