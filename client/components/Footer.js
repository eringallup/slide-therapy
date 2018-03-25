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
            <p className="mb-1 h3 font-size-base">&copy;{new Date().getFullYear()}</p>
            <a className="h3 mb-1 font-size-base" target="_blank" rel="noopener noreferrer" href="http://nonepercent.com">The Nøne Percent LLC</a>
            <p className="d-block mt-1 mb-0 font-size-base font-family-serif font-italic">All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  }
}
