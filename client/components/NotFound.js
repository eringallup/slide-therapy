import React from 'react'

export default class NotFound extends React.Component {
  constructor (props) {
    super(props)
    this.state = props
  }
  componentWillMount () {
    if (typeof document !== 'undefined') {
      document.title = 'Slide Therapy: Page Not Found'
    }
  }
  componentDidMount () {
    analytics.page('Not Found')
  }
  render () {
    return <div className="container">
      <div className="row">
        <div className="col">
          <h2>Page Not Found</h2>
        </div>
      </div>
    </div>
  }
}
