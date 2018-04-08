import React from 'react'
import PropTypes from 'prop-types'
import titles from 'pages.json'

export default class Html extends React.Component {
  constructor (props) {
    super(props)
    if (props.context) {
      props.context.title = titles[props.context.path] || 'Slide Therapy'
    }
    this.state = props
  }
  render () {
    return <html lang="en" className="no-js">
      <head>
        <title>{this.state.context.title}</title>
        <link rel="icon" href="/images/favicon1.png" type="image/png" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
        <meta property="og:title" content="Slide Therapy" />
        <meta property="og:image" content="http://preview.slidetherapy.com.s3-website-us-west-2.amazonaws.com/images/home/topimage1.jpg" />
        <link rel="apple-touch-icon" href="http://preview.slidetherapy.com.s3-website-us-west-2.amazonaws.com/images/home/topimage1.jpg" />
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
