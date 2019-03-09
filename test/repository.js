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
            workspace.db.should.be.Object();
            workspace.options.should.be.Object();
            workspace.directory.should.be.exactly(path);
            workspace.options.forkWorker.should.be.exactly(false);
            workspace.options.exclude.length.should.be.exactly(1);
            workspace.options.exclude[0].should.be.exactly('bin');
        });
    });

    describe('#parse', function() {
        it('should read test.php', function (done) {
            workspace.parse('test.php').then(function(file) {
                file.getName().should.be.exactly('test.php');
                done();
            }, done);
        });

        it('should read namespace of SimpleInterface.php', function (done) {
            workspace.parse('src/SimpleInterface.php').then(function(file) {
                var namespace = file.getByType('namespace');
                namespace.length.should.be.exactly(1);

                namespace = namespace.shift();
                namespace.name.should.be.exactly('\\');

                done();
            }).catch(function(e) {
                done(e);
            });
        });
    });

    describe('#scan', function() {
        it('should scan directory', function (done, reject) {
            workspace.scan().then(function() {
                workspace.hasFile('test.php').should.be.exactly(true);
                workspace.hasFile('friend.php').should.be.exactly(true);
                workspace.hasFile('sub/empty.php').should.be.exactly(true);
                workspace.hasFile('bin/nok.php').should.be.exactly(false);
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

        it('create a new virtual entry', function (done, reject) {
            workspace.sync(
                filename, code(states[0]), cursor(states[0])
            ).then(function() {
                done();
            }, reject);
        });

        it('adding a parse error', function (done, reject) {
            workspace.sync(
                filename, code(states[1]), cursor(states[1])
            ).then(reject, function() {
                done();
            });
        });

        it('create a fooSync function', function (done, reject) {
            workspace.sync(
                filename, code(states[2]), cursor(states[2])
            ).then(function() {
                var fn = workspace.getFirstByName('function', '\\fooSync');
                fn.name.should.be.exactly('fooSync');
                var args = fn.getArguments();
                args.length.should.be.exactly(1);
                args[0].name.should.be.exactly('a');
                done();
            }, reject);
        });

        it('add an argument', function (done, reject) {
            workspace.sync(
                filename, code(states[3]), cursor(states[3])
            ).then(function() {
                var fn = workspace.getFirstByName('function', '\\fooSync');
                fn.name.should.be.exactly('fooSync');
                var args = fn.getArguments();
                args.length.should.be.exactly(2);
                args[0].name.should.be.exactly('a');
                args[1].name.should.be.exactly('b');
                done();
            }, reject);
        });
    });

    describe('#serialise', function() {
        var fs = require('fs');
        var filename = __dirname + '/cache/sample.json';
        it('should get', function () {
            var cache = workspace.db.export();
            cache.should.be.Object();
            // saves the file to cache
            fs.writeFileSync(filename, JSON.stringify(cache, null, 2));
        });
        it('should set', function () {
            var cache = JSON.stringify(
                fs.readFileSync(filename, 'utf8')
            );
            workspace.db.import(cache);
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
