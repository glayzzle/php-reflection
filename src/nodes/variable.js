/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var Node = require('../data/node');

/**
 * **Extends from {@link NODE.md|:link: node}**
 *
 * Reprensents a variable declaration
 *
 * @public
 * @constructor Variable
 * @property {String} name
 * @property {String|Class|Null} type
 */
var Variable = Node.extends('variable');

/**
 * Gets the variable type class
 */
Variable.prototype.getType = function() {
    if (this.type) {
        return this.first('type');
    }
    return null;
};


/**
 * Force relations to refresh
 */
Variable.prototype.refreshRelations = function() {
    if (this.type) {
        var results = this._db.search({
            class: this.type
        });
        if (results.length > 0) {
            parent = this._db.get(results[0]);
            if (parent) {
                this.set('type', parent);
            }
        }
    }
};

/**
 * Gets the variable name
 */
Variable.prototype.getName = function() {
    return this.name;
};

/**
 * @protected Consumes the current ast node
 */
Variable.prototype.consume = function(file, parent, ast) {
    Node.prototype.consume.apply(this, arguments);

    if (ast.kind === 'assign') {
        if (ast.left.kind === 'variable') {
            this.name = ast.left.name;
        } else {
            // @fixme should avoid this
            this.name = '#' + ast.left.kind;
        }
        // resolve the variable type
        var what = ast.right.kind;
        if (what === 'number') {
            this.type = 'number';
        } else if (what === 'boolean') {
            this.type = 'boolean';
        } else if (what === 'string') {
            this.type = 'string';
        } else if (what === 'array') {
            this.type = 'array';
        } else if (what === 'new') {
            this.type = this.getNamespace().resolveClassName(ast.right.what);
        } else {
            this.type = null;
        }
    } else if (this.kind === 'parameter') {
        this.name = ast.name;
        if (ast.type) {
            this.type = this.getNamespace().resolveClassName(ast.type);
        } else if (ast.value) {
            // resolve from default value
            var what = ast.value;
            if (what === 'number') {
                this.type = 'number';
            } else if (what === 'boolean') {
                this.type = 'boolean';
            } else if (what === 'string') {
                this.type = 'string';
            } else if (what === 'array') {
                this.type = 'array';
            } else {
                this.type = null;
            }
        }
    } else if (this.kind === 'variable') {
        this.name = ast.name;
    }
    if (this.name) {
        this.indexName(this.name);
    }
};

module.exports = Variable;
