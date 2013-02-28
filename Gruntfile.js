module.exports = function(grunt) {

     var headerComment = "/*! <%= pkg.name %> v<%= pkg.version %> (<%= grunt.template.today() %>)\n" +
                " *  ---------------------------------------------\n" +
                " *  <%= pkg.description %>\n" +
                " *  <%= pkg.homepage %>\n" +

                " *  Licensed under the <%= pkg.license %> license\n" +
                " *  Copyright 2013 <%= pkg.author.name %>\n" +
                " */\n";

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        qunit: {
            files: ["test/index.html", "test/index-amd.html"]
        },
        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },
            files: ["<%= pkg.name %>.js", "test/test.js", "test/test-amd.js"]
        },
        csslint: {
            base: {
                src: "<%= pkg.name %>.css",
                rules: {
                    "known-properties": false
                }
            }
        },
        uglify: {
            options: {
                banner: headerComment
            },
            base: {
                files: {
                    "<%= pkg.name %>.min.js" : ["<%= pkg.name %>.js"]
                }
            }
        },
        "qunit-cov": {
            test:
            {
                minimum: 0.75,
                srcDir: "src",
                depDirs: ["test"],
                outDir: "jscoverage",
                testFiles: ["test/index.html"]
            }
        },
        concat: {
            options: {
                banner: headerComment + "\n"
            },
            js: {
                src: ["src/<%= pkg.name %>.js"],
                dest: "<%= pkg.name %>.js"
            }
        }
    });



    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-qunit");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-css");
    grunt.loadNpmTasks("grunt-qunit-cov");
    grunt.loadNpmTasks("grunt-bump");
    //grunt.loadNpmTasks("grunt-replace");
    grunt.loadNpmTasks("grunt-contrib-concat");

    // TO RUN BEFORE COMMIT
    // ====================
    grunt.registerTask("build", ["concat", "jshint", "csslint", "uglify"]);


    // TO RUN JUST BEFORE RELEASING A NEW VERSION
    // ==========================================

    // Task for patch version release
    grunt.registerTask("r", ["concat", "qunit", "qunit-cov", "jshint", "csslint", "bump", "uglify"]);

    // Task for minor version release
    grunt.registerTask("rmin", ["concat", "qunit", "qunit-cov", "jshint", "csslint", "bump:minor", "uglify"]);

    // Task for major version release
    grunt.registerTask("rmaj", ["concat", "qunit", "qunit-cov", "jshint", "csslint", "bump:major", "uglify"]);

    // FOR TRAVIS
    // ==========
    grunt.registerTask("travis", ["qunit", "jshint", "csslint", "qunit-cov"]);
};