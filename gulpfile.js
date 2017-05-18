const gulp = require('gulp')
const html = require('estatico-html')
const validateHtml = require('estatico-html-validate')
const path = require('path')

// Exemplary custom config
const config = {
  html: {
    plugins: {
      // Use JSON file instead of data.js
      data: (file) => {
        try {
          return require(file.path.replace(path.extname(file.path), '.json'))
        } catch (e) {
          return {}
        }
      }
    }
  },
  validateHtml: {
    src: './build/*.html' // Skip module build, test index only
  }
}

gulp.task('default', gulp.series(
  function htmlTask () {
    return html.task(config.html)
  },
  function validateHtmlTask () {
    return validateHtml.task(config.validateHtml)
  }
))
