var util = require('util');
var fs = require('fs');
var repository = require('../src/repository');
var workspace = new repository();

console.log('Start to load file');

workspace.parse('./test.php').then(function(file) {
    console.log('File loaded');
    var cache = workspace.cache();
    console.log(
        util.inspect(
            cache,
            {
                depth: 10
            }
        )
    );
    fs.writeFileSync('./cache.json', JSON.stringify(cache));
}, function(err) {
    console.log('Load error');
    console.error(err.stack);
});