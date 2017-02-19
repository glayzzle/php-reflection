/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var Node = require('../data/node');

/**
 * ** Extends from {@link NODE.md|:link: node} **
 *
 * Represents a class
 *
 * @public
 * @constructor Class
 * @property {string} name
 * @property {string} fullName
 * @property {boolean} isAbstract
 * @property {boolean} isFinal
 * @property {reference<class>} extends {@link CLASS.md|:link:}
 * @property {interface[]} implements {@link INTERFACE.md|:link:}
 * @property {property[]} properties {@link PROPERTY.md|:link:}
 * @property {method[]} methods {@link METHOD.md|:link:}
 * @property {trait[]} traits {@link TRAIT.md|:link:}
 */
var Class = Node.extends('class');

/**
 * Gets the extended class
 */
Class.prototype.getExtends = function() {
    if (this.extends) {
        return this.first('extends');
    }
    return null;
};

/**
 * Gets the extended class
 */
Class.prototype.getImplements = function() {
    var result = [];
    if (this.implements.length > 0) {
        var items = this.get('implements');
        for(var i = 0; i < items.length; i++) {
            var item = this._db.get(items[i]);
            if (item) {
                result.push(item);
            }
        }
    }
    return result;
};

/**
 * Force relations to refresh
 */
Class.prototype.refreshRelations = function() {
    // lookup extends
    if (this.extends) {
        var results = this._db.search({
            class: this.extends
        });
        if (results.length > 0) {
            parent = this._db.get(results[0]);
            if (parent) {
                this.set('extends', parent);
            }
        }
    }
    // lookup implements
    this.remove('implements');
    for(var i = 0; i < this.implements.length; i++) {
        var results = this._db.search({
            interface: this.implements[i]
        });
        if (results.length > 0) {
            var item = this._db.get(items[i]);
            if (item) {
                this.add('implements', item);
            }
        }
    }
};

/**
 * Retrieves a list of properties
 */
Class.prototype.getProperties = function(includeParents) {
    var result = {};
    var properties = this._db.resolve(
        this.get('properties')
    );
    if (properties) {
        for(var i = 0; i < properties.length; i++) {
            result[properties[i].name] = properties[i];
        }
    }
    if (includeParents) {
        var parent = this.getExtends();
        if (parent) {
            var parentProperties = parent.getProperties(true);
            for(var k in parentProperties) {
                if (!(k in result)) {
                    result[k] = parentProperties[k];
                }
            }
        }
    }
    return result;
};

/**
 * Retrieves a list of methods
 */
Class.prototype.getMethods = function(includeParents) {
    var result = {};
    var methods = this._db.resolve(
        this.get('methods')
    );
    if (methods) {
        for(var i = 0; i < methods.length; i++) {
            result[methods[i].name] = methods[i];
        }
    }
    if (includeParents) {
        var parent = this.getExtends();
        if (parent) {
            var parentMethods = parent.getMethods(true);
            for(var k in parentMethods) {
                if (!(k in result)) {
                    result[k] = parentMethods[k];
                }
            }
        }
    }
    return result;
};

/**
 * Retrieves a list of constants
 */
Class.prototype.getConstants = function(includeParents) {
    var result = {};
    var constants = this._db.resolve(
        this.get('constants')
    );
    if (constants) {
        for(var i = 0; i < constants.length; i++) {
            result[constants[i].name] = constants[i];
        }
    }
    if (includeParents) {
        var parent = this.getExtends();
        if (parent) {
            var parentConstants = parent.getConstants(true);
            for(var k in parentConstants) {
                if (!(k in result)) {
                    result[k] = parentConstants[k];
                }
            }
        }
    }
    return result;
};

/**
 * @protected Consumes the current ast node
 */
Class.prototype.consume = function(file, parent, ast) {

    // parent call
    Node.prototype.consume.apply(this, arguments);

    // handle name
    this.name = ast.name;
    this.fullName = this.getNamespace().name + '\\' + this.name;
    this.indexName(this.fullName);

    // handle flags
    this.isAbstract = ast.isAbstract;
    this.isFinal = ast.isFinal;

    // handle extends
    if (ast.extends) {
        this.extends = this.getNamespace().resolveClassName(
            ast.extends
        );
    } else {
        this.extends = false;
    }

    // handle implements
    this.implements = [];
    if (ast.implements && ast.implements.length > 0) {
        for (var i = 0; i < ast.implements.length; i++) {
            this.implements.push(
                this.getNamespace().resolveClassName(
                    ast.implements[i]
                )
            );
        }
    }

    // reads inner statements
    if (ast.body) {
        this.consumeClassBody(ast.body);
    }
};

/**
 * Consumes class body statements
 */
Class.prototype.consumeClassBody = function(body) {
    var lastDoc = null;
    for(var i = 0; i < body.length; i++) {
        var item = body[i];
        if (item.kind === 'doc') {
            lastDoc = item;
        } else {
            item.doc = lastDoc;
            if (item.kind === 'classconstant') {
                this.add(
                    'constants',
                    this._db.create('constant', this, item)
                );
            } else if (item.kind === 'property') {
                this.add(
                    'properties',
                    this._db.create('property', this, item)
                );
            } else if (item.kind === 'method') {
                this.add(
                    'methods',
                    this._db.create('method', this, item)
                );
            }
            // @todo use traits statements
            lastDoc = null;
        }
    }
};

module.exports = Class;
