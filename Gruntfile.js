module.exports = function(grunt){

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		jasmine:{
			unit:{
				src: [
					"bower_components/angular/angular.js", 
					"bower_components/angular-mocks/angular-mocks.js", 
					"bower_components/js-xlsx/dist/xlsx.full.min.js",
					"module.js", 
					"angular-xlsx.js"
				],
				options:{
					specs: "test/*.js",
					//vendor: ""
				}
			}
		},
		jshint:{
			all:["angular-xlsx.js", "test/*.js"]
		},
		watch: {
			scripts:{
				files: ["angular-xlsx.js", "test/*.js"],
				tasks: ["jshint", "jasmine"]
			}
		},
		uglify:{
			options:{

			},
			dist: {
				files: {
					"dist/angular-xlsx.min.js": ["angular-xlsx.js"]
				}
			}
		},
		bower:{
			install:{
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-jasmine");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks('grunt-bower-task');

	grunt.registerTask("default", ["bower:install", /*"concat",*/ "uglify"]);
	grunt.registerTask("test", ["build", "jasmine"])
};