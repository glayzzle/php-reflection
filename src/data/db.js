/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

/**
 * This file contains customisations in order to integrate grafine with
 * php-reflection
 */

var grafine = require('grafine');

// replace the point class with the generic node class
grafine.point = require('./node');

// extends constructor
var graphCtor = grafine.graph;
grafine.graph = function(shards, lazyCache) {
    graphCtor.apply(this, [shards]);
    this.lazyCache = lazyCache;
};
inherits(grafine.graph, graphCtor);

// creating the shard
var graphCreateShard = grafine.graph.prototype.createShard;
grafine.graph.prototype.createShard = function(id) {
    if (typeof this.lazyCache === 'function') {
        return this.lazyCache('shard', id);
    }
    return graphCreateShard.apply(this, [id]);
};

// creating the index
var graphCreateIndex = grafine.graph.prototype.createIndex;
grafine.graph.prototype.createIndex = function(id) {
    if (typeof this.lazyCache === 'function') {
        return this.lazyCache('index', id);
    }
    return graphCreateIndex.apply(this, [id]);
};

module.exports = grafine;
