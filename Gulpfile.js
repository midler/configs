var gulp = require('gulp');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var csscomb = require('gulp-csscomb');
var debug = require('gulp-debug');
var browserSync = require('browser-sync');
var plumber = require('gulp-plumber');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
// var postcss    = require('gulp-postcss');
// var sourcemaps = require('gulp-sourcemaps');
var pixrem = require('gulp-pixrem');
var reload = browserSync.reload;
var cmq = require('gulp-combine-media-queries');
var uncss = require('gulp-uncss');
var runSequence = require('run-sequence');
var styleguide = require("sc5-styleguide");


gulp.task('uncss', function() {
    return gulp.src('./css/style*.css')
        .pipe(uncss({
            html: ['./index.html']
        }))
        .pipe(rename({
            suffix: '.uncss'
        }))
        .pipe(gulp.dest('css'));
});



gulp.task('less', function() {
    gulp.src('./less/style.less')
        // .pipe(debug({
        //     verbose: true
        // }))
        .pipe(plumber())
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 4 versions', '> 1%', 'Firefox < 4', 'ie 8'],
            cascade: false
        }))
        .pipe(pixrem())
        .pipe(gulp.dest('css'))
        .pipe(reload({
            stream: true
        }));

});


gulp.task('cmq', function() {
    gulp.src('./css/*.css')
        .pipe(plumber())
        .pipe(cmq({
            log: true
        }))
        .pipe(rename({
            suffix: '.cmq'
        }))
        .pipe(gulp.dest('css'));
});


gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('build/**', ['less']);
});

gulp.task('csscomb', function() {
    return gulp.src('./css/*.css')
        .pipe(csscomb())
        .pipe(gulp.dest('css'));
});

gulp.task('cssmin', function() {
    gulp.src([
            './css/*.css',
            '!./css/*.min.css'
        ])
        .pipe(cssmin({
            keepBreaks: true
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('css'));
});

gulp.task('browser-sync', function() {
    browserSync.init(null, {
        server: {

           
            baseDir: "./",
            index: "main.html"
        },
         ui: {
                port: 9090
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





gulp.task('build', function(callback) {
    runSequence('less', ['csscomb'], ['cssmin'], callback);
});

gulp.task('default', ['less', 'browser-sync'], function() {
    gulp.watch("less/**/*.less", ['less']);
});

gulp.task('just-server', ['browser-sync']);
