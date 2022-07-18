import autoprefixer from 'gulp-autoprefixer';
import babelify from 'babelify';
import browserify from 'browserify';
import browserSync from 'browser-sync';
import buffer from 'vinyl-buffer';
import eslint from 'gulp-eslint';
import gulp, { task } from 'gulp';
import gulpStylelint from 'gulp-stylelint';
import notify from 'gulp-notify';
import source from 'vinyl-source-stream';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
// import through from 'through2'; // For custom function extension
// import path from 'path';

var src = "src/"

var JS = [{
        src: 'src/js/',
        name: 'user',
        dest: 'public/js'
}];

const spawn = require('child_process').spawn;
const bs = browserSync.create();
let travis = process.env.TRAVIS || false;

function js(done){
    JS.map(function(file){
        return browserify({
            entries: [`${file.src}${file.name}.js`]
        })
        .transform(babelify, {
            presets: ['@babel/preset-env']
        })
        .bundle()
        .pipe(source(file.name + '.js'))
        .pipe(buffer())
        .pipe(gulp.dest(`${file.dest}`))
        .pipe(bs.stream())
        .pipe(notify('scripts task ' + file.name + '.js complete'));
    })
    done();
}

task("js", js);

function sassGulp(){
    return gulp.src(`${src}sass/**/*.scss`)
    .pipe(gulpStylelint({
        failAfterError: travis,
        reporters: [{
            formatter: 'string',
            console: true
        }]
    }))
    .pipe(sass())
    .pipe(autoprefixer({
        browsers: ['last 3 versions'],
        cascade: false
    }))
    .pipe(gulp.dest(`${dest}css`))
    .pipe(bs.stream())
    .pipe(notify('styles task complete'))
}

task("css", sassGulp);

function images(){
    return gulp.src([`${src}/imgs/*.png`, `${src}/imgs/*.jpg`, `${src}/imgs/*.svg`], {
        base: `${src}/imgs/`
    })
    .pipe(gulp.dest(`public/imgs`))
}

task("images", images);

function lint(){
    return gulp.src([`${src}js/**/*.js`, `!node_modules/**`])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
}

task("lint", lint);

exports.default = gulp.series("lint", "js")
