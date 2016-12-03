# PHP Reflection

Nodejs Reflection API for PHP files based on the [php-parser](https://github.com/glayzzle/php-parser)

# Install

```
npm install php-reflection --save
```

# Usage

```
var repository = require('php-reflection');
var workspace = new repository();
var workers = [
    workspace.parse('some-file.php'),
    workspace.parse('another-file.php'),
    workspace.parse('test-file.php')
];
Promise.all(workers).then(function() {
    console.log('-- list of functions :');
    workspace.each(function(file) {
        // @todo
    });
});
```