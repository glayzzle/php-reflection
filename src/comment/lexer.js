/*!
 * Copyright (C) 2016 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */

var t = require('./token');

/**
 * @constructor lexer
 * @property {String} text Current parsed text (attached to current token)
 * @property {Number} offset Current offset
 * @property {String|Number} token Current parsed token
 */
var lexer = function(text) {
  this._input = text;
  this.offset = 0;
  this.text = "";
  this.token = null;
};


// breaking symbols
var lexerSymbols = [
  ',', '=', ':', '(', ')', '[', ']', '{', '}', '@'
];

// whitespace chars
var lexerWhiteSpace = [' ', '\t', '\r', '\n'];

/**
 * Consumes a char
 * @return {String}
 */
lexer.prototype.input = function() {
  if (this.offset < this._input.length) {
    this.ch = this._input[this.offset++];
    this.text += this.ch;
    return this.ch;
  } else {
    return null;
  }
};

/**
 * Revert back the current consumed char
 * @return {void}
 */
lexer.prototype.unput = function() {
  this.offset--;
  this.text = this.text.substring(0, this.text.length - 1);
};

/**
 * Revert back the current consumed token
 * @return {String|Number} the previous token
 */
lexer.prototype.unlex = function() {
  this.offset = this.__offset;
  this.text = this.__text;
  this.token = this.__token;
  return this.token;
};

/**
 * Consumes the next token (ignores whitespaces)
 * @return {String|Number} the current token
 */
lexer.prototype.lex = function() {
  // backup
  this.__offset = this.offset;
  this.__text = this.text;
  this.__token = this.token;
  // scan
  this.token = this.next();
  while (this.token === t.T_WHITESPACE) {
    // ignore white space
    this.token = this.next();
  }
  return this.token;
};

/**
 * Eats a token (see lex for public usage) including whitespace
 * @return {String|Number} the current token
 */
lexer.prototype.next = function() {
  this.text = "";
  var ch = this.input();
  if (ch === null) return t.T_EOF;
  if (ch === '"' || ch === "'") {
    var tKey = ch;
    do {
      ch = this.input();
      if (ch === '\\') {
        this.input();
      }
    } while (ch !== tKey && this.offset < this._input.length);
    return t.T_TEXT;
  } else if (lexerSymbols.indexOf(ch) > -1) {
    if (ch === ':')
      ch = '=>'; // alias
    if (ch === '=' && this._input[this.offset] === '>') {
      ch += this.input();
    }
    return ch;
  } else if (lexerWhiteSpace.indexOf(ch) > -1) {
    ch = this.input();
    while (lexerWhiteSpace.indexOf(ch) > -1) {
      ch = this.input();
    }
    if (ch !== null) this.unput();
    return t.T_WHITESPACE;
  } else {
    ch = ch.charCodeAt(0);
    if (ch > 47 && ch < 58) {
      while (ch > 47 && ch < 58 && ch !== null) {
        ch = this.input();
        if (ch !== null)
          ch = ch.charCodeAt(0);
      }
      if (ch !== null) this.unput();
      return t.T_NUM;
    } else {
      do {
        ch = this.input();
        if (
          lexerSymbols.indexOf(ch) > -1 ||
          lexerWhiteSpace.indexOf(ch) > -1
        ) {
          this.unput();
          break;
        }
      } while (this.offset < this._input.length);
      return t.T_STRING;
    }
  }
};

// exports
module.exports = lexer;