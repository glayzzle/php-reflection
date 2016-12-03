/**
 * Defines a position object
 * @constructor
 */
var position = function(node) {
    if (node[0] !== 'position') {
        throw new Error('Bad node type');
    }
    this.start = {
        line: node[1][0],
        column: node[1][1]
    }
    this.end = {
        line: node[2][0],
        column: node[2][1]
    }
    this.offset = {
        start: node[1][2],
        end: node[2][2]
    };
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