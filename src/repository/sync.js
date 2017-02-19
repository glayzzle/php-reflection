/*!
 * Copyright (C) 2017 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
'use strict';

var Block = require('../nodes/block');
var parser = require('../utils/parser');
var crc32   = require('../utils/crc32');

/**
 * Synchronize with specified offset
 * @return {boolean|Error} True is node was synced, or Error object if fail
 * @todo first implementation (not optimized for speed)
 */
module.exports = function(filename, contents, offset) {
    var fileItem = this.getFile(filename);
    if (!fileItem) {
        // not already in memory
        ast = parser.read(this, contents, filename);
        fileItem = this.db.create('file', null, ast);
        fileItem.setName(filename);
        fileItem.size = contents.length;
        fileItem.mtime = (new Date()).getTime();
        fileItem.crc32 = crc32(contents);
        // nothing to sync
        return true;
    }
    // collect nodes
    var syncNode = null;
    var start = offset[0];
    var end = offset[1];
    var self = this;
    fileItem.eachNode(function(node) {
        if (!node.position) return;
        var position = node.position.offset;
        // x... [  ]
        var isNodeAfter = position.start > start && position.end > end;
        // [ ] x...
        var isNodeBefore = position.end < start;
        // [ x... ] or [ x.].. or x.[.. ] or x.[.].
        var isNodeIntersect = !isNodeAfter && !isNodeBefore;
        // only [ x... ]
        // var isNodeContainer = position.start <= start && position.end >= end;
        if (isNodeIntersect) {
            // locate nodes to be synced :
            // [--[x..]--]
            // nodes that is not father of other nodes
            if (syncNode) {
                // most specific node
                var isInner = position.start > syncNode.position.offset.start;
                var isBlock = node instanceof Block;
                if (isBlock && isInner) {
                    syncNode = node;
                }
            } else {
                syncNode = node;
            }
        }
    });
    if (!syncNode) {
        // refresh full file
        syncNode = fileItem;
    }
    var ast;
    try {
        if (syncNode.position.offset.start === 0) {
            // full refresh
            ast = parser.read(this, contents, filename);
            // delete references
            var mtime = fileItem.mtime;
            fileItem.delete();
            // create a new one
            fileNode = self.db.create('file', null, ast);
            fileNode.setName(filename);
            fileNode.size = contents.length;
            fileNode.mtime = mtime;
            fileNode.crc32 = crc32(contents);
        } else {
            ast = parser.sync(this, contents, syncNode);
            if (this.options.debug) console.log(
                syncNode.parent.type, 'will eat', ast.kind
            );
            // @fixme handle case when parent is not a block
            fileItem.removeNode(syncNode);
            syncNode.getParent().consumeChild(ast);
        }
    } catch (e) {
        this.emit('error', e);
        return e;
    }
    return true;
};
