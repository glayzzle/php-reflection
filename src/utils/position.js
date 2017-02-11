/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

/**
 * Defines a position object
 * @constructor Position
 * @property {Object} start
 * @property {Object} end
 * @property {Object} offset
 */
var Position = function(node) {
    if (node) {
        this.start = {
            line: node.start.line,
            column: node.start.column
        };
        this.end = {
            line: node.end.line,
            column: node.end.column
        };
        this.offset = {
            start: node.start.offset,
            end: node.end.offset
        };
    }
};

/**
 * Exports a position node
 */
Position.prototype.export = function() {
    return [
        this.start.line, this.start.column,
        this.end.line, this.end.column,
        this.offset.start, this.offset.end
    ];
};

/**
 * Creates a node
 */
Position.import = function(data) {
    var node = new Position();
    node.start = {
        line: data[0],
        column: data[1]
    };
    node.end = {
        line: data[2],
        column: data[3]
    };
    node.offset = {
        start: data[4],
        end: data[5]
    };
    return node;
};


/**
 * Check if the specified offset is inside the current position
 * @param {int} offset
 * @return {boolean}
 */
Position.prototype.hit = function(offset) {
  return offset >= this.offset.start && offset <= this.offset.end;
}

module.exports = Position;
