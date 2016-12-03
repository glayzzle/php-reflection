/*!
 * Copyright (C) 2016 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
var block = require('./block');

/**
 * @constructor declare
 */
var declare = block.extends('declare');

/**
 * @protected Consumes the current ast node
 */
declare.prototype.consume = function(ast) {
    var options = {};
    ast[1].forEach(function(item) {
        options[item[0]] = item[1];
    });
    this.options = options;
    if (ast[2]) {
        block
    }
};

module.exports = declare;