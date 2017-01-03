/*!
 * Copyright (C) 2016 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
var tunic = require('tunic');
var util = require('util');
var parser = require('./comment/parser');
var grammar = require('tunic/dist/grammars/javascript');
grammar.namedTags = [
  'return', 'var', 'property', 'throws', 'param'
];

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
/*  ast = tunic.parse(ast[1], grammar);
  this.summary = ast.blocks[0].description;
  this.annotations = [];
  this.tags = [];
  ast = ast.blocks[0].tags;
  for (var i = 0; i < ast.length; i++) {
    this.parseBlock(node, ast[i]);
  }
  */
};

/**
 * Gets a list of tags matching to the specified name
 * @param {String} name
 * @return {tag[]}
 */
comment.prototype.getTags = function(name) {
  var result = [];
  this.tags.forEach(function(item) {
    if (item.name === name) {
      result.push(item);
    }
  });
  return result;
};

/**
 * Gets the first tag that matches to the specified name
 * @param {String} name
 * @return {tag|null}
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
 * @return {annotation[]}
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
 * @return {annotation|tag|null}
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
 * @protected Helper for exporting this object
 */
comment.prototype.export = function() {
  return this;
};


/**
 * @protected Helper for exporting this object
 */
comment.prototype.parseBlock = function(node, block) {
  var desc = block.description;
  if (block.name) {
    desc = block.name + ' ' + desc;
  }
  if (desc[0] === '(') {
    // @method(...args...)
    this.annotations.push(
      new annotation(
        block.tag,
        desc
      )
    );
  } else {
    // classic annotation
    this.tags.push(new tag(block.tag, desc));
  }
};


/**
 * property, variable, constant
 * @constructor variable
 * @extends comment
 * @property {type} type
 */
var variable = function() {
  this.type = null;
  comment.apply(this, arguments);
};
util.inherits(variable, comment);

/**
 * @protected Helper for exporting this object
 */
variable.prototype.parseBlock = function(node, block) {
  if (!this.type && (block.tag === 'var' || block.tag === 'property')) {
    this.type = new type(
      node.getNamespace().resolveClassName(block.name),
      block.description
    );
  } else {
    comment.prototype.parseBlock.apply(this, arguments);
  }
};

/**
 * method / function
 * @constructor method
 * @extends variable
 * @property {throws[]} throws
 * @property {param[]} params
 */
var method = function() {
  this.params = [];
  this.throws = [];
  variable.apply(this, arguments);
};
util.inherits(method, variable);

/**
 * @protected Helper for exporting this object
 */
method.prototype.parseBlock = function(node, block) {
  if (block.tag === 'return') {
    this.type = new type(
      node.getNamespace().resolveClassName(block.name),
      block.description
    );
  } else if (block.tag === 'param') {
    this.params.push(
      new param(
        node.getNamespace().resolveClassName(block.name),
        block.description
      )
    );
  } else if (block.tag === 'throws') {
    this.throws.push(
      new throws(
        node.getNamespace().resolveClassName(block.name),
        block.description
      )
    );
  } else {
    variable.prototype.parseBlock.apply(this, arguments);
  }
};


/**
 * creates a new comment node
 * @return {comment}
 */
comment.create = function(node, ast) {
  if (
    node.type === 'method' ||
    node.type === 'function'
  ) {
    return new method(node, ast);
  } else if (
    node.type === 'property' ||
    node.type === 'constant' ||
    node.type === 'variable'
  ) {
    return new variable(node, ast);
  } else {
    return new comment(node, ast);
  }
};

/**
 * @constructor param
 * @property {String} type
 * @property {String} name
 * @property {String} description
 */
var param = function(type, description) {
  this.type = type;
  this.description = description.trim();
  if (this.description[0] === '$') {
    // contains the var name
    for (var i = 0; i < this.description.length; i++) {
      var c = this.description[i];
      if (c === ' ' || c === '\t' || c === '\r' || c === '\n') {
        break;
      }
    }
    this.name = this.description.substring(0, i - 1);
    this.description = this.description.substring(i);
  }
};
param.prototype.export = function() {
  return this;
};

/**
 * @constructor throws
 * @property {String} type
 * @property {String} description
 */
var throws = function(type, description) {
  this.type = type;
  this.description = description;
}
throws.prototype.export = function() {
  return this;
};

/**
 * @constructor type
 * @property {String} type
 * @property {String} description
 */
var type = function(name, description) {
  this.name = name;
  this.description = description;
};
type.prototype.export = function() {
  return this;
};

/**
 * @private
 * @constructor tag
 * @property {String} name
 * @property {String} description
 */
var tag = function(name, description) {
  this.name = name;
  this.description = description;
};
tag.prototype.export = function() {
  return this;
};

/**
 * Parses an argument
 */
tag.prototype.getArgument = function(offset) {
  if (!Number.isInteger(offset) || !this.description) {
    return null;
  }
  var args = this.description.split(/s+/g);
  if (offset > -1 && offset < args.length) {
    return args[offset];
  }
  return null;
};

/**
 * @private
 * @constructor annotation
 * @property {String} name
 * @property {Array} arguments
 * @property {String} description
 */
var annotation = function(name, args) {
  this.name = name;
  this.arguments = [];
  var methodEnd = args.lastIndexOf(')');
  if (methodEnd > -1) {
    this.description = args.substring(methodEnd + 1);
    var doc = new parser(args.substring(1, methodEnd));
    this.arguments = doc.ast;
  }
};
/**
 * @private helper for export
 */
annotation.prototype.export = function() {
  return this;
};

/**
 * Gets a named argument (or find it by position)
 * @param {Number} offset The fallback offset when the name is not found
 * @param {String|String[]} name The name of the parameter (or a list of names, aliases)
 * @return {Object|null}
 */
annotation.prototype.getArgument = function(offset, name) {

  // search the node
  if (typeof name === 'undefined' && typeof offset !== 'number') {
    name = offset;
    offset = null;
  }
  var node = null;

  // scan by name
  if (name) {
    if (!Array.isArray(name))
      name = [name];
    for (var i = 0; i < this.arguments.length; i++) {
      if (
        this.arguments[i][0] === 'key' &&
        name.indexOf(this.arguments[i][1]) > -1
      ) {
        node = this.arguments[i][2];
        break;
      }
    }
  }

  // fallback
  if (node === null && offset != null && offset > -1) {
    // retrieve from offset
    if (offset < this.arguments.length) {
      node = this.arguments[offset];
      // handle when the parameter is named
      if (Array.isArray(node) && node[0] === 'key') {
        if (!name) {
          node = node[2];
        } else {
          // name does not matches with the offset (so ignore it)
          node = null;
        }
      }
    }
  }

  // resolving the node type
  if (node === null) {
    return null; // node not found
  }
  if (node[0] === 'json') {
    return node[1];
  } else if (node[0] === 'array') {
    return node[1];
  } else if (node[0] === 'null') {
    return null;
  } else if (node[0] === 'text') {
    node = node[1].substring(1, node[1].length - 1);
    try {
      return JSON.parse('"' + node + '"');
    } catch (e) {
      return node;
    }
  } else if (node[0] === 'number') {
    return Number.parseInt(node[1]);
  } else if (node[0] === 'boolean') {
    return node[1];
  } else {
    // unresolved type
    return node;
  }
};

// exports the comment API
module.exports = comment;
