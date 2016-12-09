/*!
 * Copyright (C) 2016 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
var tunic = require('tunic')
var grammar = require('../node_modules/tunic/dist/grammars/javascript');
grammar.namedTags = [
    'return', 'var', 'property', 'throws'
];

/**
 * Initialize a comment declaration
 * @public 
 * @constructor comment
 * @property {String} summary
 * @property {class|primitve} returns
 * @property {throws[]} throws
 * @property {param[]} params
 */
var comment = function(node, ast) {
    var ast = tunic.parse(ast[1], grammar);
    this.type = node.type;
    this.summary = ast.blocks[0].description;
    this.annotations = [];
    this.methods = [];
    for(var i = 1; i < ast.blocks.length; i++) {
        this.parseBlock(node, ast.blocks[i]);
    }
};

/**
 * @protected Helper for exporting this object
 */
comment.prototype.export = function() { return this; };


/**
 * @protected Helper for exporting this object
 */
comment.prototype.parseBlock = function(node, block) {
    console.log(JSON.stringify(block, null, '\t'));
};


/**
 * property, variable, constant
 * @constructor varComment
 */ 
var varComment = function() {
    comment.apply(this, arguments);
    this.type = null;
};

/**
 * @protected Helper for exporting this object
 */
varComment.prototype.parseBlock = function(node, block) {
    comment.parseBlock.apply(this, arguments);
};

/**
 * method / function
 * @constructor methodComment
 */ 
var methodComment = function() {
    varComment.apply(this, arguments);
    this.params = [];
    this.throws = [];
};

/**
 * @protected Helper for exporting this object
 */
methodComment.prototype.parseBlock = function(node, block) {
    varComment.parseBlock.apply(this, arguments);
};


/**
 * creates a new comment node
 * @return {comment}
 */ 
comment.create = function(node, ast) {
    if (
        node.type === 'method' ||
        node.type === 'function'
    ) {
        return new methodComment(node, ast);
    } else if (
        node.type === 'property' ||
        node.type === 'constant' ||
        node.type === 'variable'
    ) {
        return new varComment(node, ast);
    } else {
        return new comment(node, ast);
    }
};

/**
 * @private
 * @constructor param
 * @property {String} type
 * @property {String} description
 */
var param = function(type, description) {
    this.offset = -1;
    this.type = type;
    this.description = description;
};

param.prototype.export = function() { return this; };

/**
 * @private
 * @constructor throws
 * @property {String} type
 * @property {String} description
 */
var throws = function() {
    this.type = null;
    this.description = null;
}

throws.prototype.export = function() { return this; };

/**
 * @private
 * @constructor returns
 * @property {String} type
 */
var returns = function() {
    this.name = null;
};
returns.prototype.export = function() { return this; };


// exports the comment API
module.exports = comment;