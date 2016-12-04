/*!
 * Copyright (C) 2016 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */

/**
 * Defines a reference to another node
 * @public
 * @constructor {reference}
 * @param {node} from {@link NODE.md|:link:} Related from node
 * @param {node|null} to {@link NODE.md|:link:} Relating to node 
 */
var reference = function(from, to) {
    this.from = from;
    this.to = to;
    if (to) {
        this.type = to.constructor.name;
        this.filename = to.getFile().name;
        this.id = to.getName();
    }
};

/**
 * Creates a lazy loading reference (from static informations)
 * @return {reference}
 */
reference.create = function(from, filename, type, id) {
    var result = new this(from, null);
    result.type = type;
    result.filename = filename;
    result.id = id;
    return result;
};

/**
 * Gets the related object
 * @return {node|null}
 */
reference.prototype.get = function() {
    if (!this.to) {
        if (!this.filename || !this.type || !this.id) {
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