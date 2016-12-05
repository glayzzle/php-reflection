/*!
 * Copyright (C) 2016 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
var node = require('./node');

/**
 * Defines a reference to another node
 * @public
 * @constructor {reference}
 * @param {node} from {@link NODE.md|:link:} Related from node
 * @param {node|String} to {@link NODE.md|:link:} Relating to node 
 * @param {String} type The relation type 
 */
var reference = function(from, to, type) {
    this._from = from;
    this.type = type;

    if (to instanceof node) {
        this._to = to;
        this.nodeType = to.type;
        this.filename = to.getFile().name;
        if (to.fullName) {
            this.name = to.fullName;
        } else if (to.name) {
            this.name = to.name;
        }
    } else if (typeof to === 'string') {
        this.name = to;
    }
};

/**
 * @protected Helper function to export data
 */
reference.prototype.export = function() {
    return {
        nodeType: this.nodeType,
        nodeName: this.name,
        type: this.type
    };
};

/**
 * Creates a reference to the classe name
 * @param {node} from The object that uses the specified class
 * @param {String|Array} className The full classname
 * @param {String} type The relation type (new, extends, type)
 * @return {reference}
 */
reference.toClass = function(from, className, type) {
    return this.toNode(from, className, 'class', type);
};

/**
 * Creates a reference to the classe name
 * @param {node} from The object that uses the specified class
 * @param {String|Array} nodeName The full nodename
 * @param {String} nodeType The node type
 * @param {String} referenceType The relation type (new, extends, type)
 * @return {reference}
 */
reference.toNode = function(from, nodeName, nodeType, referenceType) {
    if (Array.isArray(className)) {
        if (className[0] === 'ns') {
            className = className[1].join('/');
        } else {
            className = className.join('/');
        }
    }
    var result = new reference(from, className, referenceType);
    result.nodeType = nodeType;
    return result;
};

/**
 * Gets the related object
 * @return {node|null}
 */
reference.prototype.get = function() {
    if (!this.to) {
        if (!this.filename || !this.type || !this.name) {
            return null;
        }
        if (!this.from) {
            return null;
        }
        var repository = this.from.getFile().repository;
        // @todo
    }
    return this.to;
};

module.exports = reference;