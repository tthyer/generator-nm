'use strict';

const eslint = require('gulp-eslint');
const globquire = require('globquire');
const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const runSequence = require('run-sequence');
const tape = require('tape');
const tapSpec = require('tap-spec');

module.exports = function() {
  let paths = ['lib/*.js', 'app/*.js', 'index.js', 'app.js'];
  let testPathPattern = 'test/*.js';

  gulp.task('lint', () => {
    gulp.src(paths)
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
  });

  gulp.task('test', function() {
    let stream = tape.createStream()
    .pipe(tapSpec())
    .pipe(process.stdout);
    
    globquire(testPathPattern);

    return stream;
  });

  gulp.task('service', function(){
    let spawn = require('child_process').spawn;
    let bunyan = spawn('./node_modules/bunyan/bin/bunyan', [
      '--output', 'short',
      '--level', '10',
      '--color'
    ]);

    bunyan.stdout.pipe(process.stdout);
    bunyan.stderr.pipe(process.stderr);

    nodemon({
      script: 'index.js',
      ext: 'js',
      env: { 'NODE_ENV': process.env.NODE_ENV || 'development' },
      watch: ['lib'],
      stdout: false
    })
    .on('restart', () => console.log('restarted!'))
    .on('stdout', (data) => bunyan.stdin.write(data))
    .on('stderr', (data) => {
      bunyan.stderr.write(data);
      console.error(data.toString());
    });

  });

  gulp.task('default', function(cb) {
    runSequence('lint', cb);
  });

}();
