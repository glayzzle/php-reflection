var util = require('util');
var repository = require('../src/repository');
var workspace = new repository();

console.log('Start to load file');

workspace.parse('./test.php').then(function(file) {
    console.log('File loaded');
    console.log(
        util.inspect(
            workspace.cache(),
            {
                depth: 10
            }
        )
    );
}, function(err) {
    console.log('Load error');
    console.error(err.stack);
});