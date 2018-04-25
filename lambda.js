const _ = require('lodash')
const path = require('path')
const async = require('async')
const fs = require('fs')
const exec = require('child_process').exec
const argv = require('minimist')(process.argv.slice(2))

const LAMBDA_DIR = path.join(__dirname, 'lambda')
const ROOT_DIR = path.join(__dirname)

if (argv.fn && argv.alias && argv.version) {
  const aliasCommand = [
    'aws lambda update-alias',
    `--function-name ${argv.fn}`,
    `--function-version ${argv.version}`,
    `--name ${argv.alias}`
  ].join(' ')
  console.log(`aliasCommand\n${aliasCommand}`)
  _exec(aliasCommand, _exit)
} else {
  upload()
}

function upload () {
  fs.readdir(LAMBDA_DIR, 'utf8', (dirError, files) => {
    if (dirError) {
      return _exit(dirError)
    }
    if (argv.fn) {
      files = _.intersection(files, argv.fn.split(','))
    }
    // console.log('upload', files)
    async.each(files, zipFile, _exit)
  })
}

function zipFile (lambdaFunction, callback) {
  const cp = `cp ${ROOT_DIR}/skus.json ${LAMBDA_DIR}/${lambdaFunction}`
  // console.log(cp)
  _exec(cp, cpError => {
    if (cpError) {
      return callback(cpError)
    }
    let zipFilePath = path.join('/tmp', lambdaFunction + '.zip')
    let zipCommand = [
      `cd ${LAMBDA_DIR}/${lambdaFunction}`,
      `zip -X -r ${zipFilePath} ./*`,
      `aws lambda update-function-code --publish --function-name ${lambdaFunction} --zip-file fileb://${zipFilePath}`
    ].join(' && ')
    console.log(zipCommand)
    // return callback()
    _exec(zipCommand, callback)
  })
}

function _exec (cmd, callback) {
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      return callback(error)
    }
    if (stderr) {
      return callback(stderr)
    }
    callback()
  })
}

function _exit (errors) {
  if (errors) {
    console.error('errors:', errors)
  }
  process.exit(errors)
}
