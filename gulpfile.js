// Gulp loader

const {
    src,
    dest,
    task,
    watch,
    series,
    parallel
} = require('gulp');

// --------------------------------------------
// Dependencies
// --------------------------------------------

// CSS / SASS plugins
let sass = require('gulp-sass');
let autoprefixer = require('gulp-autoprefixer');
let minifycss = require('gulp-clean-css');

// JSS / plugins
let uglify = require('gulp-uglify');

// Utility plugins
let concat = require('gulp-concat');
let del = require('del');
let plumber = require('gulp-plumber');
let sourcemaps = require('gulp-sourcemaps');
let rename = require('gulp-rename');

// Browser plugins
let browserSync = require('browser-sync').create();

// Images plugins
let images = require('gulp-imagemin');


// Project Variables

let styleSrc = 'source/sass/**/*.sass';
let styleDest = 'build/assets/css/';

let vendorSrc = 'source/js/vendors/';
let vendorDest = 'build/assets/js/';
let scriptSrc = 'source/js/*.js';
let scriptDest = 'build/assets/js/';

let htmlSrc = 'source/';
let htmlDest = 'build/';




// --------------------------------------------
// Stand Alone Tasks
// --------------------------------------------


// Compiles SASS files
function css(done) {
    src('source/sass/**/*.sass')
        .pipe(plumber())
        .pipe(sass({
            style: 'compressed'
        }))
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        }))

        .pipe(dest('build/assets/css'));
    done();
};


// Images
function img(done) {
    src('source/img/*')
        .pipe(images())
        .pipe(dest('build/assets/img'));
    done();
};

// Uglify js files
function js(done) {
    src('source/js/*.js')
        .pipe(plumber())
        .pipe(uglify())
        .pipe(dest('build/assets/js'));
    done();
};

//Concat and Compress Vendor .js files
function vendor(done) {
    src(
            [
                'source/js/vendors/jquery.min.js',
                'source/js/vendors/*.js'
            ])
        .pipe(plumber())
        .pipe(concat('vendors.js'))
        .pipe(uglify())
        .pipe(dest('build/assets/js'));
    done();
};



// Watch for changes

function watcher() {

    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./build"
        },
        notify: false
    });

    watch(styleSrc, series(css));
    watch(scriptSrc, series(js));
    watch(vendorSrc, series(vendor));
    watch(['build/*.html', 'build/assets/css/*.css', 'build/assets/js/*.js', 'build/assets/js/vendors/*.js']).on('change', browserSync.reload);

};


// use default task to launch Browsersync and watch JS files
let build = parallel(watcher);
task('default', build);
task('img', img);
