/*!
 * Copyright (C) 2016 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
var node = require('./node');
var reference = require('./reference');

/**
 * ** Extends from {@link NODE.md|:link: node} **
 *
 * Represents a class
 *
 * @public
 * @constructor class
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
var _class = node.extends('class');

/**
 * @protected Consumes the current ast node
 */
_class.prototype.consume = function(ast) {

    // handle name
    this.name = ast[1];
    this.fullName = this.getNamespace().name + '\\' + this.name;

    // handle flags
    this.isAbstract = ast[2][2] === 1;
    this.isFinal = ast[2][2] === 2;

    // handle extends
    if (ast[3]) {
        this.extends = reference.toClass(this, ast[3], 'extends');
    } else {
        this.extends = false;
    }

    // handle implements
    this.implements = [];
    if (ast[4] && ast[4].length > 0)  {
        for(var i = 0; i < ast[4].length; i++) {
            this.implements.push(
                reference.toNode(this, ast[4][i], 'interface', 'implements')
            );
        }
    }

    // the class definition
    var body = ast[5];

    // constants
    this.constants = [];
    for(var i = 0; i < body.constants.length; i++) {
        this.constants.push(
            node.create('constant', this, body.constants[i])
        );
    }

    // properties
    this.properties = [];
    for(var i = 0; i < body.properties.length; i++) {
        this.properties.push(
            node.create('property', this, body.properties[i])
        );
    }

    // methods
    this.methods = [];
    for(var i = 0; i < body.methods.length; i++) {
        this.methods.push(
            node.create('method', this, body.methods[i])
        );
    }

};

module.exports = _class;
