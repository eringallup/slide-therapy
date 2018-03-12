import React from 'react'

export default class Html extends React.Component {
  constructor (props) {
    super(props)
    this.state = props
  }
  render () {
    let jsFiles = ''
    this.state.js.forEach(file => {
      jsFiles += `<script src="/${file}"></script>`
    })
    jsFiles += `<script>window.appContext = ${JSON.stringify(this.state.context)};</script>`
    return <html lang="en" className="no-js">
      <head>
        <title>{this.state.title}</title>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossOrigin="anonymous" />
        <link href="//fonts.googleapis.com/css?family=Lato&subset=latin,latin-ext" rel="stylesheet" type="text/css" />
        <link href="/style.css" rel="stylesheet" type="text/css" />
        <script src="//checkout.stripe.com/checkout.js" />
      </head>
      <body>
        <div id="app" className="d-flex flex-column">{this.state.children}</div>
        <div dangerouslySetInnerHTML={{__html: jsFiles}} />
      </body>
    </html>
  }
}
