/**
 * Copyright (C) 2014 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */

var file = function(name, ast) {
    this.version = new Date();
    this.name = name;
    this.namespaces = [];
};

/**
 * @return namespace[]
 */
file.prototype.getNamespaces = function() {
    return ;
};

/**
 * Removes the current file from the parser (need to clean external references)
 */
file.prototype.remove = function() {

}

file.prototype.refresh = function() {

}

// exports the class
module.exports = file;