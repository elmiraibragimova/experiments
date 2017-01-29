var gulp         = require('gulp'),
  sass           = require('gulp-sass'),
  autoprefixer   = require('gulp-autoprefixer'),
  sourcemaps     = require('gulp-sourcemaps'),
  gulpIf         = require('gulp-if'),
  watch          = require('gulp-watch'),
  stylelint      = require('gulp-stylelint'),
  browserSync    = require('browser-sync').create(),
  webpackStream  = require('webpack-stream'),
  path           = require('path');


var isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';


gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: './build'
    }
  });
});


gulp.task('styles', function() {
  return gulp.src('app/assets/styles/main.scss')
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(stylelint({
      failAfterError: false,
      reporters: [{
        formatter: 'string',
        console: true
      }]
    }))
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulpIf(isDevelopment, sourcemaps.write()))
    .pipe(gulp.dest('build/assets/styles'))
    .pipe(browserSync.stream());
});


gulp.task('html', function() {
  return gulp.src('app/**/*.html')
    .pipe(gulp.dest('build'))
    .pipe(browserSync.stream());
});


gulp.task('watch', function() {
  watch('app/**/*.html', function() {
    gulp.start('html');
  });

  watch('app/**/*.scss', function() {
    gulp.start('styles');
  });

  watch('app//**/*.{jpg, svg}', function() {
    gulp.start('images');
  });
});


gulp.task('js', function() {
  var options = {
    output: {
      publicPath: '/js',
      filename: 'bundle.js'
    },

    watch: true,

    devtool: isDevelopment ? 'cheap-module-inline-source-map' : null,

    module:  {
      loaders: [{
        test:    /\.js$/,
        include: path.join(__dirname, 'app'),
        loader:  'babel?presets[]=es2015'
      }]
    },
  };

  return gulp.src('app/**/*.js')
    .pipe(webpackStream(options))
    .pipe(gulp.dest('build/assets/js'))
    .pipe(browserSync.stream());
});


gulp.task('images', function() {
  return gulp.src('app/**/*.{jpg, svg}')
    .pipe(gulp.dest('build/assets/images'))
    .pipe(browserSync.stream());
});


gulp.task('default', ['serve', 'html', 'styles', 'js', 'images', 'watch']);
