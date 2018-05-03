const crypto = require('crypto')
const Analytics = require('analytics-node')
const analytics = new Analytics(process.env.segment_write_key, {
  flushAt: 1
})

exports.handler = (event, context, callback) => {
  let payload = event
  if (event.Records) {
    try {
      payload = event.Records[0].Sns
    } catch (e) {
      return callback(new Error('Error parsing Records'), {
        statusCode: 500,
        error: e
      })
    }
  }
  if (payload.Type === 'Notification' && payload.Subject === 'Amazon SES Email Event Notification') {
    let message = {}
    try {
      message = JSON.parse(payload.Message)
    } catch (e) {
      return callback(e, {
        statusCode: 500,
        error: e
      })
    }

    let timestampDate = message.mail.timestamp

    const secret = 'slidetherapysecret'
    const hash = crypto.createHmac('sha256', secret)
      .update(message.mail.destination[0])
      .digest('hex')

    const recipient = hash
    let properties = {
      topicArn: payload.TopicArn,
      messageId: message.mail.messageId,
      messageDate: message.mail.timestamp,
      from: message.mail.source,
      to: recipient,
      sendingAccountId: message.mail.sendingAccountId,
      subject: message.mail.commonHeaders.subject
    }
    switch (message.eventType) {
    case 'Click':
      properties.clickData = message.click
      properties.clickData.ipAddress = undefined
      timestampDate = properties.clickData.timestamp
      break
    case 'Open':
      properties.openData = message.open
      properties.openData.ipAddress = undefined
      timestampDate = properties.openData.timestamp
      break
    case 'Delivery':
      properties.deliveryData = message.delivery
      properties.deliveryData.recipients = undefined
      timestampDate = properties.deliveryData.timestamp
      break
    case 'Send':
      properties.sendData = message.send
      break
    case 'Rendering Failure':
      properties.failureData = message.failure
      break
    }
    const trackJson = {
      userId: recipient,
      event: `Email ${message.eventType}`,
      timestamp: new Date(timestampDate),
      properties: properties,
      context: {
        ip: '127.0.0.1',
        user_agent: 'emailLogging'
      }
    }
    // console.log('trackJson', trackJson)
    analytics.track(trackJson, (error, batch) => {
      console.log(error, batch)
      if (error) {
        return callback(error)
      }
      callback(null, {
        statusCode: 200,
        batch: batch
      })
    })
  } else {
    callback(JSON.stringify(payload))
  }
}
