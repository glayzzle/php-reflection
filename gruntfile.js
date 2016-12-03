module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        documentation: {
            options: {
                destination: "docs",
                access: ['public', 'undefined'],
                format: "md",
                version: "<%= pkg.version %>",
                name: "<%= pkg.name %>",
                filename: "MISC.md",
                shallow: true
            },
            repository: {
                files: [{src: ['src/repository.js']}],
                options: {
                    filename: 'REPOSITORY.md'
                }
            },
            node: {
                files: [{src: ['src/node.js']}],
                options: {
                    filename: 'NODE.md'
                }
            },
            block: {
                files: [{src: ['src/block.js']}],
                options: {
                    filename: 'BLOCK.md'
                }
            },
            file: {
                files: [{src: ['src/file.js']}],
                options: {
                    filename: 'FILE.md'
                }
            },
            namespace: {
                files: [{src: ['src/namespace.js']}],
                options: {
                    filename: 'NAMESPACE.md'
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-documentation');

    // Default task(s).
    grunt.registerTask('default', ['documentation:*']);
};