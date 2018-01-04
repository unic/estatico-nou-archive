const gulp = require('gulp');
const path = require('path');
const estaticoHandlebars = require('estatico-handlebars');
const estaticoHtmlValidate = require('estatico-html-validate');
const estaticoStyleLint = require('estatico-style-lint');
const estaticoWatch = require('estatico-watch');

// Exemplary custom config
const config = {
  handlebars: {
    plugins: {
      // Use JSON file instead of data.js
      data: file => require(file.path.replace(path.extname(file.path), '.json')), // eslint-disable-line global-require, import/no-dynamic-require
    },
  },
  validateHtml: {
    src: './dist/*.html', // Skip module build, test index only
  },
  stylelint: {
    src: [
      './src/modules/**/*.scss',
    ],
  },
  watch: null,
};

// Exemplary tasks
const tasks = {
  // Create named functions so gulp-cli can properly log them
  handlebars: estaticoHandlebars(config.handlebars),
  stylelint: estaticoStyleLint(config.stylelint),
  validateHtml: estaticoHtmlValidate(config.validateHtml),
};

gulp.task('handlebars', (done) => {
  estaticoHandlebars(config.handlebars);
  done();
});

gulp.task('validate', (done) => {
  estaticoHtmlValidate(config.validateHtml);
  done();
});

gulp.task('stylelint', (done) => {
  estaticoStyleLint(config.stylelint);
  done();
});

gulp.task('default', gulp.series('handlebars', 'validate', 'stylelint'));

gulp.task('watch', () => {
  Object.keys(tasks).forEach((task) => {
    const watchTask = estaticoWatch({
      src: tasks[task].config.watch,
      fn: tasks[task].fn
    }, gulp);

    try {
      watchTask.fn();
    } catch (err) {
      // TODO: "Beautify" error handling
      console.log(err)
    }
  });
});
