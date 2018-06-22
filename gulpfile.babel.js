import 'babel-register';
import gulp from 'gulp';
import uglify from 'gulp-uglify';
import size from 'gulp-size';
import rename from 'gulp-rename';
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';
import plumber from 'gulp-plumber';
import del from 'del';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import imagemin from 'gulp-imagemin';
import browserSync from 'browser-sync';
import gulpif from 'gulp-if';
import watchify from 'watchify';
import stylelint from 'gulp-stylelint';
import htmlmin from 'gulp-htmlmin';
import runSequnce from 'run-sequence';
// import fontmagician from 'postcss-font-magician';

const bs = browserSync.create();
const { reload } = bs;

/*
<========================================>
  GLOBS

  Matches all files in root directory ending .js or .css
  *.+(js|css)
<========================================>
*/

/*
<========================================>
  Options
<========================================>
*/
const customOpts = {
  entries: ['./src/scripts/app.js'],
  debug: true,
};
const opts = Object.assign({}, watchify.args, customOpts);
const b = watchify(browserify(opts));
b.transform(babelify, {
  presets: ['env'],
});

const env = process.env.NODE_ENV;
const isProd = env === 'production';

/*
<========================================>
  Paths
<========================================>
*/
const paths = {
  styles: {
    src: './src/styles/**/*.scss',
    dest: isProd ? './dist/styles' : './src/styles',
    glob: './src/styles/**/*.scss',
  },
  scripts: {
    src: ['./src/scripts/**/*.js', './!scripts/**/*.min.js'],
    dest: isProd ? './dist/scripts' : './src/scripts',
    glob: './src/scripts/**/*.js',
  },
  html: {
    src: ['./src/index.html', './src/pages/**/*.html'],
    dest: isProd && './dist/',
    glob: ['./src/index.html', './src/pages/**/*.html'],
  },
  images: {
    src: './src/assets/images/**/*.{jpg,jpeg,png}',
    dest: isProd && './dist/assets/images',
  },
  fonts: {
    src: './src/assets/fonts/*',
    dest: './dist/assets/fonts',
  },
  maps: {
    dest: './src/maps',
  },
};

/*
<========================================>
  Task Handlers
<========================================>
*/
const clean = () => del(['./dist'], { force: true });

const scss = () =>
  gulp
    .src(paths.styles.src)
    .pipe(plumber())
    .pipe(size({ gzip: true }))
    .pipe(stylelint({
      reporters: [{ formatter: 'string', console: true }],
    }))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(rename({ suffix: '.min' }))
    .pipe(postcss())
    .pipe(gulpif(!isProd, sourcemaps.write(paths.maps.dest)))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(reload({ stream: true }));

const html = () =>
  isProd &&
  gulp
    .src(paths.html.src)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(paths.html.dest))
    .pipe(reload({ stream: true }));

/*
  Helpful Links
  http://blog.revathskumar.com/2016/02/browserify-with-gulp.html
  https://www.youtube.com/watch?v=ax0ykSVPufs&t=0s
*/
const scripts = () =>
  b
    .bundle()
    .on('error', err => console.error('Browserify Error', err))
    .pipe(source('app.min.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(gulpif(isProd, uglify()))
    .pipe(gulpif(!isProd, sourcemaps.write(paths.maps.dest)))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(reload({ stream: true }));

const images = () =>
  isProd &&
  gulp
    .src(paths.images.src)
    .pipe(imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imagemin.jpegtran({ progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo({
        plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
      }),
    ]))
    .pipe(gulp.dest(paths.images.dest));

const fonts = () => isProd && gulp.src(paths.fonts.src).pipe(gulp.dest(paths.fonts.dest));

const serve = () => {
  bs.init({
    server: './src/',
    notify: false,
    tunnel: true,
  });
  gulp.watch(paths.scripts.glob, ['scripts']);
  gulp.watch(paths.styles.glob, ['scss']);
  gulp.watch(paths.html.glob).on('change', reload);
};

const buildServe = () => {
  if (isProd) {
    bs.init({
      server: './dist/',
    });
  }
};

/*
<========================================>
  Tasks
<========================================>
*/
gulp.task('clean', clean);
gulp.task('scss', scss);
gulp.task('html', html);
gulp.task('scripts', scripts);
gulp.task('images', images);
gulp.task('fonts', fonts);
gulp.task('serve', ['scss', 'scripts', 'html', 'images'], serve);
gulp.task('buildServe', buildServe);
gulp.task('build', cb =>
  runSequnce('clean', ['scss', 'scripts', 'html', 'images', 'fonts'], 'buildServe', cb));
// gulp.series(clean, gulp.parallel(scss, scripts2, html, images)),

const defaultTask = () => {
  if (isProd) return ['build'];
  return ['serve'];
};

// gulp.task("default", ["scripts", "scss", "browser-sync", "watch"]);
gulp.task('default', defaultTask());
