// ПОСТОЯННЫЕ ФАЙЛА GULP //
const { src, dest, watch, series, parallel } = require('gulp');

// ПОСТОЯННЫЕ названий папок: приложение и результат //
const appFolder = 'src';
const distFolder = 'dist/vsevn-my_ads';

//* ПОСТОЯННЫЕ ПЛАГИНОВ //*
const browsersync = require('browser-sync').create(),
    fileinclude = require('gulp-file-include'),
    autoprefixer = require('gulp-autoprefixer'),
    // группирует media-запросы в конце файла (оптимизация: +)
    group_media = require('gulp-group-css-media-queries'),
    clean_css = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    uglify_es = require('gulp-uglify-es').default;
    del = require('del');

// ОСНОВНЫЕ ПУТИ: 
// build - папка dist; 
// src - папка src; 
// watch - папка src с теми файлами, изменения которых прослушиваются //
let path = {
    build: {
        html: `${distFolder}/`,
        css: `${distFolder}/css/`,
        js: `${distFolder}/js/`,
        img: `${distFolder}/img/`,
        fonts: `${distFolder}/fonts/`,
        json: `${distFolder}/json/`
    },
    src: {
        html: [`${appFolder}/*.html`, `${appFolder}/**/*.html`],
        css: [`${appFolder}/css/*.css`, `${appFolder}/**/*.css`],
        js: `${appFolder}/js/*.js`,
        img: `${appFolder}/img/**/*.{jpg,png,svg,ico,svg,webp}`,
        fonts: `${appFolder}/fonts/**/*.{ttf,woff,woff2,eot,svg}`,
        json: `${appFolder}/**/*.json`
    },
    watch: {
        html: `${appFolder}/**/*.html`,
        css: `${appFolder}/**/*.css`,
        js: `${appFolder}/js/*.js`,
        img: `${appFolder}/img/**/*.{jpg,png,svg,ico,svg,webp}`,
        fonts: `${appFolder}/fonts/**/*.{ttf,woff,woff2,eot,svg}`,
        json: `${appFolder}/**/*.json`
    },
    clean: [`${distFolder}/**`, `!${distFolder}/.git/`, `!${distFolder}/.gitignore`]
}

// ИНИЦИАЛИЗАЦИЯ GULP И ПЛАГИНОВ //

function browserSync() {
    browsersync.init({
        server: {
            baseDir: `dist/`
        },
        port: 3001,
        notify: false
    })
}

function clean() {
    return del(path.clean)
}

function html() {
    return src(path.src.html)
        .pipe(fileinclude({
            prefix: '@@'
        }))
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream());
}

function styles() {
    src(path.src.css)
        .pipe(autoprefixer({
            overrideBrowserslist: ["last 5 versions"],
            cascade: true
        }))
        .pipe(group_media())
        .pipe(dest(path.build.css))
        .pipe(
            rename({
                extname: '.min.css'
            })
        )
        // .pipe(clean_css())
        .pipe(dest(path.build.css));

    return src(path.src.css)
        .pipe(browsersync.stream());
}

function javascripts() {
    return src(path.src.js)
        .pipe(fileinclude({
            prefix: '@@'
        }))
        // .pipe(uglify_es())
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream());
}

function images() {
    src(path.src.img)
        .pipe(dest(path.build.img));

    return src(path.src.img)
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream());
}

function fonts() {
    return src(path.src.fonts)
        .pipe(dest(path.build.fonts))
        .pipe(browsersync.stream());
}

function json(){
    return src(path.src.json)
        .pipe(dest(path.build.json))
        .pipe(browsersync.stream());
}

function watching() {
    watch([path.watch.html], html);
    watch([path.watch.css], styles);
    watch([path.watch.js], javascripts);
    watch([path.watch.img], images);
    watch([path.watch.fonts], fonts);
    watch([path.watch.json], json);
}

const build = series(clean, parallel(html, styles, javascripts, images, fonts, json));
const start = parallel(build, watching, browserSync);


exports.fonts = fonts;
exports.images = images;
exports.styles = styles;
exports.html = html;
exports.javascripts = javascripts;

exports.build = build;
exports.default = start;