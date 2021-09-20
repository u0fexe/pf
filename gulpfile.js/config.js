module.exports = {
	DIST: './dist',
	DIST_ASSETS: './dist/assets',

	SRC_INDEX_HTML: './src/03_app/index.html',

	SRC_MAIN_CSS: './src/01_styles/main.scss',
	SRC_MAIN_JS: './src/01_js/main.js',

	SRC_FONTS: './src/00_fonts/**/*',
	SRC_IMAGES: './src/00_images/**/*',

	WATCH_CSS: ['./src/02_blocks/**/*.scss', './src/03_app/**/*.scss', './src/01_styles/**/*.scss'],
	WATCH_HTML: ['./src/02_blocks/**/*.html', './src/03_app/**/*.html'],
	WATCH_JS: ['./src/01_js/**/*.js'],
	WATCH_IMAGES: ['./src/00_images/**/*'],
	WATCH_FONTS: ['./src/00_fonts/**/*'],
}