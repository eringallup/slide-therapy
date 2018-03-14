import React from 'react'

export default class Footer extends React.Component {
  constructor (props) {
    super(props)
    this.state = props
  }
  render () {
    return <footer className="d-block">
      <div className="container">
        <div className="row">
          <div className="col py-4 text-center">
            <p>&copy;{new Date().getFullYear()}<br /><a target="_blank" rel="noopener noreferrer" href="http://nonepercent.com">The Nøne Percent LLC</a><br />
            All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  }
}
