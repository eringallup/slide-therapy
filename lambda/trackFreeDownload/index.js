const crypto = require('crypto')
const https = require('https')

exports.handler = (event, context, callback) => {
  const cfRequest = event.Records[0].cf.request
  console.log('cfRequest', cfRequest)
  if (!cfRequest || cfRequest.uri !== '/free/SlideTherapyColorPalettes.pptx') {
    return callback(null, cfRequest)
  }

  const anonymousId = crypto.randomBytes(16).toString('hex')
  const encodedKey = Buffer.from('l8EIiIHP00kvQJM7rQIQDMok6VmFCU2W').toString('base64')

  const postData = JSON.stringify({
    anonymousId: anonymousId,
    event: 'Free Download',
    properties: {
      file: 'SlideTherapyColorPalettes.pptx'
    },
    timestamp: new Date().toISOString()
  })
  console.log('postData', postData)

  const options = {
    hostname: 'api.segment.io',
    port: 443,
    path: '/v1/track',
    method: 'POST',
    headers: {
      'Authorization': `Basic ${encodedKey}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  }
  console.log('options', options)

  const request = https.request(options, response => {
    console.log(`STATUS: ${response.statusCode}`)
    console.log(`HEADERS: ${JSON.stringify(response.headers)}`)
    response.setEncoding('utf8')
    response.on('data', chunk => {
      console.log(`BODY: ${chunk}`)
    })
    response.on('end', () => callback(null, cfRequest))
  })

  request.on('error', reqError => callback(reqError))

  // write data to request body
  request.write(postData)
  request.end()
}
