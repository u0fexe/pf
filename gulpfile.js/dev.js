const { src, dest, series, parallel, watch } = require('gulp')

const rm = require('gulp-rm')
const browserSync = require('browser-sync').create()
const reload = browserSync.reload
const sourcemaps = require('gulp-sourcemaps')
const sassGlob = require('gulp-sass-glob')
const sass = require('gulp-sass')(require('sass'))
const concat = require('gulp-concat')
const webpack = require('webpack-stream')
const rename = require("gulp-rename")
const pug = require('gulp-pug')

const mode = require('gulp-mode')({
  modes: ['production', 'development', 'tools'],
  default: '',
})

function clean() {
	return src('./dist/**/*', { read: false }).pipe(rm())
}

function html() {
	return src('./src/07_pages/*.pug')
		.pipe(pug({ pretty: true }))
		.pipe(dest('./dist'))
		.pipe(reload({ stream: true }))
}

function styles() {
	return src('./src/05_sass/main.scss')
		.pipe(sourcemaps.init())
		.pipe(concat('styles.scss'))
		.pipe(sassGlob())
		.pipe(sass().on('error', sass.logError))
		.pipe(sourcemaps.write())
		.pipe(rename((path) => {
			path.basename = 'styles'
		}))
		.pipe(dest('./dist/styles'))
		.pipe(reload({ stream: true }))
}

function images() {
	return src('./src/01_multimedia/images/optimized/**/*')
		.pipe(dest('./dist/multimedia/images'))
		.pipe(reload({ stream: true }))
}

function multimedia() {
	return src(['./src/01_multimedia/**/*', '!./src/01_multimedia/images/**/*'])
		.pipe(dest('./dist/multimedia'))
		.pipe(reload({ stream: true }))
}

function scripts() {
	return src('./src/03_javascript/main.js')
		.pipe(sourcemaps.init())
		.pipe(webpack({
			mode: 'development',
			module: {
				rules: [
					{
						test: /\.glsl$/,
						exclude: /node_modules/,
						use: ['raw-loader']
					},
					{
						test: /\.(jpe?g|png|gif|svg|avi|mp4)$/,
						use: ['url-loader']
					}
				]
			},
			output: {
				filename: 'app.js'
			}
		}))
		.pipe(sourcemaps.write())
		.pipe(dest('./dist/js'))
		.pipe(reload({ stream: true }))
}

function server() {
	browserSync.init({
		server: {
			baseDir: './dist',
		},
		port: 8080,
		// online: true,
		// tunnel: true,
	})
}

function external() {
	return src('./src/02_external/**/*')
		.pipe(dest('./dist/external'))
		.pipe(reload({ stream: true }))
}

module.exports = function () {
	if(!mode.development()) return

	watch(['./src/01_multimedia/images/optimized/**/*'], images)
	watch(['./src/01_multimedia/**/*', '!./src/01_multimedia/images/**/*'], multimedia)
	watch(['./src/02_external/**/*'], external)
	watch(['./src/03_javascript/**/*.js'], scripts)
	watch(['./src/04_shaders/**/*.glsl'], scripts)
	watch(['./src/06_parts/**/*.scss', './src/05_sass/**/*.scss'], styles)
	watch(['./src/06_parts/**/*.pug', './src/07_pages/**/*.pug'], html)

	return series(clean, scripts, parallel(external, images, multimedia, styles, html), server)
}
