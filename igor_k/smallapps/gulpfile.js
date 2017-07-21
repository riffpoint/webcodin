var gulp = require('gulp'),
	browserSync = require('browser-sync'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	cssnano = require('gulp-cssnano'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglifyjs'),
	notify = require('gulp-notify'),
	del = require('del'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant');

// files

var files = {
	sass: [
			'sass/**/*.scss'
		],
	libs: [
			'libs/jquery/dist/jquery.min.js',
			'libs/slick-carousel/slick/slick.min.js'
		],
	js: [
			'js/main.js'
		],
	html: [
			'./*.html'
		],
	images: ['images/**/*'],

};

// Output folders

var foldersOutput = {
	cssOutput: 'css/',
	jsOutput: 'js',
	images: 'public/images'
}

var buildFiles = {
	css: ['css/style.min.css'],
	fonts: ['fonts/**/*'],
	js: ['js/**/*'],
	html: ['./*.html']
}

// Build folders

var buildFolders = {
	css: 'public/css',
	fonts: 'public/fonts',
	js: 'public/js',
	html: 'public'
}

// Tasks

gulp.task('browser-sync', function(){
	browserSync({
		server: {
			baseDir: ''
		},
	    tunnel: true
	});
});

gulp.task('sass', function() {
	return gulp.src(files.sass)
			.pipe(sass().on('error', notify.onError({
				message: "<%= error.message %>",
	        	title  : "Sass Error!"
			})))
			.pipe(autoprefixer(['last 6 versions']))
			.pipe(cssnano())
			.pipe(rename({suffix: '.min'}))
			.pipe(gulp.dest(foldersOutput.cssOutput))
			.pipe(browserSync.reload({stream: true}));
});

gulp.task('js-libs', function() {
	return gulp.src(files.libs)
			.pipe(concat('libs-min.js'))
			.pipe(uglify())
			.pipe(gulp.dest(foldersOutput.jsOutput));
});

gulp.task('min-js', function() {
	return gulp.src(files.js)
			.pipe(uglify())
			.pipe(rename({suffix: '.min'}))
			.pipe(gulp.dest(foldersOutput.jsOutput));
});

gulp.task('watch', ['min-js', 'js-libs', 'sass', 'browser-sync'], function() {
	gulp.watch(files.sass, ['sass']);
	gulp.watch(files.js, ['min-js']);
	gulp.watch(files.html, browserSync.reload);
	gulp.watch(files.js, browserSync.reload);
});

gulp.task('default', ['watch']);

gulp.task('clear', function() {
	 return del.sync('public');
});

gulp.task('img', function() {
    return gulp.src(files.images)
        .pipe(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(foldersOutput.images));
});

gulp.task('build', ['clear', 'img', 'min-js', 'js-libs', 'sass'], function() {
	var buildCss = gulp.src(buildFiles.css)
    .pipe(gulp.dest(buildFolders.css));

    var buildFonts = gulp.src(buildFiles.fonts)
    .pipe(gulp.dest(buildFolders.fonts));

    var buildJs = gulp.src(buildFiles.js)
    .pipe(gulp.dest(buildFolders.js));

    var buildHtml = gulp.src(buildFiles.html)
    .pipe(gulp.dest(buildFolders.html));
});
