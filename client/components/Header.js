import React from 'react'
import { NavLink, Link } from 'react-router-dom'

export default class Header extends React.Component {
  constructor (props) {
    super(props)
    this.state = props
  }
  homeActive (match, location) {
    if (!match) {
      return false
    }
    return (match.isExact || location.pathname === '/templates' || location.pathname === '/start')
  }
  render () {
    return <header className="container">
      <div className="row">
        <div className="col-md-5 pt-3 py-md-3">
          <h1 className="m-0 text-center text-md-left"><Link to="/"><img className="img-fluid" src="/images/slide-therapy-logo.png" alt="Slide Therapy" width="222" height="39" /></Link></h1>
        </div>
        <div className="col-md-7 d-flex align-items-center justify-content-center justify-content-md-end">
          <nav className="main-nav nav">
            <NavLink
              to="/"
              isActive={this.homeActive}
              suppressHydrationWarning
              activeClassName="active"
              className="nav-link"
            >Templates</NavLink>
            <NavLink
              to="/tips"
              suppressHydrationWarning
              activeClassName="active"
              className="nav-link"
            >Tips</NavLink>
            <NavLink
              to="/about"
              suppressHydrationWarning
              activeClassName="active"
              className="nav-link"
            >About</NavLink>
          </nav>
        </div>
      </div>
    </header>
  }
}
