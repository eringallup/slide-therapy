import React from 'react'
import PropTypes from 'prop-types'
import pageData from 'pages.json'

export default class Html extends React.Component {
  constructor (props) {
    super(props)
    if (props.context) {
      props.context.page = pageData[props.context.path]
    }
    this.state = props
  }
  render () {
    const page = this.state.context.page || {}
    const docTitle = page.title || 'Slide Therapy'
    const ogImage = page.ogImage || 'http://preview.slidetherapy.com.s3-website-us-west-2.amazonaws.com/images/home/topimage1.jpg'
    const ogType = page.ogType || 'website'
    const ogUrl = this.state.context.domain + this.state.context.path
    let canonicalUrl = ogUrl
    if (page.canonicalUrl) {
      canonicalUrl = this.state.context.domain + page.canonicalUrl
    }
    let noIndexTag = ''
    if (page.noIndex) {
      noIndexTag = <meta name="robots" content="noindex" />
    }
    return <html lang="en" className="no-js">
      <head>
        <title>{docTitle}</title>
        <link rel="icon" href="/images/favicon3.png" type="image/png" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
        {noIndexTag}
        <link rel="canonical" href={canonicalUrl} />
        <link rel="apple-touch-icon" href={ogImage} />
        <meta property="og:title" content={docTitle} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:type" content={ogType} />
        <meta property="og:url" content={ogUrl} />
        <link href={`/${this.state.css[0]}`} rel="stylesheet" type="text/css" />
      </head>
      <body>
        <div id="app" className="d-flex flex-column">{this.state.children}</div>
        <script src="https://checkout.stripe.com/checkout.js" async />
        <script src={`/${this.state.js[0]}`} async />
      </body>
    </html>
  }
}

Html.propTypes = {
  context: PropTypes.object
}
