var gulp = require('gulp');
var gutil = require('gulp-util');
var compass = require('gulp-compass');
var uglify = require('gulp-uglify');

gulp.task('compass', function() {
  gulp.src('./sass/*.scss')
      .pipe(compass({
        config_file: './config.rb',
        css: 'css'
      }))
      .pipe(gulp.dest('dist'));
});

gulp.task('js', function() {
  gulp.src('./js/*.js')
      .pipe(uglify({outSourceMaps: true}))
      .pipe(gulp.dest('dist'));
});

gulp.task('default', ['compass', 'js']);
