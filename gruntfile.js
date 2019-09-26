const sass = require('node-sass');

module.exports = grunt => {

	require('load-grunt-tasks')(grunt);

	let port = grunt.option('port') || 8000;
	let root = grunt.option('root') || '.';

	if (!Array.isArray(root)) root = [root];

	// Project configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		meta: {
			banner:
				'/*!\n' +
				' * reveal.js <%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd, HH:MM") %>)\n' +
				' * http://revealjs.com\n' +
				' * MIT licensed\n' +
				' *\n' +
				' * Copyright (C) 2019 Hakim El Hattab, http://hakim.se\n' +
				' */'
		},

		qunit: {
			files: [ 'reveal-js-src/test/*.html' ]
		},

		uglify: {
			options: {
				banner: '<%= meta.banner %>\n',
				ie8: true
			},
			build: {
				src: 'reveal-js-src/js/reveal.js',
				dest: 'reveal-js-src/js/reveal.min.js'
			}
		},

		sass: {
			options: {
				implementation: sass,
				sourceMap: false
			},
			core: {
				src: 'reveal-js-src/css/reveal.scss',
				dest: 'reveal-js-src/css/reveal.css'
			},
			themes: {
				expand: true,
				cwd: 'reveal-js-src/css/theme/source',
				src: ['*.sass', '*.scss'],
				dest: 'reveal-js-src/css/theme',
				ext: '.css'
			}
		},

		autoprefixer: {
			core: {
				src: 'reveal-js-src/css/reveal.css'
			}
		},

		cssmin: {
			options: {
				compatibility: 'ie9'
			},
			compress: {
				src: 'reveal-js-src/css/reveal.css',
				dest: 'reveal-js-src/css/reveal.min.css'
			}
		},

		jshint: {
			options: {
				curly: false,
				eqeqeq: true,
				immed: true,
				esnext: true,
				latedef: 'nofunc',
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				eqnull: true,
				browser: true,
				expr: true,
				loopfunc: true,
				globals: {
					head: false,
					module: false,
					console: false,
					unescape: false,
					define: false,
					exports: false,
					require: false
				}
			},
			files: [ 'gruntfile.js', 'reveal-js-src/js/reveal.js' ]
		},

		connect: {
			server: {
				options: {
					port: port,
					base: root,
					livereload: true,
					open: true,
					useAvailablePort: true
				}
			}
		},

		zip: {
			bundle: {
				src: [
					'index.html',
					'reveal-js-src/css/**',
					'reveal-js-src/js/**',
					'reveal-js-src/lib/**',
					'images/**',
					'reveal-js-src/plugin/**',
					'**.md'
				],
				dest: 'reveal-js-presentation.zip'
			}
		},

		watch: {
			js: {
				files: [ 'gruntfile.js', 'reveal-js-src/js/reveal.js' ],
				tasks: 'js'
			},
			theme: {
				files: [
					'reveal-js-src/css/theme/source/*.sass',
					'reveal-js-src/css/theme/source/*.scss',
					'reveal-js-src/css/theme/template/*.sass',
					'reveal-js-src/css/theme/template/*.scss'
				],
				tasks: 'css-themes'
			},
			css: {
				files: [ 'reveal-js-src/css/reveal.scss' ],
				tasks: 'css-core'
			},
			test: {
				files: [ 'reveal-js-src/test/*.html' ],
				tasks: 'test'
			},
			html: {
				files: root.map(path => path + '/*.html')
			},
			markdown: {
				files: root.map(path => path + '/*.md')
			},
			options: {
				livereload: true
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');

	// Default task
	grunt.registerTask( 'default', [ 'css', 'js' ] );

	// JS task
	grunt.registerTask( 'js', [ 'jshint', 'uglify', 'qunit' ] );

	// Theme CSS
	grunt.registerTask( 'css-themes', [ 'sass:themes' ] );

	// Core framework CSS
	grunt.registerTask( 'css-core', [ 'sass:core', 'autoprefixer', 'cssmin' ] );

	// All CSS
	grunt.registerTask( 'css', [ 'sass', 'autoprefixer', 'cssmin' ] );

	// Package presentation to archive
	grunt.registerTask( 'package', [ 'default', 'zip' ] );

	// Serve presentation locally
	grunt.registerTask( 'serve', [ 'connect', 'watch' ] );

	// Run tests
	grunt.registerTask( 'test', [ 'jshint', 'qunit' ] );

};
