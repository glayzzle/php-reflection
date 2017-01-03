/*!
 * Copyright (C) 2016 Glayzzle (BSD3 License)
 * @authors https://github.com/glayzzle/php-reflection/graphs/contributors
 * @url http://glayzzle.com
 */
var node = require('./node');

/**
 * Defines a reference to another node
 * @public
 * @constructor {reference}
 * @param {node} from {@link NODE.md|:link:} Related from node
 * @param {node} to {@link NODE.md|:link:} Relation to node
 * @param {String} type The relation type
 * @property {node} from {@link NODE.md|:link:} Related from node
 * @property {String} type The relation type
 * @property {String} nodeType The related node type
 * @property {String} name The related node name
 */
var reference = function(from, to, type) {
  this.from = from;
  this.type = type;
  if (to instanceof node) {
    this.to = to;
    this.nodeType = to.type;
    if (to.fullName) {
      this.name = to.fullName;
    } else if (to.name) {
      this.name = to.name;
    }
    // link to related node
    this.to.relations.push(this);
  }
};

/**
 * @protected Helper function to export data
 */
reference.prototype.export = function() {
  return {
    nodeType: this.nodeType,
    nodeName: this.name,
    type: this.type
  };
};

/**
 * Allowed reference types
 */
var relationTypes = {
  //
  'class': [
    // create a new instance
    'new',
    // extends the class by another class
    'extends',
    // use the class as a variable declaration (method parameters, @return ...)
    'type'
  ],
  'interface': [
    // when a class implements an interface
    'implements',
    // when another interface extends the class definition
    'extends'
  ],
  'trait': [
    // when a class or a trait uses the specified trait
    'use'
  ],
  'variable': [
    // used into an expression `$a = $a * 3`
    'expr',
    // used as a parameter in a method call `foo($a)`
    'call',
    // used as a global variable into a closure
    'use'
  ],
  'function': [
    // a function call statement
    'call'
  ],
  'method': [
    // a method call statement
    'call',
    // a method variation
    'extends',
    // a method call from child `parent::foo`
    'super'
  ]
};

/**
 * Creates a reference to the specified class
 * @param {node} from The object that uses the specified class
 * @param {String|Array} className The classname (namespace relative, or full namespace)
 * @param {String} type The relation type : new, extends, type
 * @return {reference}
 */
reference.toClass = function(from, className, type) {
  return this.toNode(
    from,
    from.getNamespace().resolveClassName(className),
    'class',
    type
  );
};


/**
 * Creates a reference to the specified interface
 * @param {node} from The object that uses the specified class
 * @param {String|Array} interfaceName The interface (namespace relative, or full namespace)
 * @param {String} type The relation type : implements, extends
 * @return {reference}
 */
reference.toInterface = function(from, interfaceName, type) {
  return this.toNode(
    from,
    from.getNamespace().resolveClassName(interfaceName),
    'interface',
    type
  );
};

/**
 * Creates a reference to the specified trait
 * @param {node} from The object that uses the specified class
 * @param {String|Array} traitName The trait (namespace relative, or full namespace)
 * @param {String} type The relation type : use
 * @return {reference}
 */
reference.toTrait = function(from, interfaceName, type) {
  return this.toNode(
    from,
    from.getNamespace().resolveClassName(interfaceName),
    'interface',
    type
  );
};

/**
 * Creates a reference to the classe name
 * @param {node} from The object that uses the specified class
 * @param {String|Array} nodeName The full nodename
 * @param {String} nodeType The node type
 * @param {String} referenceType The relation type (new, extends, type)
 * @return {reference}
 */
reference.toNode = function(from, nodeName, nodeType, referenceType) {
  if (Array.isArray(nodeName)) {
    if (nodeName[0] === 'ns') {
      nodeName = nodeName[1].join('\\');
    } else {
      nodeName = nodeName.join('\\');
    }
  }
  var result = new reference(from, nodeName, referenceType);
  result.name = nodeName;
  result.nodeType = nodeType;
  return result;
};

/**
 * Gets the related object
 * @return {node|null}
 */
reference.prototype.get = function() {
  if (!this.to) this.resolve();
  return this.to;
};

/**
 * Resolves the reference
 */
reference.prototype.resolve = function() {
  if (!this.to) {
    if (!this.from || !this.nodeType || !this.name) {
      return false;
    }
    var repository = this.from.getFile().repository;
    this.to = repository.getFirstByName(this.nodeType, this.name);
    if (this.to) {
      // relate current relation :
      this.to.relations.push(this);
      return true;
    } else {
      return false;
    }
  }
  return true;
};

module.exports = reference;
