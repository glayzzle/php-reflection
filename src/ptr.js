/*!
 * Copyright (C) 2016 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */

/**
 * This class handles hierarchical links between the document nodes
 * @constructor ptr
 * @property {file} file {@link FILE.md|:link:} The related file
 * @property {Number} index The {@link NODE.md|:link: node} offset into the nodes array
 */
var ptr = function(file, index) {
    this.file = file;
    this.index = index;
};

/**
 * Retrieves the related node
 * @return {node}
 */
ptr.prototype.get = function() {
    return this.file.nodes[this.index];
};

/**
 * Creates a ptr instance for the specified node
 * @param {node} node {@link NODE.md|:link:}
 * @return {ptr}
 */
ptr.create = function(node) {
    var file = node.getFile();
    file.nodes.push(node);
    return new ptr(file, file.nodes.length - 1);
};


module.exports = ptr;