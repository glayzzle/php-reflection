/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

/**
 * This class contains the state at a specified offset into a file
 * @public 
 * @constructor Scope
 * @property {file} file {@link FILE.md|:link:}
 * @property {Integer} offset
 * @property {namespace} namespace {@link NAMESPACE.md|:link:}
 * @property {class|null} class {@link CLASS.md|:link:}
 * @property {trait|null} trait {@link TRAIT.md|:link:}
 * @property {interface|null} trait {@link INTERFACE.md|:link:}
 * @property {method|null} method {@link METHOD.md|:link:}
 * @property {function|null} function {@link FUNCTION.md|:link:}
 */
var Scope = function(file, offset) {

    this.file = file;
    this.offset = offset;
    this.namespace = null;
    this.class = null;
    this.trait = null;
    this.interface = null;
    this.method = null;
    this.function = null;
    this.variables = [];

    // scanning file scope
    file.eachNode(function(node) {
        if (node.position && node.position.hit(offset)) {
            if (node.type === 'namespace') {
                this.namespace = node;
                // this.variables = this.variables.concat(node.variables);
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
            } else if (node.variables) {
                // this.variables = this.variables.concat(node.variables);
            }
        }
    });

};

/**
 * Gets variables depending on current state
 * @return {variable[]|null} {@link VARIABLE.md|:link:}
 */
Scope.prototype.getVariables = function() {
  // scope restricted
  if (this.method) {
    return this.method.variables;
  } else if (this.function) {
    return this.function.variables;
  }
  // global scope
  return this.variables;
};

module.exports = Scope;
