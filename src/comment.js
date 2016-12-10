/*!
 * Copyright (C) 2016 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
var tunic = require('tunic');
var util = require('util');
var grammar = require('../node_modules/tunic/dist/grammars/javascript');
grammar.namedTags = [
    'return', 'var', 'property', 'throws', 'param'
];

/**
 * Initialize a comment declaration
 * @public 
 * @constructor comment
 * @property {String} summary
 * @property {tag[]} tags
 * @property {annotation[]} annotations
 */
var comment = function(node, ast) {
    ast = tunic.parse(ast[1], grammar);
    this.type = node.type;
    this.summary = ast.blocks[0].description;
    this.annotations = [];
    this.tags = [];
    ast = ast.blocks[0].tags;
    for(var i = 0; i < ast.length; i++) {
        this.parseBlock(node, ast[i]);
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
    var desc = block.description;
    if (block.name) {
        desc = block.name + ' ' + desc;
    }
    if (desc[0] === '(') {
        // @method(...args...)
        this.annotations.push(
            new annotation(
                block.tag,
                desc
            )
        );
    } else {
        // classic annotation
        this.tags.push(new tag(block.tag, desc));
    }
};


/**
 * property, variable, constant
 * @constructor variable
 * @extends comment
 * @property {type} type
 */ 
var variable = function() {
    this.type = null;
    comment.apply(this, arguments);
};
util.inherits(variable, comment);

/**
 * @protected Helper for exporting this object
 */
variable.prototype.parseBlock = function(node, block) {
    if (!this.type && (block.tag === 'var' || block.tag === 'property')) {
        this.type = new type(
            node.getNamespace().resolveClassName(block.name),
            block.description
        );
    } else {
        comment.prototype.parseBlock.apply(this, arguments);
    }
};

/**
 * method / function
 * @constructor method
 * @extends variable
 * @property {throws[]} throws
 * @property {param[]} params
 */ 
var method = function() {
    this.params = [];
    this.throws = [];
    variable.apply(this, arguments);
};
util.inherits(method, variable);

/**
 * @protected Helper for exporting this object
 */
method.prototype.parseBlock = function(node, block) {
    if (block.tag === 'return') {
        this.type = new type(
            node.getNamespace().resolveClassName(block.name),
            block.description
        );
    } else if (block.tag === 'param') {
        this.params.push(
            new param(
                node.getNamespace().resolveClassName(block.name),
                block.description
            )
        );
    } else if (block.tag === 'throws') {
        this.throws.push(
            new throws(
                node.getNamespace().resolveClassName(block.name),
                block.description
            )
        );
    } else {
        variable.prototype.parseBlock.apply(this, arguments);
    }
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
        return new method(node, ast);
    } else if (
        node.type === 'property' ||
        node.type === 'constant' ||
        node.type === 'variable'
    ) {
        return new variable(node, ast);
    } else {
        return new comment(node, ast);
    }
};

/**
 * @constructor param
 * @property {String} type
 * @property {String} name
 * @property {String} description
 */
var param = function(type, description) {
    this.type = type;
    this.description = description.trim();
    if (this.description[0] === '$') {
        // contains the var name
        for(var i = 0; i < this.description.length; i++) {
            var c = this.description[i];
            if (c === ' ' || c === '\t' || c === '\r' || c === '\n') {
                break;
            }
        }
        this.name = this.description.substring(0, i - 1);
        this.description = this.description.substring(i);
    }
};
param.prototype.export = function() { return this; };

/**
 * @constructor throws
 * @property {String} type
 * @property {String} description
 */
var throws = function(type, description) {
    this.type = type;
    this.description = description;
}
throws.prototype.export = function() { return this; };

/**
 * @constructor type
 * @property {String} type
 * @property {String} description
 */
var type = function(name, description) {
    this.name = name;
    this.description = description;
};
type.prototype.export = function() { return this; };

/**
 * @private
 * @constructor tag
 * @property {String} name
 * @property {String} description
 */
var tag = function(name, description) {
    this.name = name;
    this.description = description;
};
tag.prototype.export = function() { return this; };


/**
 * @private
 */
var annotationLexer = function(text) {
    this._input = text;
    this.offset = 0;
    this.text = "";
};

var T_EOF = 1, T_WHITESPACE = 2, T_TEXT = 3, T_STRING = 4, T_NUM = 5;
var lexerSymbols = [
    ',', '=', ':', '(', ')', '[', ']', '{', '}', '@'
];
var lexerWhiteSpace = [' ', '\t', '\r', '\n'];

