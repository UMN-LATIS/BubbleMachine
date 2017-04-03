'use strict';

import gulp from "gulp";
import browserify from "browserify";
import babelify from "babelify";
import source from "vinyl-source-stream";
import concat from "gulp-concat";
import uglify from 'gulp-uglify';
import sourcemaps from 'gulp-sourcemaps';

// "Build" task:
// Takes all .jsx files stored in src/js/ that are written in React + ES6 and
//translates these scripts into ES5 that can be interpreted by web browsers,
// then pipes them into a single file called "build.js" and saves the result to dist/js
gulp.task("build", () => {
    return browserify({
        entries: 'src/js/App.js',
        extensions: ['.js'],
        debug: true
    }).transform("babelify")
        .bundle()
        .pipe(source("build.js"))
        .pipe(gulp.dest("dist/js"))
});

// "Minify" task:
// Takes all third-party JavaScript libraries saved as .js files in src/js/lib,
// minifies them, compiles them into a single file called "libs.min.js",
// and saves the result to dist/js
gulp.task("minify", () => {
  gulp.src("src/js/lib/*.js")
    .pipe(concat("libs.min.js"))
    .pipe(gulp.dest("dist/js"));
})

// "Copy-HTML" & "Copy-CSS" tasks:
// Copies index.html and styles.css files "as is" into the /dist and dist/css folder
gulp.task('copy-html', () => {
  gulp.src("src/index.html")
    .pipe(gulp.dest("dist"));
});

gulp.task('copy-css', () => {
  gulp.src("src/css/styles.css")
    .pipe(gulp.dest("dist/css"));
});


// "Watch" task:
// Whenever the developer makes a change to files in /src, run the related
// "build", "copy-html", or "copy-css" task to update the state of /dist so the
// changes can be viewed in the browser
gulp.task('watch', () => {
    gulp.watch('src/js/*.js', ['build']);
    gulp.watch('src/*.html', ['copy-html']);
    gulp.watch('src/css/*.css', ['copy-css']);
});

gulp.task('default', ['build', 'minify', 'copy-html', 'copy-css', 'watch']);
