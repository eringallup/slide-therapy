const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')
const async = require('async')
const inlineCss = require('inline-css')
const exec = require('child_process').exec
const jsdom = require('jsdom')
const { JSDOM } = jsdom

const baseUrl = 'https://slidetherapy.com'
const EMAIL_DIR = path.resolve(__dirname, 'email')

if (process.env.NODE_ENV === 'production') {
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
      writeHtmlFile(templateData, htmlEmail).then(() => {
        writeJsonFile(templateData, json).then(() => {
          if (process.env.NODE_ENV !== 'production') {
            return callback()
          }
          sendTemplateToSes(templateData, callback)
        }).catch(callback)
      }).catch(callback)
    })
  })
}

async function writeHtmlFile (templateData, htmlEmail) {
  const htmlFile = path.join('/tmp', 'email', templateData.name + '.html')
  console.log(htmlFile)
  await fse.outputFile(htmlFile, htmlEmail)
}

async function writeJsonFile (templateData, json) {
  const jsonFile = path.join('/tmp', 'email', templateData.name + '.json')
  console.log(jsonFile)
  await fse.outputJson(jsonFile, json)
}

function sendTemplateToSes (templateData, callback) {
  const jsonFile = path.join('/tmp', 'email', templateData.name + '.json')
  const sesCommand = `aws ses update-template --cli-input-json file://${jsonFile}`
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
}

function _exit (errors) {
  if (errors) {
    console.error('errors:', errors)
  }
  process.exit(errors)
}
