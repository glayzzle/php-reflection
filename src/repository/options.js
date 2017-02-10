/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

module.exports = {
    // list of excluded directory names
    exclude: ['.git', '.svn', 'node_modules'],
    // list of included directories
    include: ['./'],
    // list of php extension files
    ext: [
      '*.php', '*.php3', '*.php5', '*.phtml',
      '*.inc', '*.class', '*.req'
    ],
    // extract vars from each scope (functions, classes)
    // may use memory but could be usefull for resolving
    // their type (on autocompletion)
    scanVars: true,
    // extract scopes from
    scanExpr: true,
    // extract documentation from
    scanDocs: true,
    // default parsing encoding
    encoding: 'utf8',
    // should spawn a worker process to avoir blocking
    // the main loop (may be slower with small projects or single cpu)
    forkWorker: require('os').cpus().length > 1,
    // use the file mtime property to check changes
    cacheByFileDate: true,
    // use the file size to detect changes
    cacheByFileSize: false,
    // use an hash algorithm to detect changes
    // if low cache hit, may slow down the parsing
    cacheByFileHash: true,
    // avoid to load the full cache repository
    // just loads files when they are requested
    // define a function that receives the filename in argumen
    // and return the file cached structure
    lazyCache: false,
    // used for testing / dev without inspector
    debug: false
  };