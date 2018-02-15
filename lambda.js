const path = require('path');
const async = require('async');
const fs = require('fs');
const exec = require('child_process').exec;

const LAMBDA_DIR = path.join(__dirname, 'lambda');
const ROOT_DIR = path.join(__dirname);

fs.readdir(LAMBDA_DIR, 'utf8', (dirError, files) => {
  if (dirError) {
    return _exit(dirError);
  }
  async.each(files, zipFile, _exit);
});

function zipFile(lambdaFunction, callback) {
  const cp = `cp ${ROOT_DIR}/skus.json ${LAMBDA_DIR}/${lambdaFunction}`;
  // console.log(cp);
  exec(cp, (cpError, cpStdout, cpStderr) => {
    if (cpError) {
      return callback(cpError);
    }
    let zipFilePath = path.join('/tmp', lambdaFunction + '.zip');
    let zipCommand = [
      `cd ${LAMBDA_DIR}/${lambdaFunction}`,
      `zip -X -r ${zipFilePath} ./*`,
      `aws lambda update-function-code --publish --function-name ${lambdaFunction} --zip-file fileb://${zipFilePath}`
    ].join(' && ');
    console.log(zipCommand);
    // return callback();
    exec(zipCommand, (error, stdout, stderr) => {
      if (error) {
        return _exit(error);
      }
      callback();
    });
  });
}

function _exit(errors) {
  if (errors) {
    console.error('errors:', errors);
  }
  process.exit(errors);
}