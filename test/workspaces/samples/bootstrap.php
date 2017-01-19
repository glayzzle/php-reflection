<?php
// autoload classes
spl_autoload_register(function($name) {
  include __DIR__ . '/src/' . strtr($name, '\\', '/') . '.php';
  return class_exists($name, false);
});
return new App($_REQUEST, $_COOKIES, $_FILES);
