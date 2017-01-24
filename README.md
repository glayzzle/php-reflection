# PHP Reflection

[![npm version](https://badge.fury.io/js/php-reflection.svg)](https://www.npmjs.com/package/php-reflection)
[![Build Status](https://travis-ci.org/glayzzle/php-reflection.svg?branch=master)](https://travis-ci.org/glayzzle/php-reflection)
[![Coverage Status](https://coveralls.io/repos/github/glayzzle/php-reflection/badge.svg?branch=master)](https://coveralls.io/github/glayzzle/php-reflection?branch=master)
[![Gitter](https://img.shields.io/badge/GITTER-join%20chat-green.svg)](https://gitter.im/glayzzle/Lobby)

Nodejs Reflection API for PHP files based on the [php-parser](https://github.com/glayzzle/php-parser)

# Install

```sh
npm install php-reflection --save
```

# Usage

```js
var repository = require('php-reflection');
var workspace = new repository('/home/devbox/my-project', {
    // actual default options :
    exclude: ['.git', '.svn'],
    include: ['./'],
    ext: [
        '*.php','*.php3','*.php5','*.phtml',
        '*.inc','*.class','*.req'
    ],
    scanVars: true,
    scanExpr: true,
    encoding: 'utf8',
    cacheByFileSize: true
});
var workers = [
    workspace.parse('some-file.php'),
    workspace.parse('another-file.php'),
    workspace.parse('test-file.php')
];
Promise.all(workers).then(function() {
    console.log('-- list of functions :');
    workspace.getByType('function').each(function(fn) {
        console.log('Function Name : ', fn.name);
        console.log('Located into : ', fn.getFile().name);
        console.log('At line : ', fn.position.start.line);
    });
});
```

Read the [API docs](https://github.com/glayzzle/php-reflection/tree/master/docs) for more details.

# What it can do

 - Fully reflection support (classes, inheritance, documentation blocks)
 - Recursively scan directories and add files to repository
 - Request cross files elements (like retrieving a class)
 - Put in-memory documents structure (with a small memory footprint)
 - You can use a cache engine for the repository
 - It avoids parsing a file that is already in memory and not modified since last parsing
 - Symbols relations (what variable instanciate a class, or who extends that class)
 - A cool (and really fast) requesting engine for retrieving elements

# What you could do with it

 - Write a documentation generator
 - Write a static code generator based on relection (like an ORM)
 - Write a code analysis tool (like phpMessDetector)
 - Write a code completion plugin

... if you want to share an idea or your project make a pull request

# Benchmark


# WIP Disclaimer

This project is actually on it's early alpha stage. It may progress rapidly, so watch the project if you are interested to use it.
