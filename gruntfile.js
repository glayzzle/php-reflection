module.exports = function(grunt) {

    var fs = require('fs');
    var doc = {
        options: {
            destination: "docs",
            access: ['public', 'undefined'],
            format: "md",
            version: "<%= pkg.version %>",
            name: "<%= pkg.name %>",
            filename: "MISC.md",
            shallow: true
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
        }
    });

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        documentation: doc
    });
    grunt.loadNpmTasks('grunt-documentation');

    // Default task(s).
    grunt.registerTask('default', ['documentation:*']);
};