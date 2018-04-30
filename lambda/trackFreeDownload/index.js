const uuidv4 = require('uuid/v4')
const Analytics = require('analytics-node')
const analytics = new Analytics('l8EIiIHP00kvQJM7rQIQDMok6VmFCU2W', {
  flushAt: 1
})

exports.handler = (event, context, callback) => {
  const request = event.Records[0].cf.request
  if (request.uri === '/free/SlideTherapyColorPalettes.pptx') {
    const trackJson = {
      anonymousId: uuidv4(),
      event: 'Free Download',
      properties: {
        file: 'SlideTherapyColorPalettes.pptx'
      }
    }
    // console.log('trackJson', trackJson)
    analytics.track(trackJson, (error, batch) => {
      console.log(error, batch)
      if (error) {
        return callback(error)
      }
      callback(null, request)
    })
  } else {
    callback(null, request)
  }
}
