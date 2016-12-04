# API Documentation

The main entry class is [repository](src/REPOSITORY.md). 

With this class you can load and navigate between [files](src/FILE.md) and [nodes](src/NODE.md).

The repository contains the files object indexing by filename each [file](src/FILE.md) class.

The [file](src/FILE.md) object has a nodes array that references all parsed nodes.

In order to maintain the tree document structure, each node can contain properties that points to a node.

## Generic classes

 * [node](src/NODE.md) - This class represents a single statement node
 * [block](src/BLOCK.md) - This class represents a list of statements
 * [ptr](src/PTR.md) - This class handles hierarchical links between the document nodes
 * [reference](src/REFERENCE.md) - This class handles cross-files references between nodes (a class and it's instanciation)
 * [position](src/POSITION.md) - Meta informations about the position of a node
 * [comment](src/COMMENT.md) - Comment informations

## Nodes classes

 * [class](src/CLASS.md)
 * [constant](src/CONSTANT.md)
 * [define](src/DEFINE.md)
 * [external](src/EXTERNAL.md)

## Blocks classes

 * [declare](src/DECLARE.md)
 * [expr](src/EXPR.md)
 * [file](src/FILE.md)
 * [namespace](src/FILE.md)