'use strict';

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var imagemin = require('gulp-imagemin');
var prefix = require('gulp-autoprefixer');
var stylus = require('gulp-stylus');
// stylus modules
var kouto = require('kouto-swiss');
// var rupture = require('rupture');
// var jeet = require('jeet');
// 
var rimraf = require('rimraf');
var csscomb = require('gulp-csscomb');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var cmq = require('gulp-combine-media-queries');
// var nmq = require('gulp-no-media-queries');
var postcss = require('gulp-postcss');
var unwrapAtMedia = require('postcss-unwrap-at-media');
var iemedia = require('iemedia-postcss');

var minifyCss = require('gulp-minify-css');
// var critical = require('critical').stream;
var jsmin = require('gulp-jsmin');
var jade = require('gulp-jade');
var svgfallback = require('gulp-svgfallback');



var config = {
  dist: 'dist/',
  src: 'src/'
};

gulp.task('clean', function (cb) {
  return rimraf(config.dist, cb);
});


gulp.task('styles', function () {
  return gulp.src(config.src + 'styles/style.styl')
    .pipe(plumber())
    .pipe(stylus({
      'include css': true,
      compress: false,
      use: [kouto()]
    }))
    // .pipe(prefix('last 4 version, > 1%, ie 8, ie 9'))
    .pipe(gulp.dest(config.dist + 'css'))
    .pipe(reload({
      stream: true
    }));

});

gulp.task('styles:build', function () {
  var avoid = [
        'max-width',
        'orientation',
        'handheld',
        'print',
        'aspect-ratio',
        'max-height',
        'resolution',
        'max-device-width',
        'max-device-height',
        'max-resolution'
      ];
  return gulp.src(config.src + 'styles/style.styl')
    .pipe(plumber())
    .pipe(stylus({
      'include css': true,
      use: [kouto()]
    }))
    .pipe(prefix('last 4 version, > 1%, ie 8, ie 9'))
    .pipe(cmq())
    .pipe(csscomb())
    .pipe(minifyCss({
      keepBreaks: false,
      advanced: false
    }))
    .pipe(rename({
      suffix: '.min',
      extname: '.css'
    }))
    .pipe(gulp.dest(config.dist + 'css'))
    .pipe(postcss([iemedia(avoid)]))
    .pipe(minifyCss({
      compatibility: 'ie8',
      advanced: false
    }))
    .pipe(rename({
      suffix: '_ie',
      extname: '.css'
    }))
    .pipe(gulp.dest(config.dist + 'css'));
});

gulp.task('images', function () {
  return gulp.src(config.src + 'images/**/*.*')
    .pipe(imagemin({
      progressive: true,
      optimizationLevel: 4,
      multipass: true
    }))
    .pipe(gulp.dest(config.dist + 'images'));
});

gulp.task('svg', function () {
  return gulp.src(config.src + 'images/icons/*.svg', {
      base: 'src/icons'
    })
    .pipe(rename({
      prefix: 'icon_'
    }))
    .pipe(svgfallback())
    .pipe(gulp.dest(dist + 'images/icons/'));
});


gulp.task('html', function () {
  return gulp.src(config.src + 'markup/' + '*.jade')
    .pipe(plumber())
    .pipe(jade({
      pretty: true,
      cache: false
    }))
    .pipe(gulp.dest(config.dist))
    .pipe(reload({
      stream: true
    }));
});

gulp.task('js', function () {
  return gulp.src(config.src + 'js/*.js')
    .pipe(plumber())
    .pipe(jsmin())
    .pipe(rename({
      suffix: '.min',
      extname: '.js'
    }))
    .pipe(gulp.dest(config.dist + 'js/'))
    .pipe(reload({
      stream: true
    }));
});

gulp.task('fonts', function () {
  return gulp.src(config.src + 'fonts/*.*')
    .pipe(plumber())
    .pipe(gulp.dest(config.dist + 'fonts/'))
    .pipe(reload({
      stream: true
    }));
});

gulp.task('files', function () {
  return gulp.src(config.src + 'docs/*.*')
    .pipe(plumber())
    .pipe(gulp.dest(config.dist + 'docs/'))
    .pipe(reload({
      stream: true
    }));
});

gulp.task('server', function () {
  browserSync({
    server: {
      baseDir: config.dist
    },
    logLevel: 'info',
    open: false,
    // ghostMode: {
    //     clicks: true,
    //     location: true,
    //     forms: true,
    //     scroll: false
    // } 
    ghostMode: false,
    notify: false,
    injectChanges: true,
    codeSync: true,
    reloadDelay: 500
  });

});


gulp.task('build', function (callback) {
  runSequence(['clean'], ['images'], ['styles:build', 'html', 'js', 'fonts', 'files'], callback);
});

gulp.task('default', function (callback) {
  runSequence(['images'], ['styles', 'html', 'js', 'fonts', 'files', 'server'], callback);
  gulp.watch(config.src + 'styles/**/*.styl', ['styles']);
  gulp.watch(config.src + 'styles/**/*.css', ['styles']);
  gulp.watch(config.src + 'markup/' + '*.jade', ['html']);
  gulp.watch(config.src + 'js/*.js', ['js']);
});
