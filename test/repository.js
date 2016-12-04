var should = require("should");

describe('Repository class', function() {

    var repository = require('../src/repository');
    var path = __dirname + '/workspaces/samples';
    var workspace = null;

    describe('#ctor', function() {
        workspace = new repository(path);
        it('properties', function () {
            workspace.files.should.be.Object();
            workspace.directory.should.be.exactly(path);
        });
    });

    describe('#parse', function() {
        it('should read test.php', function (done) {
            workspace.parse('test.php').then(function(file) {
                file.name.should.be.exactly('test.php');
                done();
            }, done);
        });
    });

    describe('#cache/get', function() {
        var fs = require('fs');
        it('should get cache', function () {
            var cache = workspace.cache();
            cache.should.be.Object();
            cache.directory.should.be.exactly(path);
            cache.files.should.be.Object();
            cache.files['test.php'].should.be.Object();
            // saves the file to cache
            fs.writeFileSync(
                __dirname + '/cache/sample.json',
                JSON.stringify(cache, null, 2)
            );
        });
    });

    describe('#cache/set', function() {
        var fs = require('fs');
        it('should set cache', function () {
        });
    });


});