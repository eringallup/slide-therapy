import React from 'react';
import { Link } from 'react-router-dom';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;
  }
  render() {
    return <header className="container">
      <div className="row">
        <div className="col-sm-5">
          <h1><Link to="/"><img className="img-fluid" src="//d380dcsmppijhx.cloudfront.net/images/SlideTherapyLogo.png" alt="Slide Therapy" width="300" height="72"/></Link></h1>
        </div>
        <div className="col-sm-7 d-flex align-items-center justify-content-center justify-content-sm-end">
          <nav className="main-nav nav">
            <Link to="/" className="nav-link nav-templates" href="/">Templates</Link>
            <Link to="/tips" className="nav-link nav-tips">Tips</Link>
            <Link to="/about" className="nav-link nav-about">About</Link>
          </nav>
        </div>
      </div>
    </header>;
  }
}
