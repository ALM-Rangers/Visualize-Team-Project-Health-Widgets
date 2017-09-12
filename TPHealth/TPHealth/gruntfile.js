/// <binding BeforeBuild='exec:update, copy:main' AfterBuild='exec:package' ProjectOpened='exec:update, copy:main' />
/*
This file in the main entry point for defining grunt tasks and using grunt plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkID=513275&clcid=0x409
*/
module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        settings: grunt.file.readJSON("settings.tfx.json"),
        typings: {
            install: {}
        },
        exec: {
            package: {
                command: "tfx extension create --manifest-globs <%= settings.package.manifestGlobs %>",
                stdout: true,
                stderr: true
            },
            update: {
                command: "npm up --save-dev",
                stdout: true,
                stderr: true
            },
		    publish: {
                command: "tfx extension publish --manifest-globs <%= settings.package.manifestGlobs %> --token <%= settings.publish.token %>",
                stdout: true,
                stderr: true
            }
        },
        copy: {
            main: {
                files: [
                  // includes files within path
                  { expand: true, flatten: true, src: ['node_modules/vss-web-extension-sdk/lib/VSS.SDK.js'], dest: 'scripts/', filter: 'isFile' }
                ]
            }
        },
        jasmine: {
            src: ["scripts/**/*.js", "sdk/scripts/*.js"],
            specs: "test/**/*[sS]pec.js",
            helpers: "test/helpers/*.js"
        }
    });

    grunt.loadNpmTasks("grunt-exec");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-jasmine");
    grunt.loadNpmTasks('grunt-typings');

};