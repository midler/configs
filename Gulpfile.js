var gulp = require("gulp");
var plumber = require("gulp-plumber");
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var imagemin = require('gulp-imagemin');
var prefix = require('gulp-autoprefixer');
var stylus = require('gulp-stylus');
var rimraf = require('rimraf');
var csscomb = require('gulp-csscomb');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var cmq = require('gulp-combine-media-queries');
var nmq = require('gulp-no-media-queries');
var minifyCss = require('gulp-minify-css');


gulp.task('clean', function (cb) {
  return rimraf('./dist', cb);
});


gulp.task('styles', function () {
  return gulp.src('src/stylus/**/*.styl')
    .pipe(plumber())
    .pipe(stylus({
      "include css": true
    }))
    .pipe(prefix('last 4 version, > 1%, ie 8, ie 9'))
    .pipe(cmq({
      log: true
    }))
    .pipe(csscomb())
    .pipe(gulp.dest('dist/css'))
    .pipe(nmq())
    .pipe(rename({
      suffix: '.ie',
      extname: '.css'
    }))
    .pipe(gulp.dest('dist/css/ie/'))
    .pipe(reload({
      stream: true
    }));
});

gulp.task('styles:build', function () {
  return gulp.src('src/stylus/**/*.styl')
    .pipe(plumber())
    .pipe(stylus({
      "include css": true
    }))
    .pipe(prefix('last 4 version, > 1%, ie 8, ie 9'))
    .pipe(cmq())
    .pipe(csscomb())
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist/css'))
    .pipe(nmq())
    .pipe(rename({
      suffix: '.ie',
      extname: '.css'
    }))
    .pipe(gulp.dest('dist/css/ie/'))
    .pipe(reload({
      stream: true
    }));
});

gulp.task('images', function () {
  return gulp.src('src/images/*.*')
    .pipe(imagemin({
      progressive: true,
      optimizationLevel: 4,
      multipass: true
    }))
    .pipe(rename({
      prefix: '2015-04-endpoint_'
    }))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('html', function () {
  return gulp.src('src/*.html')
    .pipe(gulp.dest('dist/'))
    .pipe(reload({
      stream: true
    }));
});

gulp.task('server', function () {
  browserSync({
    server: {
      baseDir: 'dist/'
    },
    logLevel: "info",
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
  runSequence(['images'], ['styles:build'], callback);
});

gulp.task('default', function (callback) {
  runSequence('clean', ['images'], ['styles', 'html', 'server'], callback);
  gulp.watch('src/stylus/**/*.styl', ['styles']);
  gulp.watch('src/*.html', ['html']);
});
