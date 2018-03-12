import React from 'react'

export default class Footer extends React.Component {
  constructor (props) {
    super(props)
    this.state = props
  }
  render () {
    return <footer className="d-block p-4">
      <div className="container">
        <div className="row">
          <div className="col text-center">
            <p>&copy; {new Date().getFullYear()} <a target="_blank" rel="noopener noreferrer" href="http://nonepercent.com">The Nøne Percent LLC</a><br />
            All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  }
}
