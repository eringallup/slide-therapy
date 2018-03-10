import React from 'react';
import { NavLink, Link } from 'react-router-dom';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;
  }
  homeActive(match, location) {
    if (!match) {
      return false;
    }
    return (match.isExact || location.pathname === '/templates');
  }
  render() {
    return <header className="container">
      <div className="row">
        <div className="col-sm-5">
          <h1><Link to="/"><img className="img-fluid" src="//d380dcsmppijhx.cloudfront.net/images/SlideTherapyLogo.png" alt="Slide Therapy" width="300" height="72"/></Link></h1>
        </div>
        <div className="col-sm-7 d-flex align-items-center justify-content-center justify-content-sm-end">
          <nav className="main-nav nav">
            <NavLink
              to="/"
              isActive={this.homeActive}
              suppressHydrationWarning={true}
              activeClassName="active"
              className="nav-link"
            >Templates</NavLink>
            <NavLink
              to="/tips"
              suppressHydrationWarning={true}
              activeClassName="active"
              className="nav-link"
            >Tips</NavLink>
            <NavLink
              to="/about"
              suppressHydrationWarning={true}
              activeClassName="active"
              className="nav-link"
            >About</NavLink>
          </nav>
        </div>
      </div>
    </header>;
  }
}