annotationLexer.prototype.input = function() {
    if (this.offset < this._input.length) {
        this.ch = this._input[this.offset++];
        this.text += this.ch;
        return this.ch;
    } else {
        return null;
    }
};

annotationLexer.prototype.unput = function() {
    this.offset--;
    this.text = this.text.substring(0, this.text.length - 1);
};

annotationLexer.prototype.unlex = function() {
    this.offset = this.__offset;
    this.text = this.__text;
    this.token = this.__token;
    return this.token;
};

annotationLexer.prototype.lex = function() {
    // backup
    this.__offset = this.offset;
    this.__text = this.text;
    this.__token = this.token;
    // scan
    this.token = this.next();
    while(this.token === T_WHITESPACE) { 
        // ignore white space
        this.token = this.next();
    }
    return this.token;
};

annotationLexer.prototype.next = function() {
    this.text = "";
    var ch = this.input();
    if (ch === null) return T_EOF;
    if (ch === '"' || ch === "'") {
        var tKey = ch;
        do {
            ch = this.input();
            if (ch === '\\') {
                this.input();
            }
        } while(ch !== tKey && this.offset < this._input.length);
        return T_TEXT;
    } else if (lexerSymbols.indexOf(ch) > -1) {
        if (ch === ':') ch = '=>'; // alias
        if (ch === '=' && this.text[this.offset] === '>') ch += this.input();
        return ch;
    } else if (lexerWhiteSpace.indexOf(ch) > -1) {
        ch = this.input();
        while(lexerWhiteSpace.indexOf(ch) > -1) {
            ch = this.input();
        }
        if (ch !== null) this.unput();
        return T_WHITESPACE;
    } else {
        ch = ch.charCodeAt(0);
        if (ch > 47 && ch < 58) {
            while(ch > 47 && ch < 58 && ch !== null) {
                ch = this.input();
                if (ch !== null) ch = ch.charCodeAt(0);
            }
            if (ch !== null) this.unput();
            return T_NUM;
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
            } while(this.offset < this._input.length);
            return T_STRING;
        }
    }
};

var annotationParser = function(input) {
    this.lexer = new annotationLexer(input);
    this.ast = [];
    this.token = this.lexer.lex();
    while(this.token !== T_EOF) {
        var node = this.body();
        if (node) this.ast.push(node);
        this.token = this.lexer.lex();
    }
};

annotationParser.prototype.body = function() {
    if (this.token === T_STRING) {
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
                } while(this.token !== ')' && this.token !== T_EOF);
                return result;
            } else {
                this.token = this.lexer.unlex();
            }
            return ['type', name];
        }
    } else if (this.token === T_TEXT) {
        return ['text', this.lexer.text];
    } else if (this.token === T_NUM) {
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
        if (this.token === T_STRING) {
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
                } while(this.token !== ')' && this.token !== T_EOF);
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

annotationParser.prototype.read_array = function(endChar) {
    var result = [];
    do {
        this.token = this.lexer.lex(); // consume start char
        var item = this.body();
        if (item !== null) { // ignore
            this.token = this.lexer.lex();
            if (this.token === '=>') {
                this.token = this.lexer.lex(); // eat
                item = ['key', item, this.body()];
                this.token = this.lexer.lex(); // eat
            }
            if ( this.token !== ',') {
                this.token = this.lexer.unlex();
            }
            result.push(item);
        }
    } while(this.token !== endChar && this.token !== T_EOF);
    return result;
};

annotationParser.prototype.read_json = function(endChar) {
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
            if ( this.token !== ',') {
                this.token = this.lexer.unlex();
            }
        }
    } while(this.token !== '}' && this.token !== T_EOF);
    this.token = this.lexer.lex();
    return result;
};

annotationParser.prototype.get_json_value = function(ast) {
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
annotationParser.prototype.get_json_key = function(ast) {
    if (ast[0] === 'text') {
        var result = ast[1].substring(1, ast[1].length - 1);
        try {
            return JSON.parse('"' + result + '"');
        } catch(e) {
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

/**
 * @private
 * @constructor annotation
 * @property {String} name
 * @property {Array} arguments
 * @property {String} description
 */
var annotation = function(name, args) {
    this.name = name;
    this.arguments = [];
    var methodEnd = args.lastIndexOf(')');
    if (methodEnd > -1) {
        this.description = args.substring(methodEnd + 1);
        var parser = new annotationParser(args.substring(1, methodEnd - 1));
        this.arguments = parser.ast;
    }
};
annotation.prototype.export = function() { return this; };


// exports the comment API
module.exports = comment;