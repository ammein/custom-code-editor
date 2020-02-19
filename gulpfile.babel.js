import autoprefixer from 'gulp-autoprefixer';
import babelify from 'babelify';
import browserify from 'browserify';
import browserSync from 'browser-sync';
import buffer from 'vinyl-buffer';
import eslint from 'gulp-eslint';
import gulp from 'gulp';
import gulpStylelint from 'gulp-stylelint';
import notify from 'gulp-notify';
import sass from 'gulp-sass';
import source from 'vinyl-source-stream';
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

gulp.task('js', (done) => {
    JS.map(function (file) {
        browserify(`${file.src}${file.name}.js`)
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
});

gulp.task('sass', () =>
    gulp.src(`${src}sass/**/*.scss`)
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
);

gulp.task('imgs', () =>
    gulp.src([`${src}/imgs/*.png`, `${src}/imgs/*.jpg`, `${src}/imgs/*.svg`], {
        base: `${src}/imgs/`
    })
    .pipe(gulp.dest(`public/imgs`))
);

gulp.task('lint', () =>
    gulp.src([`${src}js/**/*.js`, `!node_modules/**`])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);

gulp.task('default', ['lint', 'js']);
