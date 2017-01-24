var gulp           = require('gulp'),
    sass           = require('gulp-sass'),
    autoprefixer   = require('gulp-autoprefixer'),
    sourcemaps     = require('gulp-sourcemaps'),
    gulpIf         = require('gulp-if'),
    watch          = require('gulp-watch'),
    stylelint      = require('gulp-stylelint'),
    browserSync    = require('browser-sync').create();


var isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';


gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: "build"
    }
  });
});


gulp.task('styles', function() {
  return gulp.src('app/assets/styles/main.scss')
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(stylelint({
      reporters: [{
        formatter: 'string',
        console: true
      }]
    }))
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulpIf(isDevelopment, sourcemaps.write()))
    .pipe(gulp.dest('build/assets/styles'))
    .pipe(browserSync.stream());;
});


gulp.task('html', function() {
  return gulp.src('app/**/*.html')
    .pipe(gulp.dest('build'))
    .pipe(browserSync.stream());;
});


gulp.task('watch', function() {
  watch('app/**/*.html', function(event, cb) {
    gulp.start('html');
  });

  watch('app/**/*.scss', function(event, cb) {
    gulp.start('styles');
  });
});


gulp.task('default', ['serve', 'html', 'styles', 'watch']);
