const { src, dest, series, parallel } = require('gulp')

const rm = require('gulp-rm')
const sass = require('gulp-sass')(require('sass'))
const concat = require('gulp-concat')
const autoprefixer = require('gulp-autoprefixer')
const sassGlob = require('gulp-sass-glob')
const gcmq = require('gulp-group-css-media-queries')
const webpack = require('webpack-stream')
const rename = require("gulp-rename")
const uglify = require('gulp-uglify')
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
}

function styles() {
	return src('./src/05_sass/main.scss')
		.pipe(concat('main.scss'))
		.pipe(sassGlob())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			cascade: false
		}))
		.pipe(gcmq())
		.pipe(rename((path) => {
			path.basename = 'styles'
		}))
		.pipe(dest('./dist/styles'))
}

function scripts() {
	return src('./src/03_javascript/main.js')
		.pipe(webpack({
			mode: 'production',
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
		.pipe(uglify())
		.pipe(dest('./dist/js'))
}

function external() {
	return src('./src/02_external/**/*')
		.pipe(dest('./dist/external'))
}

function images() {
	return src('./src/01_multimedia/images/optimized/**/*')
		.pipe(dest('./dist/multimedia/images'))
}

function multimedia() {
	return src(['./src/01_multimedia/**/*', '!./src/01_multimedia/images/**/*'])
		.pipe(dest('./dist/multimedia'))
}


module.exports = function () {
	if(!mode.production()) return

	return series(clean, scripts, parallel(images, multimedia, external, styles, html))
}
