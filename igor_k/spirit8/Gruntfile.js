module.exports = function(grunt) {

    // 1. Всё конфигурирование тут
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            dist: {
		        src: [
		            'libs/jquery/dist/jquery.min.js',
		            'libs/slick-carousel/slick/slick.min.js'
		        ],
		        dest: 'js/libs.js'
		    }
        },

        uglify: {
		    my_target: {
				files: {
					'js/libs.min.js': ['js/libs.js'],
					'js/main.min.js': ['js/main.js']
				}
			}
        },

        imagemin: {
			dynamic: { 
				files: [{
					expand: true,
					cwd: 'images/',
					src: ['**/*.{png,jpg,gif}'],
					dest: 'public/images'
				}]
			}
		},

		watch: {
			scripts: {
		        files: ['js/*.js', 'libs/**/*.js'],
		        tasks: ['concat', 'uglify'],
		        options: {
		            spawn: false,
		        },
		    },

		    css: {
			    files: ['sass/**/*.scss'],
			    tasks: ['sass', 'autoprefixer'],
			    options: {
			        spawn: false,
			    }
			},
		},

		sass: {
		    dist: {
		        options: {
		            style: 'compressed'
		        },
		        files: {
		            'css/style.min.css': 'sass/style.scss'
		        }
		    } 
		},

		autoprefixer: {
            dist: {
                files: {
                    'css/style.min.css': 'css/style.min.css'
                }
            }
        },

        browserSync: {
            dev: {
                bsFiles: {
                    src : [
                        'css/*.css',
                        './*.html',
                        'js/*.js'
                    ]
                },
                options: {
                    watchTask: true,
                    server: './',
                    tunnel: true
                }
            }
        }
    });

    // 3. Здесь мы сообщаем Grunt, что мы планируем использовать этот плагин:
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-browser-sync');
	grunt.loadNpmTasks('grunt-autoprefixer');
    // 4. Мы сообщаем Grunt, что нужно делать, когда мы введём "grunt" в терминале.
    grunt.registerTask('default', ['concat', 'uglify', 'imagemin', 'sass', 'autoprefixer', 'browserSync', 'watch']);

};