var repository = require('../src/repository');
var os = require('os');
/**
 * IN ORDER TO RUN BENCHMARK :
 * 1. Checkout the magento2 repository
 * 2. Make a symbolic link into test/workspace as magento2
 * 3. Run from cli :
 * node bin/test.js
 * 4. In order to test with fork processes :
 * node bin/test.js --fork
 */
workspace = new repository(
  __dirname + '/../test/workspaces/magento2', {
  forkWorker: process.argv.indexOf('--fork') > -1,
  exclude: ['bin']
});
var i = 0;
workspace.on('error', function(e) {
  console.error(e);
});
workspace.on('progress', function() {
  i++;
  if (i % 500 === 0) {
    var mem = process.memoryUsage();
    console.log(
      (new Date()).toString() + '\t' +
      Math.round(mem.heapUsed / 1024 / 1024) + 'Mb\t' +
      Math.round(workspace.counter.loaded / workspace.counter.total * 100) + '% - ' +
      workspace.counter.total
    );
  }
});
var start = process.hrtime();
var elapsed_time = function(note){
    var precision = 3; // 3 decimal places
    var elapsed = process.hrtime(start)[1] / 1000000; // divide by a million to get nano to milli
    console.log(process.hrtime(start)[0] + " s, " + elapsed.toFixed(precision) + " ms - " + note); // print message + time
    start = process.hrtime(); // reset the timer
};
workspace.scan().then(function() {
  elapsed_time('Scan finished');
  var items = workspace.getByType('trait', -1);
  elapsed_time('List of traits : ' + items.length);
  items = workspace.getByType('class', -1);
  elapsed_time('List of classes : ' + items.length);
  items = workspace.getByType('interface', -1);
  elapsed_time('List of interfaces : ' + items.length);
  items = workspace.getByType('constant', -1);
  elapsed_time('List of constants : ' + items.length);
  var ns = workspace.getNamespace('\\Magento\\Catalog\\Ui\\DataProvider\\Product\\Form\\Modifier');
  elapsed_time('Found Namespace : ' + (ns ? ns.name : 'KO'));
  // tada (force workers to stop)
  process.exit(0);
});
