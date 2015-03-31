var config = require('./src/util/conf-loader').load();

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jasmine_node: {
            coverage: {
                report: ['cobertura', 'html'],
                savePath: config.output.coverage,
                excludes: ['test/spec/**', 'test/util/**']
            },
            options: {
                forceExit: true,
                match: '.',
                specNameMatcher: 'spec',
                extensions: 'js',
                showColors: true,
                includeStackTrace: true,
                jUnit: {
                    report: true,
                    savePath : config.output.test,
                    useDotNotation: true,
                    consolidate: true
                }
            },
            all: ['test/spec/service/']
        }
    });

    grunt.loadNpmTasks('grunt-npm-install');
    grunt.loadNpmTasks('grunt-jasmine-node-coverage');

    grunt.registerTask('test', ['jasmine_node']);
    grunt.registerTask('default', ['npm-install', 'jasmine_node']);
};