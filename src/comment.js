/*!
 * Copyright (C) 2016 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
var parser = require('./doc/parser');

/**
 * Initialize a comment declaration
 * @public 
 * @constructor comment
 * @property {String} summary
 * @property {class|primitve} returns
 * @property {throws[]} throws
 * @property {param[]} params
 */
var comment = function(file, ast) {
    var ast = new parser(ast[1]);
    this._file = file;
    this.summary = null;
    this.returns = null;
    this.params = [];
    this.throws = [];
};

/**
 * @protected Helper for exporting this object
 */
comment.prototype.export = function() {
    return {
        summary: this.summary,
        params: this.params,
        throws: this.throws,
        returns: this.returns
    };
};

/**
 * @constructor param
 * @property {String} type
 * @property {String} description
 */
var param = function() {
    this.type = null;
    this.description = null;
};

/**
 * @constructor throws
 * @property {String} type
 * @property {String} description
 */
var throws = function() {
    this.type = null;
    this.description = null;
}

var type = function() {
    this.name = null;
    
};

module.exports = comment;