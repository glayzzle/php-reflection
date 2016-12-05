/*!
 * Copyright (C) 2016 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */

var lexer = require('./lexer');
var EOF = lexer.tokens.T_EOF;

/**
 * docBlock parser
 * @constructor parser
 */
var parser = function() {
    this.lexer = new lexer();
};

parser.prototype.parse = function(input) {
    this.lexer.init(input);
    this.token = null;
    var doc = [];
    while(this.token != EOF) {
        var node = this.read_start();
        if (node !== null) {
            if (typeof node[0] !== 'string') {
                node.forEach(function(item) {
                    doc.push(item);
                });
            } else {
                doc.push(node);
            }
        }
    }
    return doc;
};

parser.prototype.next = function() {
    this.token = this.lexer.next();
    return this;
};

parser.prototype.text = function() {
    return this.lexer.text;
};

parser.prototype.read_start = function() {
    this.next().token;
    // @todo
};

module.exports = parser;