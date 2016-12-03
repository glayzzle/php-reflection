var repository = require('../src/repository');

var workspace = new repository();

workspace.parse('./test.php').then(function(file) {
    console.log(file);
}, function(err) {
    console.error(err);
});