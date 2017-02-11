var should = require("should");

process.on('unhandledRejection', function(e) {
    if (e.stack) {
        console.error(e.stack);
    } else {
        console.error(e);
    }
});

describe('Repository class', function() {

    var repository = require('../src/repository');
    var path = __dirname + '/workspaces/samples';
    var workspace = null;

    describe('#ctor', function() {
        workspace = new repository(path, {
          forkWorker: false,
          exclude: ['bin']
        });
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
        it('should scan directory', function (done, reject) {
            workspace.scan().then(function() {
                workspace.files.should.have.property('test.php');
                workspace.files.should.have.property('friend.php');
                workspace.files.should.have.property('sub/empty.php');
                workspace.files.should.not.have.property('bin/nok.php');
                done();
            }).catch(function(e) {
                console.error(e.stack);
                reject(e);
            });
        });
    });

    describe('#sync', function() {
        var filename = 'foo.php';
        var states = [
            [
                '<?php',
                'namespace {',
                '\t$a = true;/*[*/', // <-- cursor here
                '}'
            ].join('\n'),
            [
                '<?php',
                'namespace {',
                '\t$a = true;',
                '/*[*/\tfunction fooSync(/*]*/', // <-- cursor here
                '}'
            ].join('\n'),
            [
                '<?php',
                'namespace {',
                '\t$a = true;',
                '/*[*/\tfunction fooSync($a) {',
                '\t}/*]*/',
                '}'
            ].join('\n'),
            [
                '<?php',
                'namespace {',
                '\t$a = true;',
                '\tfunction fooSync($a/*[*/, $b/*]*/) {',
                '\t}',
                '}'
            ].join('\n'),
        ];

        function code(text) {
            return text.replace(/\/\*\[\*\//g, '').replace(/\/\*\]\*\//g, '');
        }

        function cursor(text) {
            var start = text.indexOf('/*[*/');
            var end = text.indexOf('/*]*/');
            if (start === -1) start = 0;
            if (end === -1) end = start + 5;
            return [start, end - 5];
        }

        it('create a new virtual entry', function () {
            workspace.sync(
                filename, code(states[0]), cursor(states[0])
            ).should.be.exactly(true);
        });

        it('adding a parse error', function () {
            (function() {
                workspace.sync(
                    filename, code(states[1]), cursor(states[1])
                );
            }).should.throw();
        });

        return; // @todo
        it('create a fooSync function', function () {
            workspace.options.debug = true;
            workspace.sync(
                filename, code(states[2]), cursor(states[2])
            ).should.be.exactly(true);
            var fn = workspace.getFirstByName('function', 'fooSync');
            console.log(fn);
            fn.name.should.be.exactly('fooSync');
            fn.args.length.should.be.exactly(1);
            fn.args[0].name.should.be.exactly('a');
        });

        it('add an argument', function () {
            workspace.options.debug = true;
            workspace.sync(
                filename, code(states[2]), cursor(states[2])
            ).should.be.exactly(true);
            var fn = workspace.getByName('function', 'fooSync');
            fn.name.should.be.exactly('fooSync');
            fn.args.length.should.be.exactly(2);
            fn.args[0].name.should.be.exactly('a');
            fn.args[1].name.should.be.exactly('b');
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
            // 5 namespace block in 3 separate files
            // items.length.should.be.exactly(5);
        });
        it('should find classes', function () {
            var items = workspace.getByType('class');
            items.should.be.Array();
            // 3 classes blocks in 2 separate files
            // items.length.should.be.exactly(3);
        });
        it('should find constants', function () {
            var items = workspace.getByType('constant');
            items.should.be.Array();
            // 2 namespace constants
            // + 1 class constant declarations blocks
            // in 2 separate files
            // items.length.should.be.exactly(3);
        });
        it('should limit the results', function () {
            var items = workspace.getByType('namespace', 3);
            items.should.be.Array();
            // limiting the scan to 3 results
            // items.length.should.be.exactly(3);
        });
    });

});
