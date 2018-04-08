import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import qs from 'qs'

export default class Header extends React.Component {
  constructor (props) {
    super(props)
    this.state = Object.assign({}, props, {
      downloadHref: '/download',
      showDownload: false
    })
  }
  componentDidMount () {
    if (typeof location !== 'undefined') {
      const queryParams = qs.parse(location.search.substring(1))
      if (queryParams && (queryParams.o || queryParams.t || queryParams.j)) {
        this.setState({
          downloadHref: `/download${location.search.replace('&d=true', '')}`,
          showDownload: true
        })
      }
    }
  }
  homeActive (match, location) {
    if (!match) {
      return false
    }
    return (match.isExact || location.pathname === '/templates' || location.pathname === '/start')
  }
  downloadActive (match, location) {
    return location.pathname === '/download'
  }
  render () {
    return <header className="container">
      <div className="row">
        <div className="col-md-5 pt-3 py-md-3">
          <h1 className="m-0 text-center text-md-left"><Link to="/"><img className="img-fluid" src="/images/slide-therapy-logo.png" alt="Slide Therapy" width="222" height="39" /></Link></h1>
        </div>
        <div className="col-md-7 d-flex justify-content-center justify-content-md-end">
          <nav className={`main-nav nav align-items-center justify-content-center ${this.state.showDownload ? ' has-download' : ''}`}>
            <NavLink
              to={this.state.downloadHref}
              suppressHydrationWarning
              activeClassName="active"
              isActive={this.downloadActive}
              className={`nav-link d-none ${this.state.showDownload ? ' d-sm-inline-block' : ''}`}
            >Download</NavLink>
            <NavLink
              to="/"
              isActive={this.homeActive}
              suppressHydrationWarning
              activeClassName="active"
              className="nav-link"
            >Templates</NavLink>
            <NavLink
              to="/tips/index.html"
              suppressHydrationWarning
              activeClassName="active"
              className="nav-link"
            >Tips</NavLink>
            <NavLink
              to="/about/index.html"
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
