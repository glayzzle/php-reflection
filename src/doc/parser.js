/*!
 * Copyright (C) 2016 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */

var lexer = require('./lexer');
var EOF = lexer.tokens.T_EOF;


/**
 * docBlock parser
 */
module.exports = {
    token: null,
    parse: function(input) {
        lexer.init(input);
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
    },
    next: function() {
        this.token = lexer.next();
        return this;
    },
    text: function() {
        return lexer.text;
    },
    read_start: function() {
        this.next().token;
        // @todo
    }
};