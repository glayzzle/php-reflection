/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var parser = require('php-parser');

module.exports = {
    get: function(repository) {
        var result = new parser({
            ast: {
                withPositions: true
            },
            parser: {
                extractDoc: repository.options.scanDocs,
                suppressErrors: true
            }
        });
        var _super = result.ast.prepare;
        // inject state on nodes
        result.ast.prepare = function() {
            var cb = _super.apply(this, arguments);
            var state = {
                lexer: result.lexer.getState(),
                token: result.parser.token,
                // @todo check if condition is everytime IN_SCRIPTING
                condition: result.lexer.curCondition
            };
            return function() {
                var node = cb.apply(this, arguments);
                node.state = state;
                return node;
            };
        };
        return result;
    },
    read: function(repository, code, filename) {
        var engine = this.get(repository);
        return engine.parseCode(code, filename);
    },
    sync: function(repository, code, node) {
        if (!node.state) {
            throw new Error('Node does not have parsing state');
        }
        var engine = this.get(repository);
        // inject parsing state
        engine.lexer.mode_eval = false;
        engine.lexer.all_tokens = false;
        engine.lexer.comment_tokens = repository.options.scanDocs;
        engine.lexer.setInput(code);
        engine.lexer.setState(node.state.lexer);
        engine.lexer.begin(node.state.condition);
        // trigger errors (sync only when everything is ok)
        engine.parser.suppressErrors = false;
        engine.parser.extractDoc = repository.options.scanDocs;
        engine.parser._errors = [];
        engine.parser.filename = node.getFile().filename;
        engine.parser.currentNamespace = [''];
        // @notice innerList state (node not extracted to flag ignored)
        engine.parser.token = node.state.token;
        // generic entry point :
        return engine.parser.read_top_statement();
    }
};