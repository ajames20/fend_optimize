var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');
var htmlmin = require('gulp-htmlmin');
var changed = require('gulp-changed');
var imagemin = require('gulp-imagemin');
var bs = require('browser-sync').create(); // create a browser sync instance.
var smoosher = require('gulp-smoosher');
var plugins = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*'],
  replaceString: /\bgulp[\-.]/
});

gulp.task('minify-js', function() {
  gulp
    .src('src/scripts/*.js') // path to your files
    .pipe(concat('perfmatters.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts/'));
  gulp
    .src('src/views/js/*.js') // path to your files
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/views/js/'));
});

gulp.task('css', function() {
  gulp.src('src/styles/style.css').pipe(concat('style.css')).pipe(minify()).pipe(gulp.dest('dist/styles/'));
  gulp.src('src/styles/print.css').pipe(concat('print.css')).pipe(minify()).pipe(gulp.dest('dist/styles/'));
  gulp.src('src/views/css/style.css').pipe(concat('style.css')).pipe(minify()).pipe(gulp.dest('dist/views/css/'));
  gulp
    .src('src/views/css/bootstrap-grid.css')
    .pipe(concat('bootstrap-grid.css'))
    .pipe(minify())
    .pipe(gulp.dest('dist/views/css/'));
});

gulp.task('imagemin', function() {
  var imgSrc = 'src/img/*.+(png|jpg|gif)', imgDst = 'dist/img';
  var imgSrc2 = 'src/views/images/*.+(png|jpg|gif)', imgDst2 = 'dist/views/images';

  gulp.src(imgSrc).pipe(changed(imgDst)).pipe(imagemin()).pipe(gulp.dest(imgDst));
  gulp.src(imgSrc2).pipe(changed(imgDst2)).pipe(imagemin()).pipe(gulp.dest(imgDst2));
});

gulp.task('browser-sync', function() {
  bs.init({
    server: {
      baseDir: './dist'
    }
  });
});

gulp.task('smoosh', function() {
  gulp
    .src('src/*.html')
    .pipe(plugins.smoosher())
    // minify html files
    .pipe(
      plugins.htmlmin({
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true
      })
    )
    .pipe(gulp.dest('dist'));
});

gulp.task('minify', function() {
  gulp.src('src/views/*.html').pipe(htmlmin({ collapseWhitespace: true })).pipe(gulp.dest('dist/views'));
});

gulp.task('default', ['minify-js', 'css', 'minify', 'imagemin', 'browser-sync', 'smoosh'], function() {});
