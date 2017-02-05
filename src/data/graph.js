/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var point = require('./point');

/**
 * Initialize a storage
 */
var graph = function() {
    this.points = [];
    this.index = {};
};

/**
 * Create a node
 */
graph.prototype.create = function() {
    var result = new point(this); 
    this.points.push(result);
    return result;
};

/**
 * Proceed to a multicriteria search
 */
graph.prototype.search = function(criteria) {
    var results = [];
    // preparing results
    for(var k in criteria) {
        if (k in this.index) {
            var hashes = this.index[k];
            var check = criteria[k];
            if (typeof check === 'function') {
                for(var i in hashes) {
                    if (check(i) === true) {
                        results.push(hashes[i]);
                    }
                }
            } else {
                if (check in hashes) {
                    results.push(hashes[check]);
                }
            }
        } else return []; // nobody matches
    }
    if (results.length === 1) {
        return results[0];
    }
    // intersect results (quick & dirty / may improve)
    var data = [];
    for(var s = 0; s < results.length; s++) {
        var set = results[s];
        for(var i = 0, size = set.length; i < size; i++) {
            var miss = false;
            var item = set[i];
            // scan other sets to check if exists
            for(var j = 0; j < results.length; j++) {
                if (j !== s && results[j].indexOf(item) === -1) {
                    miss = true;
                    break;
                }
            }
            if (!miss) data.push(item);
        }
    }
    return data;
};

module.exports = graph;