/**
 * Defines a position object
 */
module.exports = function(node, file) {
    if (this.node[0] !== 'position') {
        throw new Error('Bad node type');
    }
    this.file = file;
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
