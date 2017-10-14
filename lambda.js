const path = require('path');
const async = require('async');
const fs = require('fs');
const exec = require('child_process').exec;

const LAMBDA_DIR = path.join(__dirname, 'lambda');

fs.readdir(LAMBDA_DIR, 'utf8', (dirError, files) => {
  if (dirError) {
    return _exit(dirError);
  }
  async.each(files, zipFile, _exit);
});

function zipFile(file, callback) {
  let zipFilePath = path.join('/tmp', file.replace('.js', '.zip'));
  let lambdaFunction = file.replace('.js', '');
  let zipCommand = `cd ${LAMBDA_DIR} && zip -X -r ${zipFilePath} ${file} && aws lambda update-function-code --publish --function-name ${lambdaFunction} --zip-file fileb://${zipFilePath}`;
  console.log(zipCommand);
  exec(zipCommand, (error, stdout, stderr) => {
    if (error) {
      return _exit(error);
    }
    callback();
  });
}

function _exit(errors) {
  if (errors) {
    console.error('errors:', errors);
  }
  process.exit(errors);
}