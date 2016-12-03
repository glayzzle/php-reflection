/*!
 * Copyright (C) 2016 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */

/** @private */
var position = require('./position');
/** @private */
var comment = require('./comment');

/**
 * Generic node object (inherited by all objects)
 * @param {node} parent The parent node
 * @param {array} ast The current AST node
 * @public @constructor {node}
 */
var node = function(parent, ast) {
    this.parent = parent;
    // check if contains a position node
    if (ast[0] === 'position') {
        this.position = new position(ast);
        ast = ast[3];
    }
    // check if doc block with inner component
    if (ast[0] === 'doc' && ast.length === 3) {
        this.doc = new comment(ast);
        ast = ast[2];
        if (this.position) {
            // attach position node to comment
            this.doc.position = this.position;
            if (ast[0] === 'position') {
                this.position = new position(ast);
                ast = ast[3];
            } else {
                delete this.position;
            }
        }
    }
    // registers a scop
    if (this.position) {
        this.getFile().scopes.push(this);
    }
};

/**
 * Gets the file node
 * @return {file}
 */
node.prototype.getFile = function() {
    if (this.parent instanceof node) {
        return this.parent.getFile();
    }
    return null;
};

/**
 * @private
 * Takes nodes instances and transform them in an object
 * @param {object|node|array} object
 * @return {object}
 */
var deshydate = function(object) {
    //if ()
};

/**
 * @private
 * Take an object and create its instances
 */
var hydrate = function(object) {

};

/**
 * Node helper for importing data
 */
node.prototype.import = function() {

};

/**
 * Node helper for exporting data
 */
node.prototype.export = function() {
    var object = {};
    for(var k in this) {
        var n = this[k];
        if (n instanceof node) {
            object[k] = n.export();
        } else if (typeof n !== 'object') {

        } else {

        }
    }
    return object;
};

/**
 * @exports {node}
 */
module.exports = node;