var repository = require('../src/repository');
var workspace = new repository();

console.log('Start to load file');

workspace.parse('./test.php').then(function(file) {
    console.log('File loaded');
    console.log(file.namespaces);
}, function(err) {
    console.log('Load error');
    console.error(err.stack);
});