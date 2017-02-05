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
  this.start = {
    line: node.start.line,
    column: node.start.column
  }
  this.end = {
    line: node.end.line,
    column: node.end.column
  }
  this.offset = {
    start: node.start.offset,
    end: node.end.offset
  };
};

/**
 * @todo
 */
Position.prototype.export = function() {
  return this;
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
