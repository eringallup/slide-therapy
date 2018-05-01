module.exports = (olduri) => {
  var pathQs = olduri.split('?')
  var pathname = pathQs[0]
  var qs = pathQs[1] ? '?' + pathQs[1] : ''

  var findFolder = /\/[a-z-]+$/
  var findTrailingSlash = /\/$/
  console.log(pathname, findFolder.test(pathname))
  if (findFolder.test(pathname)) {
    pathname += '/index.html'
  } else if (findTrailingSlash.test(pathname)) {
    pathname += 'index.html'
  }
  var newuri = pathname + qs

  // Log the URI as received by CloudFront and the new URI to be used to fetch from origin
  console.log('Old URI: ' + olduri)
  console.log('New URI: ' + newuri)

  // Replace the received URI with the URI that includes the index page
  return newuri
}
