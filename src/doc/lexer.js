/*!
 * Copyright (C) 2016 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */

/**
 * docBlock tokenizer
 * @constructor lexer
 */
var lexer = function() {
    this.text = null;
    this.input = null;
    this.offset = 0;
    this.size = 0;
    this.state = [];
};

lexer.tokens = {
    T_EOF:        0,
    T_FORMATTING: 1, 
    T_WHITESPACE: 2,
    T_STRING:     3,
    T_NUMBER:     4,
    T_BOOL:       5,
    T_TEXT:       6,
    T_ANOTATION:  7,
    T_TAG:        8
};

lexer.consume = {
    format: function() {
        var ch = this.input();
        while(ch != '*') {
            ch = this.input();
        }
        while(ch === '*') {
            ch = this.input();
        }
        if (ch === '/') {
            this.input();
        }
        this.state.pop();
        return lexer.tokens.T_FORMATTING;
    },
    string: function() {
    }
};

/**
 * Initialize the lexer with the specified text
 * @param {String} text The text to parse
 */
lexer.prototype.init = function(text) {
    this.input = text;
    this.size = text.length;
    this.state = ['string','format'];
    this.offset = 0;
};

lexer.prototype.input = function() {
    var ch = this.input[this.offset++];
    this.text += ch;
    return ch;
};

lexer.prototype.unput = function(size) {
    if (!size) size = 1;
    if (size > this.text.length) {
        throw new Error('Bad status');
    }
    this.offset -= size;
    this.text = this.text.substring(0, this.text.length - size);
    return this;
};

lexer.prototype.next = function() {
    var token = this.lex();
    while(!token || token === lexer.tokens.T_FORMATTING) {
        token = this.lex();
    }
    return token;
};

lexer.prototype.nextToken = function() {
    var token = this.next();
    while(token === lexer.tokens.T_WHITESPACE) {
        token = this.next();
    }
    return token;
};

lexer.prototype.lex = function() {
    if (this.offset < this.size) {
        this.text = '';
        var cb = lexer.consume[
            this.state[
                this.state.length - 1
            ]
        ];
        return cb.apply(this, []);
    } else {
        return thlexeris.tokens.T_EOF;
    }
};

module.exports = lexer;