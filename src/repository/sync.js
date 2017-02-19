/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var parser = require('../utils/parser');

/**
 * Synchronize with specified offset
 * @return {boolean|Error} True is node was synced, or Error object if fail
 */
module.exports = function(filename, contents, offset) {
  if (!(filename in this.files)) {
    // not already in memory
    var ast;
    try {
      ast = parser.read(this, contents, filename);
    } catch (e) {
      this.emit('error', e);
      return e;
    }
    this.files[filename] = new file(this, filename, ast);
    this.files[filename].refresh();
    this.files[filename].size = contents.length;
    // nothing to sync
    return true;
  }
  // @todo first implementation (not optimized for speed)
  // collect nodes
  var fileItem = this.files[filename];
  var syncNode = null;
  var start = offset[0];
  var end = offset[1];
  if (this.options.debug) console.log(
    'detect', start, 'to', end,
    '>' + contents.substring(start, end) + '<'
  );
  for(var i = 0, size = fileItem.nodes.length; i < size; i++) {
    var node = fileItem.nodes[i];
    var position = node.position.offset;
    // x... [  ]
    var isNodeAfter = position.start > start && position.end > end;
    // [ ] x...
    var isNodeBefore = position.end < start;
    // [ x... ] or [ x.].. or x.[.. ] or x.[.].
    var isNodeIntersect = !isNodeAfter && !isNodeBefore;
    // only [ x... ]
    // var isNodeContainer = position.start <= start && position.end >= end;
    if (this.options.debug) console.log(
      'check',
      node._type,
      position,
      '>' + contents.substring(position.start, position.end) + '<'
    );
    if (isNodeIntersect) {
      // locate nodes to be synced :
      // [--[x..]--]
      // nodes that is not father of other nodes
      if (syncNode) {
        // most specific node
        var isInner = position.start > syncNode.position.offset.start;
        var isBlock = node instanceof block;
        if (isBlock && isInner) {
          syncNode = node;
        }
      } else {
        syncNode = node;
      }
    }
  }
  if (!syncNode) {
    // refresh full file
    syncNode = fileItem;
  }
  if (this.options.debug) console.log(
    'sync', syncNode.type, 'from',
    syncNode.position.offset.start,
    'to',
    syncNode.position.offset.end
  );
  var ast;
  try {
    if (syncNode.position.offset.start === 0) {
      // full refresh
      ast = parser.read(this, contents, filename);
      // delete references
      fileItem.remove();
      // create a new one
      this.files[filename] = new file(this, filename, ast);
      this.files[filename].refresh();
      this.files[filename].size = contents.length;
    } else {
      ast = parser.sync(this, contents, syncNode);
      if (this.options.debug) console.log(syncNode.parent.type, 'will eat', ast.kind);
      // @fixme handle case when parent is not a block
      fileItem.removeNode(syncNode);
      syncNode.parent.consumeChild(ast);
    }
  } catch (e) {
    this.emit('error', e);
    return e;
  }
  return true;
};
