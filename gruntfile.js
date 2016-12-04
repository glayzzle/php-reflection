module.exports = function(grunt) {

    var fs = require('fs');
    var doc = {
        options: {
            destination: "docs/src",
            access: ['public', 'undefined'],
            format: "md",
            version: "<%= pkg.version %>",
            name: "<%= pkg.name %>",
            filename: "MISC.md",
            shallow: true
        }
    };
    var watch = {
        tests: {
            files: ['test/*.js'],
            tasks: ['shell:runTests']
        }
    };

    /**
     * scan files to generate documentation
     */
    fs.readdirSync('./src/').forEach(function(file) {
        if (file.substring(file.length - 3) === '.js') {
            var key = file.substring(0, file.length - 3);
            doc[key] = {
                files: [{src: ['src/' + file]}],
                options: {
                    filename: key.toUpperCase() + '.md'
                }
            }
            watch[key] = {
                files: ['src/' + file],
                tasks: ['documentation:' + key, 'shell:runTests']
            };
        }
    });

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        documentation: doc,
        watch: watch,
        shell: {
            runTests: {
                command: 'clear && echo "\\n\\nrun tests\\n\\n" && npm run test'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-documentation');
    grunt.loadNpmTasks('grunt-shell');

    // Default task(s).
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('doc', ['documentation']);
};