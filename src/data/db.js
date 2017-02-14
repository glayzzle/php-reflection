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
var inherits = require('util').inherits;
var node = require('./node');

// replace the point class with the generic node class
grafine.point = node;

// extends constructor
var graphCtor = grafine.graph;
grafine.graph = function(repository) {
    graphCtor.apply(this, [repository.options.shards]);
    this.repository = repository;
};
inherits(grafine.graph, graphCtor);

// creating the shard
var graphCreateShard = grafine.graph.prototype.createShard;
grafine.graph.prototype.createShard = function(id) {
    var shard = graphCreateShard.apply(this, [id]);
    if (typeof this.repository.options.lazyCache === 'function') {
        var result = this.repository.options.lazyCache('shard', id);
        if (result) {
            shard.import(result);
        }
    }
    return shard;
};

// creating the index
var graphCreateIndex = grafine.graph.prototype.createIndex;
grafine.graph.prototype.createIndex = function(id) {
    var index = graphCreateIndex.apply(this, [id]);
    if (typeof this.repository.options.lazyCache === 'function') {
        var result = this.repository.options.lazyCache('index', id);
        if (result) {
            index.import(result);
        }
    }
    return index;
};

module.exports = grafine;
