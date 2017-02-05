/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var graph = require('../src/data/graph');
var db = new graph();

var start = (new Date().getTime());
var elapsed_time = function(note, counter){
    // divide by a million to get nano to milli
    var elapsed = (new Date().getTime()) - start;
    var mem = process.memoryUsage();
    console.log(
        note + ' in ' + elapsed + "ms / memory " + 
        Math.round(mem.heapUsed / 1024 / 1024) + 'Mb'
    );
    if (counter) {
        console.log('Speed : ' + Math.round(counter / elapsed * 1000) + '/sec');
    }
    start = (new Date().getTime()); // reset the timer
};

// writing tests
var last;
var size = process.argv.length === 3 ? process.argv[2] : 1000;
for(var i = 0; i < size; i++) {
    var node = db.create();
    node.index('name', i % 30);
    node.index('type', i % 60);
    if (i % 5 === 0) {
        if (last) {
            node.set('foo', last);
            node.set('bar', last);
            node.add('baz', last);
        }
    }
    if (i % 10 === 0) last = node;
}
elapsed_time('Create ' + size +  ' items', size);

// searching tests
var search = 10;
var records = 0;
for(var i = 0; i < search; i++) {
    var found = db.search({
        name: i % 30,
        type: i % 60
    });
    records += found.length;
}
elapsed_time('Found ' + records +  ' items', records);

// searching tests
var records = 1000;
for(var i = 0; i < records; i++) {
    db.points[0].delete();
}
elapsed_time('Deleted ' + records +  ' items', records);
