import fs from 'node:fs';
import path from 'node:path';
import gulp from 'gulp';
import * as dartScss from 'sass';
import gulpScss from 'gulp-sass';
import rename from 'gulp-rename';
import browserStync from 'browser-sync';
import plumber from 'gulp-plumber';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import { deleteSync } from 'del';
import pug from 'gulp-pug';
import data from 'gulp-data';
import zip from 'gulp-zip';
import imagemin, { gifsicle, mozjpeg, optipng, svgo } from 'gulp-imagemin';
import gulpPugLint from 'gulp-pug-linter';
import pugLintStylish from 'puglint-stylish';
import eslint from 'gulp-eslint';
import gulpStylelint from 'gulp-stylelint-esm';
import generateData from './generateData.js';

const paths = {
  dist: './dist',
  srcPath: './src/banner_list',
  indexPath: './src/',
  zipPath: './dist',
  isiPath: './src/pug/',
};

const server = browserStync.create();
const scss = gulpScss(dartScss);

const getFolders = () => {
  return fs.readdirSync(paths.srcPath).filter(function(file) {
    return fs.statSync(path.join(paths.srcPath, file)).isDirectory();
  });
};

const FOLDERS = getFolders();

export function dataJson(done) {
  console.log('>>>> STARTING DATA JSON TASK 📄 <<<<');
  generateData();
  done();
}

export function styles(done) {
  console.log('>>>> STARTING STYLES TASK 🖌<<<<');

  FOLDERS.map((folder) => {
    gulp.src(path.join(paths.srcPath, folder, '/scss/*.scss'))
      .pipe(
        plumber(function(err) {
          console.log('>>>> STYLES TASK ERROR 💔 <<<<');
          console.log(err);
          // eslint-disable-next-line no-invalid-this
          this.emit('end');
        })
      )
      .pipe(sourcemaps.init())
      .pipe(
        scss.sync({
          outputStyle: 'compressed',
        })
      )
      .pipe(rename('styles.css'))
      .pipe(gulp.dest(path.join(paths.dist, '/', folder, '/css')))
      .pipe(server.stream());
  });

  done();
}

export function lintStyles(done) {
  console.log('>>>> STARTING LINT STYLES TASK 🖌<<<<');

  FOLDERS.map((folder) => {
    gulp.src(path.join(paths.srcPath, folder, '/**/*.{css,scss}'))
      .pipe(gulpStylelint({
        failAfterError: true,
        reporters: [
          { formatter: 'string', console: true },
        ],
      }));
  });

  done();
}

export function scripts(done) {
  console.log('>>>> STARTING SCRIPTS TASK  <<<<');

  FOLDERS.map((folder) => {
    gulp.src(path.join(paths.srcPath, folder, '/js/*.js'))
      .pipe(
        plumber(function(err) {
          console.log('>>>> SCRIPTS TASK ERROR 💔 <<<<');
          console.log(err);
          // eslint-disable-next-line no-invalid-this
          this.emit('end');
        })
      )
      .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(concat('main.js'))
      .pipe(gulp.dest(path.join(paths.dist, '/', folder, '/js')));
  });

  done();
}

export function scriptsDev(done) {
  console.log('>>>> STARTING SCRIPTS TASK  <<<<');

  FOLDERS.map((folder) => {
    gulp.src(path.join(paths.srcPath, folder, '/js/*.js'))
      .pipe(
        plumber(function(err) {
          console.log('>>>> SCRIPTS TASK ERROR 💔 <<<<');
          console.log(err);
          // eslint-disable-next-line no-invalid-this
          this.emit('end');
        })
      )
      .pipe(sourcemaps.init())
      .pipe(concat('main.js'))
      .pipe(gulp.dest(path.join(paths.dist, '/', folder, '/js')));
  });

  done();
}

export function scriptsLint(done) {
  console.log('>>>> STARTING LINT SCRIPTS TASK  <<<<');

  FOLDERS.map((folder) => {
    gulp.src(path.join(paths.srcPath, folder, '/js/*.js'))
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
  });

  done();
}

