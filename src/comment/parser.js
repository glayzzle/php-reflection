/*!
 * Copyright (C) 2016 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */

var t = require('./token');
var lexer = require('./lexer');

/**
 * @constructor parser
 * @property {lexer} lexer
 * @property {Array} ast
 */
var parser = function(input) {
  this.lexer = new lexer(input);
  this.ast = [];
  this.token = this.lexer.lex();
  while (this.token !== t.T_EOF) {
    var node = this.body();
    if (node) this.ast.push(node);
    this.token = this.lexer.lex();
  }
};

parser.prototype.body = function() {
  if (this.token === t.T_STRING) {
    if (this.lexer.text === 'true') {
      return ['boolean', true];
    } else if (this.lexer.text === 'false') {
      return ['boolean', false];
    } else if (this.lexer.text === 'null') {
      return ['null'];
    } else if (this.lexer.text === 'array') {
      this.token = this.lexer.lex();
      if (this.token === '(') {
        var result = ['array'];
        result.push(this.read_array(')'));
        return result;
      } else {
        this.token = this.lexer.unlex();
      }
      return ['type', this.lexer.text];
    } else {
      var name = this.lexer.text;
      this.token = this.lexer.lex();
      if (this.token === '=' || this.token === '=>') {
        // key value
        this.token = this.lexer.lex();
        return [
          'key',
          name,
          this.get_json_value(this.body())
        ];
      } else if (this.token === '(') {
        // method
        var result = ['method', name, []];
        do {
          this.token = this.lexer.lex();
          var item = this.body();
          if (item !== null) {
            result[2].push(item);
          }
        } while (this.token !== ')' && this.token !== t.T_EOF);
        return result;
      } else {
        this.token = this.lexer.unlex();
      }
      return ['type', name];
    }
  } else if (this.token === t.T_TEXT) {
    return ['text', this.lexer.text];
  } else if (this.token === t.T_NUM) {
    return ['number', this.lexer.text];
  } else if (this.token === '[') {
    // can be an Array
    var result = ['array'];
    result.push(this.read_array(']'));
    return result;
  } else if (this.token === '{') {
    // can be a JSON
    var result = ['json'];
    result.push(this.read_json());
    return result;
  } else if (this.token === '@') {
    this.token = this.lexer.lex();
    if (this.token === t.T_STRING) {
      // inner annotation
      var result = ['annotation', this.lexer.text, []];
      this.token = this.lexer.lex();
      if (this.token === '(') {
        // with args
        do {
          this.token = this.lexer.lex();
          var item = this.body();
          if (item !== null) {
            result[2].push(item);
          }
        } while (this.token !== ')' && this.token !== t.T_EOF);
      } else {
        this.token = this.lexer.unlex();
      }
      return result;
    } else {
      // ignore it
      this.token = this.lexer.unlex();
      return null;
    }
  } else {
    // ignore it
    return null;
  }
};

parser.prototype.read_array = function(endChar) {
  var result = [];
  do {
    this.token = this.lexer.lex(); // consume start char
    var item = this.body();
    if (item !== null) { // ignore
      this.token = this.lexer.lex();
      item = this.get_json_value(item);
      if (this.token === '=>') {
        this.token = this.lexer.lex(); // eat
        item = [
          'key', item,
          this.get_json_value(
            this.body()
          )
        ];
        this.token = this.lexer.lex(); // eat
      }
      if (this.token !== ',') {
        this.token = this.lexer.unlex();
      }
      result.push(item);
    }
  } while (this.token !== endChar && this.token !== t.T_EOF);
  return result;
};

parser.prototype.read_json = function(endChar) {
  var result = {};
  do {
    this.token = this.lexer.lex();
    var item = this.body();
    if (item !== null) { // ignore
      this.token = this.lexer.lex(); // eat
      if (this.token === '=>') {
        item = this.get_json_key(item);
        if (item !== null) {
          this.token = this.lexer.lex();
          result[item] = this.get_json_value(this.body());
        }
        this.token = this.lexer.lex();
      }
      if (this.token !== ',') {
        this.token = this.lexer.unlex();
      }
    }
  } while (this.token !== '}' && this.token !== t.T_EOF);
  this.token = this.lexer.lex();
  return result;
};

parser.prototype.get_json_value = function(ast) {
  if (!ast) return null;
  var result = this.get_json_key(ast);
  if (result === null) {
    if (ast[0] === 'json') {
      result = ast[1];
    } else if (ast[0] === 'array') {
      result = [];
      ast[1].forEach(function(item) {
        result.push(this.get_json_value(item));
      }.bind(this));
    } else {
      result = ast;
    }
  }
  return result;
};

// converts an ast node to a scalar key
parser.prototype.get_json_key = function(ast) {
  if (ast[0] === 'text') {
    var result = ast[1].substring(1, ast[1].length - 1);
    try {
      return JSON.parse('"' + result + '"');
    } catch (e) {
      return result;
    }
  } else if (ast[0] === 'number') {
    return JSON.parse(ast[1]);
  } else if (ast[0] === 'type' || ast[0] === 'boolean') {
    return ast[1];
  } else {
    return null;
  }
};

module.exports = parser;