const { src, dest } = require('gulp')
const imagemin = require('gulp-imagemin')
const rename = require('gulp-rename')
const imageminWebp = require('imagemin-webp')


function prepareImages() {
  return src(['./src/01_multimedia/images/unoptimized/**/*.{png,jpg}'])
  .pipe(imagemin([
    imagemin.mozjpeg(
      {
        quality: 95,
      }
    ),
    imagemin.optipng(
      {
        optimizationLevel: 5
      }
    ),
  ]))
  .pipe(dest('./src/01_multimedia/images/optimized'))
  .pipe(imagemin([
    imageminWebp({
      quality: 90,
      method: 6,
    })
  ]))
  .pipe(rename((path) => {
    return {
      dirname: path.dirname,
      basename: path.basename,
      extname: !!path.extname ? '.webp' : ''
    }
  }))
  .pipe(dest('./src/01_multimedia/images/optimized'))
}

module.exports = {
  prepareImages
}
