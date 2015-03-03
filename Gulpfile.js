'use strict';
var gulp = require('gulp');
// var svgmin = require('gulp-svgmin');
var imgmin = require('gulp-imagemin');
// var hb = require('gulp-hb');
var less = require('gulp-less');
var pleeease = require('gulp-pleeease');
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var runSequence = require('run-sequence');
var stylus = require('gulp-stylus');
var flatten = require('gulp-flatten');
var svgconvert = require('gulp-svg2png');
var uglify = require('gulp-uglify');


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
  },
  styles: {
    src: bpath.src + 'stylus/',
    dest: bpath.dest + 'css/'
  },
  html: {
    src: bpath.src + 'html/',
    dest: bpath.dest
  },
  fonts: {
    src: bpath.src + 'fonts',
    dest: bpath.dest + 'fonts/'
  }

};

var pathImagesFormat = {
  jpeg: path.images.src + 'jpeg',
  png: path.images.src + 'png',
  svg: path.images.src + 'svg'
};


/*===================Plug-In===================== */


// gulp.task('svgmin', function () {
//   return gulp.src(pathImagesFormat.svg)
//     .pipe(plumber())
//     .pipe(svgmin())
//     .pipe(gulp.dest(bpath.dest + 'images/'));
// });

gulp.task('imgmin', ['svgconvert'],
  function () {
    return gulp.src(path.images.src + '/**/*.{jpg,jpeg,png,gif}')
      .pipe(plumber())
      .pipe(imgmin({
        progressive: true,
        interlaced: true,
        optimizationLevel: 3
      }))
      .pipe(rename({
        prefix: '2014_Report_'
      }))
      .pipe(flatten())
      .pipe(gulp.dest(path.images.dest));
  });


gulp.task('svgconvert', function () {
  console.log(pathImagesFormat.svg + '/*.svg');
  return gulp.src(pathImagesFormat.svg + '/*.svg')
    .pipe(plumber())
    .pipe(svgconvert())
    .pipe(gulp.dest(pathImagesFormat.png));
});

// gulp.task('hbs', function () {
//   return gulp
//     .src(path.hbs.src + '/*')
//     .pipe(plumber())
//     .pipe(hb())
//     .pipe(gulp.dest(bpath.dest));
// });

gulp.task('move-html', function () {
  return gulp.src(path.html.src + '/**/*.html')
    .pipe(plumber())
    .pipe(gulp.dest(path.html.dest))
    .pipe(reload({
      stream: true
    }));
});

gulp.task('move-fonts', function () {
  return gulp.src(path.fonts.src + '/**/*.*')
    .pipe(plumber())
    .pipe(gulp.dest(path.fonts.dest));
});

gulp.task('move-js', function () {
  return gulp.src(path.scripts.src + '/**/*.*')
    .pipe(plumber())
    .pipe(uglify({
      compress: true
    }))
    .pipe(rename({
      suffix: '.min',
      extname: '.js'
    }))
    .pipe(gulp.dest(path.scripts.dest));
});

gulp.task('less', function () {
  return gulp
    .src(path.styles.src + '**/*.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(pleeease())
    // .pipe(rename({
    //   suffix: '.min',
    //   extname: '.css'
    // }))
    .pipe(gulp.dest(bpath.dest + '/css'));
});


gulp.task('stylus', function () {
  return gulp
    .src(path.styles.src + '/*.styl')
    .pipe(plumber())
    .pipe(stylus({
      "include css": true
    }))
    .pipe(pleeease({
      "autoprefixer": {
        "browsers": ["last 4 versions", "ie 8"]
      },
      "filters": true,
      "rem": true,
      "pseudoElements": true,
      "opacity": true,
      "import": true,
      "minifier": true,
      "mqpacker": true
    }))
    .pipe(gulp.dest(bpath.dest + '/css/min'))
    .pipe(reload({
      stream: true
    }));
});

gulp.task('please', function () {
  return gulp
    .src(path.styles.dest + '/*.css')
    .pipe(plumber())
    .pipe(pleeease({
      "autoprefixer": {
        "browsers": ["last 4 versions", "ie 8"]
      },
      "filters": true,
      "rem": true,
      "pseudoElements": true,
      "opacity": true,
      "import": true,
      "minifier": true,
      "mqpacker": true
    }))
    .pipe(gulp.dest(bpath.dest + '/css/min/'));
});

gulp.task('browser-sync', function () {
  browserSync({
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


gulp.task('server', ['imgmin', 'move-js', 'move-fonts', 'move-html', 'stylus', 'browser-sync'], function () {
  gulp.watch(path.styles.src + '/**/*.styl', ['stylus']);
  gulp.watch(path.html.src + "/*.html", ['move-html']);
});



// gulp.task('server-nob', ['browser-sync']);