export function images(done) {
  console.log('>>>> STARTING IMAGES TASK 🖼 <<<<');

  FOLDERS.map((folder) => {
    gulp.src(path.join(paths.srcPath, folder, '/img/*'), { encoding: false })
      .pipe(imagemin([
        gifsicle({ interlaced: true }),
        mozjpeg({ quality: 90, progressive: true }),
        optipng({ optimizationLevel: 5 }),
        svgo({
          plugins: [
            {
              name: 'removeViewBox',
              active: true,
            },
            {
              name: 'cleanupIDs',
              active: false,
            },
          ],
        }),
      ]))
      .pipe(gulp.dest(path.join(paths.dist, '/', folder, '/images')));
  });

  done();
}

export function templates(done) {
  console.log('>>>> STARTING TEMPLATES TASK 📄 <<<<');

  FOLDERS.map((folder) => {
    gulp.src(path.join(paths.srcPath, folder, '/pug/*.pug'))
      .pipe(
        pug({
          pretty: false,
        })
      )
      .pipe(rename('index.html'))
      .pipe(gulp.dest(path.join(paths.dist, '/', folder)));
  });

  done();
}

export function lintPug(done) {
  console.log('>>>> STARTING LINT PUG TASK 🖌<<<<');

  gulp.src(path.join(paths.indexPath, '/**/*.pug'))
    .pipe(gulpPugLint({
      reporter: pugLintStylish,
      failAfterError: true,
    }));

  done();
}

export function indexDynamic(done) {
  console.log('>>>> STARTING DINAMIC INDEX TASK 📄 <<<<');

  gulp.src(path.join(paths.indexPath, 'base.pug'))
    .pipe(
      data(function() {
        return JSON.parse(fs.readFileSync('./src/data.json'));
      })
    )
    .pipe(
      pug({
        pretty: false,
      })
    )
    .pipe(rename('index.html'))
    .pipe(gulp.dest(paths.dist));

  done();
}

export function clean(done) {
  console.log('>>>> STARTING DEL TASK ✂ <<<<');
  deleteSync([paths.dist]);
  done();
}

export function bannerView(done) {
  gulp.src(path.join(paths.indexPath, '/banner.pug'))
    .pipe(
      pug({
        pretty: false,
      })
    )
    .pipe(rename('banner.html'))
    .pipe(gulp.dest(paths.dist));

  done();
}

export function zips(done) {
  console.log('>>>> STARTING ZIPS TASK 🗜<<<<');

  FOLDERS.map((folder) => {
    gulp.src(path.join(paths.zipPath, folder, '**/*'))
      .pipe(zip(`${folder}.zip`))
      .pipe(gulp.dest(path.join(paths.zipPath, '/', 'ZIPS')));
  });

  done();
}

function reload(done) {
  server.reload();

  done();
}

function serve(done) {
  server.init({
    server: {
      baseDir: paths.dist,
    },
  });

  done();
}

const initialDev = gulp.series(clean, styles, scriptsDev, images, templates, indexDynamic, bannerView);
const initialBuild = gulp.series(clean, styles, scripts, images, templates);
const finalBuild = gulp.series(dataJson, indexDynamic, bannerView);

const watch = () => {
  console.log('>>>> STARTING WATCH TASK 👀 <<<<');
  gulp.watch(path.join(paths.isiPath, '/**/*.pug'), gulp.series(indexDynamic, bannerView, templates, reload));
  gulp.watch(path.join(paths.srcPath, '/**/*.scss'), gulp.series(styles, reload));
  gulp.watch(path.join(paths.srcPath, '/**/*.js'), gulp.series(scriptsDev, reload));
  gulp.watch(path.join(paths.srcPath, '/**/img/*.{png,jpeg,jpg,svg,gif}'), gulp.series(images, reload));
  gulp.watch(path.join(paths.srcPath, '/**/pug/*.pug'), gulp.series(templates, reload));
  gulp.watch(path.join(paths.indexPath, '/**/*.pug'), gulp.series(indexDynamic, bannerView, reload));
};

gulp.task('build', gulp.series(initialBuild, lintStyles, lintPug));
gulp.task('finalBuild', finalBuild);

const dev = gulp.series(dataJson, initialDev, serve, watch);

export default dev;
