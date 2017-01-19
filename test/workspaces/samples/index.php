<?php $app = require('bootstrap.php'); ?>
<html>
  <head>
    <title><?= $app->getTitle(); ?></title>
  </head>
  <body>
    <h1>
      <?= "Hello " . $_GET['name'] ?? "nobody"; ?>
    </h1>
  </body>
</html>
