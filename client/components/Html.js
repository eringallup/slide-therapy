import React from 'react'

export default class Html extends React.Component {
  constructor (props) {
    super(props)
    this.state = props
  }
  render () {
    return <html lang="en" className="no-js">
      <head>
        <title>{this.state.title}</title>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
        <link href="//fonts.googleapis.com/css?family=Lato&subset=latin,latin-ext" rel="stylesheet" type="text/css" />
        <link href={`/${this.state.css[0]}`} rel="stylesheet" type="text/css" />
        <script src="//checkout.stripe.com/checkout.js" />
      </head>
      <body>
        <div id="app" className="d-flex flex-column">{this.state.children}</div>
        <script src={`/${this.state.js[0]}`} />
      </body>
    </html>
  }
}
