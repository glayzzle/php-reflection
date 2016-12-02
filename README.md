# php-reflection

Nodejs Reflection API for PHP files based on the (php-parser)[https://github.com/glayzzle/php-parser]

# Install

```
npm install php-reflection --save
```

# Usage

```
var repository = require('php-reflection');
var workers = [
    repository.parse('some-file.php'),
    repository.parse('another-file.php'),
    repository.parse('test-file.php')
];
Promise.all(workers).then(function() {
    console.log('-- list of functions :');
    repository.each(function(file) {
        // @todo
    });
});
```