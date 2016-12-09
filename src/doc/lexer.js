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
    T_EOF:        0,    // end of streamm
    T_FORMATTING: 1,    // documentation formatting
    T_WHITESPACE: 2,    // white space chars
    T_STRING:     3,    // a single word
    T_NUMBER:     4,    // a numeric value
    T_BOOL:       5,    // a boolean value
    T_TEXT:       6,    // a string value
    T_ANOTATION:  7,    // anotation tag
    T_TAG:        8     // xml tag
};

lexer.consume = {
    format: function() {
        var ch = this.input();
        while(ch !== '\n' && ch !== '*') {
            ch = this.input();
            if () break;
        }
        while(ch === '*' && ch !== '\n') {
            ch = this.input();
        }
        if (ch === '/') {
            this.input();
        } else {
            this.unput(1);
            if (ch === '\n') {
                return lexer.tokens
            }
        }
        this.state.pop();
        return lexer.tokens.T_FORMATTING;
    },
    string: function() {
        var ch = this.input();
        // white spaces
        if (ch === ' ' || ch === '\t') {
            ch = this.input();
            while(ch === ' ' || ch === '\t') {
                ch = this.input();
            }
            this.unput(1);
            return lexer.tokens.T_WHITESPACE;
        }
        if (ch === '\n') {
            this.state.push('format');
            return lexer.tokens.T_WHITESPACE;
        }
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
    if (this.input() !== '/') {
        throw new Error('Bad start token');
    }
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
        return lexer.tokens.T_EOF;
    }
};

module.exports = lexer;