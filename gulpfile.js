// Dependencies
var gulp    = require('gulp');
var plugins = require('gulp-load-plugins')();
var rimraf  = require('rimraf');

// Default task
gulp.task('default', ['compress']);

// JSHint task
gulp.task('lint', function() {
  gulp.src('./src/*.js')
  .pipe(plugins.jshint())
  .pipe(plugins.jshint.reporter('default'));
});

// Compress JS
gulp.task('compress', function() {
  return gulp.src(['./src/timeline.js'])
    .pipe(plugins.uglify('timeline.min.js'))
    .pipe(gulp.dest('./min/'))
});

// Clean up build directory
gulp.task('clean', function (cb) {
  rimraf('./min', cb);
});