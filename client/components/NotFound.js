import React from 'react'

export default class NotFound extends React.Component {
  constructor (props) {
    super(props)
    this.state = props
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
