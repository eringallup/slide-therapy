'use strict';

const async = require('async');

let tasks = [];

function addTask(fn) {
  tasks.push(fn);
}

module.exports = {
  addTask: addTask
};

process.on('SIGINT', function(sig) {
  async.parallel(tasks, function(err) {
    if (err) {
      console.error(err);
    }
    var shutdownType = err ? 1 : 0;
    console.info('SIGINT Shutdown', shutdownType);
    process.exit(shutdownType);
  });
});
