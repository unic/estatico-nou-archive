const gulp = require('gulp')
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
  },
  watch: null
}

// Exemplary tasks
const tasks = {
  handlebars: require('estatico-handlebars')(config.html),
  validateHtml: require('estatico-html-validate')(config.validateHtml),
  watch: require('estatico-watch')(config.watch, gulp)
}

gulp.task('default', gulp.series(
  // Create named functions so gulp-cli can properly log them
  function handlebars () {
    return tasks.handlebars.fn()
  },
  function validateHtml () {
    return tasks.validateHtml.fn()
  }
))

gulp.task('watch', function watchTask () {
  Object.keys(tasks).forEach((taskName) => {
    if (tasks[taskName].config.watch) {
      try {
        tasks.watch.fn({
          task: tasks[taskName],
          name: taskName
        })
      } catch (err) {
        // TODO: "Beautify" error handling
        console.log(err)
      }
    }
  })
})
