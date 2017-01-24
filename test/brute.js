var should = require("should");

describe('Brute Force Tests', function() {
  var repository = require('../src/repository');
  var path = __dirname + '/workspaces/samples';
  var workspace =  new repository(__dirname + '/workspaces/magento2', {
    forkWorker: false
  });
  this.timeout(0);
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
  it('parse all files into magento2', function(done, reject) {
    workspace.scan().then(function() {
      done();
    }, reject);
  });
});
