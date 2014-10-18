var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshing-stylish');

gulp.task('jshint', function() {
    gulp.src('src/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter('fail'));
});

gulp.task('default', ['jshint']);