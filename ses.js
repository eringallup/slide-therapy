const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')
const async = require('async')
const inlineCss = require('inline-css')
const exec = require('child_process').exec
const jsdom = require('jsdom')
const { JSDOM } = jsdom

const EMAIL_DIR = path.resolve(__dirname, 'email')

let baseUrl = 'https://local.slidetherapy.com'
if (process.env.NODE_ENV === 'production') {
  baseUrl = 'https://slidetherapy.com'
  console.log('---------- LIVE ----------')
} else {
  console.log('---------- TEST ----------')
}

fs.readdir(EMAIL_DIR, 'utf8', (dirError, files) => {
  if (dirError) {
    return _exit(dirError)
  }
  async.each(files, sendTemplate, _exit)
})

function sendTemplate (template, callback) {
  const templatePath = path.resolve(EMAIL_DIR, template)
  const templateData = path.parse(templatePath)
  const htmlTemplate = fs.readFileSync(templatePath, 'utf8')
  inlineCss(htmlTemplate, {
    url: baseUrl,
    removeHtmlSelectors: true
  }).then(htmlEmail => {
    console.log(htmlEmail)
    JSDOM.fromFile(templatePath, {
      pretendToBeVisual: true,
      includeNodeLocations: true
    }).then(dom => {
      const templateName = path.parse(templatePath).name
      const json = {
        Template: {
          TemplateName: templateName,
          SubjectPart: dom.window.document.title,
          HtmlPart: htmlEmail
        }
      }
      const TEMP_FILE = path.join('/tmp', 'email', templateData.name + '.json')
      console.log(TEMP_FILE)
      fse.outputJson(TEMP_FILE, json, writeError => {
        if (writeError) {
          return callback(writeError)
        }
        const sesCommand = `aws ses update-template --cli-input-json file://${TEMP_FILE}`
        console.log(sesCommand)
        exec(sesCommand, (error, stdout, stderr) => {
          if (error) {
            return callback(error)
          }
          if (stderr) {
            return callback(stderr)
          }
          callback()
        })
      })
    })
  })
}

function _exit (errors) {
  if (errors) {
    console.error('errors:', errors)
  }
  process.exit(errors)
}
