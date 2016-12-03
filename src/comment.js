/*!
 * Copyright (C) 2016 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */


var parser = require('./doc/parser');

/**
 * Initialize a comment declaration
 * @constructor {comment}
 */
var comment = function(file, ast) {
    var ast = parser.parse(ast[1]);
    this.file = null;
    this.summary = null;
    this.returns = null;
    this.params = [];
};

var param = function() {
    this.type = null;
    this.description = null;
};

var type = function() {
    this.name = null;
    
};

module.exports = comment;