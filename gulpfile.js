const gulp = require('gulp')
const html = require('estatico-html')
const validateHtml = require('estatico-html-validate')
const watch = require('estatico-watch')
const path = require('path')
const merge = require('lodash.merge')

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
    return html.fn(config.html)
  },
  function validateHtmlTask () {
    return validateHtml.fn(config.validateHtml)
  }
))

gulp.task('watch', function watchTask () {
  watch.fn({
    task: {
      fn: html.fn,
      name: html.name,
      config: merge({}, html.defaults, config.html)
    }
  })
})
