/**
 * Defines a position object
 * @constructor
 */
var position = function(node) {
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
  console.log(this);
};

/**
 * @todo
 */
position.prototype.export = function() {
  return this;
};

/**
 * Check if the specified offset is inside the current position
 * @param {int} offset
 * @return {boolean}
 */
position.prototype.hit = function(offset) {
  return offset >= this.offset.start && offset <= this.offset.end;
}

module.exports = position;
