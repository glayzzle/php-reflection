/*!
 * Copyright (C) 2016 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */

var position = require('./position');
var comment = require('./comment');

/**
 * Generic node object (inherited by all objects)
 * 
 * @public @constructor {node}
 * @param {node} parent The parent node
 * @param {array} ast The current AST node
 * 
 * @property {node} parent Parent node instance
 * @property {position|null} position Current node [position](POSITION.md)
 * @property {comment|null} doc Current node [comment](COMMENT.md)
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
    this.consume(ast);
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
 * @protected Consumes the current ast node
 */
node.prototype.consume = function(ast) {};

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

module.exports = node;