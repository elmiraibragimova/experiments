var gulp           = require('gulp'),
    sass           = require('gulp-sass'),
    autoprefixer   = require('gulp-autoprefixer'),
    sourcemaps     = require('gulp-sourcemaps'),
    gulpIf         = require('gulp-if'),
    browserSync    = require('browser-sync').create();


var isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';


gulp.task('styles', function() {
  return gulp.src('app/assets/styles/main.scss')
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulpIf(isDevelopment, sourcemaps.write()))
    .pipe(gulp.dest('build/assets/styles'));
});
