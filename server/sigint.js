const async = require('async');

let tasks = [];

function addTask(fn) {
  tasks.push(fn);
}

module.exports = {
  addTask: addTask
};

process.on('SIGINT', sig => {
  async.series(tasks, err => {
    if (err) {
      console.error(err);
    }
    let shutdownType = err ? 1 : 0;
    console.info('SIGINT Shutdown', shutdownType);
    process.exit(shutdownType);
  });
});
