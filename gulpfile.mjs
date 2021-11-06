    const sass = gulpSass(nodeSass);
    const server = browserSync.create();
    
    import gulp from 'gulp';
    import gulpSass from "gulp-sass";
    import nodeSass from "node-sass";
    import plumber from 'gulp-plumber';  
    import cleanCSS from 'gulp-cleanCSS';
    import autoprefixer from 'gulp-autoprefixer';
    import browserSync from 'browser-sync';
    import sourcemaps from 'gulp-sourcemaps';
    import concat from 'gulp-concat';
    import imagemin from 'gulp-imagemin';
    import terser from 'gulp-terser';
    import lineec from 'gulp-line-ending-corrector';
    import imagewebp from 'gulp-webp';

    gulp.task('serve', async function(done) {
        browserSync.init({
            server: "./"
        });
        
        gulp.watch("*.{css,php,html}",gulp.series('webfile'));
        gulp.watch("src/scss/**/**/*.scss",gulp.series('sass'));
        gulp.watch("src/js/**/**/*.js",gulp.series('jsmin'));
        gulp.watch("src/images/*.{jpeg,png}",gulp.series('imagemin'));
        gulp.watch("src/fonts/**/*.{ttf,otf,codepoints}",gulp.series('fonts'));
        gulp.watch("**/*.{txt,php,html}").on('change',browserSync.reload)
        
    });

    gulp.task ('sass', async function(){
        return gulp.src("src/scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(browserSync.stream())
        .pipe(sourcemaps.init({loadMaps: true, largeFile: true}))
        .pipe(autoprefixer('last 2 versions'))
        .pipe(lineec())
        .pipe(plumber(
            async function (err) {
                console.log('Error Proccessing CSS files....');
                console.log(err);
                this.emit('end');
            }
        )) 
        .pipe(concat('app.min.css'))
        .pipe(cleanCSS())
        //.pipe(sourcemaps.write('./maps/'))
        .pipe(gulp.dest('dist/assets/css'));
    });

    gulp.task('jsmin', async function(){
        return gulp.src("src/js/**/**/*.js")
        .pipe(terser())
        .pipe(sourcemaps.init({loadMaps: false, largeFile: false}))
        .pipe(concat('bundle.min.js'))
        //.pipe(sourcemaps.write('./maps/'))
        .pipe(gulp.dest('dist/assets/js'));
    });

    gulp.task('imagemin',async function(){
        return gulp.src('src/images/*.{jpeg,png}')
        .pipe(imagemin())
        .pipe(imagewebp())
        .pipe(gulp.dest('dist/assets/images'))
    
    });

    gulp.task('webfile', function(){
        return gulp.src('*.{txt,php,html}')
        .pipe(plumber())
        .pipe(gulp.dest('dist/'));
    });

    gulp.task('fonts', function(){
        return gulp.src('src/fonts/*.{ttf,otf,codepoints}')
        //.pipe(plumber())
        .pipe(gulp.dest('dist/assets/fonts'));
    });

    gulp.task('build', gulp.series('serve','sass'))