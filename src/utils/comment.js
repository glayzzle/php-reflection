/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var util = require('util');
var DocParser = require('doc-parser');
var reader = new DocParser();

/**
 * Initialize a comment declaration
 * @public
 * @constructor comment
 * @property {String} summary
 * @property {tag[]} tags
 * @property {annotation[]} annotations
 */
var comment = function(node, ast) {
  this.type = node.type;
  try {
    var doc = reader.parse(ast.lines);
  } catch(e) {
    console.error(e.stack);
    console.log('Source : \n* ' + ast.lines.join('\n* '));
    return;
  }
  this.summary = doc.summary;
  this.tags = {};
  this.annotations = [];
  for(var i = 0; i < doc.body.length; i++) {
    var child = doc.body[i];
    if (child.kind === 'annotation') {
      this.annotations.push(child);
    } else {
      var name = child.kind.toLowerCase();
      if (!this.tags.hasOwnProperty(name)) {
        this.tags[name] = [];
      }
      this.tags[name].push(child);
    }
  }
};

/**
 * Gets a list of tags matching to the specified name
 * @param {String} name
 * @return {Object[]}
 */
comment.prototype.getTags = function(name) {
  var result = [];
  name = name.toLowerCase();
  if (this.tags.hasOwnProperty(name)) {
    result = this.tags[name];
  }
  return result;
};

/**
 * Gets the first tag that matches to the specified name
 * @param {String} name
 * @return {Object|null}
 */
comment.prototype.getTag = function(name) {
  var items = this.getTags(name);
  if (items.length > 0) {
    return items[0];
  } else {
    return null;
  }
};

/**
 * Gets a list of annotations matching to the specified name
 * @param {String} name
 * @return {Object[]}
 */
comment.prototype.getAnnotations = function(name) {
  var result = [];
  this.annotations.forEach(function(item) {
    if (item.name === name) {
      result.push(item);
    }
  });
  return result;
};

/**
 * Gets the first annotation that matches to the specified name
 * @param {String} name
 * @return {Object}
 */
comment.prototype.getAnnotation = function(name) {
  var items = this.getAnnotations(name);
  if (items.length > 0) {
    return items[0];
  } else {
    // fallback on tag
    return this.getTag(name);
  }
};


/**
 * Gets the attribute of the specified annotation
 *
 * ```js
 * /**
 *  * @foo(bar => 'baz')
 *  * @return void
 *  *\
 * var doc = new comment(docNode);
 * doc.getArgument('return', 'what');
 * doc.getArgument('foo', 0, 'bar');
 * ```
 *
 *
 * @param {String} tag
 * @param {Number} offset
 * @param {String} name
 * @return {Object}
 */
comment.prototype.getArgument = function(tag, offset, name) {
  var what = this.getAnnotation(tag);

  if (what === null) {
    return null;
  }

  // search the node
  if (typeof name === 'undefined' && typeof offset !== 'number') {
    name = offset;
    offset = null;
  }
  var node = null;
  var search = [];
  if (what.kind === 'annotation') {
    search = what.arguments;
  } else {
    for(var k in what) {
      search.push({
        kind: 'key',
        name: k,
        value: what[k]
      });
    }
  }

  // scan by name
  if (name) {
    if (!Array.isArray(name)) {
      name = [name];
    }
    for (var i = 0; i < search.length; i++) {
      if (
        search.kind === 'key' &&
        search.name === name
      ) {
        node = search.value;
        break;
      }
    }
  }

  // fallback
  if (node === null && offset != null && offset > -1) {
    // retrieve from offset
    if (offset < search.length) {
      node = search[offset];
      // handle when the parameter is named
      if (node && node.kind && node.kind === 'key') {
        node = node.value;
      }
    }
  }

  return node;
};


/**
 * @protected Helper for exporting this object
 */
comment.prototype.export = function() {
  return this;
};

// exports the comment API
module.exports = comment;
