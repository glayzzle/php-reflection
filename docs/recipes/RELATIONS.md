# Dealing with relations

When have a class, you would like to know what is it's base class,
but you could also want to know, what classes extends it.

To deal with that kind of notion php-reflection has a typed bi-directional
reference system.

Lets consider this code :

```php
<?php 
// from foo.php
abstract class Foo {
    abstract protected function doFoo();
}
```

And into another file :

```php
<?php 
// from bar.php
class Bar extends Foo {
    protected function doFoo() {
        return $this;
    }
}
```

## Preparing relations

Lets say you have made a scan on the workspace :

```js
var repository = require('php-reflection');
var workspace = new repository(__dirname);
workspace.scan().then(function() {
    // everything is ready
});
```

So at this point you can make a request to retrieve the Foo class for example :

```js
// ...
var fooClass = workspace.getFirstByName('class', 'Bar');
// ...
```

Each [:link:node](../src/NODE.md) has a `relations` property, that contains a list of [:link:relations](../src/RELATION.md).

In order to simplify requesting, you can also use the `getByRelationType` method, by passing the relation type you want to retrieve.

> Note that this method returns a direct list of [:link:node](../src/NODE.md). 

So in principle if I want to retrieve the list of classes that 

```js
// ...
var fooClass = workspace.getFirstByName('class', 'Bar');
fooClass.getByRelationType('extends').forEach(function(def) {
    console.log('Extended by ')
});
// ...
```

