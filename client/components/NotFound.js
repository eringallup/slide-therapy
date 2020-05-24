/* eslint-disable react/jsx-closing-tag-location */
import React from 'react'

export default class NotFound extends React.Component {
  constructor (props) {
    super(props)
    this.state = props
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount () {
    setPageTitle(null, 'Slide Therapy: Page Not Found')
  }

  componentDidMount () {
    stAnalytics.page('Not Found')
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
