var repository = require('../main');
repository.parse('test.php').then(function(file) {
    console.log(file);
}, function(err) {
    console.error(err);
});