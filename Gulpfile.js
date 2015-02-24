'use strict';

var gulp = require('gulp');
var svgmin = require('gulp-svgmin');
var imgmin = require('gulp-imagemin');
var hb = require('gulp-hb');
var less = require('gulp-less');
var pleeease = require('gulp-pleeease');
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');




/*===================Paths===================== */
//base path
var bpath = {
  src: './src/',
  dest: './dest/'
};

var path = {
  images: {
    src: bpath.src + 'images/',
    dest: bpath.dest + 'images/',
    srcopt: bpath.src + 'images/opt/'
  },
  scripts: {
    src: bpath.src + 'js/',
    dest: bpath.dest + 'js/',
    destm: bpath.dest + 'js/min/'
  },
  styles: {
    src: bpath.src + 'less/',
    dest: bpath.dest + 'css/'
  },
  hbs: {
    src: bpath.src + 'hbs',
    dest: bpath.dest

  }

};

var pathImagesFormat = {
  jpeg: path.images.src + 'jpeg',
  png: path.images.src + 'png',
  svg: path.images.src + 'svg'
};


/*===================Plug-In===================== */


gulp.task('svgmin', function () {
  return gulp.src(pathImagesFormat.svg)
    .pipe(plumber())
    .pipe(svgmin())
    .pipe(gulp.dest(bpath.dest + 'images/'));
});

gulp.task('imgmin', function () {
  return gulp.src(path.images.src)
    .pipe(plumber())
    .pipe(imgmin)
    .pipe(gulp.dest(path.images.srcopt));
});




gulp.task('hbs', function () {
  return gulp
    .src(path.hbs.src + '/*')
    .pipe(plumber())
    .pipe(hb())
    .pipe(gulp.dest(bpath.dest));
});


gulp.task('less', function () {
  return gulp
    .src(path.styles.src + '**/*.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(pleeease())
    .pipe(rename({
      suffix: '.min',
      extname: '.css'
    }))
    .pipe(gulp.dest(bpath.dest + '/css'));
});



gulp.task('browser-sync', function () {
  browserSync.init(null, {
    server: {
      baseDir: bpath.dest
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
    reloadDelay: 500
  });
});



/* ===================== Main Tasks ========================== */

gulp.task('default', function () {
  console.log('Mida\'s building system');
});


gulp.task('server', ['less', 'browser-sync'], function () {
  gulp.watch("./input/less/**/*.less", ['less']);
});


gulp.task('server -nob', 'server --no-build', ['browser-sync']);
