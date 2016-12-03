module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    documentation: {
        default: {
            files: [{
                "expand": true,
                "cwd": "src",
                "src": ["**/*.js"]
            }],
            options: {
                destination: "docs",
                format: "md",
                version: "<%= pkg.version %>"
            }
        },
    }
  });
  grunt.loadNpmTasks('grunt-documentation');
  
  // Default task(s).
  grunt.registerTask('default', ['documentation']);
};