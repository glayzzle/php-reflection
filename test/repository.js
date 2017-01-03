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

    describe('#scan', function() {
        it('should scan directory', function (done) {
            workspace.scan().then(function() {
                workspace.files.should.have.property('test.php');
                workspace.files.should.have.property('friend.php');
                workspace.files.should.have.property('sub/empty.php');
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
            // @todo
        });
    });

    describe('#getByType', function() {
        it('should find namespace', function () {
            var items = workspace.getByType('namespace');
            items.should.be.Array();
            // 4 namespace block in 2 separate files
            items.length.should.be.exactly(4);
        });
        it('should find classes', function () {
            var items = workspace.getByType('class');
            items.should.be.Array();
            // 3 classes blocks in 2 separate files
            items.length.should.be.exactly(3);
        });
        it('should find constants', function () {
            var items = workspace.getByType('constant');
            items.should.be.Array();
            // 2 namespace constants
            // + 1 class constant declarations blocks
            // in 2 separate files
            items.length.should.be.exactly(3);
        });
        it('should limit the results', function () {
            var items = workspace.getByType('namespace', 3);
            items.should.be.Array();
            // limiting the scan to 3 results
            items.length.should.be.exactly(3);
        });
    });

});
