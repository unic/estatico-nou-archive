const gulp = require('gulp')
const path = require('path')
const merge = require('lodash.merge')

const tasks = {
  html: require('../estatico-html'),
  validateHtml: require('../estatico-html-validate'),
  watch: require('../estatico-watch')
}

// Exemplary custom config
const config = {
  html: merge({}, tasks.html.defaults, {
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
  }),
  validateHtml: merge({}, tasks.validateHtml.defaults, {
    src: './build/*.html' // Skip module build, test index only
  })
}

gulp.task('default', gulp.series(
  function htmlTask () {
    return tasks.html.fn(config.html)
  },
  function validateHtmlTask () {
    return tasks.validateHtml.fn(config.validateHtml)
  }
))

gulp.task('watch', function watchTask () {
  Object.keys(config).forEach((taskName) => {
    if (config[taskName].watch) {
      tasks.watch.fn({
        task: {
          fn: tasks[taskName].fn,
          name: tasks[taskName].name,
          config: config[taskName]
        }
      }, gulp)
    }
  })
})
